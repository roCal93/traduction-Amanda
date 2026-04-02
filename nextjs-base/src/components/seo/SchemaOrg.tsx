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
  url,
  logo,
  telephone,
  email,
  address,
  areaServed = 'France, Suisse, Italie, Canada',
  priceRange,
  sameAs,
}: SchemaOrgProps) => {
  const siteUrl =
    url || process.env.NEXT_PUBLIC_SITE_URL || 'https://amandatraduction.com'
  const contactEmail =
    email || process.env.NEXT_PUBLIC_CONTACT_EMAIL || process.env.CONTACT_EMAIL
  const normalizedSiteUrl = siteUrl.replace(/\/$/, '')
  const siteOrigin = /^https?:\/\//.test(normalizedSiteUrl)
    ? new URL(normalizedSiteUrl).origin
    : normalizedSiteUrl
  const logoUrl = logo || `${siteOrigin}/images/logo.png`
  const serviceId = `${siteOrigin}/#service`
  const websiteId = `${siteOrigin}/#website`

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
    serviceType: 'Translation Services',
    areaServed,
    availableLanguage: ['fr', 'en', 'it'],
  }

  if (telephone) serviceSchema.telephone = telephone
  if (contactEmail) serviceSchema.email = contactEmail
  if (normalizedAddress) serviceSchema.address = normalizedAddress
  if (type === 'LocalBusiness' && priceRange)
    serviceSchema.priceRange = priceRange
  if (sameAs?.length) serviceSchema.sameAs = sameAs

  // Add provider (Amanda as Person)
  serviceSchema.provider = {
    '@type': 'Person',
    name: 'Amanda Fontannaz',
    jobTitle: 'Professional Translator',
    email: contactEmail,
  }
  serviceSchema.founder = {
    '@type': 'Person',
    name: 'Amanda Fontannaz',
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
    </>
  )
}
