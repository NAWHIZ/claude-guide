import type { Metadata } from 'next'
import Link from 'next/link'
import { getCommonLearnPosts, getAllRoleLearnPosts } from '@/lib/content'
import { LevelBadge } from '@/components/level-badge'
import { RoleTracks } from '@/components/role-tracks'
import type { Level } from '@/lib/types'

export const metadata: Metadata = {
  title: '학습 콘텐츠',
  description: '설치부터 실전까지, 단계별로 배우고 내 직무에 맞는 트랙으로 전직하세요.',
}

const LEVEL_INFO: { level: Level; emoji: string; desc: string }[] = [
  { level: 'beginner', emoji: '🌱', desc: 'Claude Code가 뭐지, 설치하고 첫 실행하기까지' },
  { level: 'intermediate', emoji: '🚀', desc: '파일 작업, 프로젝트 활용, 실전 사례 이해하기' },
  { level: 'advanced', emoji: '⚡', desc: '훅, 오케스트레이션, MCP 서버로 완전 자동화' },
]

export default function LearnPage() {
  const commonPosts = getCommonLearnPosts()
  const rolePostsMap = getAllRoleLearnPosts()

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">학습 콘텐츠</h1>
        <p className="mt-2 text-gray-500">
          순서대로 읽으면 코딩을 몰라도 Claude Code를 자유자재로 쓸 수 있어요.
        </p>
      </div>

      {/* Common track by level */}
      {LEVEL_INFO.map(({ level, emoji, desc }) => {
        const levelPosts = commonPosts.filter((p) => p.level === level)
        if (levelPosts.length === 0) return null
        return (
          <section key={level} className="mb-12">
            <div className="mb-5 flex items-center gap-3">
              <span className="text-2xl">{emoji}</span>
              <div>
                <LevelBadge level={level} />
                <p className="mt-1 text-sm text-gray-500">{desc}</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {levelPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/learn/${post.slug}`}
                  className="group rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-purple-200 hover:shadow-md"
                >
                  <h3 className="font-semibold leading-snug text-gray-900 transition-colors group-hover:text-purple-700">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">{post.description}</p>
                  <p className="mt-3 text-xs text-gray-400">⏱ {post.estimatedTime}</p>
                </Link>
              ))}
            </div>
          </section>
        )
      })}

      {/* Role track divider */}
      <div className="my-14 rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-10 text-white">
        <div className="mb-1 text-sm font-semibold uppercase tracking-widest text-purple-200">
          직무 전직 시스템
        </div>
        <h2 className="text-2xl font-bold">내 직무에 맞는 트랙 선택 ⚔️</h2>
        <p className="mt-2 text-purple-100">
          공통 과정을 마쳤다면 이제 전직할 시간이에요.
          내 직무에 꼭 맞는 실무 자동화 레시피를 골라보세요.
        </p>
      </div>

      {/* Role tracks client component */}
      <RoleTracks rolePostsMap={rolePostsMap} />
    </div>
  )
}