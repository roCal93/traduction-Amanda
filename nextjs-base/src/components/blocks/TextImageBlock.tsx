import React from 'react'
import Image from 'next/image'
import { StrapiMedia, StrapiBlock } from '@/types/strapi'
import { cleanImageUrl } from '@/lib/strapi'
import { renderStrapiBlocks } from '@/lib/strapi-rich-text'

type TextImageBlockProps = {
  content: StrapiBlock[]
  image: StrapiMedia
  imagePosition: 'left' | 'right'
  imageSize: 'small' | 'medium' | 'large'
  verticalAlignment: 'top' | 'center' | 'bottom'
  textAlignment?: 'left' | 'center' | 'right' | 'justify'
  roundedImage?: boolean
}

const TextImageBlock = ({
  content,
  image,
  imagePosition,
  imageSize,
  verticalAlignment,
  textAlignment = 'left',
  roundedImage = false,
}: TextImageBlockProps) => {
  const imageSrc = cleanImageUrl(image.url)
  const finalImageSrc =
    imageSrc && imageSrc.startsWith('/')
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${imageSrc}`
      : imageSrc

  const imageSizeClasses = {
    small: 'md:w-1/3',
    medium: 'md:w-1/2',
    large: 'md:w-2/3',
  }

  const roundedImageSizeClasses = {
    small:
      'w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[468px] lg:h-[468px]',
    medium:
      'w-80 h-80 sm:w-96 sm:h-96 md:w-[468px] md:h-[468px] lg:w-[600px] lg:h-[600px]',
    large:
      'w-96 h-96 sm:w-[468px] sm:h-[468px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px]',
  }

  const alignmentClasses = {
    top: 'items-start',
    center: 'items-center',
    bottom: 'items-end',
  }

  const textAlignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  }

  const imageElement = (
    <div
      className={`${roundedImage ? roundedImageSizeClasses[imageSize] : `w-full ${imageSizeClasses[imageSize]}`} flex-shrink-0 mx-auto`}
    >
      <Image
        src={finalImageSrc || '/placeholder.jpg'}
        alt={image.alternativeText || 'Image'}
        width={roundedImage ? 800 : image.width || 800}
        height={roundedImage ? 800 : image.height || 600}
        className={`${roundedImage ? 'w-full h-full object-cover rounded-full' : 'w-full h-auto object-cover rounded-lg'}`}
        sizes="(max-width: 768px) 100vw, 50vw"
        unoptimized={true}
      />
    </div>
  )

  const textElement = (
    <div className="flex-1">
      {renderStrapiBlocks(content, {
        textAlignmentClass: textAlignmentClasses[textAlignment],
        textColorClass: 'text-gray-700',
      })}
    </div>
  )

  return (
    <div
      className={`flex flex-col md:flex-row gap-8 my-8 ${alignmentClasses[verticalAlignment]}`}
    >
      {imagePosition === 'left' ? (
        <>
          {imageElement}
          {textElement}
        </>
      ) : (
        <>
          {textElement}
          {imageElement}
        </>
      )}
    </div>
  )
}

export default TextImageBlock
