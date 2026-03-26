import type { Metadata } from 'next'
import './globals.css'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: {
    default: '클로드코드 가이드 — 비개발자를 위한 Claude Code 완전 정복',
    template: '%s | 클로드코드 가이드',
  },
  description:
    'Claude Code를 첫 접하는 분부터 파워 유저까지. 한국어로 쉽고 깊게 배우는 Claude Code 완전 가이드.',
  openGraph: {
    title: '클로드코드 가이드',
    description: '비개발자를 위한 Claude Code 완전 정복',
    type: 'website',
    locale: 'ko_KR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
