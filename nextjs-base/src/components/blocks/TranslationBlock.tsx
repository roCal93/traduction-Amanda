'use client'

import React from 'react'
import Image from 'next/image'
import { StrapiBlock } from '@/types/strapi'

type ExampleItem = {
  source: StrapiBlock[]
  translation: StrapiBlock[]
  sourceLanguage?: 'en' | 'it'
  theme?: string | null
  title?: string
  author?: string
  sourceText?: string
  description?: StrapiBlock[]
}

const renderSourceText = (text?: string) => {
  if (!text) return null
  return text
    .split(/(https?:\/\/[^\s]+|www\.[^\s]+)/g)
    .filter(Boolean)
    .map((part, idx) =>
      /^(https?:\/\/|www\.)/.test(part) ? (
        <a
          key={idx}
          href={part.startsWith('http') ? part : `https://${part}`}
          target="_blank"
          rel="noopener noreferrer"
          title={part}
          aria-label={`Source: ${part}`}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5e1a599] text-gray-800 hover:bg-[#c5e1a5b3] shadow-md hover:shadow-lg transition-shadow"
        >
          <span>Source</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="w-3 h-3"
          >
            <path d="M14 3h7v7" />
            <path d="M10 14L21 3" />
            <path d="M21 14v7H3V3h7" />
          </svg>
        </a>
      ) : (
        <span key={idx}>{part}</span>
      )
    )
}

const filterNonEmptyParagraphs = (blocks: StrapiBlock[] | undefined) => {
  if (!blocks) return []
  return blocks
    .filter((b) => b.type === 'paragraph')
    .filter((b) =>
      b.children?.some((child) => child.type === 'text' && child.text?.trim())
    )
}

