'use client'

import React from 'react'
import Image from 'next/image'
import { WorkItem, StrapiEntity } from '@/types/strapi'
import { cleanImageUrl } from '@/lib/strapi'

type CarouselWorkCardProps = {
  item: WorkItem & StrapiEntity
  isPriority?: boolean
}

const CarouselWorkCard = ({
  item,
  isPriority = false,
}: CarouselWorkCardProps) => {
  const imageUrl = cleanImageUrl(item.image?.url)

  return (
    <div
      tabIndex={0}
      role="article"
      aria-label={item.title}
      className="relative w-full h-45 mb-4 overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 bg-[#FFE5B3]/60 flex-shrink-0 select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      {/* Image */}
      <div className="relative w-full aspect-[3/1] overflow-hidden flex items-center justify-center pt-3 px-3 pb-2">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.image?.alternativeText || item.title}
            width={240}
            height={80}
            priority={isPriority}
            loading={isPriority ? undefined : 'lazy'}
            quality={85}
            className="w-full h-full object-contain select-none pointer-events-none"
            sizes="(max-width: 640px) 150px, (max-width: 1024px) 240px, 350px"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        {item.featured && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-center">
        <h3 className="text-base text-center sm:text-lg font-bold leading-tight">
          {item.title}
        </h3>
      </div>
    </div>
  )
}

export default CarouselWorkCard
