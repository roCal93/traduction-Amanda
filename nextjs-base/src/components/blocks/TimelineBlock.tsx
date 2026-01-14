import React from "react"
import Image from "next/image"
import { cleanImageUrl } from "@/lib/strapi"

export interface TimelineImage {
  url: string
  width?: number
  height?: number
}

export type TimelineImageOrString = string | TimelineImage

export interface TimelineItem {
  title: string
  date?: string
  description?: string
  images?: TimelineImageOrString[]
  links?: { url: string }[]
}

export interface TimelineBlockProps {
  items: TimelineItem[]
}

const TimelineBlock: React.FC<TimelineBlockProps> = ({ items }) => {
  const renderImages = (images: TimelineImageOrString[] | undefined, links: { url: string }[] | undefined, className: string = "", size: number = 80) => {
    if (!images || images.length === 0) return null
    const imageSize = images.length > 1 ? Math.min(size, 100) : size // Reduce size for multiple images
    return (
      <div className={`flex gap-2 ${className}`}>
        {images.map((rawImage, imgIdx) => {
          const imageUrl = typeof rawImage === "string" ? rawImage : rawImage.url
          const imageSrc = cleanImageUrl(imageUrl)
          const imageWidth = typeof rawImage === "string" ? 200 : (rawImage.width || 200)
          const imageHeight = typeof rawImage === "string" ? imageSize : (rawImage.height || imageSize)
          const link = links && links[imgIdx]
          return imageSrc ? (
            link ? (
              <a
                key={imgIdx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 rounded-md"
              >
                <div
                  className="flex-shrink-0 transform transition-transform duration-150 group-hover:scale-105 cursor-pointer"
                  style={{ height: `${imageSize}px`, maxWidth: `${imageSize * 2}px` }}
                >
                  <Image
                    src={imageSrc}
                    alt=""
                    width={imageWidth}
                    height={imageHeight}
                    className="object-contain h-full w-full rounded-md"
                    unoptimized={true}
                  />
                </div>
              </a>
            ) : (
              <div key={imgIdx} className="flex-shrink-0" style={{ height: `${imageSize}px`, maxWidth: `${imageSize * 2}px` }}>
                <Image
                  src={imageSrc}
                  alt=""
                  width={imageWidth}
                  height={imageHeight}
                  className="object-contain h-full w-full rounded-md"
                  unoptimized={true}
                />
              </div>
            )
          ) : null
        })}
      </div>
    )
  }

  return (
    <div className="relative w-full py-16">
      {/* Vertical center line */}
      <div className="absolute left-4 md:left-1/2 top-0 h-full w-[2px] bg-gray-300 -translate-x-1/2" />

      <div className="space-y-16">
        {items.map((item, idx) => {
          const isLeft = idx % 2 === 0

          return (
            <div
              key={`${item.title}-${idx}`}
              className={`relative flex flex-col md:flex-row items-start md:items-center`}
            >
              {/* Dot */}
              <div className="absolute left-4 md:left-1/2 top-6 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow -translate-x-1/2" />

              {isLeft ? (
                <>
                  {/* Content card on the left (desktop) */}
                  <div className="ml-12 md:ml-0 md:w-[45%] bg-white rounded-lg shadow-lg p-6 md:mr-auto md:text-right">
                    {item.date && (
                      <span className="text-xs text-gray-500 block mb-2">{item.date}</span>
                    )}

                    <h3 className="text-lg font-bold mb-3">{item.title}</h3>

                    {item.description && (
                      <p className="text-sm text-gray-700 mb-4">{item.description}</p>
                    )}

                    {/* Mobile: images inside card */}
                    {renderImages(item.images, item.links, "md:hidden justify-center", 60)}
                  </div>

                  {/* Desktop: images on the opposite side (right) */}
                  {renderImages(item.images, item.links, "hidden md:flex md:items-center md:w-[40%] md:ml-6 justify-center", 140)}
                </>
              ) : (
                <>
                  {/* Desktop: images on the opposite side (left) */}
                  {renderImages(item.images, item.links, "hidden md:flex md:items-center md:w-[40%] md:mr-6 justify-center", 140)}

                  {/* Content card on the right (desktop) */}
                  <div className="ml-12 md:ml-0 md:w-[45%] bg-white rounded-lg shadow-lg p-6 md:ml-auto md:text-left">
                    {item.date && (
                      <span className="text-xs text-gray-500 block mb-2">{item.date}</span>
                    )}

                    <h3 className="text-lg font-bold mb-3">{item.title}</h3>

                    {item.description && (
                      <p className="text-sm text-gray-700 mb-4">{item.description}</p>
                    )}

                    {/* Mobile: images inside card */}
                    {renderImages(item.images, item.links, "md:hidden justify-center", 60)}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TimelineBlock
