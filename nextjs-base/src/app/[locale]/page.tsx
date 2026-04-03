import { createStrapiClient } from '@/lib/strapi-client'
import { getPageSEO } from '@/lib/seo'
import { getHreflangAlternates } from '@/lib/hreflang'
import { Layout } from '@/components/layout'
import { Hero } from '@/components/sections/Hero'
import { SectionGeneric } from '@/components/sections/SectionGeneric'
import { PageCollectionResponse, StrapiBlock } from '@/types/strapi'
import { DynamicBlock } from '@/types/custom'

export const dynamic = 'force-dynamic'

const fetchHomePageData = async (locale: string, isDraft: boolean) => {
  const apiToken = isDraft
    ? process.env.STRAPI_PREVIEW_TOKEN || process.env.STRAPI_API_TOKEN
    : process.env.STRAPI_API_TOKEN

  const client = createStrapiClient({
    apiUrl: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
    apiToken,
  })

  let res: PageCollectionResponse = await client.findMany('pages', {
    filters: { slug: { $eq: 'home' } },
    fields: [
      'title',
      'hideTitle',
      'slug',
      'seoTitle',
      'seoDescription',
      'noIndex',
      'locale',
    ],
    populate:
      'sections.blocks.cards.image,sections.blocks.image,sections.blocks.imageDesktop,sections.blocks.buttons.file,sections.blocks.items.images.image,sections.blocks.items.images.link,sections.blocks.examples,sections.blocks.workItems.image,sections.blocks.workItems.categories,sections.blocks.privacyPolicy,seoImage,localizations',
    locale,
    publicationState: isDraft ? 'preview' : 'live',
  })

  // Fallback to 'fr' if not found
  if (!res.data || res.data.length === 0) {
    res = await client.findMany('pages', {
      filters: { slug: { $eq: 'home' } },
      fields: [
        'title',
        'hideTitle',
        'slug',
        'seoTitle',
        'seoDescription',
        'noIndex',
        'locale',
      ],
      populate:
        'sections.blocks.cards.image,sections.blocks.image,sections.blocks.imageDesktop,sections.blocks.buttons.file,sections.blocks.items.images.image,sections.blocks.items.images.link,sections.blocks.examples,sections.blocks.workItems.image,sections.blocks.workItems.categories,sections.blocks.privacyPolicy,seoImage,localizations',
      locale: 'fr',
      publicationState: isDraft ? 'preview' : 'live',
    })
  }

  // If still no data, return fallback
  if (!res.data || res.data.length === 0) {
    return {
      data: [
        {
          id: 1,
          documentId: 'fallback-home',
          title: 'Bienvenue',
          slug: 'home',
          seoTitle: 'Accueil',
          seoDescription: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: "Page d'accueil" }],
            },
          ],
          noIndex: false,
          locale: locale,
          sections: [],
          seoImage: undefined,
        },
      ],
      meta: { pagination: { page: 1, pageSize: 1, pageCount: 1, total: 1 } },
    } as PageCollectionResponse
  }

  return res
}

const getHomePageData = async (locale: string) =>
  fetchHomePageData(locale, false)
// unstable_cache(
//   async (locale: string) => fetchHomePageData(locale, false),
//   ['home-page'],
//   { revalidate: 3600, tags: ['strapi-pages'] }
// )

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // SEO per-locale: fetch home metadata for the active locale
  const seo = await getPageSEO('home', false, locale)

  // Build hreflang alternate links for multilingual SEO
  const res = await getHomePageData(locale)
  const page = res?.data?.[0]
  const localizations = page?.localizations || []
  const allLocales = [
    { locale: page?.locale || locale, slug: 'home' },
    ...localizations.map((loc) => ({
      locale: loc.locale || 'fr',
      slug: 'home',
    })),
  ]
  const alternates = getHreflangAlternates('home', allLocales)

  return {
    ...seo,
    alternates,
  }
}

export default async function HomeLocale({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams?: Promise<{ draft?: string }>
}) {
  const { locale } = await params

  const sparams = searchParams ? await searchParams : undefined
  const isDraft = sparams?.draft === 'true'

  // Bypass cache when Draft Mode is enabled (preview mode) regardless of draft/published status
  const res = isDraft
    ? await fetchHomePageData(locale, true)
    : await getHomePageData(locale)

  const page = res?.data?.[0]

  if (!page) {
    return (
      <Layout locale={locale}>
        <div style={{ color: 'red', padding: 32, textAlign: 'center' }}>
          Erreur : page &quot;home&quot; introuvable dans Strapi pour la locale{' '}
          {locale}.
        </div>
      </Layout>
    )
  }

  const getText = (value: unknown) =>
    typeof value === 'string'
      ? value
      : (value as StrapiBlock[])
          ?.map(
            (block) =>
              block.children?.map((child) => child.text || '').join('') || ''
          )
          .join('\n') || ''

  return (
    <Layout locale={locale}>
      {!page.hideTitle && <Hero title={getText(page.title)} />}

      {page.sections?.map((section, sectionIndex) => (
        <SectionGeneric
          key={section.id}
          identifier={section.identifier}
          title={section.hideTitle ? undefined : section.title}
          blocks={section.blocks as DynamicBlock[]}
          isFirstSection={sectionIndex === 0}
          spacingTop={
            section.spacingTop as
              | 'none'
              | 'small'
              | 'medium'
              | 'large'
              | undefined
          }
          spacingBottom={
            section.spacingBottom as
              | 'none'
              | 'small'
              | 'medium'
              | 'large'
              | undefined
          }
        />
      ))}
    </Layout>
  )
}
