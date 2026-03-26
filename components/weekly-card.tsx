'use client'

import { useState } from 'react'

type Highlight = {
  title: string
  summary: string
  importance: 'high' | 'medium' | 'low'
}

type RoleData = {
  summary: string
  tips: string[]
}

export type WeeklyDigest = {
  id: string
  week_label: string
  week_start: string
  week_end: string
  headline: string
  overview: string
  highlights: Highlight[]
  by_role: Record<string, RoleData>
  news_count: number
  created_at: string
}

const ROLES = [
  { key: 'pm', label: 'PM', emoji: '💼' },
  { key: 'design', label: '디자이너', emoji: '🎨' },
  { key: 'marketing', label: '마케터', emoji: '📣' },
  { key: 'office', label: '일반사무', emoji: '🗂️' },
]

const importanceDot: Record<string, string> = {
  high: 'bg-red-400',
  medium: 'bg-amber-400',
  low: 'bg-gray-300',
}

export function WeeklyCard({ digest }: { digest: WeeklyDigest }) {
  const [activeRole, setActiveRole] = useState('pm')
  const roleData = digest.by_role?.[activeRole]

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-purple-200">{digest.week_label}</span>
          <span className="text-xs text-purple-200">뉴스 {digest.news_count}개 분석</span>
        </div>
        <h2 className="text-xl font-bold text-white leading-snug">{digest.headline}</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* 전체 요약 */}
        <p className="text-gray-600 text-sm leading-relaxed">{digest.overview}</p>

        {/* 하이라이트 */}
        {digest.highlights?.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              이번 주 하이라이트
            </h3>
            <div className="space-y-3">
              {digest.highlights.map((h, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${importanceDot[h.importance] ?? 'bg-gray-300'}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{h.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{h.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 직무별 인사이트 */}
        {digest.by_role && (
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              직무별 인사이트
            </h3>
            <div className="flex gap-2 mb-4 flex-wrap">
              {ROLES.map(role => (
                <button
                  key={role.key}
                  onClick={() => setActiveRole(role.key)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                    activeRole === role.key
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <span>{role.emoji}</span>
                  <span>{role.label}</span>
                </button>
              ))}
            </div>
            {roleData && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700 leading-relaxed mb-3">{roleData.summary}</p>
                {roleData.tips?.length > 0 && (
                  <ul className="space-y-1.5">
                    {roleData.tips.map((tip, i) => (
                      <li key={i} className="flex gap-2 text-sm text-gray-600">
                        <span className="text-purple-500 shrink-0">✅</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
