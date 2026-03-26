import Link from 'next/link'
import { getAllLearnPosts } from '@/lib/content'
import { LevelBadge } from '@/components/level-badge'
import { createClient } from '@supabase/supabase-js'
import { HeroRoles } from '@/components/hero-roles'
import { WeeklyCard, type WeeklyDigest } from '@/components/weekly-card'

export const dynamic = 'force-dynamic'

async function getLatestNews() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await supabase
    .from('news_items')
    .select('id,title,source_name,priority,source_url')
    .order('created_at', { ascending: false })
    .limit(4)
  return data || []
}

async function getLatestWeekly(): Promise<WeeklyDigest | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await supabase
    .from('weekly_digests')
    .select('*')
    .order('week_start', { ascending: false })
    .limit(1)
    .single()
  return data as WeeklyDigest | null
}

export default async function HomePage() {
  const posts = getAllLearnPosts()
  const beginner = posts.filter((p) => p.level === 'beginner').slice(0, 3)
  const latestNews = await getLatestNews()
  const latestWeekly = await getLatestWeekly()

  return (
    <div>
      <HeroRoles />

      {/* 학습 경로 소개 */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">학습 경로</h2>
          <p className="text-gray-500 mb-8">순서대로 읽으면 코딩을 몰라도 Claude Code를 자유자재로 쓸 수 있어요.</p>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { level: '입문', emoji: '🌱', desc: 'Claude Code가 뭔지, 어떻게 설치하는지', color: 'border-green-200 bg-green-50', badge: 'text-green-700', btnColor: 'bg-green-600 hover:bg-green-700', href: '/learn/01-what-is-claude-code' },
              { level: '중급', emoji: '🚀', desc: '파일 작업, 프로젝트 활용, 실전 사례', color: 'border-blue-200 bg-blue-50', badge: 'text-blue-700', btnColor: 'bg-blue-600 hover:bg-blue-700', href: '/learn/05-project-setup' },
              { level: '심화', emoji: '⚡', desc: '자동화, 설정 커스터마이징, 고급 활용', color: 'border-purple-200 bg-purple-50', badge: 'text-purple-700', btnColor: 'bg-purple-600 hover:bg-purple-700', href: '/learn/08-claude-md-settings' },
            ].map(({ level, emoji, desc, color, badge, btnColor, href }) => (
              <div key={level} className={`rounded-2xl border p-6 flex flex-col gap-3 ${color}`}>
                <div className="text-3xl">{emoji}</div>
                <div>
                  <h3 className={`font-bold text-lg mb-1 ${badge}`}>{level}</h3>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
                <Link href={href} className={`mt-auto inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors ${btnColor}`}>
                  {level} 시작하기 →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 입문 글 미리보기 */}
      <section className="py-8 pb-20 px-4 bg-gray-50">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🌱 입문 시작하기</h2>
            <Link href="/learn" className="text-sm text-purple-600 hover:underline">전체 보기 →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {beginner.map((post) => (
              <Link
                key={post.slug}
                href={`/learn/${post.slug}`}
                className="group rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-md hover:border-purple-200 transition-all"
              >
                <div className="mb-3">
                  <LevelBadge level={post.level} />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 mb-2 transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">{post.description}</p>
                <p className="mt-3 text-xs text-gray-400">⏱ {post.estimatedTime}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI 트렌드 위클리 */}
      {latestWeekly && (
        <section className="py-12 px-4 bg-gradient-to-br from-purple-50 to-indigo-50">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">📊 AI 트렌드 위클리</h2>
                <p className="text-sm text-gray-500 mt-1">이번 주 AI 트렌드를 직무별로 정리했어요</p>
              </div>
              <Link href="/weekly" className="text-sm text-purple-600 hover:underline">전체 보기 →</Link>
            </div>
            <WeeklyCard digest={latestWeekly} />
          </div>
        </section>
      )}

      {/* 최신 소식 미리보기 */}
      {latestNews.length > 0 && (
        <section className="py-12 px-4">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">📰 최신 소식</h2>
              <Link href="/news" className="text-sm text-purple-600 hover:underline">전체 소식 보기 →</Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {latestNews.map((item: { id: string; title: string; source_name: string; priority: string; source_url: string | null }) => (
                <a
                  key={item.id}
                  href={item.source_url ?? '/news'}
                  target={item.source_url ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 hover:shadow-md hover:border-purple-200 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {item.priority === 'official' ? (
                        <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200">★ 공식</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">{item.source_name}</span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-800 group-hover:text-purple-700 line-clamp-2 transition-colors">{item.title}</p>
                  </div>
                  <span className="text-gray-300 group-hover:text-purple-400 shrink-0 mt-1">→</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
