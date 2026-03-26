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
  // 직무별 활용 소스
  { query: 'Claude AI Figma design workflow UI UX non-developer 2026', source: '디자인 활용', priority: 'community' },
  { query: 'Claude AI product manager roadmap planning strategy 2026', source: 'PM 활용', priority: 'community' },
  { query: 'Claude AI marketing content SEO copywriting automation 2026', source: '마케팅 활용', priority: 'community' },
  { query: 'Claude AI office automation non-developer business workflow 2026', source: '업무 자동화', priority: 'community' },
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
          max_tokens: 500,
          messages: [{
            role: 'user',
            content: `다음 영어 기사를 비개발자도 이해할 수 있게 한국어로 개조식으로 요약해줘. 반드시 아래 형식 그대로만 출력해. 다른 말은 절대 하지 마.

CATEGORIES: (dev/design/pm/marketing/office 중 해당하는 것 모두 쉼표로 나열. 여러 직무에 해당하면 복수 선택)
▶ 달라진 점: (이전과 비교해 무엇이 바뀌었는지 1줄)
▶ 핵심 내용: (가장 중요한 변화나 사실 1줄)
▶ 활용 포인트: (이제 무엇을 할 수 있는지 1줄)

직무 기준 (중복 가능):
- dev: 개발자 전용 (API, 코딩, CLI, 시스템 구축 등 기술 지식 필요)
- design: 디자이너 활용 (Figma, UI/UX, 비주얼 작업)
- pm: 기획자·PM 활용 (전략, 로드맵, 스펙 작성, 리서치)
- marketing: 마케터 활용 (콘텐츠, SEO, 카피, 광고)
- office: 일반사무 활용 (코딩 없이 문서·이메일·업무 자동화)
※ 비개발자도 쓸 수 있는 기능이면 dev 외 직무도 반드시 포함할 것

제목: ${result.title}
내용: ${(result.content as string).slice(0, 800)}`,
          }],
        })

        const raw = message.content[0].type === 'text' ? message.content[0].text : ''
        const catMatch = raw.match(/^CATEGORIES:\s*(.+)/m)
        const validCats = ['dev', 'design', 'pm', 'marketing', 'office']
        const category = catMatch
          ? catMatch[1].split(',').map(c => c.trim()).filter(c => validCats.includes(c))
          : ['dev']
        const summaryKo = raw.replace(/^CATEGORIES:.*\n?/m, '').trim()

        const { error } = await supabase.from('news_items').upsert(
          {
            title: result.title,
            summary_ko: summaryKo,
            source_name: source.source,
            source_url: result.url,
            priority: source.priority,
            category,
            published_date: new Date().toISOString().split('T')[0],
          },
          { onConflict: 'title,source_name', ignoreDuplicates: true }
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
