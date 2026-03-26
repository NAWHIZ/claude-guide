'use client'

import { useState } from 'react'
import Link from 'next/link'

const ROLES = [
  {
    key: 'pm',
    label: '💼 PM / 기획자',
    headline: '내가 만든 도구로\n일하는 PM',
    sub: 'Claude Code는 답변만 주는 AI가 아니에요.\n실제로 파일을 만들고, 데이터를 분석하고, 자동화 도구를 직접 구축합니다.',
    befores: [
      { before: '경직사 웹사이트 일일이 들어가 정리', after: '자동 크롤링후 분석 리포트 파일로 저장' },
      { before: '회의록 폴더 의미 없이 쳄영', after: '전체 폴더 분석해 액션 아이템 자동 추출' },
      { before: 'Notion에 태스크 직접 입력', after: 'API 연동해서 태스크 자동 생성·업데이트' },
    ],
    cta: 'PM 학습 시작하기',
    href: '/learn/01-what-is-claude-code',
    color: 'from-blue-50 to-indigo-50',
    accent: 'text-blue-700',
    btnColor: 'bg-blue-600 hover:bg-blue-700',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    key: 'design',
    label: '🎨 디자이너',
    headline: 'Figma에서 클릭하면\n코드가 나옵니다',
    sub: 'Claude Code + Figma MCP 연동으로\n디자인 컴포넌트가 실제 코드 파일로 변환됩니다.',
    befores: [
      { before: '디자인 컴포넌트 코드 구현은 개발자 담당', after: 'Figma 컴포넌트 선택하면 코드 직접 생성' },
      { before: '디자인 스펙 문서화 따로 작업', after: '컴포넌트 구조 보고 자동 생성·저장' },
      { before: '프로토타입 설명 매번 따로 작성', after: '실제 동작하는 HTML 프로토타입 즉시 빌드' },
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
    headline: '경쟁사 모니터링부터\nCTA 페이지까지 직접 만듭니다',
    sub: 'Claude Code는 콘텐츠를 써주는 게 아니라\n실제로 동작하는 마케팅 도구를 만들어줍니다.',
    befores: [
      { before: '경직사 블로그 수동 모니터링', after: '자동 수집·요약 리포트 매주 발송' },
      { before: '구글 시트 데이터 분석 하나하나 직접', after: '콘텐츠 캘린더 시스템 직접 구축' },
      { before: 'CTA 페이지 제작 에이전시에 맡겨', after: '말로 설명하면 랜딩 페이지 직접 제작' },
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
