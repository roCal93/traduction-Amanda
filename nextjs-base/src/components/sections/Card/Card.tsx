import React from 'react'
import Image from 'next/image'
import { cleanImageUrl } from '@/lib/strapi'
import { StrapiBlock } from '@/types/strapi'
import { renderStrapiBlocks } from '@/lib/strapi-rich-text'

type CardProps = {
  title: string
  subtitle?: string
  content?: StrapiBlock[]
  image?: string
}

export const Card = ({ title, subtitle, content, image }: CardProps) => {
  const cleanImage = cleanImageUrl(image)

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
      <div className="mt-4 flex-grow">
        {renderStrapiBlocks(content || [], {
          textAlignmentClass: 'text-left',
          textColorClass: 'text-gray-600',
        })}
      </div>
    </div>
  )
}
