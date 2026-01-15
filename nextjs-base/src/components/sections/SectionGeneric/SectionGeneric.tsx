/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import * as Blocks from '@/components/blocks'

type DynamicBlock = { __component: string; [k: string]: unknown }

type BlocksMap = Record<string, React.ComponentType<any>>
const TypedBlocks = Blocks as unknown as BlocksMap

type SectionGenericProps = {
  title?: string
  blocks: unknown[]
  spacingTop?: 'none' | 'small' | 'medium' | 'large'
  spacingBottom?: 'none' | 'small' | 'medium' | 'large'
}

export const SectionGeneric = ({ title, blocks, spacingTop = 'medium', spacingBottom = 'medium' }: SectionGenericProps) => {
  const renderBlock = (block: unknown, index: number) => {
    // Use a local any-typed alias to ease dynamic access to block props
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const b: any = block
    switch (b.__component) {
      case 'blocks.text-block': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const b: any = block
        const Comp = TypedBlocks.TextBlock as React.ComponentType<any> | undefined
        return Comp ? (
          <Comp
            key={index}
            content={b.content}
            textAlignment={b.textAlignment as 'left' | 'center' | 'right' | 'justify'}
            blockAlignment={b.blockAlignment as 'left' | 'center' | 'right' | 'full'}
            maxWidth={b.maxWidth as 'small' | 'medium' | 'large' | 'full'}
          />
        ) : null
      }
      
      case 'blocks.button-block': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const b: any = block
        const Comp = TypedBlocks.ButtonBlock as React.ComponentType<any> | undefined
        return Comp ? (
          <Comp 
            key={index} 
            buttons={b.buttons} 
            alignment={b.alignment as 'left' | 'center' | 'right' | 'space-between'} 
          />
        ) : null
      }
      
      case 'blocks.image-block': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const b: any = block
        const Comp = TypedBlocks.ImageBlock as React.ComponentType<any> | undefined
        return Comp ? (
          <Comp 
            key={index} 
            image={b.image} 
            caption={b.caption}
            alignment={b.alignment as 'left' | 'center' | 'right' | 'full'}
            size={b.size as 'small' | 'medium' | 'large' | 'full'}
          />
        ) : null
      }
      
      case 'blocks.cards-block': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const b: any = block
        const Comp = (Blocks as any).CardsBlock as React.ComponentType<any> | undefined
        return Comp ? (
          <Comp
            key={index}
            cards={b.cards}
            columns={b.columns as '1' | '2' | '3' | '4'}
            alignment={b.alignment as 'left' | 'center' | 'right'}
          />
        ) : null
      }
      
      case 'blocks.text-image-block': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const b: any = block
        const Comp = (Blocks as any).TextImageBlock as React.ComponentType<any> | undefined
        return Comp ? (
          <Comp
            key={index}
            content={b.content}
            image={b.image}
            imagePosition={b.imagePosition as 'left' | 'right'}
            imageSize={b.imageSize as 'small' | 'medium' | 'large'}
            verticalAlignment={b.verticalAlignment as 'top' | 'center' | 'bottom'}
            textAlignment={b.textAlignment as 'left' | 'center' | 'right' | 'justify'}
            roundedImage={b.roundedImage}
          />
        ) : null
      }
      
      case 'blocks.hero-block-simple-text': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const b: any = block
        const Comp = (Blocks as any).HeroBlockSimpleText as React.ComponentType<any> | undefined
        return Comp ? (
          <Comp
            key={index}
            title={b.title}
            content={b.content}
            height={b.height as 'medium' | 'large' | 'full'}
            textAlignment={b.textAlignment as 'left' | 'center' | 'right'}
          />
        ) : null
      }
      
      case 'blocks.carousel-block': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const b: any = block
        const Comp = (Blocks as any).CarouselBlock as React.ComponentType<any> | undefined
        return Comp ? (
          <Comp
            key={index}
            cards={b.cards.map((card: any, idx: number) => ({
              id: idx,
              frontTitle: card.frontTitle,
              frontContent: card.frontContent,
              backContent: card.backContent,
              image: card.image ? { url: card.image.url, alternativeText: card.image.alternativeText || undefined } : undefined
            }))}
            autoplay={b.autoplay}
            autoplayDelay={b.autoplayDelay}
            showControls={b.showControls}
            showIndicators={b.showIndicators}
          />
        ) : null
      }
      
      case 'blocks.contact-form-block': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const b: any = block
        const Comp = (Blocks as any).ContactFormBlock as React.ComponentType<any> | undefined
        return Comp ? (
          <Comp
            key={index}
            title={b.title}
            description={b.description}
            submitButtonText={b.submitButtonText}
            blockAlignment={b.blockAlignment as 'left' | 'center' | 'right' | 'full'}
            maxWidth={b.maxWidth as 'small' | 'medium' | 'large' | 'full'}
          />
        ) : null
      }
      
      case 'blocks.work-block': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const b: any = block
        const Comp = (Blocks as any).WorkBlock as React.ComponentType<any> | undefined
        return Comp ? (
          <Comp
            key={index}
            filterByCategories={b.filterByCategories}
            showAllCategories={b.showAllCategories}
            showFeaturedOnly={b.showFeaturedOnly}
            filterByItemType={b.filterByItemType as 'all' | 'project' | 'case-study' | 'service' | 'product' | 'article' | 'achievement' | 'custom' | undefined}
            limit={b.limit}
            columns={b.columns as '2' | '3' | '4'}
            showFilters={b.showFilters}
            layout={b.layout as 'grid' | 'masonry' | 'list'}
          />
        ) : null
      }
      
      case 'blocks.timeline-block': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const b: any = block
        const Comp = (Blocks as any).TimelineBlock as React.ComponentType<any> | undefined
        return Comp ? (
          <Comp
            key={index}
            items={(b.items || []).map((it: any) => ({
              title: it.title,
              date: it.date,
              description: it.description,
              images: it.images
                ? (it.images.map((img: any) => (img.image ? { url: img.image.url, width: img.image.width, height: img.image.height } : null)).filter(Boolean) as { url: string; width?: number; height?: number }[])
                : undefined,
              links: it.images ? (it.images.map((img: any) => (img.link ? { url: img.link.url } : null)).filter(Boolean) as { url: string }[]) : undefined
            }))}
          />
        ) : null
      }
    
      
      default: {
        // Fallback dynamique : si un composant côté Next.js correspondant existe dans
        // `@/components/blocks` (nom PascalCase dérivé de `blocks.foo-bar`), on le rend.
        try {
          const componentKey = b.__component.replace(/^blocks\./, '') // ex: 'timeline-block'
          const componentName = componentKey.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join('') // 'TimelineBlock'
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const Component = TypedBlocks[componentName] as React.ComponentType<any> | undefined
          if (Component) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return <Component key={index} {...b} />
          }
        } catch {
          // ignore and fallback to warn
        }

        console.warn('Unknown block type:', b.__component)
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
