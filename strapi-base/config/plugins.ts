export default ({ env }) => ({
  // Vérifier que CLOUDINARY_URL est définie (usage exclusif)
  // (optionnel, peut être déplacé dans le plugin upload si besoin)
  plugins: {
    i18n: {
      enabled: true,
      config: {
        defaultLocale: 'fr',
        locales: ['fr', 'en'],
      },
    },
    preview: {
      enabled: true,
      config: {
        handler: (uid, { documentId, document, locale, status }) => {
          const frontendUrl = env('CLIENT_URL', 'http://localhost:3000')
          const previewSecret = env('PREVIEW_SECRET', 'dev-preview-secret')
          const params = new URLSearchParams({
            secret: previewSecret,
            status: status || 'draft',
          })
          const localePath = locale && locale !== 'fr' ? `/${locale}` : ''

          // Extract slug from various possible shapes sent by Strapi admin
          const maybeSlug =
            // common shapes: document.slug, document.attributes.slug
            (document && (document.slug || (document as any)?.attributes?.slug)) ||
            // sometimes wrapped in data: document.data.attributes.slug
            (document && (document as any)?.data && (document as any).data.attributes && (document as any).data.attributes.slug) ||
            // older/other shapes
            (document && (document as any)?.data && (document as any).data.slug) ||
            null

          const slug = maybeSlug || documentId

          // ensure no double slashes and encode slug
          const pathPart = `${localePath}/${encodeURIComponent(String(slug))}`.replace(/\/\/+/, '/')

          return `${frontendUrl}/api/preview?${params.toString()}&url=${pathPart}`
        },
      },
    },
    upload: {
      config: {
        provider: 'cloudinary',
        providerOptions: {},
        actionOptions: {
          upload: {},
          delete: {},
        },
      },
    },
  },
})
