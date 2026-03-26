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

function getWeekLabel(date: Date): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekNum = Math.ceil(day / 7)
  return `${year}년 ${month}월 ${weekNum}주차`
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date()
  const weekEnd = today.toISOString().split('T')[0]
  const weekStartDate = new Date(today)
  weekStartDate.setDate(today.getDate() - 6)
  const weekStart = weekStartDate.toISOString().split('T')[0]
  const weekLabel = getWeekLabel(today)

  const { data: newsItems } = await supabase
    .from('news_items')
    .select('title, summary_ko, source_name, priority, category')
    .gte('created_at', weekStartDate.toISOString())
    .order('created_at', { ascending: false })
    .limit(50)

  if (!newsItems || newsItems.length === 0) {
    return NextResponse.json({ error: 'No news this week', weekStart, weekEnd }, { status: 404 })
  }

  const newsText = newsItems.map((n, i) =>
    `[${i + 1}] ${n.priority === 'official' ? '★공식' : '커뮤니티'} | 직무: ${(n.category || []).join(',')} | ${n.title}\n${n.summary_ko}`
  ).join('\n\n---\n\n')

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: `다음은 이번 주(${weekStart} ~ ${weekEnd}) 수집된 ${newsItems.length}개의 Claude Code·AI 뉴스입니다.
비개발자(PM, 디자이너, 마케터)를 대상으로 주간 트렌드 요약을 JSON으로 작성해줘.
반드시 아래 JSON 형식만 출력하고 다른 텍스트는 절대 출력하지 마.

{
  "headline": "이번 주를 한 문장으로 요약 (명사형 종결, 20자 이내)",
  "overview": "이번 주 전체 트렌드를 2-3문장으로 요약. 비개발자도 이해할 수 있게 쉽게.",
  "highlights": [
    {"title": "핵심 뉴스 제목 (한국어)", "summary": "1-2줄 핵심 요약", "importance": "high"},
    {"title": "...", "summary": "...", "importance": "medium"},
    {"title": "...", "summary": "...", "importance": "medium"}
  ],
  "by_role": {
    "pm": {"summary": "PM에게 이번 주 가장 중요한 변화와 기회 1-2문장", "tips": ["구체적 활용 팁 1", "구체적 활용 팁 2"]},
    "design": {"summary": "디자이너에게 이번 주 가장 중요한 변화와 기회 1-2문장", "tips": ["구체적 활용 팁 1", "구체적 활용 팁 2"]},
    "marketing": {"summary": "마케터에게 이번 주 가장 중요한 변화와 기회 1-2문장", "tips": ["구체적 활용 팁 1", "구체적 활용 팁 2"]},
    "office": {"summary": "일반사무직에게 이번 주 가장 중요한 변화와 기회 1-2문장", "tips": ["구체적 활용 팁 1", "구체적 활용 팁 2"]}
  }
}

뉴스 목록:
${newsText}`,
    }],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : ''
  let digest
  try {
    const jsonStr = raw.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
    digest = JSON.parse(jsonStr)
  } catch {
    return NextResponse.json({ error: 'JSON parse failed', raw: raw.slice(0, 500) }, { status: 500 })
  }

  const { error } = await supabase.from('weekly_digests').upsert(
    {
      week_label: weekLabel,
      week_start: weekStart,
      week_end: weekEnd,
      headline: digest.headline,
      overview: digest.overview,
      highlights: digest.highlights,
      by_role: digest.by_role,
      news_count: newsItems.length,
    },
    { onConflict: 'week_start' }
  )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    week: weekLabel,
    newsCount: newsItems.length,
    headline: digest.headline,
  })
}
