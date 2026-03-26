import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { WeeklyCard, type WeeklyDigest } from '@/components/weekly-card'

export const dynamic = 'force-dynamic'

async function getDigests(): Promise<WeeklyDigest[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await supabase
    .from('weekly_digests')
    .select('*')
    .order('week_start', { ascending: false })
    .limit(12)
  return (data as WeeklyDigest[]) || []
}

export default async function WeeklyPage() {
  const digests = await getDigests()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block">
            ← 홈으로
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 AI 트렌드 위클리</h1>
          <p className="text-gray-500">
            매주 Claude Code · AI 트렌드를 직무별로 정리해드려요.
          </p>
        </div>

        {digests.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📊</div>
            <p className="text-lg font-medium text-gray-600 mb-2">아직 위클리가 없어요</p>
            <p className="text-sm">매주 월요일 자동으로 발행돼요.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {digests.map((digest) => (
              <WeeklyCard key={digest.id} digest={digest} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
