'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cleanImageUrl } from '@/lib/strapi'
import { StrapiBlock } from '@/types/strapi'

type CarouselCardProps = {
  frontTitle: string
  frontContent?: StrapiBlock[]
  backContent?: StrapiBlock[]
  image?: { url: string; alternativeText?: string }
}

const CarouselCard = ({
  frontTitle,
  frontContent,
  backContent,
  image,
}: CarouselCardProps) => {
  const [isRevealed, setIsRevealed] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const cleanImage = cleanImageUrl(image?.url)

  const renderBlocks = (blocks?: StrapiBlock[]) => {
    if (!blocks) return null

    return blocks.map((block, index) => {
      switch (block.type) {
        case 'paragraph':
          return (
            <p key={index} className="text-gray-600 mb-2">
              {block.children?.map((child, childIndex) => {
                if (child.type === 'text') {
                  let className = ''
                  if (child.bold && child.italic) className = 'font-bold italic'
                  else if (child.bold) className = 'font-bold'
                  else if (child.italic) className = 'italic'

                  return (
                    <span key={childIndex} className={className}>
                      {child.text}
                    </span>
                  )
                }
                return null
              })}
            </p>
          )
        case 'heading':
          const level = block.level || 3
          const HeadingTag = `h${level}` as keyof React.JSX.IntrinsicElements
          return (
            <HeadingTag key={index} className="font-semibold mb-2">
              {block.children?.map((child, childIndex) => {
                if (child.type === 'text') {
                  return <span key={childIndex}>{child.text}</span>
                }
                return null
              })}
            </HeadingTag>
          )
        default:
          return null
      }
    })
  }

  return (
    <div
      className="relative w-full h-96 cursor-pointer overflow-hidden rounded-3xl"
      style={{ perspective: '1000px' }}
      onClick={() => setIsRevealed(!isRevealed)}
    >
      <motion.div
        className="w-full h-full relative"
        initial={false}
        animate={{
          rotateX: isRevealed ? 180 : 0,
          boxShadow: isAnimating
            ? 'none'
            : isRevealed
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.1)'
              : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
        onAnimationStart={() => setIsAnimating(true)}
        onAnimationComplete={() => setIsAnimating(false)}
      >
        {/* Front */}
        <div
          className="absolute inset-0 bg-[#FADCA3]/60 p-6 h-full flex flex-col items-center justify-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-center">
            {frontTitle}
          </h3>
          <div className="mb-4 text-center">{renderBlocks(frontContent)}</div>
          {cleanImage && (
            <div className="relative w-full max-w-md h-64 flex-shrink-0">
              <Image
                src={cleanImage}
                alt={image?.alternativeText || frontTitle}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 448px"
              />
            </div>
          )}
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 bg-[#FADCA3]/40 p-6 h-full overflow-auto"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateX(180deg)',
          }}
        >
          <h3 className="text-2xl font-semibold mb-4">
            Plus d&apos;informations
          </h3>
          {renderBlocks(backContent)}
        </div>
      </motion.div>
    </div>
  )
}

export default CarouselCard
