'use client'

import React from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { StrapiBlock } from '@/types/strapi'

type ExampleItem = {
  source: StrapiBlock[]
  translation: StrapiBlock[]
  sourceLanguage?: 'en' | 'it'
  theme?: string | null
  originalTitle?: string
  translatedTitle?: string
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

const hasTextContent = (block: StrapiBlock) => {
  if (block.type === 'paragraph' || block.type === 'heading') {
    return block.children?.some(
      (child) => child.type === 'text' && child.text?.trim()
    )
  }

  if (block.type === 'list') {
    return block.children?.some(
      (child) =>
        Array.isArray(child.children) &&
        child.children.some(
          (grandChild: StrapiBlock) =>
            grandChild.type === 'text' &&
            typeof grandChild.text === 'string' &&
            grandChild.text.trim()
        )
    )
  }

  return false
}

const filterTranslatableBlocks = (blocks: StrapiBlock[] | undefined) => {
  if (!blocks) return []
  return blocks
    .filter(
      (b) => b.type === 'paragraph' || b.type === 'heading' || b.type === 'list'
    )
    .filter((b) => hasTextContent(b))
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

type SiteLocale = 'fr' | 'en' | 'it'

type StrapiTextNode = {
  type?: string
  text?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
}

const getSiteLocale = (pathname: string | null): SiteLocale => {
  const segment = pathname?.split('/').filter(Boolean)[0]
  if (segment === 'en' || segment === 'it' || segment === 'fr') {
    return segment
  }
  return 'fr'
}

const languageName = (lang: string, siteLocale: SiteLocale) => {
  const names: Record<SiteLocale, Record<string, string>> = {
    fr: {
      en: 'Anglais',
      it: 'Italien',
      fr: 'Français',
    },
    en: {
      en: 'English',
      it: 'Italian',
      fr: 'French',
    },
    it: {
      en: 'Inglese',
      it: 'Italiano',
      fr: 'Francese',
    },
  }

  return names[siteLocale][lang] || lang
}

const renderInlineTextNode = (node: StrapiTextNode, key: React.Key) => {
  if (node.type !== 'text') return null

  let content: React.ReactNode = node.text ?? ''

  if (node.code) {
    content = (
      <code className="px-1 py-0.5 rounded bg-black/5 font-mono text-[0.95em]">
        {content}
      </code>
    )
  }
  if (node.bold) content = <strong>{content}</strong>
  if (node.italic) content = <em>{content}</em>
  if (node.underline) content = <span className="underline">{content}</span>
  if (node.strikethrough)
    content = <span className="line-through">{content}</span>

  return <React.Fragment key={key}>{content}</React.Fragment>
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
  const pathname = usePathname()
  const siteLocale = getSiteLocale(pathname)

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
      const id = `${ctx === 'source' ? 's' : ctx === 'target' ? 't' : 'd'}-${activeIndex}-${currentIndex}`
      const isSource = ctx === 'source'
      const isDescription = ctx === 'description'
      const showHighlight = enableInteractivity && !isDescription
      const isHighlighted =
        showHighlight &&
        ((isSource && highlightedSources.has(currentIndex)) ||
          (!isSource && highlightedTargets.has(currentIndex)))
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

      switch (block.type) {
        case 'paragraph': {
          return (
            <p
              key={index}
              id={id}
              onMouseEnter={enableInteractivity ? handleMouseEnter : undefined}
              onMouseLeave={enableInteractivity ? handleMouseLeave : undefined}
              onClick={enableInteractivity ? handleClick : undefined}
              className={`${textColor || 'text-gray-700'} mb-4 ${textAlignmentClasses[alignment]} ${isHighlighted ? 'bg-yellow-100' : ''}`}
            >
              {block.children?.map((child, childIndex) => {
                if (child.type === 'text')
                  return renderInlineTextNode(child as StrapiTextNode, childIndex)
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
              id={id}
              onMouseEnter={enableInteractivity ? handleMouseEnter : undefined}
              onMouseLeave={enableInteractivity ? handleMouseLeave : undefined}
              onClick={enableInteractivity ? handleClick : undefined}
              className={`${headingClasses[level as keyof typeof headingClasses]} ${textAlignmentClasses.left} ${isHighlighted ? 'bg-yellow-100 rounded px-1' : ''}`}
            >
              {block.children?.map((child, childIndex) => {
                if (child.type === 'text')
                  return renderInlineTextNode(child as StrapiTextNode, childIndex)
                return null
              })}
            </HeadingTag>
          )
        }
        case 'list': {
          const ListTag = block.format === 'ordered' ? 'ol' : 'ul'
          const listClass =
            block.format === 'ordered' ? 'list-decimal' : 'list-disc'
          return (
            <ListTag
              key={index}
              id={id}
              onMouseEnter={enableInteractivity ? handleMouseEnter : undefined}
              onMouseLeave={enableInteractivity ? handleMouseLeave : undefined}
              onClick={enableInteractivity ? handleClick : undefined}
              className={`${listClass} ml-6 mb-4 ${textColor || 'text-gray-700'} ${isHighlighted ? 'bg-yellow-100 rounded px-1 py-1' : ''}`}
            >
              {block.children?.map((child, childIndex) => (
                <li key={childIndex} className="mb-2">
                  {Array.isArray(child.children) &&
                    child.children.map(
                      (grandChild: StrapiBlock, grandChildIndex: number) => {
                        if (grandChild.type === 'text')
                          return renderInlineTextNode(
                            grandChild as StrapiTextNode,
                            grandChildIndex
                          )
                        return null
                      }
                    )}
                </li>
              ))}
            </ListTag>
          )
        }
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
  const originalTitle = active.originalTitle || active.title
  const translatedTitle = active.translatedTitle

  const pairedBlocks = React.useMemo(() => {
    const sourceBlocks = filterTranslatableBlocks(active.source || source)
    const translationBlocks = filterTranslatableBlocks(
      active.translation || translation
    )
    const maxLength = Math.max(sourceBlocks.length, translationBlocks.length)

    return Array.from({ length: maxLength }).map((_, idx) => ({
      idx,
      sourceBlock: sourceBlocks[idx],
      translationBlock: translationBlocks[idx],
    }))
  }, [active.source, active.translation, source, translation])

  // Fonction pour rendre les blocs de manière imbriquée (mobile)
  const renderInterleavedBlocks = () => {
    return (
      <div className="space-y-4">
        {pairedBlocks.map(({ idx, sourceBlock, translationBlock }) => (
          <div
            key={idx}
            className="border-b border-[#F88379] pb-4 last:border-b-0"
          >
            {sourceBlock && (
              <div className="mb-4">
                {showLanguageLabel && idx === 0 && (
                  <div className="text-sm font-semibold text-gray-500 mb-1">
                    {languageName(
                      active.sourceLanguage || sourceLanguage,
                      siteLocale
                    )}
                  </div>
                )}
                <div className="prose max-w-none whitespace-pre-line">
                  {renderBlocks(
                    [sourceBlock],
                    'source',
                    idx,
                    false,
                    'text-gray-700'
                  )}
                </div>
              </div>
            )}
            {translationBlock && (
              <div>
                {showLanguageLabel && idx === 0 && (
                  <div className="text-sm font-semibold text-gray-500 mb-1">
                    {languageName(translationLanguage, siteLocale)}
                  </div>
                )}
                <div className="prose max-w-none whitespace-pre-line">
                  <div className="bg-[#FFFACD80] rounded-full px-3 min-[850px]:bg-transparent min-[850px]:p-0">
                    {renderBlocks([translationBlock], 'target', idx, false)}
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
                    : `Exemple ${idx + 1} — ${languageName(
                        ex.sourceLanguage || sourceLanguage,
                        siteLocale
                      )}`}
                </button>
              ))}
            </div>
          )}

          {(originalTitle ||
            translatedTitle ||
            active.author ||
            active.sourceText ||
            (active.description && active.description.length > 0)) && (
            <div className="mx-auto rounded-xl bg-[#FADCA3]/40 p-6 mb-6 text-center">
              {(originalTitle ||
                translatedTitle ||
                active.author ||
                active.sourceText) && (
                <div className="mb-4">
                  {originalTitle && (
                    <h3 className="text-2xl font-semibold mb-2">
                      {originalTitle}
                    </h3>
                  )}
                  {translatedTitle && (
                    <div className="text-lg font-medium text-gray-700 mb-2">
                      {translatedTitle}
                    </div>
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
                <div className="grid grid-cols-2 gap-6 mb-2">
                  <div>
                    {showLanguageLabel && (
                      <div
                        className="text-lg font-bold text-gray-600 mb-2 text-center"
                        aria-label={`Source language: ${languageName(active.sourceLanguage || sourceLanguage, siteLocale)}`}
                      >
                        {languageName(
                          active.sourceLanguage || sourceLanguage,
                          siteLocale
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    {showLanguageLabel && (
                      <div
                        className="text-lg font-bold text-gray-600 mb-2 text-center"
                        aria-label={`Target language: ${languageName(translationLanguage, siteLocale)}`}
                      >
                        {languageName(translationLanguage, siteLocale)}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className="max-h-[60vh] lg:max-h-[40vh] overflow-y-auto custom-scrollbar"
                  style={scrollbarStyle}
                  tabIndex={0}
                  role="region"
                  aria-label={`Translation content — ${languageName(active.sourceLanguage || sourceLanguage, siteLocale)} → ${languageName(translationLanguage, siteLocale)}`}
                >
                  <div className="space-y-4">
                    {pairedBlocks.map(
                      ({ idx, sourceBlock, translationBlock }) => (
                        <div
                          key={idx}
                          className="grid grid-cols-2 gap-6 border-b border-[#F88379]/60 pb-4 last:border-b-0"
                        >
                          <div className="pr-6">
                            <div className="prose max-w-none whitespace-pre-line">
                              {sourceBlock &&
                                renderBlocks(
                                  [sourceBlock],
                                  'source',
                                  idx,
                                  true,
                                  'text-gray-700'
                                )}
                            </div>
                          </div>

                          <div className="pl-6 border-l border-[#F88379]">
                            <div className="prose max-w-none whitespace-pre-line">
                              {translationBlock &&
                                renderBlocks([translationBlock], 'target', idx)}
                            </div>
                          </div>
                        </div>
                      )
                    )}
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
