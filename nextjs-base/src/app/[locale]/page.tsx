import { createStrapiClient } from '@/lib/strapi-client'
import { getPageSEO } from '@/lib/seo'
import { cleanImageUrl } from '@/lib/strapi'
import { Layout } from '@/components/layout'
import { Hero } from '@/components/sections/Hero'
import { SectionGeneric } from '@/components/sections/SectionGeneric'
import { PageCollectionResponse, StrapiBlock } from '@/types/strapi'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'

export const revalidate = 3600 // Revalidate every hour as fallback

const fetchHomePageData = async (locale: string, isDraft: boolean) => {
  const apiToken = isDraft
    ? (process.env.STRAPI_PREVIEW_TOKEN || process.env.STRAPI_API_TOKEN)
    : process.env.STRAPI_API_TOKEN

  const client = createStrapiClient({ apiUrl: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337', apiToken })

  let res: PageCollectionResponse = await client.findMany('pages', {
    filters: { slug: { $eq: 'home' } },
    fields: ['title', 'hideTitle', 'slug', 'heroContent', 'seoTitle', 'seoDescription', 'noIndex', 'locale'],
    populate: { 
      sections: { 
        populate: '*' 
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

  // Fallback to 'fr' if not found
  if (!res.data || res.data.length === 0) {
    res = await client.findMany('pages', {
      filters: { slug: { $eq: 'home' } },
      fields: ['title', 'hideTitle', 'slug', 'heroContent', 'seoTitle', 'seoDescription', 'noIndex', 'locale'],
      populate: { 
        sections: { 
          populate: '*' 
        } 
      },
      locale: 'fr',
      publicationState: isDraft ? 'preview' : 'live',
    })
  }

  // If still no data, return fallback
  if (!res.data || res.data.length === 0) {
    return {
      data: [{
        id: 1,
        documentId: 'fallback-home',
        title: 'Bienvenue',
        slug: 'home',
        heroContent: [{ type: 'paragraph', children: [{ type: 'text', text: 'Site en construction' }] }],
        seoTitle: 'Accueil',
        seoDescription: [{ type: 'paragraph', children: [{ type: 'text', text: 'Page d\'accueil' }] }],
        noIndex: false,
        locale: locale,
        sections: [],
        seoImage: undefined
      }],
      meta: { pagination: { page: 1, pageSize: 1, pageCount: 1, total: 1 } }
    } as PageCollectionResponse
  }

  return res
}

const getHomePageData = unstable_cache(
  async (locale: string) => fetchHomePageData(locale, false),
  ['home-page'],
  { revalidate: 3600, tags: ['strapi-pages'] }
)

export async function generateMetadata({ params }: { params: { locale: string } | Promise<{ locale: string }> }) {
  const { locale } = await Promise.resolve(params)
  
  // Fetch home data to get the first image for preload
  const res = await getHomePageData(locale)
  const page = res?.data?.[0]
  const firstImage = page?.sections?.[0]?.image
  
  const links: { rel: string; href: string; as?: string }[] = []
  
  if (firstImage) {
    const imageUrl = cleanImageUrl(firstImage.url)
    if (imageUrl) {
      const fullUrl = imageUrl.startsWith('/') 
        ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${imageUrl}` 
        : imageUrl
      links.push({
        rel: 'preload',
        href: fullUrl,
        as: 'image'
      })
    }
  }
  
  // SEO per-locale: fetch home metadata for the active locale
  const seo = await getPageSEO('home', false, locale)
  
  return {
    ...seo,
    other: links
  }
}

export default async function HomeLocale({ params, searchParams }: { params: Promise<{ locale: string }>, searchParams?: { draft?: string } | Promise<{ draft?: string }> }) {
  const { locale } = await params

  const sparams = searchParams ? await Promise.resolve(searchParams) : undefined
  const { isEnabled } = await draftMode()
  const isDraft = (sparams?.draft === 'true')

  // Bypass cache when Draft Mode is enabled (preview mode) regardless of draft/published status
  const res = isEnabled || isDraft
    ? await fetchHomePageData(locale, isDraft)
    : await getHomePageData(locale)

  const page = res?.data?.[0]

  if (!page) {
    return (
      <Layout locale={locale}>
        <div style={{ color: 'red', padding: 32, textAlign: 'center' }}>
          Erreur : page &quot;home&quot; introuvable dans Strapi pour la locale {locale}.
        </div>
      </Layout>
    )
  }

  type RichTextValue = { children?: { text?: string }[] }[]
  const getText = (value: unknown) =>
    typeof value === 'string'
      ? value
      : ((value as StrapiBlock[])?.map(block =>
          block.children?.map(child => child.text || '').join('') || ''
        ).join('\n') || '')

  return (
    <Layout locale={locale}>
      {!page.hideTitle && (
        <Hero
          title={getText(page.title)}
          subtitle={getText(page.heroContent)}
        />
      )}

      {page.sections?.map((section, index) => (
        <SectionGeneric
          key={section.id}
          title={section.hideTitle ? undefined : section.title}
          content={section.content}
          image={section.image}
          reverse={section.reverse}
          priority={index === 0}
        />
      ))}
    </Layout>
  )
}
