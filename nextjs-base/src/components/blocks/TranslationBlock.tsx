'use client'

import React from 'react'
import { StrapiBlock } from '@/types/strapi'

type ExampleItem = {
  source: StrapiBlock[]
  translation: StrapiBlock[]
  sourceLanguage?: 'en' | 'it'
  author?: string | null
}

type TranslationBlockProps = {
  source?: StrapiBlock[]
  translation?: StrapiBlock[]
  sourceLanguage?: 'en' | 'it'
  translationLanguage: 'fr'
  showLanguageLabel?: boolean
  author?: string | null
  examples?: ExampleItem[]
  alignmentMapping?: Record<string, unknown>
}

const languageName = (lang: string) => {
  if (lang === 'en') return 'English'
  if (lang === 'it') return 'Italian'
  if (lang === 'fr') return 'Français'
  return lang
}

const TranslationBlock = ({
  source,
  translation,
  sourceLanguage = 'en',
  translationLanguage = 'fr',
  showLanguageLabel = true,
  author,
  examples,
}: TranslationBlockProps) => {
  const textAlignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  }

  const renderBlocks = (blocks: StrapiBlock[] | undefined) => {
    if (!blocks || !Array.isArray(blocks)) return null
    return blocks.map((block, index) => {
      switch (block.type) {
        case 'paragraph':
          return (
            <p
              key={index}
              className={`text-gray-700 mb-4 ${textAlignmentClasses.left}`}
            >
              {block.children?.map((child, childIndex) => {
                if (child.type === 'text')
                  return <span key={childIndex}>{child.text}</span>
                return null
              })}
            </p>
          )
        case 'heading':
          const level = block.level || 2
          const HeadingTag = `h${level}` as keyof React.JSX.IntrinsicElements
          const headingClasses = {
            1: 'text-4xl font-bold mb-6',
            2: 'text-3xl font-bold mb-5',
            3: 'text-2xl font-bold mb-4',
            4: 'text-xl font-bold mb-3',
            5: 'text-lg font-bold mb-2',
            6: 'text-base font-bold mb-2',
          }
          return (
            <HeadingTag
              key={index}
              className={`${headingClasses[level as keyof typeof headingClasses]} ${textAlignmentClasses.left}`}
            >
              {block.children?.map((child, childIndex) => {
                if (child.type === 'text')
                  return <span key={childIndex}>{child.text}</span>
                return null
              })}
            </HeadingTag>
          )
        case 'list':
          const ListTag = block.format === 'ordered' ? 'ol' : 'ul'
          const listClass =
            block.format === 'ordered' ? 'list-decimal' : 'list-disc'
          return (
            <ListTag
              key={index}
              className={`${listClass} ml-6 mb-4 text-gray-700`}
            >
              {block.children?.map((child, childIndex) => (
                <li key={childIndex} className="mb-2">
                  {Array.isArray(child.children) &&
                    child.children.map(
                      (grandChild: StrapiBlock, grandChildIndex: number) => {
                          if (grandChild.type === 'text')
                            return (
                              <span key={grandChildIndex}>{String(grandChild.text ?? '')}</span>
                            )
                          return null
                        }
                    )}
                </li>
              ))}
            </ListTag>
          )
        default:
          return null
      }
    })
  }

  const [activeIndex, setActiveIndex] = React.useState(0)

  const examplesToUse: ExampleItem[] = React.useMemo(() => {
    const baseExample: ExampleItem[] =
      source || translation
        ? [
            {
              source: source || [],
              translation: translation || [],
              sourceLanguage,
              author,
            },
          ]
        : []
    if (Array.isArray(examples) && examples.length > 0)
      return [...baseExample, ...examples]
    if (baseExample.length > 0) return baseExample
    return []
  }, [examples, source, translation, sourceLanguage, author])

  const active = examplesToUse[activeIndex] || {}

  return (
    <section className="my-8">
      <div className="w-full max-w-6xl mx-auto px-4">
        {examplesToUse.length > 1 && (
          <div className="mb-4 flex gap-2" role="tablist" aria-label="Examples">
            {examplesToUse.map((ex, idx) => (
              <button
                key={idx}
                role="tab"
                aria-selected={idx === activeIndex}
                onClick={() => setActiveIndex(idx)}
                className={`px-3 py-1 rounded ${idx === activeIndex ? 'bg-gray-200' : 'bg-white'}`}
              >
                {languageName(ex.sourceLanguage || sourceLanguage)}
                {ex.author ? ` — ${ex.author}` : ''}
              </button>
            ))}
          </div>
        )}

        <div
          className={`flex flex-col md:flex-row gap-6 md:divide-x md:divide-gray-200`}
        >
          <div className="w-full md:w-1/2 md:pr-6">
            {showLanguageLabel && (
              <div
                className="text-sm font-medium text-gray-600 mb-2"
                aria-label={`Source language: ${languageName(active.sourceLanguage || sourceLanguage)}`}
              >
                {languageName(active.sourceLanguage || sourceLanguage)}
              </div>
            )}
            <div className="prose max-w-none whitespace-pre-line">
              {renderBlocks(active.source || source)}
            </div>
            {(active.author || author) && (
              <div className="text-xs text-gray-500 mt-4">
                {active.author || author}
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2 md:pl-6">
            {showLanguageLabel && (
              <div
                className="text-sm font-medium text-gray-600 mb-2"
                aria-label={`Target language: ${languageName(translationLanguage)}`}
              >
                {languageName(translationLanguage)}
              </div>
            )}
            <div className="prose max-w-none whitespace-pre-line">
              {renderBlocks(active.translation || translation)}
            </div>
            {(active.author || author) && (
              <div className="text-xs text-gray-500 mt-4">
                {active.author || author}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TranslationBlock
