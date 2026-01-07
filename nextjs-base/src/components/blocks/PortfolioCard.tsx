import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PortfolioItem, StrapiEntity } from '@/types/strapi'
import { cleanImageUrl } from '@/lib/strapi'

type PortfolioCardProps = {
  item: PortfolioItem & StrapiEntity
}

export const PortfolioCard = ({ item }: PortfolioCardProps) => {
  const imageUrl = cleanImageUrl(item.image?.url)

  return (
    <div className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.image?.alternativeText || item.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Featured badge */}
        {item.featured && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-gray-600 transition-colors">
          {item.title}
        </h3>
        
        {item.shortDescription && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {item.shortDescription}
          </p>
        )}

        {/* Themes tags */}
        {item.themes && item.themes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {item.themes.map((theme) => (
              <span
                key={theme.id}
                className="px-2 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: theme.color ? `${theme.color}20` : '#f3f4f6',
                  color: theme.color || '#6b7280',
                }}
              >
                {theme.name}
              </span>
            ))}
          </div>
        )}

        {/* Meta information */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          {item.client && <span>{item.client}</span>}
          {item.year && <span>{item.year}</span>}
        </div>

        {/* Technologies */}
        {item.technologies && typeof item.technologies === 'object' && (
          <div className="flex flex-wrap gap-1 mb-4">
            {Object.values(item.technologies).map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
              >
                {String(tech)}
              </span>
            ))}
          </div>
        )}

        {/* Link */}
        {item.link && (
          <Link
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Voir le projet
            <svg
              className="ml-1 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </Link>
        )}
      </div>
    </div>
  )
}
