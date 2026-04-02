'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { WorkItem, StrapiBlock, StrapiEntity } from '@/types/strapi'
import { cleanImageUrl } from '@/lib/strapi'
import { renderStrapiBlocks } from '@/lib/strapi-rich-text'

type WorkCardProps = {
  item: WorkItem & StrapiEntity
  layout?: 'grid' | 'masonry' | 'list'
  showFilters?: boolean
}

/**
 * Coin replié : clip-path sur la card pour couper le coin bas-droit,
 * + triangle blanc positionné en absolu sur le wrapper pour remplir la découpe.
 * Le wrapper ne doit PAS avoir overflow:hidden pour que le triangle soit visible.
 */
const FoldedCorner = () => (
  <div
    className="pointer-events-none absolute bottom-0 right-0"
    style={{
      width: 0,
      height: 0,
      borderStyle: 'solid',
      borderWidth: '28px 28px 0 0',
      borderColor: '#fff4e2 transparent transparent transparent',
    }}
  />
)

const WorkCard = ({
  item,
  layout = 'grid',
  showFilters = true,
}: WorkCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const imageUrl = cleanImageUrl(item.image?.url)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsModalOpen(true)
    }
  }

  const renderModal = () => {
    if (!isModalOpen) return null
    return (
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={() => setIsModalOpen(false)}
      >
        <div
          className="bg-[#FFE8BD] rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-3xl font-semibold">{item.title}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {showFilters && item.categories && item.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {item.categories.map((category) => (
                  <span
                    key={category.id}
                    className="px-3 py-1 text-sm rounded-full"
                    style={{
                      backgroundColor: category.color
                        ? `${category.color}20`
                        : '#C5E1A599',
                      color: category.color || '#6b7280',
                    }}
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}

            {item.description && (
              <div className="prose max-w-none mb-6">
                {renderStrapiBlocks(item.description as StrapiBlock[], {
                  textAlignmentClass: 'text-left',
                  textColorClass: 'text-gray-700',
                })}
              </div>
            )}

            {item.customFields &&
              typeof item.customFields === 'object' &&
              Object.keys(item.customFields).length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-2">
                    Informations complémentaires
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(item.customFields).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium text-gray-700">
                          {key}:{' '}
                        </span>
                        <span className="text-gray-600">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    )
  }

  const renderCardContent = (variant: 'list' | 'grid') => (
    <>
      {/* Image */}
      <div
        className={
          variant === 'list'
            ? 'relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-lg p-1'
            : 'relative w-full aspect-[3/1] overflow-hidden flex items-center justify-center p-2'
        }
      >
        {imageUrl ? (
          variant === 'list' ? (
            <Image
              src={imageUrl}
              alt={item.image?.alternativeText || item.title}
              width={64}
              height={64}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <Image
              src={imageUrl}
              alt={item.image?.alternativeText || item.title}
              width={240}
              height={80}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 640px) 150px, (max-width: 1024px) 240px, 350px"
            />
          )
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}

        {variant === 'grid' && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {item.featured && (
              <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                Featured
              </div>
            )}
          </>
        )}

        {variant === 'list' && item.featured && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
            ★
          </div>
        )}
      </div>

      {/* Content */}
      <div className={variant === 'list' ? 'flex-1' : 'p-2 sm:p-3'}>
        <h3
          className={
            variant === 'list'
              ? 'text-center text-base sm:text-lg font-bold group-hover:text-gray-600 transition-colors mb-1'
              : 'text-center text-base sm:text-lg font-bold mb-1.5 group-hover:text-gray-600 transition-colors leading-tight'
          }
        >
          {item.title}
        </h3>

        {item.shortDescription && (
          <p
            className={
              variant === 'list'
                ? 'text-sm sm:text-base text-gray-600 mb-2 sm:mb-3 whitespace-pre-line'
                : 'text-sm sm:text-base text-gray-600 mb-2 line-clamp-2 whitespace-pre-line'
            }
          >
            {item.shortDescription}
          </p>
        )}

        {showFilters && item.categories && item.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            {item.categories.map((category) => (
              <span
                key={category.id}
                className={
                  variant === 'list'
                    ? 'px-1.5 py-0.5 text-[10px] sm:px-2 sm:py-0.5 sm:text-xs rounded-full'
                    : 'px-1 py-0.5 text-[9px] sm:px-1.5 sm:py-0.5 sm:text-[10px] rounded-full'
                }
                style={{
                  backgroundColor: category.color
                    ? `${category.color}20`
                    : '#C5E1A599',
                  color: category.color || '#6b7280',
                }}
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        {item.customFields &&
          typeof item.customFields === 'object' &&
          Object.keys(item.customFields).length > 0 && (
            <div
              className={
                variant === 'list'
                  ? 'grid grid-cols-2 gap-2 mb-4'
                  : 'border-t pt-3 mb-4 space-y-1'
              }
            >
              {(variant === 'list'
                ? Object.entries(item.customFields)
                : Object.entries(item.customFields).slice(0, 3)
              ).map(([key, value]) => (
                <div
                  key={key}
                  className={variant === 'list' ? 'text-sm' : 'text-xs'}
                >
                  <span className="font-medium text-gray-700">{key}: </span>
                  <span className="text-gray-600">{String(value)}</span>
                </div>
              ))}
            </div>
          )}
      </div>
    </>
  )

  // List layout
  if (layout === 'list') {
    return (
      <>
        {/* Wrapper relatif sans overflow:hidden pour que le triangle soit visible */}
        <div
          className="group relative cursor-pointer"
          onClick={() => setIsModalOpen(true)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label={`Voir les détails de ${item.title}`}
        >
          {/* Card avec coin coupé */}
          <div
            className="flex gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg shadow-lg group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300 bg-[#FEE7BC] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            style={{
              clipPath:
                'polygon(0% 0%, 100% 0%, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0% 100%)',
            }}
          >
            {renderCardContent('list')}
          </div>
          <FoldedCorner />
        </div>
        {renderModal()}
      </>
    )
  }

  // Grid/Masonry layout
  return (
    <>
      {/* Wrapper relatif sans overflow:hidden pour que le triangle soit visible */}
      <div
        className="group relative cursor-pointer"
        onClick={() => setIsModalOpen(true)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Voir les détails de ${item.title}`}
      >
        {/* Card avec coin coupé */}
        <div
          className="rounded-lg shadow-lg group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300 bg-[#FEE7BC] focus:outline-none"
          style={{
            clipPath:
              'polygon(0% 0%, 100% 0%, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0% 100%)',
          }}
        >
          {renderCardContent('grid')}
        </div>
        <FoldedCorner />
      </div>
      {renderModal()}
    </>
  )
}

export default WorkCard