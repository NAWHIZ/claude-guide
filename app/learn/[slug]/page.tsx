import { notFound } from 'next/navigation'
import type { ComponentType } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllLearnPosts, getLearnPost, getLearnSlugs, getAdjacentLearnPosts } from '@/lib/content'
import { Sidebar } from '@/components/sidebar'
import { LevelBadge } from '@/components/level-badge'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getLearnSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getLearnPost(slug)
  if (!post) return {}
  return { title: post.title, description: post.description }
}

export default async function LearnPostPage({ params }: Props) {
  const { slug } = await params
  const post = getLearnPost(slug)
  if (!post) notFound()

  const allPosts = getAllLearnPosts()
  const { prev, next } = getAdjacentLearnPosts(slug)

  type MDXModule = { default: ComponentType<object> }
  const { default: MDXContent } = (await import(`@/content/learn/${slug}.mdx`)) as MDXModule

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:flex lg:gap-10">
      <Sidebar
        posts={allPosts.map((p) => ({
          slug: p.slug,
          title: p.title,
          level: p.level,
          order: p.order,
        }))}
      />

      <article className="min-w-0 flex-1">
        <header className="mb-8">
          <LevelBadge level={post.level} />
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">{post.title}</h1>
          <p className="mt-2 text-lg text-gray-500">{post.description}</p>
          <p className="mt-2 text-sm text-gray-400">⏱ 예상 시간 {post.estimatedTime}</p>
        </header>

        <div className="prose prose-gray prose-lg max-w-none
          prose-headings:font-bold prose-headings:tracking-tight
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:leading-relaxed prose-p:text-gray-700
          prose-li:text-gray-700 prose-li:leading-relaxed
          prose-strong:text-gray-900
          prose-code:text-purple-700 prose-code:bg-purple-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
          prose-blockquote:border-purple-300 prose-blockquote:bg-purple-50 prose-blockquote:rounded-r-lg">
          <MDXContent />
        </div>

        <nav className="mt-12 grid grid-cols-2 gap-4 border-t border-gray-100 pt-8">
          {prev ? (
            <Link
              href={`/learn/${prev.slug}`}
              className="rounded-xl border border-gray-200 p-4 hover:border-purple-200 hover:bg-purple-50 transition-all"
            >
              <p className="text-xs text-gray-400 mb-1">← 이전 글</p>
              <p className="font-medium text-gray-900 text-sm">{prev.title}</p>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/learn/${next.slug}`}
              className="rounded-xl border border-gray-200 p-4 text-right hover:border-purple-200 hover:bg-purple-50 transition-all"
            >
              <p className="text-xs text-gray-400 mb-1">다음 글 →</p>
              <p className="font-medium text-gray-900 text-sm">{next.title}</p>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </article>
    </div>
  )
}
