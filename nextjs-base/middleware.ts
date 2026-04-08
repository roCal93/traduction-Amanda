import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from './src/lib/locales'

export const runtime = 'edge'

/** Replicate the allowed-origins logic so frame-ancestors stays accurate. */
function getAllowedFrameAncestors(): string[] {
  const allowedEnv =
    process.env.ALLOWED_ORIGINS ?? process.env.NEXT_PUBLIC_ALLOWED_ORIGINS
  const strapiOrigin =
    process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337'
  const origins = new Set<string>()

  if (allowedEnv) {
    allowedEnv
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((u) => origins.add(u))
  } else {
    origins.add(strapiOrigin)
    if (!strapiOrigin.includes('localhost')) {
      const host = strapiOrigin.replace(/^https?:\/\//, '').replace(/\/$/, '')
      const base = host.replace(/^www\./, '')
      origins.add(`https://${base}`)
      origins.add(`https://www.${base}`)
      origins.add(`https://*.${base}`)
    }
  }

  return Array.from(origins)
}

/**
 * Build a per-request CSP header.
 * Uses a nonce so 'unsafe-inline' is no longer required for scripts.
 * ('strict-dynamic' propagates trust to dynamically loaded chunks.)
 */
function buildCsp(nonce: string): string {
  const strapiOrigin =
    process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337'
  const normalizedStrapiOrigin = (() => {
    try {
      return new URL(strapiOrigin).origin
    } catch {
      return strapiOrigin
    }
  })()
  const isProd = process.env.NODE_ENV === 'production'
  const frameAncestors = ["'self'", ...getAllowedFrameAncestors()].join(' ')

  const directives = [
    "default-src 'self';",
    `img-src 'self' data: blob: https://res.cloudinary.com ${normalizedStrapiOrigin};`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isProd ? '' : " 'unsafe-eval'"};`,
    `style-src 'self' 'nonce-${nonce}';`,
    "style-src-attr 'unsafe-inline';",
    `connect-src 'self' ${normalizedStrapiOrigin};`,
    "font-src 'self' data:;",
    "object-src 'none';",
    "base-uri 'self';",
    "form-action 'self';",
    'upgrade-insecure-requests;',
    `frame-ancestors ${frameAncestors};`,
  ]

  return directives
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

export function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl
    const isRscOrPrefetchRequest =
      req.headers.get('rsc') === '1' ||
      req.headers.has('next-router-prefetch') ||
      req.headers.get('accept')?.includes('text/x-component')

    // Ignore static assets, API and other non-page requests
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api/') ||
      pathname.startsWith('/static') ||
      pathname.includes('.')
    ) {
      return NextResponse.next()
    }

    // Generate a per-request nonce. btoa + randomUUID is safe on the Edge runtime.
    const nonce = btoa(crypto.randomUUID())
    const csp = buildCsp(nonce)

    // Thread nonce through request headers so Next.js can apply it to its
    // own injected inline scripts (hydration, prefetch, etc.).
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-nonce', nonce)

    const segments = pathname.split('/').filter(Boolean)
    const first = segments[0]
    const locale =
      first && (locales as readonly string[]).includes(first)
        ? first
        : defaultLocale

    // Only redirect when there is NO locale segment at all ("/").
    // If the first segment exists but is not a supported locale (e.g. "/f"),
    // we let the request through so the app can render a proper 404.
    if (!first) {
      const url = req.nextUrl.clone()
      url.pathname = `/${locale}${url.pathname}`

      const redirectRes = NextResponse.redirect(url)
      try {
        redirectRes.cookies.set({
          name: 'locale',
          value: locale,
          path: '/',
          sameSite: 'lax',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 30,
        })
      } catch {
        const cookieValue = `locale=${encodeURIComponent(locale)}; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}${process.env.NODE_ENV === 'production' ? '; Secure; HttpOnly' : ''}`
        redirectRes.headers.set('set-cookie', cookieValue)
      }

      return redirectRes
    }

    // If the first segment exists but is not a supported locale, do not rewrite/redirect.
    if (!(locales as readonly string[]).includes(first)) {
      const res = NextResponse.next({ request: { headers: requestHeaders } })
      res.headers.set('Content-Security-Policy', csp)
      return res
    }

    const res = NextResponse.next({ request: { headers: requestHeaders } })
    res.headers.set('Content-Security-Policy', csp)

    // Avoid mutating cookies on RSC/prefetch requests used by App Router soft navigation.
    if (isRscOrPrefetchRequest) {
      return res
    }

    const currentLocaleCookie = req.cookies.get('locale')?.value
    if (currentLocaleCookie === locale) {
      return res
    }

    try {
      // Prefer the Cookies API when available (sets HttpOnly cookie)
      res.cookies.set({
        name: 'locale',
        value: locale,
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
      })
    } catch {
      // Fallback to setting header
      const cookieValue = `locale=${encodeURIComponent(locale)}; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}${process.env.NODE_ENV === 'production' ? '; Secure; HttpOnly' : ''}`
      res.headers.set('set-cookie', cookieValue)
    }

    return res
  } catch {
    return NextResponse.next()
  }
}

// Match all non-api and non-_next routes
export const config = {
  matcher: ['/((?!_next|api/|static).*)'],
}
