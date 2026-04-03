import type { NextConfig } from 'next'
import path from 'node:path'

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

    // Note: Content-Security-Policy (with per-request nonce) is set in middleware.ts
    // so that 'unsafe-inline' can be replaced by 'nonce-{nonce}' + 'strict-dynamic'.
    const securityHeaders: { key: string; value: string }[] = [
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
    ]
  },
}

export default nextConfig
