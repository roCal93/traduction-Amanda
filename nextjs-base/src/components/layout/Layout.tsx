import React, { ReactNode } from 'react'
import { Header } from '@/components/sections/Header'
import { Footer } from '@/components/sections/Footer'
import { fetchAPI } from '@/lib/strapi'
import type { HeaderResponse } from '@/types/strapi'

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

    // Merge navigation arrays using the component item id as key
    const navMap = new Map<number, any>()

    if (dataPage?.navigation) {
      for (const item of dataPage.navigation) {
        navMap.set(item.id, { ...item })
      }
    }

    if (dataSection?.navigation) {
      for (const item of dataSection.navigation) {
        const existing = navMap.get(item.id) || {}
        navMap.set(item.id, { ...existing, ...item })
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
