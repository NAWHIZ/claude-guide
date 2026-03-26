'use client'

import { useState } from 'react'

type NewsItem = {
  id: string
  title: string
  summary_ko: string
  source_name: string
  source_url: string | null
  priority: 'official' | 'community'
  category: string
  published_date: string
  created_at: string
}

const ROLES = [
  { key: 'all', label: '전체', emoji: '🌐' },
  { key: 'dev', label: '개발', emoji: '💻' },
  { key: 'design', label: '디자인', emoji: '🎨' },
  { key: 'pm', label: 'PM', emoji: '📋' },
  { key: 'marketing', label: '마케팅', emoji: '📣' },
  { key: 'office', label: '일반사무', emoji: '🗂️' },
]

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatTime(isoStr: string) {
  const d = new Date(isoStr)
  return d.toLocaleString('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Seoul' })
}

function SummaryLines({ text }: { text: string }) {
  const emojiMap: Record<string, string> = {
    '달라진 점': '🔄',
    '핵심 내용': '💡',
    '활용 포인트': '✅',
  }
  const lines = text.split('\n').filter(l => l.trim())
  return (
    <div className="space-y-2 mt-3">
      {lines.map((line, i) => {
        const match = line.match(/^▶\s*([^：:]+)[:：]\s*(.+)/)
        if (!match) return <p key={i} className="text-gray-600 text-sm">{line}</p>
        const [, label, content] = match
        const emoji = emojiMap[label.trim()] ?? '▶'
        return (
          <div key={i} className="flex gap-2 text-sm">
            <span className="shrink-0">{emoji}</span>
            <span>
              <span className="font-medium text-gray-700">{label.trim()}:</span>{' '}
              <span className="text-gray-600">{content}</span>
            </span>
          </div>
        )
      })}
    </div>
  )
}

function groupByDate(items: NewsItem[]) {
  return items.reduce<Record<string, NewsItem[]>>((acc, item) => {
    const date = item.published_date || item.created_at.split('T')[0]
    if (!acc[date]) acc[date] = []
    acc[date].push(item)
    return acc
  }, {})
}

export function NewsFilter({ news }: { news: NewsItem[] }) {
  const [activeRole, setActiveRole] = useState('all')

  const filtered = activeRole === 'all' ? news : news.filter(n => n.category === activeRole)
  const grouped = groupByDate(filtered)
  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <>
      {/* 역할 필터 탭 */}
      <div className="flex flex-wrap gap-2 mb-8">
        {ROLES.map(role => (
          <button
            key={role.key}
            onClick={() => setActiveRole(role.key)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              activeRole === role.key
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-700'
            }`}
          >
            <span>{role.emoji}</span>
            <span>{role.label}</span>
            {activeRole !== 'all' && role.key !== 'all' && (
              <span className={`text-xs ${activeRole === role.key ? 'text-purple-200' : 'text-gray-400'}`}>
                {news.filter(n => n.category === role.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-lg font-medium text-gray-600 mb-2">해당 직무 소식이 없어요</p>
          <p className="text-sm">다른 카테고리를 선택해보세요.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {dates.map((date) => (
            <section key={date}>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-gray-200" />
                {formatDate(date)}
              </h2>
              <div className="space-y-4">
                {grouped[date]
                  .sort((a, b) => (a.priority === 'official' ? -1 : 1))
                  .map((item) => (
                    <article
                      key={item.id}
                      className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            {item.priority === 'official' ? (
                              <span className="text-xs font-medium px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                                ★ {item.source_name}
                              </span>
                            ) : (
                              <span className="text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                                {item.source_name}
                              </span>
                            )}
                            {(() => {
                              const role = ROLES.find(r => r.key === item.category)
                              return role && role.key !== 'all' ? (
                                <span className="text-xs font-medium px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                                  {role.emoji} {role.label}
                                </span>
                              ) : null
                            })()}
                          </div>
                          <span className="text-xs text-gray-400 shrink-0">{formatTime(item.created_at)} 저장</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">
                          {item.title}
                        </h3>
                        <SummaryLines text={item.summary_ko} />
                        {item.source_url && (
                          <a
                            href={item.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-medium"
                          >
                            원문 보기 →
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  )
}
