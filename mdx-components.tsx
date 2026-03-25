import type { MDXComponents } from 'mdx/types'
import { Callout, BeforeAfter, Before, After, StepByStep, Step, Glossary } from '@/components/mdx-components'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Callout,
    BeforeAfter,
    Before,
    After,
    StepByStep,
    Step,
    Glossary,
    ...components,
  }

}