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
        handler: (uid, { documentId, locale, status }) => {
          const frontendUrl = env('CLIENT_URL', 'http://localhost:3000')
          const previewSecret = env('PREVIEW_SECRET', 'dev-preview-secret')
          const params = new URLSearchParams({
            secret: previewSecret,
            status: status || 'draft',
          })
          const localePath = locale && locale !== 'fr' ? `/${locale}` : ''
          return `${frontendUrl}/api/preview?${params.toString()}&url=${localePath}/${uid.split('.')[1]}/${documentId}`
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
