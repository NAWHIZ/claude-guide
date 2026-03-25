import { notFound } from 'next/navigation'
import type { ComponentType } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllReferencePosts, getReferencePost, getReferenceSlugs } from '@/lib/content'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getReferenceSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getReferencePost(slug)
  if (!post) return {}
  return { title: post.title, description: post.description }
}

export default async function ReferencePostPage({ params }: Props) {
  const { slug } = await params
  const post = getReferencePost(slug)
  if (!post) notFound()

  const allPosts = getAllReferencePosts()

  type MDXModule = { default: ComponentType<object> }
  const { default: MDXContent } = (await import(`@/content/reference/${slug}.mdx`)) as MDXModule

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:flex lg:gap-10">
      <nav className="w-56 shrink-0 pr-6 hidden lg:block">
        <div className="sticky top-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">레퍼런스</p>
          <ul className="flex flex-col gap-1">
            {allPosts.map((p) => {
              const active = p.slug === slug
              return (
                <li key={p.slug}>
                  <Link
                    href={`/reference/${p.slug}`}
                    className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? 'bg-purple-100 font-semibold text-purple-800'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {p.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      <article className="min-w-0 flex-1">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{post.title}</h1>
          <p className="mt-2 text-lg text-gray-500">{post.description}</p>
        </header>

        <div className="prose prose-gray prose-lg max-w-none
          prose-headings:font-bold prose-headings:tracking-tight
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:leading-relaxed prose-p:text-gray-700
          prose-li:text-gray-700 prose-li:leading-relaxed
          prose-strong:text-gray-900
          prose-code:text-purple-700 prose-code:bg-purple-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
          prose-table:text-sm prose-th:bg-gray-50 prose-th:font-semibold">
          <MDXContent />
        </div>
      </article>
    </div>
  )
}
