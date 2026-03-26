'use client'

import { useState } from 'react'
import Link from 'next/link'

const ROLES = [
  {
    key: 'pm',
    label: '💼 PM / 기획자',
    headline: '기획서 초안,\n이제 5분이면 됩니다',
    sub: 'PRD 작성부터 경쟁사 분석, 회의록 정리까지\nClaude Code 하나로 끝냅니다.',
    befores: [
      { before: '경쟁사 리서치 하루 종일', after: '30분 만에 보고서 완성' },
      { before: 'PRD 초안 쓰는 데 반나절', after: '요구사항 말하면 즉시 초안 생성' },
      { before: '회의록 정리 퇴근 후에', after: '회의 끝나자마자 자동 구조화' },
    ],
    cta: '기획자 학습 시작하기',
    href: '/learn/01-what-is-claude-code',
    color: 'from-blue-50 to-indigo-50',
    accent: 'text-blue-700',
    btnColor: 'bg-blue-600 hover:bg-blue-700',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    key: 'design',
    label: '🎨 디자이너',
    headline: 'Figma 작업,\nClaude가 같이 해줍니다',
    sub: '디자인 스펙 문서화, 레퍼런스 수집, 사용자 리서치 분석까지\n코딩 없이 자동으로.',
    befores: [
      { before: '디자인 스펙 문서 직접 타이핑', after: 'Figma 보고 자동으로 문서화' },
      { before: '레퍼런스 찾는 데 한 시간', after: '키워드 하나로 즉시 수집·정리' },
      { before: '사용자 인터뷰 분석 하루', after: '인터뷰 내용 붙이면 패턴 즉시 도출' },
    ],
    cta: '디자이너 학습 시작하기',
    href: '/learn/01-what-is-claude-code',
    color: 'from-pink-50 to-purple-50',
    accent: 'text-purple-700',
    btnColor: 'bg-purple-600 hover:bg-purple-700',
    tagColor: 'bg-purple-100 text-purple-700',
  },
  {
    key: 'marketing',
    label: '📣 마케터',
    headline: '콘텐츠 10개,\n이제 1시간이면 됩니다',
    sub: '블로그, SNS, 이메일, SEO까지\nClaude Code로 한 번에 만들어냅니다.',
    befores: [
      { before: '블로그 포스트 하나에 반나절', after: '키워드·방향만 주면 초안 완성' },
      { before: 'A/B 테스트 카피 고민 한 시간', after: '10가지 버전 즉시 생성' },
      { before: '경쟁사 콘텐츠 분석 하루', after: '링크 주면 전략·인사이트 즉시 정리' },
    ],
    cta: '마케터 학습 시작하기',
    href: '/learn/01-what-is-claude-code',
    color: 'from-orange-50 to-amber-50',
    accent: 'text-orange-700',
    btnColor: 'bg-orange-500 hover:bg-orange-600',
    tagColor: 'bg-orange-100 text-orange-700',
  },
]

export function HeroRoles() {
  const [active, setActive] = useState(0)
  const role = ROLES[active]

  return (
    <section className={`bg-gradient-to-br ${role.color} py-16 px-4 transition-all duration-300`}>
      <div className="mx-auto max-w-3xl">
        {/* 탭 */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {ROLES.map((r, i) => (
            <button
              key={r.key}
              onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                active === i
                  ? `${r.tagColor} border-current shadow-sm`
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* 헤드라인 */}
        <div className="text-center mb-8">
          <div className={`mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${role.tagColor}`}>
            ✦ 코딩 몰라도 됩니다
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight whitespace-pre-line">
            {role.headline}
          </h1>
          <p className="mt-4 text-lg text-gray-600 whitespace-pre-line leading-relaxed">
            {role.sub}
          </p>
        </div>

        {/* Before → After 카드 */}
        <div className="grid gap-3 sm:grid-cols-3 mb-8">
          {role.befores.map((item, i) => (
            <div key={i} className="bg-white/80 rounded-xl p-4 border border-white shadow-sm">
              <p className="text-xs text-gray-400 line-through mb-1">{item.before}</p>
              <p className={`text-sm font-semibold ${role.accent}`}>✓ {item.after}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={role.href}
            className={`rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors text-center ${role.btnColor}`}
          >
            {role.cta} →
          </Link>
          <Link
            href="/learn"
            className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-center"
          >
            전체 학습 보기
          </Link>
        </div>
      </div>
    </section>
  )
}
