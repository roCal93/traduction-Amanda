'use client'

import React from 'react'
import { StrapiBlock } from '@/types/strapi'

type ExampleItem = {
  source: StrapiBlock[]
  translation: StrapiBlock[]
  sourceLanguage?: 'en' | 'it'
  theme?: string | null
  description?: StrapiBlock[]
}

type TranslationBlockProps = {
  title?: string
  description?: StrapiBlock[]
  source?: StrapiBlock[]
  translation?: StrapiBlock[]
  sourceLanguage?: 'en' | 'it'
  translationLanguage: 'fr'
  showLanguageLabel?: boolean
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
  title,
  source,
  translation,
  sourceLanguage = 'en',
  translationLanguage = 'fr',
  showLanguageLabel = true,
  examples,
}: TranslationBlockProps) => {
  const textAlignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  }

  const renderBlocks = (
    blocks: StrapiBlock[] | undefined,
    ctx: 'source' | 'target' = 'source'
  ) => {
    if (!blocks || !Array.isArray(blocks)) return null
    return blocks.map((block, index) => {
      switch (block.type) {
        case 'paragraph': {
          const id = `${ctx === 'source' ? 's' : 't'}-${activeIndex}-${index}`
          const isSource = ctx === 'source'
          const handleMouseEnter = () => {
            setHighlightedSources(new Set([index]))
            setHighlightedTargets(new Set([index]))
          }
          const handleMouseLeave = () => {
            setHighlightedSources(new Set())
            setHighlightedTargets(new Set())
          }
          const handleClick = () => {
            setHighlightedSources(new Set([index]))
            setHighlightedTargets(new Set([index]))
          }

          return (
            <p
              key={index}
              id={id}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              className={`text-gray-700 mb-4 ${textAlignmentClasses.left} ${isSource && highlightedSources.has(index) ? 'bg-yellow-100' : ''} ${!isSource && highlightedTargets.has(index) ? 'bg-yellow-100' : ''}`}
            >
              {block.children?.map((child, childIndex) => {
                if (child.type === 'text')
                  return <span key={childIndex}>{child.text}</span>
                return null
              })}
            </p>
          )
        }
        case 'heading': {
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
        }
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
                            <span key={grandChildIndex}>
                              {String(grandChild.text ?? '')}
                            </span>
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
  const [highlightedSources, setHighlightedSources] = React.useState<
    Set<number>
  >(new Set())
  const [highlightedTargets, setHighlightedTargets] = React.useState<
    Set<number>
  >(new Set())

  const examplesToUse: ExampleItem[] = React.useMemo(() => {
    const baseExample: ExampleItem[] =
      source || translation
        ? [
            {
              source: source || [],
              translation: translation || [],
              sourceLanguage,
            },
          ]
        : []
    if (Array.isArray(examples) && examples.length > 0)
      return [...baseExample, ...examples]
    if (baseExample.length > 0) return baseExample
    return []
  }, [examples, source, translation, sourceLanguage])

  const active = examplesToUse[activeIndex] || {}

  return (
    <section className="my-8">
      <div className="w-full max-w-6xl mx-auto px-4">
        {title && (
          <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
        )}
        {examplesToUse.length > 1 && (
          <div
            className="mb-4 flex gap-2 justify-center"
            role="tablist"
            aria-label="Examples"
          >
            {examplesToUse.map((ex, idx) => (
              <button
                key={idx}
                role="tab"
                aria-selected={idx === activeIndex}
                onClick={() => setActiveIndex(idx)}
                className={`px-3 py-1 rounded ${idx === activeIndex ? 'bg-gray-200' : 'bg-white'}`}
              >
                {ex.theme
                  ? ex.theme
                  : `Exemple ${idx + 1} — ${languageName(ex.sourceLanguage || sourceLanguage)}`}
              </button>
            ))}
          </div>
        )}

        {active.description && active.description.length > 0 && (
          <div className="prose max-w-3xl mx-auto text-center mb-6 whitespace-pre-line">
            {renderBlocks(active.description)}
          </div>
        )}

        <div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2 md:pr-6">
              {showLanguageLabel && (
                <div
                  className="text-lg font-bold text-gray-600 mb-2 text-center"
                  aria-label={`Source language: ${languageName(active.sourceLanguage || sourceLanguage)}`}
                >
                  {languageName(active.sourceLanguage || sourceLanguage)}
                </div>
              )}
            </div>

            <div className="w-full md:w-1/2 md:pl-6">
              {showLanguageLabel && (
                <div
                  className="text-lg font-bold text-gray-600 mb-2 text-center"
                  aria-label={`Target language: ${languageName(translationLanguage)}`}
                >
                  {languageName(translationLanguage)}
                </div>
              )}
            </div>
          </div>

          <div
            className="md:max-h-[60vh] md:overflow-y-auto md:pr-4 md:pb-4"
            tabIndex={0}
            role="region"
            aria-label={`Translation content — ${languageName(active.sourceLanguage || sourceLanguage)} → ${languageName(translationLanguage)}`}
          >
            <div
              className={`flex flex-col md:flex-row gap-6 md:divide-x md:divide-gray-200`}
            >
              <div className="w-full md:w-1/2 md:pr-6">
                <div className="prose max-w-none whitespace-pre-line">
                  {renderBlocks(active.source || source)}
                </div>
              </div>

              <div className="w-full md:w-1/2 md:pl-6">
                <div className="prose max-w-none whitespace-pre-line">
                  {renderBlocks(active.translation || translation, 'target')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TranslationBlock
