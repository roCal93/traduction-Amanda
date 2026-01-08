'use client'

import React, { useState, useEffect } from 'react'
import CarouselCard from './CarouselCard'
import { StrapiBlock } from '@/types/strapi'

type CarouselCardData = {
  id: number
  frontTitle: string
  frontContent?: StrapiBlock[]
  backContent?: StrapiBlock[]
  image?: { url: string; alternativeText?: string }
}

type CarouselBlockProps = {
  cards: CarouselCardData[]
  autoplay?: boolean
  autoplayDelay?: number
  showControls?: boolean
  showIndicators?: boolean
}

const CarouselBlock = ({ 
  cards, 
  autoplay = false, 
  autoplayDelay = 5000,
  showControls = true,
  showIndicators = true
}: CarouselBlockProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoplay || cards.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length)
    }, autoplayDelay)

    return () => clearInterval(interval)
  }, [autoplay, autoplayDelay, cards.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length)
  }

  const goToIndex = (index: number) => {
    setCurrentIndex(index)
  }

  if (!cards || cards.length === 0) {
    return null
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto my-8">
      {/* Carousel Content */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {cards.map((card) => (
            <div key={card.id} className="w-full flex-shrink-0 px-4">
              <CarouselCard
                frontTitle={card.frontTitle}
                frontContent={card.frontContent}
                backContent={card.backContent}
                image={card.image}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      {showControls && cards.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all z-10"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-0 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all z-10"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && cards.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-blue-600 w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CarouselBlock
