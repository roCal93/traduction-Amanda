'use client'

import React, { useState, useMemo } from 'react'
import { PortfolioItem, PortfolioTheme, StrapiEntity } from '@/types/strapi'
import { PortfolioCard } from './PortfolioCard'

type PortfolioBlockProps = {
  filterByThemes?: (PortfolioTheme & StrapiEntity)[]
  showAllThemes?: boolean
  showFeaturedOnly?: boolean
  limit?: number
  columns?: '2' | '3' | '4'
  showFilters?: boolean
  layout?: 'grid' | 'masonry'
}

export const PortfolioBlock = ({
  filterByThemes = [],
  showAllThemes = true,
  showFeaturedOnly = false,
  limit = 12,
  columns = '3',
  showFilters = true,
  layout = 'grid',
}: PortfolioBlockProps) => {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [portfolioItems, setPortfolioItems] = useState<(PortfolioItem & StrapiEntity)[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch portfolio items
  React.useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          'populate[themes][fields][0]': 'name',
          'populate[themes][fields][1]': 'slug',
          'populate[themes][fields][2]': 'color',
          'populate[image][fields][0]': 'url',
          'populate[image][fields][1]': 'alternativeText',
          'populate[image][fields][2]': 'width',
          'populate[image][fields][3]': 'height',
          'sort[0]': 'order:asc',
          'sort[1]': 'createdAt:desc',
          'pagination[limit]': limit.toString(),
        })

        if (showFeaturedOnly) {
          params.append('filters[featured][$eq]', 'true')
        }

        if (!showAllThemes && filterByThemes.length > 0) {
          filterByThemes.forEach((theme, index) => {
            params.append(`filters[themes][id][$in][${index}]`, theme.id.toString())
          })
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/portfolio-items?${params.toString()}`
        )
        const data = await response.json()
        setPortfolioItems(data.data || [])
      } catch (error) {
        console.error('Error fetching portfolio items:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolioItems()
  }, [filterByThemes, showAllThemes, showFeaturedOnly, limit])

  // Get all unique themes from loaded items
  const availableThemes = useMemo(() => {
    const themesMap = new Map<number, PortfolioTheme & StrapiEntity>()
    
    portfolioItems.forEach((item) => {
      item.themes?.forEach((theme) => {
        if (!themesMap.has(theme.id)) {
          themesMap.set(theme.id, theme)
        }
      })
    })

    return Array.from(themesMap.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    )
  }, [portfolioItems])

  // Filter items based on selected theme
  const filteredItems = useMemo(() => {
    if (!selectedTheme) return portfolioItems

    return portfolioItems.filter((item) =>
      item.themes?.some((theme) => theme.slug === selectedTheme)
    )
  }, [portfolioItems, selectedTheme])

  const columnClasses = {
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!portfolioItems.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        Aucun projet de portfolio disponible.
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Theme filters */}
      {showFilters && availableThemes.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => setSelectedTheme(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedTheme === null
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          {availableThemes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTheme === theme.slug
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={
                selectedTheme === theme.slug && theme.color
                  ? { backgroundColor: theme.color, color: 'white' }
                  : undefined
              }
            >
              {theme.name}
            </button>
          ))}
        </div>
      )}

      {/* Portfolio grid */}
      <div
        className={`grid ${columnClasses[columns]} gap-6 ${
          layout === 'masonry' ? 'auto-rows-max' : ''
        }`}
      >
        {filteredItems.map((item) => (
          <PortfolioCard key={item.id} item={item} />
        ))}
      </div>

      {/* No results message */}
      {filteredItems.length === 0 && selectedTheme && (
        <div className="text-center py-12 text-gray-500">
          Aucun projet trouvé pour ce thème.
        </div>
      )}
    </div>
  )
}
