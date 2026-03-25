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

export interface LearnMeta {
  title: string
  description: string
  level: Level
  order: number
  estimatedTime: string
  prerequisites?: string[]
  lastUpdated: string
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
