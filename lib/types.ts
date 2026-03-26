export type Level = 'beginner' | 'intermediate' | 'advanced'

export const LEVEL_LABELS: Record<Level, string> = {
  beginner: '입문',
  intermediate: '중급',
  advanced: '심화',
}

export const LEVEL_COLORS: Record<Level, string> = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-blue-100 text-blue-800',
  advanced: 'bg-purple-100 text-purple-800',
}

export type Category = 'common' | 'pm' | 'designer' | 'marketer' | 'office'

export const CATEGORY_INFO: Record<Exclude<Category, 'common'>, { label: string; emoji: string; desc: string; color: string }> = {
  pm:       { label: 'PM 트랙',    emoji: '📋', desc: 'PRD 작성부터 데이터 기반 의사결정까지',     color: 'blue'   },
  designer: { label: '디자이너 트랙', emoji: '🎨', desc: 'Figma → 코드 자동화부터 포트폴리오까지',  color: 'pink'   },
  marketer: { label: '마케터 트랙',  emoji: '📢', desc: '콘텐츠 자동화부터 경쟁사 모니터링까지',   color: 'orange' },
  office:   { label: '일반사무 트랙', emoji: '💼', desc: '회의록 자동화부터 반복 업무 제거까지',    color: 'green'  },
}

export interface LearnMeta {
  title: string
  description: string
  level: Level
  order: number
  estimatedTime: string
  prerequisites?: string[]
  lastUpdated: string
  category?: Category
  track?: string
}

export interface ReferenceMeta {
  title: string
  description: string
  category?: string
  order: number
  lastUpdated: string
}

export interface LearnPost extends LearnMeta {
  slug: string
  content: string
}

export interface ReferencePost extends ReferenceMeta {
  slug: string
  content: string
}
