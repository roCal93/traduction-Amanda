import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

function isAllowedImageUrl(url: URL): boolean {
  if (url.protocol !== 'https:') return false
  if (url.username || url.password) return false

  // Allow-list exact trusted origin(s), not arbitrary user-provided hosts.
  if (url.origin === 'https://res.cloudinary.com') return true

  const strapiBase = process.env.NEXT_PUBLIC_STRAPI_URL
  if (!strapiBase) return false

  try {
    const strapiUrl = new URL(strapiBase)
    return url.origin === strapiUrl.origin
  } catch {
    return false
  }
}

function getSanitizedAllowedImageUrl(rawUrl: string): string | null {
  let parsed: URL
  try {
    parsed = new URL(rawUrl)
  } catch {
    return null
  }

  if (!isAllowedImageUrl(parsed)) return null

  // Prevent path traversal-style endpoint manipulation.
  let decodedPathname: string
  try {
    decodedPathname = decodeURIComponent(parsed.pathname)
  } catch {
    return null
  }

  if (
    decodedPathname.includes('/../') ||
    decodedPathname.endsWith('/..') ||
    decodedPathname.startsWith('../') ||
    decodedPathname === '..'
  ) {
    return null
  }

  const sanitized = new URL(parsed.origin)
  sanitized.pathname = parsed.pathname
  sanitized.search = parsed.search

  return sanitized.toString()
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const rawUrl = searchParams.get('url')

  if (!rawUrl) {
    return NextResponse.json(
      { error: 'Missing url parameter' },
      { status: 400 }
    )
  }

  const sanitizedUrl = getSanitizedAllowedImageUrl(rawUrl)
  if (!sanitizedUrl) {
    return NextResponse.json({ error: 'URL not allowed' }, { status: 403 })
  }

  let upstream: Response
  try {
    upstream = await fetch(sanitizedUrl, {
      headers: { Accept: 'image/*,*/*' },
      cache: 'force-cache',
      redirect: 'error',
    })
  } catch {
    return NextResponse.json(
      { error: 'Upstream fetch failed' },
      { status: 502 }
    )
  }

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: 'Image not found upstream' },
      { status: upstream.status || 404 }
    )
  }

  const headers = new Headers()
  headers.set(
    'Content-Type',
    upstream.headers.get('Content-Type') || 'application/octet-stream'
  )
  headers.set(
    'Cache-Control',
    upstream.headers.get('Cache-Control') ||
      'public, max-age=31536000, immutable'
  )
  headers.set('X-Robots-Tag', 'noindex, noimageindex, noarchive')

  return new Response(upstream.body, {
    status: 200,
    headers,
  })
}
