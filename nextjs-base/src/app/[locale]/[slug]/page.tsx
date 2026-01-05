import { createStrapiClient } from '@/lib/strapi-client'
import { buildMetadata, type Hreflang } from '@/lib/seo' 
import { Layout } from '@/components/layout'
import { Hero } from '@/components/sections/Hero'
import { SectionGeneric } from '@/components/sections/SectionGeneric'
import { PageCollectionResponse, StrapiBlock, StrapiEntity, Page as PageType } from '@/types/strapi'
import { notFound, redirect } from 'next/navigation'
import { locales as SUPPORTED_LOCALES } from '@/lib/locales'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'

type SupportedLocale = typeof SUPPORTED_LOCALES[number]

export const revalidate = 3600 // Revalidate every hour as fallback

const fetchPageData = async (slug: string, locale: string, isDraft: boolean) => {
  const apiToken = isDraft
    ? (process.env.STRAPI_PREVIEW_TOKEN || process.env.STRAPI_API_TOKEN)
    : process.env.STRAPI_API_TOKEN

  const client = createStrapiClient({ apiUrl: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337', apiToken })

  const pageRes: PageCollectionResponse = await client.findMany('pages', {
    filters: { slug: { $eq: slug } },
    fields: ['title', 'hideTitle', 'slug', 'heroContent', 'seoTitle', 'seoDescription', 'noIndex', 'locale'],
    populate: {
      sections: {
        fields: ['title', 'hideTitle', 'content', 'order', 'reverse'],
        populate: { 
          image: { 
            fields: ['url', 'alternativeText', 'width', 'height', 'formats'] 
          } 
        } 
      }, 
      seoImage: { 
        fields: ['url', 'alternativeText', 'width', 'height', 'formats'] 
      }, 
      localizations: { 
        fields: ['slug', 'locale'] 
      } 
    },
    locale,
    publicationState: isDraft ? 'preview' : 'live',
  })

  return pageRes
}

const fetchPageDataFallback = async (slug: string, isDraft: boolean) => {
  const apiToken = isDraft
    ? (process.env.STRAPI_PREVIEW_TOKEN || process.env.STRAPI_API_TOKEN)
    : process.env.STRAPI_API_TOKEN

  const client = createStrapiClient({ apiUrl: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337', apiToken })

  const fallbackRes: PageCollectionResponse = await client.findMany('pages', {
    filters: { slug: { $eq: slug } },
    fields: ['title', 'hideTitle', 'slug', 'heroContent', 'seoTitle', 'seoDescription', 'noIndex', 'locale'],
    populate: {
      sections: {
        fields: ['title', 'hideTitle', 'content', 'order', 'reverse'],
        populate: { 
          image: { 
            fields: ['url', 'alternativeText', 'width', 'height', 'formats'] 
          } 
        } 
      }, 
      seoImage: { 
        fields: ['url', 'alternativeText', 'width', 'height', 'formats'] 
      }, 
      localizations: { 
        fields: ['slug', 'locale'] 
      } 
    },
    publicationState: isDraft ? 'preview' : 'live',
  })

  return fallbackRes
}

const getPageData = unstable_cache(
  async (slug: string, locale: string) => fetchPageData(slug, locale, false),
  ['page-data'],
  { revalidate: 3600, tags: ['strapi-pages'] }
)

const getPageDataFallback = unstable_cache(
  async (slug: string) => fetchPageDataFallback(slug, false),
  ['page-data-fallback'],
  { revalidate: 3600, tags: ['strapi-pages'] }
)

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug, locale } = await params

  const client = createStrapiClient({ apiUrl: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337', apiToken: process.env.STRAPI_API_TOKEN })
  const res: PageCollectionResponse = await client.findMany('pages', {
    filters: { slug: { $eq: slug } },
    fields: ['title', 'slug', 'seoTitle', 'seoDescription', 'noIndex', 'locale'],
    populate: { 
      seoImage: { 
        fields: ['url', 'alternativeText', 'width', 'height', 'formats'] 
      }, 
      localizations: { 
        fields: ['slug', 'locale'] 
      } 
    },
    locale,
  })

  const page = res?.data?.[0]
  if (!page) return {}

  const siteBase = (process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? 'https://example.com').replace(/\/$/, '')

  const pageLocalizations = page.localizations ?? []

  const alternates: Hreflang[] = [
    {
      hreflang: page.locale || 'fr',
      href: `${siteBase}/${page.locale || 'fr'}/${slug}`,
    },
    ...pageLocalizations.map((loc: PageType & StrapiEntity) => ({
      hreflang: loc.locale || 'fr',
      href: `${siteBase}/${loc.locale || 'fr'}/${slug}`,
    })),
  ]

  const description = Array.isArray(page.seoDescription)
    ? page.seoDescription?.[0]?.children?.[0]?.text ?? undefined
    : typeof page.seoDescription === 'string' ? page.seoDescription : undefined

  return buildMetadata({
    title: page.seoTitle || page.title,
    description,
    image: page.seoImage?.url,
    noIndex: page.noIndex,
    url: `${siteBase}/${page.locale}/${slug}`,
    alternates,
  })
}

export const dynamicParams = true // Allow dynamic params for pages that might not exist yet

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string; slug: string }>, searchParams?: { draft?: string } | Promise<{ draft?: string }> }) {
  const { locale, slug } = await params

  if (!SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    notFound()
  }

  // Redirige /[locale]/home vers /[locale]
  if (slug === 'home') {
    redirect(`/${locale}`)
  }

  const sparams = searchParams ? await Promise.resolve(searchParams) : undefined
  const { isEnabled } = await draftMode()
  const isDraft = (sparams?.draft === 'true') || false

  // Bypass cache when Draft Mode is enabled (preview mode) regardless of draft/published status
  const pageRes = isEnabled || isDraft
    ? await fetchPageData(slug, locale, isDraft)
    : await getPageData(slug, locale)

  if (!pageRes.data.length) {
    // Fallback: try without locale (global)
    const fallbackRes = isEnabled || isDraft
      ? await fetchPageDataFallback(slug, isDraft)
      : await getPageDataFallback(slug)

    if (!fallbackRes.data.length) {
      // Nothing found in any locale → show 404 page
      notFound()
    }

    const fallbackPage = fallbackRes.data[0]

    // Redirect to the page in its original locale
    redirect(`/${fallbackPage.locale}/${slug}`)
  }

  const page = pageRes.data[0]
  const sections = (page.sections || []).sort((a, b) => (a.order || 0) - (b.order || 0))

  // Helper function to extract text from Strapi blocks
  const extractTextFromBlocks = (blocks: StrapiBlock[]): string => {
    return blocks
      .map(block =>
        block.children
          ?.map(child => child.text || '')
          .join('') || ''
      )
      .join('\n')
  }

  return (
    <Layout locale={locale}>
      {!page.hideTitle && (
        <Hero
          title={page.title || ''}
          subtitle={page.heroContent ? extractTextFromBlocks(page.heroContent) : undefined}
        />
      )}

      {sections.map((section, index) => (
        <SectionGeneric
          key={section.id}
          title={section.hideTitle ? undefined : section.title}
          content={section.content}
          image={section.image?.url}
          reverse={section.reverse}
          priority={index === 0}
        />
      ))}
    </Layout>
  )
}
