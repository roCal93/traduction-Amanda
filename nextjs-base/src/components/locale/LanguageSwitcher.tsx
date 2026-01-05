'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export function LanguageSwitcher() {
  const pathname = usePathname() ?? '/'
  const segments = pathname.split('/')
  const currentSegment = segments[1]
  const currentLocale = currentSegment === 'fr' || currentSegment === 'en' ? currentSegment : 'fr'
  const otherLocale = currentLocale === 'fr' ? 'en' : 'fr'
  const newPath = '/' + [otherLocale, ...segments.slice(2)].filter(Boolean).join('/')

  return (
    <div className="flex items-center gap-3">
      <span className="font-bold underline">{currentLocale.toUpperCase()}</span>
      <Link href={newPath} aria-label={`Passer en ${otherLocale}`} className="ml-2 hover:underline" prefetch>
        {otherLocale.toUpperCase()}
      </Link>
    </div>
  )
}
