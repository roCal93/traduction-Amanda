'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { locales, defaultLocale } from '@/lib/locales'

export default function RootNotFound() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if the first segment looks like an invalid locale
    const segments = pathname?.split('/').filter(Boolean) || []
    const firstSegment = segments[0]

    // If first segment exists but is not a valid locale, redirect to default locale
    if (
      firstSegment &&
      !(locales as readonly string[]).includes(firstSegment)
    ) {
      const remainingPath = segments.slice(1).join('/')
      const newPath = remainingPath
        ? `/${defaultLocale}/${remainingPath}`
        : `/${defaultLocale}`
      router.replace(newPath)
    }
  }, [pathname, router])

  const content = {
    fr: {
      title: '404',
      message: "Cette page n'existe pas.",
      button: "Retour à l'accueil",
    },
    en: {
      title: '404',
      message: "This page doesn't exist.",
      button: 'Back to home',
    },
    it: {
      title: '404',
      message: 'Questa pagina non esiste.',
      button: 'Torna alla home',
    },
  }

  const text = content[defaultLocale]

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: '#FFF1F1',
      }}
      aria-labelledby="notfound-title"
    >
      <h1
        id="notfound-title"
        style={{ fontSize: '3rem', marginBottom: '1rem' }}
      >
        {text.title}
      </h1>

      <p style={{ marginBottom: '1.5rem', color: '#374151' }}>{text.message}</p>

      <Button href={`/${defaultLocale}`}>{text.button}</Button>
    </main>
  )
}
