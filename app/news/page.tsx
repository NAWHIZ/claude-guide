import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

type NewsItem = {
  id: string
  title: string
  summary_ko: string
  source_name: string
  source_url: string | null
  priority: 'official' | 'community'
  published_date: string
  created_at: string
}

async function getNews(): Promise<NewsItem[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await supabase
    .from('news_items')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(60)
  return (data as NewsItem[]) || []
}

function groupByDate(items: NewsItem[]) {
  return items.reduce<Record<string, NewsItem[]>>((acc, item) => {
    const date = item.published_date || item.created_at.split('T')[0]
    if (!acc[date]) acc[date] = []
    acc[date].push(item)
    return acc
  }, {})
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function NewsPage() {
  const news = await getNews()
  const grouped = groupByDate(news)
  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* 헤더 */}
        <div className="mb-10">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block">
            ← 홈으로
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">최신 소식</h1>
          <p className="text-gray-500">
            Claude Code · 바이브코딩 최신 업데이트를 매일 자동 수집해요.
          </p>
          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
              ★ 공식 소스
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              💬 커뮤니티
            </span>
          </div>
        </div>

        {news.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📰</div>
            <p className="text-lg font-medium text-gray-600 mb-2">아직 뉴스가 없어요</p>
            <p className="text-sm">매일 오전 자동으로 업데이트돼요.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {dates.map((date) => (
              <section key={date}>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-8 h-px bg-gray-200" />
                  {formatDate(date)}
                </h2>
                <div className="space-y-4">
                  {grouped[date]
                    .sort((a, b) => (a.priority === 'official' ? -1 : 1))
                    .map((item) => (
                      <article
                        key={item.id}
                        className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              {item.priority === 'official' ? (
                                <span className="text-xs font-medium px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                                  ★ {item.source_name}
                                </span>
                              ) : (
                                <span className="text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                                  {item.source_name}
                                </span>
                              )}
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {item.summary_ko}
                            </p>
                            {item.source_url && (
                              <a
                                href={item.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-medium"
                              >
                                원문 보기 →
                              </a>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
