import React, { ReactNode } from 'react'
import { Header } from '@/components/sections/Header'
import { Footer } from '@/components/sections/Footer'
import { fetchAPI } from '@/lib/strapi'
import type { HeaderResponse, PageLink } from '@/types/strapi'

type LayoutProps = {
  children: ReactNode
  locale: string
}

async function getHeaderData(locale: string) {
  // Validate locale to avoid API calls with invalid locales
  if (locale !== 'fr' && locale !== 'en') {
    return null
  }

  try {
    // Faire deux requêtes distinctes (Strapi ne supporte pas toujours la population multiple
    // pour les components). On récupère les pages et les sections puis on fusionne.
    const [respPage, respSection] = await Promise.all([
      fetchAPI<HeaderResponse>('/header?populate=navigation.page', { locale, next: { revalidate: 3600 } }),
      fetchAPI<HeaderResponse>('/header?populate=navigation.section', { locale, next: { revalidate: 3600 } }),
    ])

    const dataPage = respPage?.data || null
    const dataSection = respSection?.data || null

    if (!dataPage && !dataSection) return null

    if (process.env.NODE_ENV !== 'production') {
      console.debug('[Layout] respPage.navigation:', dataPage?.navigation)
      console.debug('[Layout] respSection.navigation:', dataSection?.navigation)
    }

    // Merge navigation arrays using page id as key
    type NavItem = PageLink & { id?: number }
    const navMap = new Map<string, NavItem>()

    // Only process page navigation since PageLink only has page references now
    if (dataPage?.navigation) {
      for (const item of dataPage.navigation as NavItem[]) {
        if (item.page?.id) {
          navMap.set(`page-${item.page.id}`, { ...item })
        }
      }
    }

    if (dataSection?.navigation) {
      for (const item of dataSection.navigation as NavItem[]) {
        const pageId = item.page?.id
        if (pageId) {
          const existing = navMap.get(`page-${pageId}`) || {}
          navMap.set(`page-${pageId}`, { ...existing, ...item })
        } else {
          // Try to match by nav item id (preferred) or by page slug if available.
          let matchedKey: string | null = null

          // 1) Match by navigation component id (e.g., both respPage and respSection have same nav item id)
          for (const [key, val] of navMap.entries()) {
            if (val.id && val.id === item.id) {
              matchedKey = key
              break
            }
          }

          // 2) Fallback: match by page.slug
          if (!matchedKey) {
            const pageSlug = item.page?.slug
            if (pageSlug) {
              for (const [key, val] of navMap.entries()) {
                if (val.page?.slug === pageSlug) {
                  matchedKey = key
                  break
                }
              }
            }
          }

          if (matchedKey) {
            const existing = navMap.get(matchedKey) || {}
            navMap.set(matchedKey, { ...existing, ...item })
            if (process.env.NODE_ENV !== 'production') console.debug(`[Layout] merged section item id=${item.id ?? 'unknown'} into ${matchedKey}`)
          } else {
            // keep as separate entry to avoid losing the section reference
            const extraKey = `extra-${navMap.size}-${Math.random().toString(36).slice(2,7)}`
            navMap.set(extraKey, { ...item })
            if (process.env.NODE_ENV !== 'production') console.debug(`[Layout] added extra nav entry for item id=${item.id ?? 'unknown'} as ${extraKey}`)
          }
        }
      }
    }

    const merged = Array.from(navMap.values())

    // Prefer dataPage root fields (logo/title), but attach merged navigation
    return {
      ...dataPage,
      navigation: merged,
    }
  } catch (error) {
    console.error('Erreur lors du chargement du header:', error)
    return null
  }
}

export const Layout = async ({ children, locale }: LayoutProps) => {
  const headerData = await getHeaderData(locale)

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        logo={headerData?.logo}
        title={headerData?.title}
        navigation={headerData?.navigation}
      />
      <main className="flex-1">{children}</main>
      <Footer siteName={headerData?.title} />
    </div>
  )
}
