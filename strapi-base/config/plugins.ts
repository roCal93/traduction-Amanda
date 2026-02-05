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
