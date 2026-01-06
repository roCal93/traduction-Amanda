import React from 'react'
import { 
  TextBlock as TextBlockData, 
  ButtonBlock as ButtonBlockData,
  ImageBlock as ImageBlockData,
  CardsBlock as CardsBlockData,
  TextImageBlock as TextImageBlockData,
} from '@/types/strapi'
import { TextBlock, ButtonBlock, ImageBlock, CardsBlock, TextImageBlock } from '@/components/blocks'

type DynamicBlock = 
  | ({ __component: 'blocks.text-block' } & TextBlockData)
  | ({ __component: 'blocks.button-block' } & ButtonBlockData)
  | ({ __component: 'blocks.image-block' } & ImageBlockData)
  | ({ __component: 'blocks.cards-block' } & CardsBlockData)
  | ({ __component: 'blocks.text-image-block' } & TextImageBlockData)

type SectionGenericProps = {
  title?: string
  blocks: DynamicBlock[]
}

export const SectionGeneric = ({ title, blocks }: SectionGenericProps) => {
  const renderBlock = (block: DynamicBlock, index: number) => {
    switch (block.__component) {
      case 'blocks.text-block':
        return <TextBlock key={index} content={block.content} />
      
      case 'blocks.button-block':
        return (
          <ButtonBlock 
            key={index} 
            buttons={block.buttons} 
            alignment={block.alignment as 'left' | 'center' | 'right' | 'space-between'} 
          />
        )
      
      case 'blocks.image-block':
        return (
          <ImageBlock 
            key={index} 
            image={block.image} 
            caption={block.caption}
            alignment={block.alignment as 'left' | 'center' | 'right' | 'full'}
            size={block.size as 'small' | 'medium' | 'large' | 'full'}
          />
        )
      
      case 'blocks.cards-block':
        return (
          <CardsBlock 
            key={index} 
            cards={block.cards} 
            columns={block.columns as '1' | '2' | '3' | '4'} 
          />
        )
      
      case 'blocks.text-image-block':
        return (
          <TextImageBlock
            key={index}
            content={block.content}
            image={block.image}
            imagePosition={block.imagePosition as 'left' | 'right'}
            imageSize={block.imageSize as 'small' | 'medium' | 'large'}
            verticalAlignment={block.verticalAlignment as 'top' | 'center' | 'bottom'}
          />
        )
      
      default:
        console.warn('Unknown block type:', (block as DynamicBlock).__component)
        return null
    }
  }

  return (
    <section className="my-12 px-4">
      <div className="max-w-6xl mx-auto">
        {title && <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>}
        <div className="space-y-4">
          {blocks.map((block, index) => renderBlock(block, index))}
        </div>
      </div>
    </section>
  )
}
