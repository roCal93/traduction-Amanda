import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      // Pour la production, ajoutez votre domaine Strapi ici :
      // {
      //   protocol: 'https',
      //   hostname: 'votre-strapi.com',
      //   pathname: '/uploads/**',
      // },
    ],
    unoptimized: process.env.NODE_ENV === 'development' || (process.env.NEXT_PUBLIC_STRAPI_URL || '').includes('localhost'), // Toujours non-optimisé pour localhost
    formats: ['image/webp', 'image/avif'], // Formats modernes pour réduire la taille
  },

  // Optimisations de performance
  compress: true, // Activer la compression Gzip/Brotli
  poweredByHeader: false, // Supprimer l'en-tête X-Powered-By

  // Autoriser l'admin Strapi à intégrer le site en iframe pour la Preview
  async headers() {
    const strapiOrigin = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
    const isProd = process.env.NODE_ENV === 'production'

    // Note: we rely on CSP `frame-ancestors` for iframe control (X-Frame-Options
    // cannot express multiple allowed origins and would break Strapi preview embeds).
    const csp = [
      "default-src 'self';",
      `img-src 'self' data: https: ${strapiOrigin};`,
      `script-src 'self' 'unsafe-inline'${isProd ? '' : " 'unsafe-eval'"};`,
      "style-src 'self' 'unsafe-inline';",
      `connect-src 'self' ${strapiOrigin} https://*.railway.app https://*.vercel.app;`,
      "font-src 'self' data:;",
      `frame-ancestors 'self' ${strapiOrigin};`,
    ].join(' ')

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
      {
        key: 'Content-Security-Policy',
        value: csp.replace(/\s{2,}/g, ' ').trim(),
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
};

export default nextConfig;
