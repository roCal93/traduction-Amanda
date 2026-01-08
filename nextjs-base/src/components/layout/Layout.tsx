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
    const response = await fetchAPI<HeaderResponse>('/header?populate=navigation.page', {
      locale,
      next: { revalidate: 3600 }, // Cache 1h
    })
    return response.data
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
