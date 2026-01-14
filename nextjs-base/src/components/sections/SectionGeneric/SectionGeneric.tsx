import React from 'react'
import { 
  TextBlock as TextBlockData, 
  ButtonBlock as ButtonBlockData,
  ImageBlock as ImageBlockData,
  CardsBlock as CardsBlockData,
  TextImageBlock as TextImageBlockData,
  HeroBlockSimpleText as HeroBlockSimpleTextData,
  CarouselBlock as CarouselBlockData,
  ContactFormBlock as ContactFormBlockData,
  WorkBlock as WorkBlockData,
  TimelineBlock as TimelineBlockData,
} from '@/types/strapi'
import { TextBlock, ButtonBlock, ImageBlock, CardsBlock, TextImageBlock, HeroBlockSimpleText, CarouselBlock, ContactFormBlock, WorkBlock, TimelineBlock, } from '@/components/blocks'
import * as Blocks from '@/components/blocks'

type DynamicBlock = 
  | ({ __component: 'blocks.text-block' } & TextBlockData)
  | ({ __component: 'blocks.button-block' } & ButtonBlockData)
  | ({ __component: 'blocks.image-block' } & ImageBlockData)
  | ({ __component: 'blocks.cards-block' } & CardsBlockData)
  | ({ __component: 'blocks.text-image-block' } & TextImageBlockData)
  | ({ __component: 'blocks.hero-block-simple-text' } & HeroBlockSimpleTextData)
  | ({ __component: 'blocks.carousel-block' } & CarouselBlockData)
  | ({ __component: 'blocks.contact-form-block' } & ContactFormBlockData)
  | ({ __component: 'blocks.work-block' } & WorkBlockData)
  | ({ __component: 'blocks.timeline-block' } & TimelineBlockData)

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
            roundedImage={block.roundedImage}
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
      
      case 'blocks.carousel-block':
        return (
          <CarouselBlock
            key={index}
            cards={block.cards.map((card, idx) => ({
              id: idx,
              frontTitle: card.frontTitle,
              frontContent: card.frontContent,
              backContent: card.backContent,
              image: card.image ? { url: card.image.url, alternativeText: card.image.alternativeText || undefined } : undefined
            }))}
            autoplay={block.autoplay}
            autoplayDelay={block.autoplayDelay}
            showControls={block.showControls}
            showIndicators={block.showIndicators}
          />
        )
      
      case 'blocks.contact-form-block':
        return (
          <ContactFormBlock
            key={index}
            title={block.title}
            description={block.description}
            submitButtonText={block.submitButtonText}
            blockAlignment={block.blockAlignment as 'left' | 'center' | 'right' | 'full'}
            maxWidth={block.maxWidth as 'small' | 'medium' | 'large' | 'full'}
          />
        )
      
      case 'blocks.work-block':
        return (
          <WorkBlock
            key={index}
            filterByCategories={block.filterByCategories}
            showAllCategories={block.showAllCategories}
            showFeaturedOnly={block.showFeaturedOnly}
            filterByItemType={block.filterByItemType as 'all' | 'project' | 'case-study' | 'service' | 'product' | 'article' | 'achievement' | 'custom' | undefined}
            limit={block.limit}
            columns={block.columns as '2' | '3' | '4'}
            showFilters={block.showFilters}
            layout={block.layout as 'grid' | 'masonry' | 'list'}
          />
        )
      
      case 'blocks.timeline-block':
        return (
          <TimelineBlock
            key={index}
            items={(block.items || []).map((it) => ({
              title: it.title,
              date: it.date,
              description: it.description,
              images: it.images ? (Array.isArray(it.images) ? it.images : [it.images]) : undefined
            }))}
          />
        )
      
      default: {
        // Fallback dynamique : si un composant côté Next.js correspondant existe dans
        // `@/components/blocks` (nom PascalCase dérivé de `blocks.foo-bar`), on le rend.
        try {
          const componentKey = (block as DynamicBlock).__component.replace(/^blocks\./, '') // ex: 'timeline-block'
          const componentName = componentKey.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('') // 'TimelineBlock'
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const Component = (Blocks as any)[componentName] as React.ComponentType<any> | undefined
          if (Component) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return <Component key={index} {...(block as any)} />
          }
        } catch {
          // ignore and fallback to warn
        }

        console.warn('Unknown block type:', (block as DynamicBlock).__component)
        return null
      } 
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
