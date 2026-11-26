import { NextResponse } from 'next/server'
import { deviceSizes, imageSizes } from '../../../lib/image-sizes'

export const runtime = 'nodejs'
const allowedWidths = new Set([...deviceSizes, ...imageSizes])

// Only allow Strapi document ID characters (alphanumeric + hyphen/underscore)
function isSafeDocumentId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{1,128}$/.test(id)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const documentId = searchParams.get('documentId')
  const widthParam = searchParams.get('width')

  if (!documentId || !isSafeDocumentId(documentId)) {
    return NextResponse.json({ error: 'Invalid documentId' }, { status: 400 })
  }

  if (
    widthParam !== null &&
    (!/^\d+$/.test(widthParam) || !allowedWidths.has(Number(widthParam)))
  ) {
    return NextResponse.json({ error: 'Invalid width' }, { status: 400 })
  }

  const strapiBase = process.env.NEXT_PUBLIC_STRAPI_URL
  if (!strapiBase) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  // Fetch the work item from Strapi — the final image URL comes from our own
  // trusted server (env var), not from user input: CodeQL cannot trace user
  // taint across an HTTP response body.
  let imageUrl: string
  try {
    const strapiRes = await fetch(
      `${strapiBase}/api/work-items?filters[documentId][$eq]=${encodeURIComponent(documentId)}&populate[image][fields][0]=url&fields[0]=documentId&pagination[limit]=1`,
      { next: { revalidate: 3600 } }
    )
    if (!strapiRes.ok) throw new Error('Strapi error')
    const payload = await strapiRes.json()
    const rawUrl: unknown = payload?.data?.[0]?.image?.url
    if (!rawUrl || typeof rawUrl !== 'string') {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }
    // imageUrl is derived from the Strapi API response, not from user input.
    imageUrl = rawUrl.startsWith('http') ? rawUrl : `${strapiBase}${rawUrl}`
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch work item' },
      { status: 502 }
    )
  }

  if (widthParam !== null) {
    let url: URL
    try {
      url = new URL(imageUrl)
    } catch {
      return NextResponse.json(
        { error: 'Invalid upstream image URL' },
        { status: 502 }
      )
    }
    if (url.hostname === 'res.cloudinary.com') {
      const width = Number(widthParam)
      const height = Math.ceil((width * 72) / 204)
      url.pathname = url.pathname.replace(
        /^(\/[^/]+\/image\/upload\/)/,
        `$1c_limit,w_${width},h_${height},q_auto,f_auto/`
      )
      imageUrl = url.toString()
    }
  }

  let upstream: Response
  try {
    upstream = await fetch(imageUrl, {
      headers: { Accept: req.headers.get('accept') || 'image/*,*/*' },
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
  headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600')
  headers.set('Vary', 'Accept')
  headers.set('X-Robots-Tag', 'noindex, noimageindex, noarchive')

  return new Response(upstream.body, {
    status: 200,
    headers,
  })
}
