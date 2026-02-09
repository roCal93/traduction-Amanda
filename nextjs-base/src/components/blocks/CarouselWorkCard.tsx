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
      className="relative w-full m-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 bg-[#FFE5B3]/60 flex-shrink-0 select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      {/* Image */}
      <div className="relative w-full aspect-[5/2] overflow-hidden flex items-center justify-center pt-4 ">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.image?.alternativeText || item.title}
            width={260}
            height={104}
            priority={isPriority}
            loading={isPriority ? undefined : 'lazy'}
            quality={85}
            className="w-full h-full object-contain select-none pointer-events-none"
            sizes="(max-width: 640px) 180px, (max-width: 1024px) 220px, 260px"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        {item.featured && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pt-2 pb-3 sm:px-5 sm:pt-2 sm:pb-4 flex items-center justify-center min-h-[70px]">
        <h3 className="text-sm text-center font-bold leading-tight line-clamp-3">
          {item.title}
        </h3>
      </div>
    </div>
  )
}

export default CarouselWorkCard
