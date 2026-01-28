'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  defaultLocale as STATIC_DEFAULT_LOCALE,
  locales as STATIC_LOCALES,
} from '@/lib/locales'

type LocalesResponse = {
  locales: string[]
  defaultLocale: string
}

export function LanguageSwitcher({
  side = 'bottom',
  onOpenChange,
}: {
  side?: 'bottom' | 'right'
  onOpenChange?: (open: boolean) => void
}) {
  const pathname = usePathname() ?? '/'
  const segments = pathname.split('/')

  const [supportedLocales, setSupportedLocales] = React.useState<string[]>([
    ...(STATIC_LOCALES as readonly string[]),
  ])
  const [defaultLocale, setDefaultLocale] = React.useState<string>(
    STATIC_DEFAULT_LOCALE
  )

  React.useEffect(() => {
    let isMounted = true

    ;(async () => {
      try {
        const res = await fetch('/api/locales')
        if (!res.ok) return
        const json = (await res.json()) as Partial<LocalesResponse>

        const locales = Array.isArray(json.locales)
          ? json.locales.filter(
              (l): l is string => typeof l === 'string' && l.length > 0
            )
          : []

        if (!isMounted) return
        if (locales.length > 0) setSupportedLocales(locales)
        if (
          typeof json.defaultLocale === 'string' &&
          json.defaultLocale.length > 0
        )
          setDefaultLocale(json.defaultLocale)
      } catch {
        // ignore: fallback to static locales
      }
    })()

    return () => {
      isMounted = false
    }
  }, [])

  const currentSegment = segments[1]
  const currentLocale =
    currentSegment && supportedLocales.includes(currentSegment)
      ? currentSegment
      : defaultLocale

  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  React.useEffect(() => {
    onOpenChange?.(open)
  }, [open, onOpenChange])

  const otherLocales = supportedLocales.filter((l) => l !== currentLocale)

  const [canHover, setCanHover] = React.useState(false)
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      setCanHover(window.matchMedia('(hover: hover)').matches)
    }
  }, [])

  const shouldReduceMotion = useReducedMotion()

  // Disable entrance animations when displayed in the burger menu (side === 'right')
  const animEnabled = !shouldReduceMotion && side !== 'right'

  // Compute animations and position based on requested side ('bottom' or 'right')
  const containerInitial = animEnabled
    ? side === 'bottom'
      ? { opacity: 0, scale: 0.8, y: -6 }
      : { opacity: 0, scale: 0.8, x: -6 }
    : {}

  const containerAnimate = animEnabled
    ? side === 'bottom'
      ? { opacity: 1, scale: 1, y: 0 }
      : { opacity: 1, scale: 1, x: 0 }
    : {}

  const containerExit = animEnabled
    ? side === 'bottom'
      ? { opacity: 0, scale: 0.95, y: -4 }
      : { opacity: 0, scale: 0.95, x: -4 }
    : {}

  const itemInitial = animEnabled
    ? side === 'bottom'
      ? { opacity: 0, y: -4 }
      : { opacity: 0, x: -4 }
    : {}

  const itemAnimate = animEnabled ? { opacity: 1, y: 0, x: 0 } : {}
  const itemExit = animEnabled
    ? side === 'bottom'
      ? { opacity: 0, y: -2 }
      : { opacity: 0, x: -2 }
    : {}

  const menuClassName =
    side === 'bottom'
      ? 'absolute left-1/2 top-full pt-10 w-9 bg-[#FFFACD]/60 rounded-full shadow z-50 overflow-hidden transform -translate-x-1/2 -translate-y-9'
      : 'absolute left-full top-1/2 pl-9 h-9 bg-[#FFFACD]/60 rounded-full shadow z-50 overflow-visible transform -translate-y-1/2 -translate-x-9 flex items-center'

  // Link class depending on side (horizontal for right side)
  const itemLinkClass =
    side === 'bottom'
      ? 'block py-2 hover:bg-[#C5E1A599] rounded-full text-sm text-center w-full'
      : 'inline-flex w-9 h-9 ml-16 items-center justify-center rounded-full hover:bg-[#C5E1A599] text-sm font-semibold'

  // If only one locale is supported, hide the language switcher entirely
  if (supportedLocales.length <= 1) return null

  return (
    <div
      className="relative"
      ref={containerRef}
      onMouseEnter={() => canHover && otherLocales.length > 0 && setOpen(true)}
      onMouseLeave={() => canHover && setOpen(false)}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => otherLocales.length > 0 && setOpen((v) => !v)}
        className="w-9 h-9 rounded-full bg-[#C5E1A599] flex items-center justify-center text-sm font-semibold hover:bg-[#FFFACD]/80 cursor-pointer"
      >
        {currentLocale.toUpperCase()}
      </button>

      <AnimatePresence>
        {open && otherLocales.length > 0 && (
          <motion.div
            role="menu"
            aria-label="Choisir la langue"
            onMouseEnter={() => canHover && setOpen(true)}
            onMouseLeave={() => canHover && setOpen(false)}
            initial={containerInitial}
            animate={containerAnimate}
            exit={containerExit}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 32,
              duration: 0.2,
            }}
            className={menuClassName}
          >
            {otherLocales.map((loc, idx) => {
              const href =
                '/' + [loc, ...segments.slice(2)].filter(Boolean).join('/')
              return (
                <motion.div
                  key={loc}
                  initial={itemInitial}
                  animate={itemAnimate}
                  exit={itemExit}
                  transition={{ delay: idx * 0.03, duration: 0.12 }}
                >
                  <Link
                    role="menuitem"
                    href={href}
                    onClick={() => setOpen(false)}
                    className={itemLinkClass}
                    title={`Changer la langue en ${loc}`}
                  >
                    {loc.toUpperCase()}
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
