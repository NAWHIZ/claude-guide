import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { NewsFilter } from './NewsFilter'

export const dynamic = 'force-dynamic'

type NewsItem = {
  id: string
  title: string
  summary_ko: string
  source_name: string
  source_url: string | null
  priority: 'official' | 'community'
  category: string[]
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
    .limit(100)
  return (data as NewsItem[]) || []
}


export default async function NewsPage() {
  const news = await getNews()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block">
            ← 홈으로
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">최신 소식</h1>
          <p className="text-gray-500">
            Claude Code · 바이브코딩 최신 업데이트를 매일 자동 수집해요.
          </p>
        </div>

        {news.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📰</div>
            <p className="text-lg font-medium text-gray-600 mb-2">아직 뉴스가 없어요</p>
            <p className="text-sm">매일 오전 자동으로 업데이트돼요.</p>
          </div>
        ) : (
          <NewsFilter news={news} />
        )}
      </div>
    </div>
  )
}
