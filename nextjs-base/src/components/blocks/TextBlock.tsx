import React from 'react'
import { StrapiBlock } from '@/types/strapi'

type TextBlockProps = {
  content: StrapiBlock[]
  textAlignment?: 'left' | 'center' | 'right' | 'justify'
  blockAlignment?: 'left' | 'center' | 'right' | 'full'
  maxWidth?: 'small' | 'medium' | 'large' | 'full'
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

const TextBlock = ({
  content,
  textAlignment = 'left',
  blockAlignment = 'full',
  maxWidth = 'full',
}: TextBlockProps) => {
  const renderInlineTextNode = (node: StrapiTextNode, key: React.Key) => {
    if (
      node.type === 'hardBreak' ||
      node.type === 'lineBreak' ||
      node.type === 'break' ||
      node.type === 'hard_break'
    )
      return <br key={key} />
    if (node.type !== 'text') return null

    const textWithBreaks = (node.text ?? '')
      .split(/\r?\n/)
      .map((line, index) => (
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

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  }

  const blockAlignmentClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
    full: 'w-full',
  }

  const maxWidthClasses = {
    small: 'max-w-2xl',
    medium: 'max-w-4xl',
    large: 'max-w-6xl',
    full: 'max-w-none',
  }

  const renderBlocks = (blocks: StrapiBlock[]) => {
    return blocks.map((block, index) => {
      switch (block.type) {
        case 'paragraph':
          return (
            <p
              key={index}
              className={`text-gray-700 mb-4 ${alignmentClasses[textAlignment]}`}
            >
              {block.children?.map((child, childIndex) => {
                if (child.type === 'text' || child.type === 'hardBreak') {
                  return renderInlineTextNode(
                    child as StrapiTextNode,
                    childIndex
                  )
                }
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
              className={`${headingClasses[level as keyof typeof headingClasses]} ${alignmentClasses[textAlignment]}`}
            >
              {block.children?.map((child, childIndex) => {
                if (child.type === 'text' || child.type === 'hardBreak') {
                  return renderInlineTextNode(
                    child as StrapiTextNode,
                    childIndex
                  )
                }
                return null
              })}
            </HeadingTag>
          )
        case 'list': {
          const ListTag = block.format === 'ordered' ? 'ol' : 'ul'
          const listClass =
            block.format === 'ordered' ? 'list-decimal' : 'list-disc'

          const renderListItemContent = (item: StrapiBlock) => {
            if (!item || !Array.isArray(item.children)) return null
            return item.children.map((subChild, subChildIndex) => {
              if (
                subChild.type === 'text' ||
                subChild.type === 'hardBreak' ||
                subChild.type === 'lineBreak' ||
                subChild.type === 'break' ||
                subChild.type === 'hard_break'
              ) {
                return renderInlineTextNode(subChild as StrapiTextNode, subChildIndex)
              }

              if (Array.isArray((subChild as StrapiBlock).children)) {
                return renderListItemContent(subChild as StrapiBlock)
              }

              return null
            })
          }

          return (
            <ListTag
              key={index}
              className={`${listClass} ml-6 mb-4 text-gray-700 ${alignmentClasses[textAlignment]}`}
            >
              {block.children?.map((child, childIndex) => (
                <li key={childIndex} className="mb-2">
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
      className={`${blockAlignmentClasses[blockAlignment]} ${maxWidthClasses[maxWidth]}`}
    >
      <div className="prose max-w-none">{renderBlocks(content)}</div>
    </div>
  )
}

export default TextBlock
