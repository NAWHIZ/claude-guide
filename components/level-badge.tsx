import { LEVEL_LABELS, LEVEL_COLORS, type Level } from '@/lib/types'

export function LevelBadge({ level }: { level: Level }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${LEVEL_COLORS[level]}`}
    >
      {LEVEL_LABELS[level]}
    </span>
  )
}
