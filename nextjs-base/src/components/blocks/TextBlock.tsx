import React from 'react'
import { StrapiBlock } from '@/types/strapi'
import { renderStrapiBlocks } from '@/lib/strapi-rich-text'

type TextBlockProps = {
  content: StrapiBlock[]
  textAlignment?: 'left' | 'center' | 'right' | 'justify'
  blockAlignment?: 'left' | 'center' | 'right' | 'full'
  maxWidth?: 'small' | 'medium' | 'large' | 'full'
}

const TextBlock = ({
  content,
  textAlignment = 'left',
  blockAlignment = 'full',
  maxWidth = 'full',
}: TextBlockProps) => {
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

  return (
    <div
      className={`${blockAlignmentClasses[blockAlignment]} ${maxWidthClasses[maxWidth]}`}
    >
      <div className="prose max-w-none">
        {renderStrapiBlocks(content, {
          textAlignmentClass: alignmentClasses[textAlignment],
          textColorClass: 'text-gray-700',
        })}
      </div>
    </div>
  )
}

export default TextBlock
