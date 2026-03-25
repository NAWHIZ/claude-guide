import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllReferencePosts } from '@/lib/content'

export const metadata: Metadata = {
  title: '레퍼런스',
  description: 'Claude 사용에 필요한 핵심 참고 자료 모음',
}

const ICON_MAP: Record<string, string> = {
  'prompt-patterns': '📝',
  'model-comparison': '🤖',
  'pricing': '💳',
  'glossary': '📖',
  'faq': '❓',
}

export default function ReferencePage() {
  const posts = getAllReferencePosts()

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">레퍼런스</h1>
        <p className="mt-2 text-gray-500">Claude를 더 잘 쓰기 위한 핵심 참고 자료들이에요.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/reference/${post.slug}`}
            className="group rounded-2xl border border-gray-200 bg-white p-6 hover:border-purple-200 hover:shadow-md transition-all"
          >
            <div className="text-3xl mb-3">{ICON_MAP[post.slug] ?? '📄'}</div>
            <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors text-lg">
              {post.title}
            </h3>
            <p className="mt-2 text-sm text-gray-500 line-clamp-2">{post.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
