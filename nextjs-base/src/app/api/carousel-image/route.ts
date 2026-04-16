import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Only allow Strapi document ID characters (alphanumeric + hyphen/underscore)
function isSafeDocumentId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{1,128}$/.test(id)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const documentId = searchParams.get('documentId')

  if (!documentId || !isSafeDocumentId(documentId)) {
    return NextResponse.json({ error: 'Invalid documentId' }, { status: 400 })
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

  let upstream: Response
  try {
    upstream = await fetch(imageUrl, {
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
