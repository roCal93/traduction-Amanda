export default ({ env }) => {
	// Vérifier que CLOUDINARY_URL est définie (usage exclusif)
	if (!env('CLOUDINARY_URL')) {
		throw new Error('CLOUDINARY_URL est requise pour le provider Cloudinary')
	}

	return {
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

					// Construire l'URL de preview
					const params = new URLSearchParams({
						secret: previewSecret,
						status: status || 'draft',
					})

					// Si locale existe, l'inclure dans le path
					const localePath = locale && locale !== 'fr' ? `/${locale}` : ''
					
					// URL finale : /api/preview?secret=xxx&status=draft&url=/fr/page-slug
					const previewUrl = `${frontendUrl}/api/preview?${params.toString()}&url=${localePath}/${uid.split('.')[1]}/${documentId}`

					return previewUrl
				},
			},
		},

		upload: {
			config: {
				provider: 'cloudinary',
				// providerOptions vide : le SDK Cloudinary lira CLOUDINARY_URL
				providerOptions: {},
				actionOptions: {
					upload: {},
					delete: {},
				},
			},
		},
	}
};
