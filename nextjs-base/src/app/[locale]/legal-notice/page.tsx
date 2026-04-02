import { notFound } from 'next/navigation'
import { Layout } from '@/components/layout'
import { fetchAPI } from '@/lib/strapi'
import { defaultLocale } from '@/lib/locales'
import { formatLegalContent } from '@/lib/format-legal-content'
import type { Metadata } from 'next'

type LegalData = {
  title?: string
  content?: string
  lastUpdated?: string
}

type LegalResponse = {
  data?: LegalData | null
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const response = await fetchAPI<LegalResponse>('/legal-notice', {
    locale,
    next: { revalidate: 60 },
    suppressWarnings: true,
  })

  let legal = response?.data

  if (!legal?.title && locale !== defaultLocale) {
    const fallbackResponse = await fetchAPI<LegalResponse>('/legal-notice', {
      locale: defaultLocale,
      next: { revalidate: 60 },
      suppressWarnings: true,
    })
    legal = fallbackResponse?.data
  }

  return {
    title:
      legal?.title || (locale === 'en' ? 'Legal Notice' : 'Mentions légales'),
  }
}

export default async function LegalNoticePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const response = await fetchAPI<LegalResponse>('/legal-notice', {
    locale,
    next: { revalidate: 60 },
  })

  let legal = response?.data

  if ((!legal?.title || !legal?.content) && locale !== defaultLocale) {
    const fallbackResponse = await fetchAPI<LegalResponse>('/legal-notice', {
      locale: defaultLocale,
      next: { revalidate: 60 },
    })
    legal = fallbackResponse?.data
  }

  if (!legal?.title || !legal?.content) {
    notFound()
  }

  return (
    <Layout locale={locale}>
      <section className="relative px-4 py-20 md:py-24">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#F5B5AE] bg-[#FFFDF0]/90 p-6 md:p-10 text-left text-[#4B3A33] shadow-sm">
          <h1 className="mb-6 text-3xl font-semibold md:text-4xl">
            {legal.title}
          </h1>
          {legal.lastUpdated && (
            <p className="mb-6 text-sm text-[#7A6A61]">
              {locale === 'en' ? 'Last updated:' : 'Dernière mise à jour :'}{' '}
              {legal.lastUpdated}
            </p>
          )}
          <article
            className="prose max-w-none prose-headings:text-[#4B3A33] prose-p:text-[#5A4A43]"
            dangerouslySetInnerHTML={{
              __html: formatLegalContent(legal.content || ''),
            }}
          />
        </div>
      </section>
    </Layout>
  )
}
