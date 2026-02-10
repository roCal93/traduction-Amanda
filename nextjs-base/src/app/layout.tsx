import type { Metadata } from 'next'
import { Geist, Geist_Mono, Source_Serif_4, Caveat } from 'next/font/google'
import './globals.css'
import { cookies, headers } from 'next/headers'
import { defaultLocale } from '@/lib/locales'
import { isDisableDark } from '@/lib/theme'

// Mark the root layout as dynamic since we read cookies/headers to pick the locale.
export const dynamic = 'force-dynamic'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  adjustFontFallback: true,
})

const sourceSerif = Source_Serif_4({
  variable: '--font-serif',
  weight: ['400', '600'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'serif'],
})

const caveat = Caveat({
  variable: '--font-caveat',
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['cursive'],
})

export const metadata: Metadata = {
  title: 'Amanda Traduction - Traduction professionnelle',
  description:
    "Services de traduction professionnelle de l'anglais et de l'italien vers le français pour les entreprises et les particuliers.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  openGraph: {
    title: 'Amanda Traduction - Traduction professionnelle',
    description:
      "Services de traduction professionnelle de l'anglais et de l'italien vers le français pour les entreprises et les particuliers.",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'Amanda Traduction',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/images/logo.png',
        width: 800,
        height: 600,
        alt: 'Amanda Traduction Logo',
      },
    ],
  },
}

import DevPerfProtector from '@/components/dev/DevPerfProtector'
import { SchemaOrg } from '@/components/seo/SchemaOrg'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let locale = defaultLocale

  try {
    const cookieStore = await cookies()
    const cookieLocale = cookieStore.get('locale')?.value
    if (
      cookieLocale === 'fr' ||
      cookieLocale === 'en' ||
      cookieLocale === 'it'
    ) {
      locale = cookieLocale
    } else {
      locale = defaultLocale
    }
  } catch {
    // Fallback: parse header cookie string if cookies() is unavailable
    try {
      const cookieHeader = (await headers()).get('cookie') ?? ''
      const match = cookieHeader.match(/(?:^|; )locale=([^;]+)/)
      const parsedLocale = match ? decodeURIComponent(match[1]) : defaultLocale
      locale =
        parsedLocale === 'fr' || parsedLocale === 'en' || parsedLocale === 'it'
          ? parsedLocale
          : defaultLocale
    } catch {
      locale = defaultLocale
    }
  }

  const disableDark = isDisableDark()

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      data-disable-dark={disableDark ? 'true' : undefined}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} ${caveat.variable} antialiased`}
      >
        {/* Structured data for SEO */}
        <SchemaOrg />
        {/* Dev-only protective wrapper to avoid dev tooling throwing on performance.measure */}
        <DevPerfProtector />
        {children}
      </body>
    </html>
  )
}
