import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { LearnMeta, ReferenceMeta, LearnPost, ReferencePost } from './types'

const CONTENT_DIR = path.join(process.cwd(), 'content')

function getFiles(dir: string): string[] {
  const fullPath = path.join(CONTENT_DIR, dir)
  if (!fs.existsSync(fullPath)) return []
  return fs.readdirSync(fullPath).filter((f) => f.endsWith('.mdx'))
}

function parseFile<T>(filePath: string): { data: T; content: string } {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return { data: data as T, content }
}

// 학습 콘텐츠
export function getAllLearnPosts(): LearnPost[] {
  return getFiles('learn')
    .map((filename) => {
      const slug = filename.replace('.mdx', '')
      const { data, content } = parseFile<LearnMeta>(
        path.join(CONTENT_DIR, 'learn', filename)
      )
      return { ...data, slug, content }
    })
    .sort((a, b) => a.order - b.order)
}

export function getLearnPost(slug: string): LearnPost | null {
  const filePath = path.join(CONTENT_DIR, 'learn', `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const { data, content } = parseFile<LearnMeta>(filePath)
  return { ...data, slug, content }
}

export function getLearnSlugs(): string[] {
  return getFiles('learn').map((f) => f.replace('.mdx', ''))
}

// 레퍼런스
export function getAllReferencePosts(): ReferencePost[] {
  return getFiles('reference')
    .map((filename) => {
      const slug = filename.replace('.mdx', '')
      const { data, content } = parseFile<ReferenceMeta>(
        path.join(CONTENT_DIR, 'reference', filename)
      )
      return { ...data, slug, content }
    })
    .sort((a, b) => a.order - b.order)
}

export function getReferencePost(slug: string): ReferencePost | null {
  const filePath = path.join(CONTENT_DIR, 'reference', `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const { data, content } = parseFile<ReferenceMeta>(filePath)
  return { ...data, slug, content }
}

export function getReferenceSlugs(): string[] {
  return getFiles('reference').map((f) => f.replace('.mdx', ''))
}

// 이전/다음 글
export function getAdjacentLearnPosts(slug: string) {
  const posts = getAllLearnPosts()
  const idx = posts.findIndex((p) => p.slug === slug)
  return {
    prev: idx > 0 ? posts[idx - 1] : null,
    next: idx < posts.length - 1 ? posts[idx + 1] : null,
  }
}
