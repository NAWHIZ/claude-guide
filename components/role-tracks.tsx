'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { LearnPost, Category } from '@/lib/types'
import { CATEGORY_INFO } from '@/lib/types'

type RoleCategory = Exclude<Category, 'common'>

interface RoleTracksProps {
  rolePostsMap: Record<RoleCategory, LearnPost[]>
}

const COLOR_CLASSES: Record<RoleCategory, {
  tabActive: string
  tabIdle: string
  border: string
  badge: string
}> = {
  pm: {
    tabActive: 'bg-blue-600 text-white border-blue-600 shadow-blue-200 shadow-md',
    tabIdle:   'border-blue-200 text-blue-700 hover:bg-blue-50',
    border:    'border-blue-200 hover:border-blue-400',
    badge:     'bg-blue-100 text-blue-700',
  },
  designer: {
    tabActive: 'bg-pink-500 text-white border-pink-500 shadow-pink-200 shadow-md',
    tabIdle:   'border-pink-200 text-pink-700 hover:bg-pink-50',
    border:    'border-pink-200 hover:border-pink-400',
    badge:     'bg-pink-100 text-pink-700',
  },
  marketer: {
    tabActive: 'bg-orange-500 text-white border-orange-500 shadow-orange-200 shadow-md',
    tabIdle:   'border-orange-200 text-orange-700 hover:bg-orange-50',
    border:    'border-orange-200 hover:border-orange-400',
    badge:     'bg-orange-100 text-orange-700',
  },
  office: {
    tabActive: 'bg-green-600 text-white border-green-600 shadow-green-200 shadow-md',
    tabIdle:   'border-green-200 text-green-700 hover:bg-green-50',
    border:    'border-green-200 hover:border-green-400',
    badge:     'bg-green-100 text-green-700',
  },
}

export function RoleTracks({ rolePostsMap }: RoleTracksProps) {
  const [activeRole, setActiveRole] = useState<RoleCategory>('pm')
  const roles = Object.keys(CATEGORY_INFO) as RoleCategory[]
  const posts = rolePostsMap[activeRole] ?? []
  const colors = COLOR_CLASSES[activeRole]

  return (
    <div>
      {/* Class selection buttons */}
      <div className="mb-8 flex flex-wrap gap-3">
        {roles.map((role) => {
          const info = CATEGORY_INFO[role]
          const isActive = activeRole === role
          const c = COLOR_CLASSES[role]
          return (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`flex items-center gap-2 rounded-2xl border-2 px-5 py-3 text-sm font-semibold transition-all duration-150 ${
                isActive ? c.tabActive : `bg-white ${c.tabIdle}`
              }`}
            >
              <span className="text-xl">{info.emoji}</span>
              <span>{info.label}</span>
            </button>
          )
        })}
      </div>

      {/* Track description card */}
      <div className={`mb-6 flex items-center gap-4 rounded-2xl border-2 bg-white px-6 py-4 ${colors.border}`}>
        <span className="text-4xl">{CATEGORY_INFO[activeRole].emoji}</span>
        <div>
          <p className="font-bold text-gray-900">{CATEGORY_INFO[activeRole].label}</p>
          <p className="text-sm text-gray-500">{CATEGORY_INFO[activeRole].desc}</p>
        </div>
      </div>

      {/* Articles */}
      {posts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">
          콘텐츠 준비 중이에요. 곧 업데이트됩니다.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/learn/${post.slug}`}
              className={`group rounded-2xl border-2 bg-white p-5 transition-all hover:shadow-md ${colors.border}`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold leading-snug text-gray-900 group-hover:text-gray-700">
                  {post.title}
                </h3>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${colors.badge}`}>
                  {i + 1}단계
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-gray-500">{post.description}</p>
              <p className="mt-3 text-xs text-gray-400">⏱ {post.estimatedTime}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
