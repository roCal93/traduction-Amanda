import React from 'react'

type SchemaOrgProps = {
  type?: 'Organization' | 'ProfessionalService' | 'LocalBusiness'
  name?: string
  description?: string
  url?: string
  logo?: string
  telephone?: string
  email?: string
  address?: string
  areaServed?: string
  priceRange?: string
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
}: SchemaOrgProps) => {
  const siteUrl =
    url || process.env.NEXT_PUBLIC_SITE_URL || 'https://amandatraduction.com'
  const contactEmail = email || process.env.CONTACT_EMAIL
  const logoUrl = logo || `${siteUrl}/logo.png`

  // Build ProfessionalService schema
  const serviceSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    description,
    url: siteUrl,
    logo: logoUrl,
    image: logoUrl,
    serviceType: 'Translation Services',
    areaServed,
    availableLanguage: ['French', 'English', 'Italian'],
  }

  if (telephone) serviceSchema.telephone = telephone
  if (contactEmail) serviceSchema.email = contactEmail
  if (address) serviceSchema.address = address
  if (priceRange) serviceSchema.priceRange = priceRange

  // Add provider (Amanda as Person)
  serviceSchema.provider = {
    '@type': 'Person',
    name: 'Amanda Fontannaz',
    jobTitle: 'Professional Translator',
    email: contactEmail,
  }

  // Build WebSite schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Amanda Traduction',
    url: siteUrl,
    inLanguage: ['fr', 'en'],
    publisher: {
      '@type': type,
      name,
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
