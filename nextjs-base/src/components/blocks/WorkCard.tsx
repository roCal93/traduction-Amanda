'use client'

import React, { useState } from 'react'
import type { JSX } from 'react'
import Image from 'next/image'
import { WorkItem, StrapiEntity } from '@/types/strapi'
import { cleanImageUrl } from '@/lib/strapi'

type WorkCardProps = {
  item: WorkItem & StrapiEntity
  layout?: 'grid' | 'masonry' | 'list'
  showFilters?: boolean
}

// Helper pour render le rich text de Strapi
type RichTextChild = {
  text: string
  bold?: boolean
  italic?: boolean
}

type RichTextBlock = {
  type: 'paragraph' | 'heading' | 'list'
  level?: number
  format?: 'ordered' | 'unordered'
  children?: RichTextChild[] | RichTextBlock[]
}

const renderRichText = (content: RichTextBlock[] | undefined) => {
  if (!content || !Array.isArray(content)) return null

  return content.map((block: RichTextBlock, index: number) => {
    if (block.type === 'paragraph') {
      return (
        <p key={index} className="mb-4 text-gray-700">
          {Array.isArray(block.children) &&
            block.children.every(
              (child): child is RichTextChild =>
                typeof (child as RichTextChild).text === 'string'
            ) &&
            (block.children as RichTextChild[]).map((child, childIndex) => {
              if (child.bold)
                return <strong key={childIndex}>{child.text}</strong>
              if (child.italic) return <em key={childIndex}>{child.text}</em>
              return <span key={childIndex}>{child.text}</span>
            })}
        </p>
      )
    }
    if (block.type === 'heading') {
      const level = block.level || 3
      const Tag = `h${level}` as keyof JSX.IntrinsicElements
      return (
        <Tag key={index} className="font-bold mb-3 mt-6">
          {Array.isArray(block.children) &&
            block.children
              .filter(
                (child): child is RichTextChild =>
                  typeof (child as RichTextChild).text === 'string'
              )
              .map((child) => child.text)
              .join('')}
        </Tag>
      )
    }
    if (block.type === 'list') {
      const ListTag = block.format === 'ordered' ? 'ol' : 'ul'
      return (
        <ListTag key={index} className="mb-4 ml-6 list-disc">
          {Array.isArray(block.children) &&
            block.children
              .filter(
                (item): item is RichTextBlock =>
                  typeof (item as RichTextBlock).type === 'string'
              )
              .map((item, itemIndex) => (
                <li key={itemIndex}>
                  {Array.isArray(item.children)
                    ? (item.children as RichTextChild[])
                        .map((child) => child.text)
                        .join('')
                    : ''}
                </li>
              ))}
        </ListTag>
      )
    }
    return null
  })
}

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
                {renderRichText(
                  (item.description as RichTextBlock[]).filter(
                    (block): block is RichTextBlock =>
                      block &&
                      (block.type === 'paragraph' ||
                        block.type === 'heading' ||
                        block.type === 'list')
                  )
                )}
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
              width={300}
              height={100}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 640px) 180px, (max-width: 1024px) 280px, 420px"
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
              ? 'text-base sm:text-lg font-bold group-hover:text-gray-600 transition-colors mb-1'
              : 'text-center md:text-left text-base sm:text-lg font-bold mb-1.5 group-hover:text-gray-600 transition-colors leading-tight'
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
          <div
            className={
              variant === 'list'
                ? 'flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4'
                : 'flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4'
            }
          >
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
        <div
          onClick={() => setIsModalOpen(true)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label={`Voir les détails de ${item.title}`}
          className="group flex gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 bg-[#FFE5B3]/60 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {renderCardContent('list')}
        </div>
        {renderModal()}
      </>
    )
  }

  // Grid/Masonry layout
  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Voir les détails de ${item.title}`}
        className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 bg-[#FFE5B3]/60 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {renderCardContent('grid')}
      </div>
      {renderModal()}
    </>
  )
}

export default WorkCard
