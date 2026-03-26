import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const SEARCH_QUERIES = [
  // 공식 소스 (높은 우선순위)
  { query: 'Anthropic Claude Code new feature release announcement 2026', source: 'Anthropic 공식', priority: 'official' },
  { query: 'site:anthropic.com Claude news blog 2026', source: 'Anthropic 블로그', priority: 'official' },
  { query: 'github anthropics claude-code release new version 2026', source: 'GitHub 릴리즈', priority: 'official' },
  // 커뮤니티 소스
  { query: 'reddit ClaudeAI vibecoding Claude Code new update 2026', source: 'Reddit', priority: 'community' },
  { query: 'hacker news Claude Code vibe coding AI 2026', source: 'Hacker News', priority: 'community' },
  { query: 'twitter vibe coding Claude Code new feature tutorial 2026', source: 'Twitter/X', priority: 'community' },
  { query: 'youtube Claude Code vibe coding tutorial beginner 2026', source: 'YouTube', priority: 'community' },
]

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const saved: string[] = []
  const errors: string[] = []
  const debug: string[] = []

  for (const source of SEARCH_QUERIES) {
    try {
      const tavilyRes = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: process.env.TAVILY_API_KEY,
          query: source.query,
          max_results: 3,
          days: 7,
        }),
      })

      const tavilyData = await tavilyRes.json()
      const results = tavilyData.results || []
      const rawDebug = results.length === 0 ? ` (raw:${JSON.stringify(tavilyData).slice(0,200)})` : ''
      debug.push(`${source.source}: ${results.length}건${rawDebug}`)

      for (const result of results) {
        if (!result.title) continue

        // Claude Haiku로 한국어 요약
        const message = await anthropic.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 250,
          messages: [{
            role: 'user',
            content: `다음 영어 기사를 비개발자도 이해할 수 있게 한국어로 2-3문장으로 요약해줘. 전문 용어는 쉽게 설명해줘. 요약만 출력해. 다른 말 하지 마.

제목: ${result.title}
내용: ${(result.content as string).slice(0, 600)}`,
          }],
        })

        const summaryKo =
          message.content[0].type === 'text' ? message.content[0].text : ''

        const { error } = await supabase.from('news_items').upsert(
          {
            title: result.title,
            summary_ko: summaryKo,
            source_name: source.source,
            source_url: result.url,
            priority: source.priority,
            published_date: new Date().toISOString().split('T')[0],
          },
          { onConflict: 'title,source_name' }
        )

        if (error) {
          errors.push(`DB오류 [${result.title.slice(0,30)}]: ${error.message}`)
        } else {
          saved.push(result.title)
        }
      }
    } catch (err) {
      errors.push(`${source.source}: ${err}`)
    }
  }

  return NextResponse.json({
    success: true,
    saved: saved.length,
    items: saved,
    errors,
    debug,
  })
}
