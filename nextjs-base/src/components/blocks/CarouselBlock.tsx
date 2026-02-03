'use client'

import React, { useEffect, useRef, useState } from 'react'
import CarouselWorkCard from './CarouselWorkCard'
import { WorkItem, StrapiEntity } from '@/types/strapi'

type CarouselBlockProps = {
  workItems?: (WorkItem & StrapiEntity)[]
  scrollSpeed?: number
}

const CarouselBlock = ({
  workItems = [],
  scrollSpeed = 5,
}: CarouselBlockProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  useEffect(() => {
    if (!workItems || workItems.length === 0) return

    // Initialiser le scroll au milieu (2e set) pour avoir de la marge
    if (scrollRef.current) {
      const singleSetWidth = scrollRef.current.scrollWidth / 3
      scrollRef.current.scrollLeft = singleSetWidth
    }
  }, [workItems])

  useEffect(() => {
    if (!workItems || workItems.length === 0 || isPaused || isDragging) return

    let animationFrameId: number
    let lastTimestamp = 0

    const scroll = (timestamp: number) => {
      if (!scrollRef.current) {
        animationFrameId = requestAnimationFrame(scroll)
        return
      }

      // Calculer le temps écoulé depuis la dernière frame
      const elapsed = timestamp - lastTimestamp

      // Ne mettre à jour que toutes les X millisecondes (scrollSpeed)
      if (elapsed >= scrollSpeed) {
        const { scrollLeft, scrollWidth } = scrollRef.current

        // Calculer la largeur d'un set complet (1/3 du total car on a 3 copies)
        const singleSetWidth = scrollWidth / 3

        // Repositionner quand on atteint le 2e set (évite d'aller trop loin)
        if (scrollLeft >= singleSetWidth * 2) {
          scrollRef.current.scrollLeft = singleSetWidth
        } else {
          // Défiler de manière fluide
          scrollRef.current.scrollLeft += 1
        }

        lastTimestamp = timestamp
      }

      animationFrameId = requestAnimationFrame(scroll)
    }

    animationFrameId = requestAnimationFrame(scroll)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [workItems, scrollSpeed, isPaused, isDragging])

  if (!workItems || workItems.length === 0) {
    return null
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 0.5
    scrollRef.current.scrollLeft = scrollLeft - walk

    // Gérer la boucle infinie pendant le drag
    const { scrollLeft: currentScroll, scrollWidth } = scrollRef.current
    const singleSetWidth = scrollWidth / 3

    if (currentScroll >= singleSetWidth * 2) {
      scrollRef.current.scrollLeft = singleSetWidth
      setScrollLeft(singleSetWidth)
    } else if (currentScroll <= 0) {
      scrollRef.current.scrollLeft = singleSetWidth
      setScrollLeft(singleSetWidth)
    }
  }

  const handleMouseUpOrLeave = () => {
    setIsDragging(false)
  }

  // Gestionnaires tactiles pour mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 0.5
    scrollRef.current.scrollLeft = scrollLeft - walk

    // Gérer la boucle infinie pendant le drag
    const { scrollLeft: currentScroll, scrollWidth } = scrollRef.current
    const singleSetWidth = scrollWidth / 3

    if (currentScroll >= singleSetWidth * 2) {
      scrollRef.current.scrollLeft = singleSetWidth
      setScrollLeft(singleSetWidth)
    } else if (currentScroll <= 0) {
      scrollRef.current.scrollLeft = singleSetWidth
      setScrollLeft(singleSetWidth)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Tripler les items pour une boucle infinie parfaitement fluide
  const duplicatedItems = [...workItems, ...workItems, ...workItems]

  return (
    <div className="relative w-full overflow-hidden my-8">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-hidden select-none"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false)
          handleMouseUpOrLeave()
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {duplicatedItems.map((item, index) => (
          <div key={`${item.id}-${index}`} className="w-[200px] flex-shrink-0">
            <CarouselWorkCard item={item} isPriority={index < 6} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CarouselBlock
