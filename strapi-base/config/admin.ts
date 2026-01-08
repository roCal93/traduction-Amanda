// Basic admin config with Preview feature handler
const getPreviewPathname = (uid, { locale, document }) => {
  // Minimal mapping for pages — extend as needed
  if (uid === 'api::page.page') {
    const slug = document?.slug
    if (!slug) return '/' // fallback
    const path = slug === 'home' ? '/' : `/${slug}`
    return `/${locale}${path}`
  }
  return null
}

export default ({ env }) => {
  const clientUrl = env('CLIENT_URL')
  const previewSecret = env('PREVIEW_SECRET')

  return {
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
    },
    apiToken: {
      salt: env('API_TOKEN_SALT'),
    },
    transfer: {
      token: {
        salt: env('TRANSFER_TOKEN_SALT'),
      },
    },
    secrets: {
      encryptionKey: env('ENCRYPTION_KEY'),
    },
    flags: {
      nps: env.bool('FLAG_NPS', true),
      promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    },
    // Preview configuration
    preview: {
      enabled: true,
      config: {
        allowedOrigins: clientUrl,
        async handler(uid, { documentId, locale, status }) {
          const document = await strapi.documents(uid).findOne({ 
            documentId,
            locale 
          })
          const pathname = getPreviewPathname(uid, { locale, document })

          if (!pathname) return null

          const urlSearchParams = new URLSearchParams({
            url: pathname,
            secret: previewSecret,
            status,
          })

          return `${clientUrl}/api/preview?${urlSearchParams}`
        },
      },
    },
  }
}
