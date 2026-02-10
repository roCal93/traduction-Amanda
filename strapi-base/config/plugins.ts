export default ({ env }) => ({
  // Configuration des plugins Strapi
  i18n: {
    enabled: true,
    config: {
      defaultLocale: 'fr',
      locales: ['fr', 'en'],
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
})
