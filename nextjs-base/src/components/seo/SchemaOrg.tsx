import React from 'react'

type PostalAddress = {
  '@type'?: 'PostalAddress'
  streetAddress?: string
  addressLocality?: string
  postalCode?: string
  addressRegion?: string
  addressCountry?: string
}

type SchemaOrgProps = {
  type?: 'Organization' | 'ProfessionalService' | 'LocalBusiness'
  name?: string
  description?: string
  url?: string
  logo?: string
  telephone?: string
  email?: string
  address?: string | PostalAddress
  areaServed?: string
  priceRange?: string
  sameAs?: string[]
}

export const SchemaOrg = ({
  type = 'ProfessionalService',
  name = 'Amanda Traduction',
  description = "Services de traduction professionnelle de l'anglais et de l'italien vers le français pour les entreprises et les particuliers.",
  url = 'https://www.amandatraduction.com',
  logo,
  email = 'contact@amandatraduction.com',
  address = {
    '@type': 'PostalAddress',
    streetAddress: '21 Route de Tronchine',
    addressLocality: 'Thônes',
    postalCode: '74230',
    addressRegion: 'Auvergne-Rhône-Alpes',
    addressCountry: 'FR',
  },
  areaServed = 'France, Suisse, Italie, Canada',
  priceRange,
  sameAs = ['https://www.linkedin.com/in/amanda-fontannaz-57b820203/'],
}: SchemaOrgProps) => {
  const siteUrl = url
  const contactEmail = email
  const normalizedSiteUrl = siteUrl.replace(/\/$/, '')
  const siteOrigin = /^https?:\/\//.test(normalizedSiteUrl)
    ? new URL(normalizedSiteUrl).origin
    : normalizedSiteUrl
  const logoUrl = logo || `${siteOrigin}/images/logo.png`
  const serviceId = `${siteOrigin}/#service`
  const websiteId = `${siteOrigin}/#website`
  const personId = `${siteOrigin}/#amanda-fontannaz`

  const normalizedAddress =
    typeof address === 'string'
      ? { '@type': 'PostalAddress' as const, streetAddress: address }
      : address

  // Build ProfessionalService schema
  const serviceSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': serviceId,
    name,
    description,
    url: siteUrl,
    logo: logoUrl,
    image: logoUrl,
    areaServed,
    knowsLanguage: ['fr', 'en', 'it'],
  }

  if (contactEmail) serviceSchema.email = contactEmail
  if (normalizedAddress) serviceSchema.address = normalizedAddress
  if (type === 'LocalBusiness' && priceRange)
    serviceSchema.priceRange = priceRange
  if (sameAs?.length) serviceSchema.sameAs = sameAs

  // Use an explicit Person object to satisfy validators expecting founder target type.
  serviceSchema.founder = {
    '@type': 'Person',
    '@id': personId,
    name: 'Amanda Fontannaz',
  }

  const personSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId,
    name: 'Amanda Fontannaz',
    jobTitle: 'Professional Translator',
    email: contactEmail,
    knowsLanguage: ['fr', 'en', 'it'],
  }

  // Build WebSite schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId,
    name: 'Amanda Traduction',
    url: siteUrl,
    inLanguage: ['fr', 'en', 'it'],
    publisher: {
      '@type': type,
      '@id': serviceId,
      name,
      url: siteUrl,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
    </>
  )
}
