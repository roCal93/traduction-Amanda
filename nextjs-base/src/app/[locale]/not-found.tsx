'use client'

export const metadata = { robots: 'noindex' }

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { defaultLocale as STATIC_DEFAULT_LOCALE, locales as STATIC_LOCALES } from '@/lib/locales'

type LocalesResponse = {
  locales: string[]
  defaultLocale: string
}

export default function NotFound() {
  const [supportedLocales, setSupportedLocales] = useState<string[]>([...(STATIC_LOCALES as readonly string[])])
  const [defaultLocale, setDefaultLocale] = useState<string>(STATIC_DEFAULT_LOCALE)
  const [rawLang, setRawLang] = useState<string | undefined>(undefined)

  const lang = rawLang && supportedLocales.includes(rawLang) ? rawLang : defaultLocale

  useEffect(() => {
    try {
      const docLang = document.documentElement.lang
      const parts = window.location.pathname.split('/').filter(Boolean)

      if (typeof docLang === 'string' && docLang.length > 0) {
        setTimeout(() => setRawLang(docLang), 0)
      } else if (parts[0]) {
        setTimeout(() => setRawLang(parts[0]), 0)
      }
    } catch {
      // noop
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    ;(async () => {
      try {
        const res = await fetch('/api/locales')
        if (!res.ok) return
        const json = (await res.json()) as Partial<LocalesResponse>

        const locales = Array.isArray(json.locales)
          ? json.locales.filter((l): l is string => typeof l === 'string' && l.length > 0)
          : []

        if (!isMounted) return
        if (locales.length > 0) setSupportedLocales(locales)
        if (typeof json.defaultLocale === 'string' && json.defaultLocale.length > 0) setDefaultLocale(json.defaultLocale)
      } catch {
        // ignore: fallback to static locales
      }
    })()

    return () => {
      isMounted = false
    }
  }, [])

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
      }}
      aria-labelledby="notfound-title"
    >
      <h1 id="notfound-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        404
      </h1>

      <p style={{ marginBottom: '1.5rem', color: '#374151' }}>
        {!rawLang ? "Cette page n'existe pas. / This page doesn't exist." : lang === 'en' ? "This page doesn't exist." : 'Cette page n\'existe pas.'}
      </p>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Link
          href={`/${lang}`}
          style={{
            padding: '12px 24px',
            background: '#000',
            color: '#fff',
            borderRadius: '6px',
            textDecoration: 'none',
          }}
        >
          {lang === 'en' ? 'Home' : "Retour à l’accueil"}
        </Link>
      </div>
    </main>
  )
}
