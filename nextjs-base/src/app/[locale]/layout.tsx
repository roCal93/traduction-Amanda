import React from 'react'
import { LangSetter } from '@/components/locale'
import { PageTransition } from '@/components/animations/PageTransition'

export const dynamic = 'force-dynamic'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{
    locale: string
  }>
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  // Note: Locale validation is handled in individual pages/components
  // to allow the 404 page to render properly

  return (
    <PageTransition>
      <LangSetter lang={locale} />
      {children}
    </PageTransition>
  )
}
