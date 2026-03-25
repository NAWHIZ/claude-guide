'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LEVEL_LABELS, type Level } from '@/lib/types'

interface SidebarPost {
  slug: string
  title: string
  level: Level
  order: number
}

export function Sidebar({ posts }: { posts: SidebarPost[] }) {
  const pathname = usePathname()

  const grouped = {
    beginner: posts.filter((p) => p.level === 'beginner'),
    intermediate: posts.filter((p) => p.level === 'intermediate'),
    advanced: posts.filter((p) => p.level === 'advanced'),
  }

  const levels: Level[] = ['beginner', 'intermediate', 'advanced']

  return (
    <nav className="w-64 shrink-0 pr-6">
      <div className="sticky top-20">
        {levels.map((level) => (
          <div key={level} className="mb-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              {LEVEL_LABELS[level]}
            </p>
            <ul className="flex flex-col gap-1">
              {grouped[level].map((post) => {
                const active = pathname === `/learn/${post.slug}`
                return (
                  <li key={post.slug}>
                    <Link
                      href={`/learn/${post.slug}`}
                      className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                        active
                          ? 'bg-purple-100 font-semibold text-purple-800'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      {post.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  )
}
