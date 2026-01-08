'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { defaultLocale as STATIC_DEFAULT_LOCALE, locales as STATIC_LOCALES } from '@/lib/locales'

type LocalesResponse = {
  locales: string[]
  defaultLocale: string
}

export function LanguageSwitcher() {
  const pathname = usePathname() ?? '/'
  const segments = pathname.split('/')
  
  const [supportedLocales, setSupportedLocales] = React.useState<string[]>([...(STATIC_LOCALES as readonly string[])])
  const [defaultLocale, setDefaultLocale] = React.useState<string>(STATIC_DEFAULT_LOCALE)

  React.useEffect(() => {
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

  const currentSegment = segments[1]
  const currentLocale = (currentSegment && supportedLocales.includes(currentSegment)) ? currentSegment : defaultLocale

  const idx = supportedLocales.indexOf(currentLocale)
  const nextLocale = supportedLocales.length > 1
    ? supportedLocales[(idx >= 0 ? idx + 1 : 0) % supportedLocales.length]
    : currentLocale

  const newPath = '/' + [nextLocale, ...segments.slice(2)].filter(Boolean).join('/')
  return (
    <div className="flex items-center gap-3">
      <span className="font-bold underline">{currentLocale.toUpperCase()}</span>
      {supportedLocales.length > 1 && (
        <Link href={newPath} aria-label={`Passer en ${nextLocale}`} className="ml-2 hover:underline" prefetch>
          {nextLocale.toUpperCase()}
        </Link>
      )}
    </div>
  )
}
