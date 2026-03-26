import type { MDXComponents } from 'mdx/types'
import { Callout, BeforeAfter, Before, After, StepByStep, Step, Glossary } from '@/components/mdx-components'
import { Quiz } from '@/components/quiz'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Callout,
    BeforeAfter,
    Before,
    After,
    StepByStep,
    Step,
    Glossary,
    Quiz,
    ...components,
  }

}