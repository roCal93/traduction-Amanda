import type { NextConfig } from 'next'
import path from 'node:path'

function normalizeOrigin(input: string): string | null {
  try {
    return new URL(input).origin
  } catch {
    return null
  }
}

function getSiteOrigin(): string {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    'https://www.amandatraduction.com'
  return normalizeOrigin(siteUrl) || 'https://www.amandatraduction.com'
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'traduction-amanda-production.up.railway.app',
        pathname: '/uploads/**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development', // Activer l'optimisation en production
    formats: ['image/webp', 'image/avif'], // Formats modernes pour réduire la taille
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 85], // Qualités d'images autorisées
  },

  // Optimisations de performance
  compress: true, // Activer la compression Gzip/Brotli
  poweredByHeader: false, // Supprimer l'en-tête X-Powered-By

  // For Turbopack: explicitly set workspace root to this Next app to avoid
  // module resolution issues when the repo contains multiple lockfiles.
  // See https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory
  turbopack: {
    // On Vercel the build runs from a subdirectory (nextjs-base) but Next also
    // sets outputFileTracingRoot to the repo root. Those two values must match.
    root: process.env.VERCEL ? path.resolve(__dirname, '..') : __dirname,
  } as const,

  // Autoriser l'admin Strapi à intégrer le site en iframe pour la Preview
  async headers() {
    const isProd = process.env.NODE_ENV === 'production'
    const strapiOrigin =
      process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
    const normalizedStrapiOrigin = normalizeOrigin(strapiOrigin) || strapiOrigin
    const siteOrigin = getSiteOrigin()

    const metadataCsp = [
      "default-src 'none';",
      `connect-src 'self' ${normalizedStrapiOrigin};`,
      "img-src 'self' data: https://res.cloudinary.com;",
      "style-src 'self';",
      "style-src-attr 'unsafe-inline';",
      "font-src 'self' data:;",
      "base-uri 'none';",
      "form-action 'none';",
      "frame-ancestors 'none';",
      "object-src 'none';",
    ]
      .join(' ')
      .replace(/\s{2,}/g, ' ')
      .trim()

    // Note: Content-Security-Policy (with per-request nonce) is set in middleware.ts
    // so that 'unsafe-inline' can be replaced by 'nonce-{nonce}' + 'strict-dynamic'.
    const securityHeaders: { key: string; value: string }[] = [
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'geolocation=(), microphone=(), camera=()',
      },
    ]

    if (isProd) {
      securityHeaders.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      })
    }

    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: metadataCsp,
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: siteOrigin,
          },
          {
            key: 'Vary',
            value: 'Origin',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: metadataCsp,
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: siteOrigin,
          },
          {
            key: 'Vary',
            value: 'Origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig
