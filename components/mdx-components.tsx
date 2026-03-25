import type { ReactNode } from 'react'

type CalloutType = 'tip' | 'warning' | 'info'

const calloutStyles: Record<CalloutType, { bg: string; border: string; icon: string }> = {
  tip: { bg: 'bg-green-50', border: 'border-green-400', icon: '💡' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-400', icon: '⚠️' },
  info: { bg: 'bg-blue-50', border: 'border-blue-400', icon: 'ℹ️' },
}

export function Callout({ type = 'info', children }: { type?: CalloutType; children: ReactNode }) {
  const s = calloutStyles[type]
  return (
    <div className={`my-4 flex gap-3 rounded-lg border-l-4 ${s.border} ${s.bg} p-4`}>
      <span className="text-lg leading-tight">{s.icon}</span>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  )
}

export function BeforeAfter({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 grid gap-3 sm:grid-cols-2">{children}</div>
  )
}

export function Before({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-500">❌ 이렇게 하면</p>
      <p className="text-sm text-gray-700">{children}</p>
    </div>
  )
}

export function After({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-green-600">✅ 이렇게 하면</p>
      <p className="text-sm text-gray-700">{children}</p>
    </div>
  )
}

export function StepByStep({ children }: { children: ReactNode }) {
  return <ol className="my-4 flex flex-col gap-2 list-none pl-0">{children}</ol>
}

export function Step({ number, children }: { number: number; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
        {number}
      </span>
      <span className="text-sm leading-7">{children}</span>
    </li>
  )
}

export function Glossary({ term, children }: { term: string; children: ReactNode }) {
  return (
    <span className="group relative cursor-help border-b border-dashed border-purple-400">
      {term}
      <span className="pointer-events-none absolute -top-1 left-0 z-10 w-56 -translate-y-full rounded-lg bg-gray-800 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {children}
      </span>
    </span>
  )
}
