import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

function isAllowedImageUrl(url: URL): boolean {
  if (url.protocol !== 'https:') return false

  if (url.hostname === 'res.cloudinary.com') return true

  const strapiBase = process.env.NEXT_PUBLIC_STRAPI_URL
  if (!strapiBase) return false

  try {
    const strapiUrl = new URL(strapiBase)
    return url.hostname === strapiUrl.hostname
  } catch {
    return false
  }
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

  let target: URL
  try {
    target = new URL(rawUrl)
  } catch {
    return NextResponse.json(
      { error: 'Invalid url parameter' },
      { status: 400 }
    )
  }

  if (!isAllowedImageUrl(target)) {
    return NextResponse.json({ error: 'URL not allowed' }, { status: 403 })
  }

  let upstream: Response
  try {
    upstream = await fetch(target.toString(), {
      headers: { Accept: 'image/*,*/*' },
      cache: 'force-cache',
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
