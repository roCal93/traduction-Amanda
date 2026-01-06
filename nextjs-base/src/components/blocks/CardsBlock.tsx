import React from 'react'
import { Card as CardData, StrapiEntity } from '@/types/strapi'
import { Card } from '@/components/sections/Card'

type CardsBlockProps = {
  cards: (CardData & StrapiEntity)[]
  columns: '1' | '2' | '3' | '4'
  alignment?: 'left' | 'center' | 'right'
}

export const CardsBlock = ({ cards, columns, alignment = 'center' }: CardsBlockProps) => {
  const columnClasses = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  const alignmentClasses = {
    left: 'justify-items-start',
    center: 'justify-items-center',
    right: 'justify-items-end',
  }

  return (
    <div className={`grid ${columnClasses[columns]} ${alignmentClasses[alignment]} gap-6 my-8`}>
      {cards.map((card) => (
        <Card
          key={card.id}
          title={card.title}
          description={card.description || []}
          image={card.image?.url}
        />
      ))}
    </div>
  )
}
