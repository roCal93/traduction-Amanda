export default [
  // Append Cloudinary to any CSP header returned by Strapi (helps ensure admin loads remote images)
  {
    name: 'global::append-cloudinary-csp',
    config: {},
  },
  'strapi::logger',
  'strapi::errors',
  // Security middleware with relaxed CSP for local preview & dev tooling
  {
    name: 'strapi::security',
    config: ({ env }) => ({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          // Allow the frontend (CLIENT_URL) to be framed inside Strapi admin preview
          'frame-ancestors': ["'self'", env('CLIENT_URL', 'http://localhost:3000')],
          // Allow embedding/iframes from the frontend
          'frame-src': ["'self'", env('CLIENT_URL', 'http://localhost:3000')],
          // Allow inline scripts (needed for Strapi admin live dev client) in dev only
          'script-src': env('NODE_ENV') === 'production'
            ? ["'self'"]
            : ["'self'", "'unsafe-inline'", 'http://localhost:5173'],
          // Allow Vite websocket & admin to connect to local dev servers
          'connect-src': env('NODE_ENV') === 'production'
            ? ["'self'", 'https:']
            : ["'self'", 'https:', 'ws://localhost:5173', 'http://localhost:5173'],
          // Images: allow data/blob and Cloudinary (production) + Strapi market assets
          'img-src': env('NODE_ENV') === 'production'
            ? ["'self'", 'data:', 'https://res.cloudinary.com', 'https://market-assets.strapi.io']
            : ["'self'", 'data:', 'blob:', 'http://localhost:5173', 'https://res.cloudinary.com', 'https://market-assets.strapi.io'],
        },
      },
    }),
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      // Allow a set of known origins in production, plus Vercel preview domains.
      // We prefer an allow-list coming from ALLOWED_ORIGINS env var when present.
      origin: (ctx: any) => {
        const requestOrigin = ctx.request.header.origin;
        if (!requestOrigin) return '*';

        const allowed = process.env.ALLOWED_ORIGINS?.split(',') || [
          'https://www.amandatraduction.com',
          'https://amandatraduction.com',
          'https://traduction-amanda-production.up.railway.app',
        ];

        const vercelPreview = /^https:\/\/.*\.vercel\.app$/;

        return allowed.includes(requestOrigin) || vercelPreview.test(requestOrigin)
          ? requestOrigin
          : false;
      },
      headers: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
