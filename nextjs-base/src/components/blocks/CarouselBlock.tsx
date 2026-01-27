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
  showIndicators = true,
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

      {/* Controls & Indicators - placed outside the cards */}
      {(showControls || showIndicators) && cards.length > 1 && (
        <div className="flex items-center justify-center mt-6 md:mt-8 lg:mt-10 gap-3">
          {showControls && (
            <button
              onClick={goToPrevious}
              className="group text-[#FADCA3] hover:text-[#F6C87E] mr-10 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Previous slide"
            >
              <svg
                className="w-8 h-6 drop-shadow-sm group-hover:drop-shadow-lg transition-shadow"
                width="32"
                height="24"
                viewBox="0 0 56 45"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 22.0837L55.6685 9.15527e-05L55.6685 44.1674L0 22.0837Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          )}

          {showIndicators && (
            <div className="flex items-center gap-2 mx-2">
              {cards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FADCA3] ${
                    index === currentIndex
                      ? 'bg-[#F88379] w-8'
                      : 'bg-[#FADCA3] hover:bg-[#FADCA3]/90'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {showControls && (
            <button
              onClick={goToNext}
              className="group text-[#FADCA3] hover:text-[#F6C87E] ml-10 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Next slide"
            >
              <svg
                className="w-8 h-6 drop-shadow-sm group-hover:drop-shadow-lg transform -scale-x-100 transition-shadow"
                width="32"
                height="24"
                viewBox="0 0 56 45"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 22.0837L55.6685 9.15527e-05L55.6685 44.1674L0 22.0837Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default CarouselBlock
