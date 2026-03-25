import React from 'react'
import Image from 'next/image'
import { cleanImageUrl } from '@/lib/strapi'
import { StrapiBlock } from '@/types/strapi'

type CardProps = {
  title: string
  subtitle?: string
  content?: StrapiBlock[]
  image?: string
}

type StrapiTextNode = {
  type?: string
  text?: string
  value?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
  children?: StrapiTextNode[]
  content?: StrapiTextNode[]
}

const getStrapiNodeText = (node: StrapiTextNode): string => {
  if (typeof node.text === 'string') return node.text
  if (typeof node.value === 'string') return node.value
  return ''
}

const getBlockChildren = (block: StrapiBlock): StrapiTextNode[] => {
  if (Array.isArray(block.children)) return block.children as StrapiTextNode[]
  if (Array.isArray(block.content)) return block.content as StrapiTextNode[]
  return []
}

export const Card = ({ title, subtitle, content, image }: CardProps) => {
  const cleanImage = cleanImageUrl(image)

  const renderInlineTextNode = (node: StrapiTextNode, key: React.Key) => {
    if (
      node.type === 'hardBreak' ||
      node.type === 'lineBreak' ||
      node.type === 'break' ||
      node.type === 'hard_break'
    )
      return <br key={key} />

    const text = getStrapiNodeText(node)
    if (!text) return null

    const textWithBreaks = text.split(/\r?\n/).map((line, index) => (
      <React.Fragment key={index}>
        {index > 0 && <br />}
        {line}
      </React.Fragment>
    ))

    let rendered: React.ReactNode = textWithBreaks
    if (node.code) {
      rendered = (
        <code className="px-1 py-0.5 rounded bg-black/5 font-mono text-[0.95em]">
          {rendered}
        </code>
      )
    }
    if (node.bold) rendered = <strong>{rendered}</strong>
    if (node.italic) rendered = <em>{rendered}</em>
    if (node.underline) rendered = <span className="underline">{rendered}</span>
    if (node.strikethrough)
      rendered = <span className="line-through">{rendered}</span>

    return <React.Fragment key={key}>{rendered}</React.Fragment>
  }

  // Fonction pour rendre les blocs Strapi
  const renderBlocks = (blocks: StrapiBlock[]) => {
    return blocks.map((block, index) => {
      switch (block.type) {
        case 'paragraph':
          return (
            <p key={index} className="text-gray-600 mb-2 whitespace-pre-line">
              {getBlockChildren(block).map((child, childIndex) =>
                renderInlineTextNode(child, childIndex)
              )}
            </p>
          )
        case 'heading':
          const level = block.level || 3
          const HeadingTag = `h${level}` as keyof React.JSX.IntrinsicElements
          return (
            <HeadingTag key={index} className="text-gray-600 mb-2">
              {getBlockChildren(block).map((child, childIndex) =>
                renderInlineTextNode(child, childIndex)
              )}
            </HeadingTag>
          )
        case 'list': {
          const ListTag = block.format === 'ordered' ? 'ol' : 'ul'
          const listClass =
            block.format === 'ordered' ? 'list-decimal' : 'list-disc'

          const renderListItemContent = (
            item: StrapiBlock
          ): React.ReactNode => {
            if (!item) return null
            const children = getBlockChildren(item)
            if (!children.length) return null
            return children.map((subChild, subChildIndex) => {
              if (
                subChild.type === 'text' ||
                subChild.type === 'hardBreak' ||
                subChild.type === 'lineBreak' ||
                subChild.type === 'break' ||
                subChild.type === 'hard_break'
              ) {
                return renderInlineTextNode(subChild, subChildIndex)
              }

              const nested = subChild as unknown as StrapiBlock
              if (
                Array.isArray(nested.children) ||
                Array.isArray(nested.content)
              ) {
                return renderListItemContent(nested)
              }

              return null
            })
          }

          return (
            <ListTag
              key={index}
              className={`${listClass} ml-6 mb-2 text-gray-600`}
            >
              {block.children?.map((child, childIndex) => (
                <li key={childIndex} className="mb-1">
                  {renderListItemContent(child)}
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

  return (
    <div
      className="rounded-lg overflow-hidden shadow p-8 h-full flex flex-col"
      style={{ backgroundColor: 'rgba(250,220,163,0.6)' }}
    >
      {cleanImage && (
        <div className="relative w-full h-40 mb-4 flex-shrink-0">
          <Image
            src={cleanImage}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <h3 className="text-xl font-semibold whitespace-pre-line">{title}</h3>
      {subtitle && (
        <h4 className="text-lg text-gray-700 mt-1 whitespace-pre-line">
          {subtitle}
        </h4>
      )}
      <div className="mt-4  flex-grow">{renderBlocks(content || [])}</div>
    </div>
  )
}
