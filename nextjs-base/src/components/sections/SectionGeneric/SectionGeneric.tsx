import React from 'react'
import { 
  TextBlock as TextBlockData, 
  ButtonBlock as ButtonBlockData,
  ImageBlock as ImageBlockData,
  CardsBlock as CardsBlockData,
  TextImageBlock as TextImageBlockData,
  HeroBlockSimpleText as HeroBlockSimpleTextData,
} from '@/types/strapi'
import { TextBlock, ButtonBlock, ImageBlock, CardsBlock, TextImageBlock, HeroBlockSimpleText } from '@/components/blocks'

type DynamicBlock = 
  | ({ __component: 'blocks.text-block' } & TextBlockData)
  | ({ __component: 'blocks.button-block' } & ButtonBlockData)
  | ({ __component: 'blocks.image-block' } & ImageBlockData)
  | ({ __component: 'blocks.cards-block' } & CardsBlockData)
  | ({ __component: 'blocks.text-image-block' } & TextImageBlockData)
  | ({ __component: 'blocks.hero-block-simple-text' } & HeroBlockSimpleTextData)

type SectionGenericProps = {
  title?: string
  blocks: DynamicBlock[]
  spacingTop?: 'none' | 'small' | 'medium' | 'large'
  spacingBottom?: 'none' | 'small' | 'medium' | 'large'
}

export const SectionGeneric = ({ title, blocks, spacingTop = 'medium', spacingBottom = 'medium' }: SectionGenericProps) => {
  const renderBlock = (block: DynamicBlock, index: number) => {
    switch (block.__component) {
      case 'blocks.text-block':
        return (
          <TextBlock 
            key={index} 
            content={block.content}
            textAlignment={block.textAlignment as 'left' | 'center' | 'right' | 'justify'}
            blockAlignment={block.blockAlignment as 'left' | 'center' | 'right' | 'full'}
            maxWidth={block.maxWidth as 'small' | 'medium' | 'large' | 'full'}
          />
        )
      
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
            alignment={block.alignment as 'left' | 'center' | 'right'}
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
            textAlignment={block.textAlignment as 'left' | 'center' | 'right' | 'justify'}
          />
        )
      
      case 'blocks.hero-block-simple-text':
        return (
          <HeroBlockSimpleText
            key={index}
            title={block.title}
            content={block.content}
            height={block.height as 'medium' | 'large' | 'full'}
            textAlignment={block.textAlignment as 'left' | 'center' | 'right'}
          />
        )
      
      default:
        console.warn('Unknown block type:', (block as DynamicBlock).__component)
        return null
    }
  }

  const getTopSpacingClass = (spacing: 'none' | 'small' | 'medium' | 'large') => {
    switch (spacing) {
      case 'none': return ''
      case 'small': return 'mt-6'
      case 'medium': return 'mt-12'
      case 'large': return 'mt-24'
      default: return 'mt-12'
    }
  }

  const getBottomSpacingClass = (spacing: 'none' | 'small' | 'medium' | 'large') => {
    switch (spacing) {
      case 'none': return ''
      case 'small': return 'mb-6'
      case 'medium': return 'mb-12'
      case 'large': return 'mb-24'
      default: return 'mb-12'
    }
  }

  return (
    <section className={`${getTopSpacingClass(spacingTop)} ${getBottomSpacingClass(spacingBottom)} px-4`}>
      <div className="max-w-6xl mx-auto">
        {title && <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>}
        <div className="space-y-4">
          {blocks?.map((block, index) => renderBlock(block, index))}
        </div>
      </div>
    </section>
  )
}
