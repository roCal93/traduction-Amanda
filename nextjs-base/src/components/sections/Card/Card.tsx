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
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
}

export const Card = ({ title, subtitle, content, image }: CardProps) => {
  const cleanImage = cleanImageUrl(image)

  const renderInlineTextNode = (node: StrapiTextNode, key: React.Key) => {
    if (node.type !== 'text') return null

    let rendered: React.ReactNode = node.text ?? ''
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
    if (node.strikethrough) rendered = <span className="line-through">{rendered}</span>

    return <React.Fragment key={key}>{rendered}</React.Fragment>
  }

  // Fonction pour rendre les blocs Strapi
  const renderBlocks = (blocks: StrapiBlock[]) => {
    return blocks.map((block, index) => {
      switch (block.type) {
        case 'paragraph':
          return (
            <p key={index} className="text-gray-600 mb-2 whitespace-pre-line">
              {block.children?.map((child, childIndex) => {
                if (child.type === 'text') {
                  return renderInlineTextNode(child as StrapiTextNode, childIndex)
                }
                return null
              })}
            </p>
          )
        case 'heading':
          const level = block.level || 3
          const HeadingTag = `h${level}` as keyof React.JSX.IntrinsicElements
          return (
            <HeadingTag key={index} className="text-gray-600 mb-2">
              {block.children?.map((child, childIndex) => {
                if (child.type === 'text') {
                  return renderInlineTextNode(child as StrapiTextNode, childIndex)
                }
                return null
              })}
            </HeadingTag>
          )
        case 'list': {
          const ListTag = block.format === 'ordered' ? 'ol' : 'ul'
          const listClass =
            block.format === 'ordered' ? 'list-decimal' : 'list-disc'

          return (
            <ListTag key={index} className={`${listClass} ml-6 mb-2 text-gray-600`}>
              {block.children?.map((child, childIndex) => (
                <li key={childIndex} className="mb-1">
                  {Array.isArray(child.children) &&
                    child.children.map((grandChild, grandChildIndex) =>
                      grandChild.type === 'text'
                        ? renderInlineTextNode(
                            grandChild as StrapiTextNode,
                            grandChildIndex
                          )
                        : null
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
