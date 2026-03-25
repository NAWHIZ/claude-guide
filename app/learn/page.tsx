import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllLearnPosts } from '@/lib/content'
import { LevelBadge } from '@/components/level-badge'
import type { Level } from '@/lib/types'

export const metadata: Metadata = {
  title: '학습 콘텐츠',
  description: '설치부터 실전까지, 단계별로 Claude Code를 배워보세요.',
}

const LEVEL_INFO: { level: Level; emoji: string; desc: string }[] = [
  { level: 'beginner', emoji: '🌱', desc: 'Claude Code가 뭐지, 설치하고 첫 실행하기까지' },
  { level: 'intermediate', emoji: '🚀', desc: '파일 작업, 프로젝트 활용, 실전 사례 이해하기' },
  { level: 'advanced', emoji: '⚡', desc: 'CLAUDE.md, 자동화, 고급 설정으로 한단계 더' },
]

export default function LearnPage() {
  const posts = getAllLearnPosts()

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">학습 콘텐츠</h1>
        <p className="mt-2 text-gray-500">순서대로 읽으면 코딩을 몰라도 Claude Code를 자유자재로 쓸 수 있어요.</p>
      </div>

      {LEVEL_INFO.map(({ level, emoji, desc }) => {
        const levelPosts = posts.filter((p) => p.level === level)
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
                  className="group rounded-2xl border border-gray-200 bg-white p-5 hover:border-purple-200 hover:shadow-md transition-all"
                >
                  <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{post.description}</p>
                  <p className="mt-3 text-xs text-gray-400">⏱ {post.estimatedTime}</p>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