type TranslationBlockProps = {
  title?: string
  description?: StrapiBlock[]
  source?: StrapiBlock[]
  translation?: StrapiBlock[]
  sourceLanguage?: 'en' | 'it'
  translationLanguage: 'fr'
  showLanguageLabel?: boolean
  showCreditImage?: boolean
  examples?: ExampleItem[]
  alignmentMapping?: Record<string, unknown>
  marginTopClass?: string
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
  showCreditImage = false,
  examples,
  marginTopClass = 'mt-16',
}: TranslationBlockProps) => {
  const textAlignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  }

  const renderBlocks = (
    blocks: StrapiBlock[] | undefined,
    ctx: 'source' | 'target' | 'description' = 'source',
    paragraphIndex?: number,
    enableInteractivity: boolean = true,
    textColor?: string
  ) => {
    if (!blocks || !Array.isArray(blocks)) return null
    const alignment = ctx === 'description' ? 'center' : 'left'
    return blocks.map((block, index) => {
      const currentIndex = paragraphIndex !== undefined ? paragraphIndex : index
      switch (block.type) {
        case 'paragraph': {
          const id = `${ctx === 'source' ? 's' : ctx === 'target' ? 't' : 'd'}-${activeIndex}-${currentIndex}`
          const isSource = ctx === 'source'
          const isDescription = ctx === 'description'
          const showHighlight = enableInteractivity && !isDescription
          const handleMouseEnter = () => {
            if (!enableInteractivity || isDescription) return
            setHighlightedSources(new Set([currentIndex]))
            setHighlightedTargets(new Set([currentIndex]))
          }
          const handleMouseLeave = () => {
            if (!enableInteractivity || isDescription) return
            setHighlightedSources(new Set())
            setHighlightedTargets(new Set())
          }
          const handleClick = () => {
            if (!enableInteractivity || isDescription) return
            setHighlightedSources(new Set([currentIndex]))
            setHighlightedTargets(new Set([currentIndex]))
          }

          return (
            <p
              key={index}
              id={id}
              onMouseEnter={enableInteractivity ? handleMouseEnter : undefined}
              onMouseLeave={enableInteractivity ? handleMouseLeave : undefined}
              onClick={enableInteractivity ? handleClick : undefined}
              className={`${textColor || 'text-gray-700'} mb-4 ${textAlignmentClasses[alignment]} ${showHighlight && isSource && highlightedSources.has(currentIndex) ? 'bg-yellow-100' : ''} ${showHighlight && !isSource && highlightedTargets.has(currentIndex) ? 'bg-yellow-100' : ''}`}
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

  // Reset highlights when switching tabs
  React.useEffect(() => {
    setHighlightedSources(new Set())
    setHighlightedTargets(new Set())
  }, [activeIndex])

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

  // Fonction pour rendre les blocs de manière imbriquée (mobile)
  const renderInterleavedBlocks = () => {
    const sourceBlocks = filterNonEmptyParagraphs(active.source || source)
    const translationBlocks = filterNonEmptyParagraphs(
      active.translation || translation
    )
    const maxLength = Math.max(sourceBlocks.length, translationBlocks.length)

    return (
      <div className="space-y-4">
        {Array.from({ length: maxLength }).map((_, idx) => (
          <div
            key={idx}
            className="border-b border-[#F88379] pb-4 last:border-b-0"
          >
            {sourceBlocks[idx] && (
              <div className="mb-4">
                {showLanguageLabel && idx === 0 && (
                  <div className="text-sm font-semibold text-gray-500 mb-1">
                    {languageName(active.sourceLanguage || sourceLanguage)}
                  </div>
                )}
                <div className="prose max-w-none whitespace-pre-line">
                  {renderBlocks(
                    [sourceBlocks[idx]],
                    'source',
                    idx,
                    false,
                    'text-gray-700'
                  )}
                </div>
              </div>
            )}
            {translationBlocks[idx] && (
              <div>
                {showLanguageLabel && idx === 0 && (
                  <div className="text-sm font-semibold text-gray-500 mb-1">
                    {languageName(translationLanguage)}
                  </div>
                )}
                <div className="prose max-w-none whitespace-pre-line">
                  <div className="bg-[#FFFACD80] rounded-full px-3 min-[850px]:bg-transparent min-[850px]:p-0">
                    {renderBlocks(
                      [translationBlocks[idx]],
                      'target',
                      idx,
                      false
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  const scrollbarStyle: React.CSSProperties & {
    scrollbarGutter?: 'auto' | 'stable'
  } = {
    scrollbarGutter: 'stable',
  }

  return (
    <>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #fffacd80;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f88379;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #f88379;
        }
        .custom-scrollbar {
          scrollbar-color: #f88379 #fffacd80;
          scrollbar-width: thin;
        }
      `}</style>
      <section className={`${marginTopClass} mb-8`}>
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
                  className="px-3 py-1 rounded-full shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  style={{
                    backgroundColor:
                      idx === activeIndex ? '#c5e1a599' : '#FFFACD80',
                  }}
                >
                  {ex.theme
                    ? ex.theme
                    : `Exemple ${idx + 1} — ${languageName(ex.sourceLanguage || sourceLanguage)}`}
                </button>
              ))}
            </div>
          )}

          {(active.title ||
            active.author ||
            active.sourceText ||
            (active.description && active.description.length > 0)) && (
            <div className="mx-auto rounded-xl bg-[#FADCA3]/40 p-6 mb-6 text-center">
              {(active.title || active.author || active.sourceText) && (
                <div className="mb-4">
                  {active.title && (
                    <h3 className="text-2xl font-semibold mb-2">
                      {active.title}
                    </h3>
                  )}
                  {active.author && (
                    <div className="text-sm text-gray-600 mb-4">
                      {active.author}
                    </div>
                  )}
                  {active.sourceText && (
                    <div className="text-sm text-gray-700 mb-4">
                      {renderSourceText(active.sourceText)}
                    </div>
                  )}
                </div>
              )}

              {active.description && active.description.length > 0 && (
                <div className="prose max-w-3xl mx-auto text-center mb-6 whitespace-pre-line">
                  {renderBlocks(active.description, 'description')}
                </div>
              )}
            </div>
          )}

          <div>
            {/* Vue mobile : paragraphes imbriqués */}
            <div className="block min-[850px]:hidden">
              <div className="rounded-xl bg-[#FADCA3]/40 p-6">
                {renderInterleavedBlocks()}
              </div>
            </div>

            {/* Vue desktop : colonnes côte-à-côte */}
            <div className="hidden min-[850px]:block">
              <div className="rounded-xl bg-[#FADCA3]/40 p-6">
                <div className="flex flex-row gap-6">
                  <div className="w-1/2 pr-6">
                    {showLanguageLabel && (
                      <div
                        className="text-lg font-bold text-gray-600 mb-2 text-center"
                        aria-label={`Source language: ${languageName(active.sourceLanguage || sourceLanguage)}`}
                      >
                        {languageName(active.sourceLanguage || sourceLanguage)}
                      </div>
                    )}
                  </div>

                  <div className="w-1/2 pl-6">
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
                  className="max-h-[60vh] lg:max-h-[40vh] overflow-y-auto custom-scrollbar"
                  style={scrollbarStyle}
                  tabIndex={0}
                  role="region"
                  aria-label={`Translation content — ${languageName(active.sourceLanguage || sourceLanguage)} → ${languageName(translationLanguage)}`}
                >
                  <div className="flex flex-row gap-6 divide-x divide-[#F88379]">
                    <div className="w-1/2 pr-6">
                      <div className="prose max-w-none whitespace-pre-line">
                        {renderBlocks(active.source || source)}
                      </div>
                    </div>

                    <div className="w-1/2 pl-6">
                      <div className="prose max-w-none whitespace-pre-line">
                        {renderBlocks(
                          active.translation || translation,
                          'target'
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {showCreditImage && (
              <div className="mt-4 flex justify-center">
                <a
                  href="https://creativecommons.org/licenses/by/4.0/deed.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/images/cc-by-4.0.svg"
                    alt="Licence CC BY 4.0"
                    width={120}
                    height={42}
                    className="h-8 w-auto"
                  />
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default TranslationBlock
