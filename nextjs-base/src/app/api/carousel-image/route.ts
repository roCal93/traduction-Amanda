import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

/**
 * Returns the TRUSTED, server-controlled origin that matches the user-supplied
 * URL, or null if the URL is not from an allowed host.
 * The returned string is always either a hard-coded literal or derived from an
 * environment variable — never from user input — so CodeQL cannot trace user
 * data into the final fetch target's host.
 */
function getTrustedOrigin(url: URL): string | null {
  if (url.protocol !== 'https:') return null
  if (url.username || url.password) return null

  if (url.origin === 'https://res.cloudinary.com') {
    // Hard-coded — completely server-controlled.
    return 'https://res.cloudinary.com'
  }

  const strapiBase = process.env.NEXT_PUBLIC_STRAPI_URL
  if (!strapiBase) return null

  try {
    const strapiUrl = new URL(strapiBase)
    if (url.origin === strapiUrl.origin) {
      // Comes from an env var, not from user input.
      return strapiUrl.origin
    }
  } catch {
    return null
  }

  return null
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

  let parsed: URL
  try {
    parsed = new URL(rawUrl)
  } catch {
    return NextResponse.json(
      { error: 'Invalid url parameter' },
      { status: 400 }
    )
  }

  // trustedOrigin is NEVER derived from user input: it is either a hard-coded
  // string or comes from an environment variable.  CodeQL cannot trace user
  // taint through it, which is exactly what eliminates the SSRF finding.
  const trustedOrigin = getTrustedOrigin(parsed)
  if (!trustedOrigin) {
    return NextResponse.json({ error: 'URL not allowed' }, { status: 403 })
  }

  // Reconstruct the full URL from the trusted server-controlled origin + the
  // user-supplied path/query.  The host is guaranteed to be our own origin.
  const safeUrl = new URL(
    parsed.pathname + (parsed.search ?? ''),
    trustedOrigin
  )

  let upstream: Response
  try {
    upstream = await fetch(safeUrl.toString(), {
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
