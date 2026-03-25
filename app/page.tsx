import Link from 'next/link'
import { getAllLearnPosts } from '@/lib/content'
import { LevelBadge } from '@/components/level-badge'

export default function HomePage() {
  const posts = getAllLearnPosts()
  const beginner = posts.filter((p) => p.level === 'beginner').slice(0, 3)

  return (
    <div>
      {/* 히어로 */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-violet-50 py-20 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
            ✦ 비개발자를 위한 Claude 완전 정복
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Claude, 이제 제대로<br />
            <span className="text-purple-700">이해하고 활용하세요</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            AI 지식이 없어도 괜찮아요. 입문부터 심화까지,<br className="hidden sm:block" />
            한국어로 쉽고 깊게 배우는 Claude 완전 가이드입니다.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/learn"
              className="rounded-xl bg-purple-700 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-800 transition-colors"
            >
              학습 시작하기 →
            </Link>
            <Link
              href="/reference"
              className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              레퍼런스 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 학습 경로 소개 */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">학습 경로</h2>
          <p className="text-gray-500 mb-8">순서대로 읽으면 누구나 Claude 파워 유저가 될 수 있어요.</p>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { level: '입문', emoji: '🌱', desc: 'Claude가 뭔지, 어떻게 시작하는지', color: 'border-green-200 bg-green-50', badge: 'text-green-700' },
              { level: '중급', emoji: '🚀', desc: '더 좋은 답을 얻는 기술과 실전 활용', color: 'border-blue-200 bg-blue-50', badge: 'text-blue-700' },
              { level: '심화', emoji: '⚡', desc: '고급 테크닉과 AI 리터러시', color: 'border-purple-200 bg-purple-50', badge: 'text-purple-700' },
            ].map(({ level, emoji, desc, color, badge }) => (
              <div key={level} className={`rounded-2xl border p-6 ${color}`}>
                <div className="text-3xl mb-3">{emoji}</div>
                <h3 className={`font-bold text-lg mb-1 ${badge}`}>{level}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
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
    </div>
  )
}
