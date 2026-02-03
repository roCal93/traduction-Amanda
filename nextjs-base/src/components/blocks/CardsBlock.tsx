import React from 'react'
import { Card as CardData, StrapiEntity } from '@/types/strapi'
import { Card } from '@/components/sections/Card'

type CardsBlockProps = {
  cards: (CardData & StrapiEntity)[]
  // only allow single column or multi (3 or more) columns
  columns: '1' | '3' | '4'
  alignment?: 'left' | 'center' | 'right'
}

const CardsBlock = ({
  cards,
  columns,
  alignment = 'center',
}: CardsBlockProps) => {
  const columnClasses = {
    '1': 'grid-cols-1 max-w-3xl mx-auto',
    // single column on small screens, 3 columns on large screens
    '3': 'grid-cols-1 lg:grid-cols-3',
    // single column on small screens, 4 columns on large screens
    '4': 'grid-cols-1 lg:grid-cols-4',
  }

  const alignmentClasses = {
    left: 'justify-items-start',
    center: 'justify-items-center',
    right: 'justify-items-end',
  }

  // Add width classes for individual cards based on column count
  const cardWidthClasses = {
    '1': 'w-full',
    '3': 'w-full',
    '4': 'w-full',
  }

  return (
    <div
      className={`grid ${columnClasses[columns]} ${alignmentClasses[alignment]} gap-6 my-14`}
    >
      {cards.map((card) => (
        <div key={card.id} className={cardWidthClasses[columns]}>
          <Card
            title={card.title}
            subtitle={card.subtitle}
            content={card.content || []}
            image={card.image?.url}
          />
        </div>
      ))}
    </div>
  )
}

export default CardsBlock
