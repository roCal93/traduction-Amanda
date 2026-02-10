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
        handler: async (uid, { documentId, document, locale, status }) => {
          const frontendUrl = env('CLIENT_URL', 'http://localhost:3000')
          const previewSecret = env('PREVIEW_SECRET', 'dev-preview-secret')
          const params = new URLSearchParams({
            secret: previewSecret,
            status: status || 'draft',
          })
          const localePath = locale && locale !== 'fr' ? `/${locale}` : ''

          // Try to resolve a slug server-side using Strapi entity service (handles i18n properly)
          let slug = null
          try {
            if (typeof strapi !== 'undefined' && strapi.entityService) {
              const entry = await strapi.entityService.findOne(uid, documentId, {
                fields: ['slug'],
                locale: locale || null,
              })
              if (entry && entry.slug) {
                slug = entry.slug
              }
            }
          } catch (e) {
            // ignore lookup errors and fallback to whatever we have
          }

          // Fallbacks: document payload or documentId
          if (!slug) {
            const maybeSlug =
              (document && (document.slug || (document as any)?.attributes?.slug)) ||
              (document && (document as any)?.data && (document as any).data.attributes && (document as any).data.attributes.slug) ||
              (document && (document as any)?.data && (document as any).data.slug) ||
              null

            slug = maybeSlug || documentId
          }

          // ensure no double slashes and encode slug
          const pathPart = `${localePath}/${encodeURIComponent(String(slug))}`.replace(/\/\/+/, '/')

          return `${frontendUrl}/api/preview?${params.toString()}&url=${pathPart}`
        },
      },
    },
    upload: {
      config: {
        provider: 'cloudinary',
        // If CLOUDINARY_URL is provided (Railway / env), the provider will use it.
        // Otherwise fall back to individual variables.
        providerOptions: env('CLOUDINARY_URL')
          ? {}
          : {
              cloud_name: env('CLOUDINARY_NAME'),
              api_key: env('CLOUDINARY_KEY'),
              api_secret: env('CLOUDINARY_SECRET'),
            },
        actionOptions: {
          upload: {
            folder: env('CLOUDINARY_FOLDER', 'amanda-traduction'),
          },
          delete: {},
        },
      },
    },
  },
})
