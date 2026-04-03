import { notFound } from 'next/navigation'
import { Layout } from '@/components/layout'
import { fetchAPI } from '@/lib/strapi'
import { defaultLocale } from '@/lib/locales'
import { formatLegalContent } from '@/lib/format-legal-content'
import type { Metadata } from 'next'

type PolicyData = {
  title?: string
  content?: string
  lastUpdated?: string
}

type PolicyResponse = {
  data?: PolicyData | null
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const response = await fetchAPI<PolicyResponse>('/privacy-policy', {
    locale,
    next: { revalidate: 60 },
    suppressWarnings: true,
  })

  let policy = response?.data

  if (!policy?.title && locale !== defaultLocale) {
    const fallbackResponse = await fetchAPI<PolicyResponse>('/privacy-policy', {
      locale: defaultLocale,
      next: { revalidate: 60 },
      suppressWarnings: true,
    })
    policy = fallbackResponse?.data
  }

  return {
    title:
      policy?.title ||
      (locale === 'en' ? 'Privacy Policy' : 'Politique de confidentialité'),
  }
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const response = await fetchAPI<PolicyResponse>('/privacy-policy', {
    locale,
    next: { revalidate: 60 },
  })

  let policy = response?.data

  if ((!policy?.title || !policy?.content) && locale !== defaultLocale) {
    const fallbackResponse = await fetchAPI<PolicyResponse>('/privacy-policy', {
      locale: defaultLocale,
      next: { revalidate: 60 },
    })
    policy = fallbackResponse?.data
  }

  if (!policy?.title || !policy?.content) {
    notFound()
  }

  return (
    <Layout locale={locale}>
      <section className="relative px-4 py-20 md:py-24">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#F5B5AE] bg-[#FFFDF0]/90 p-6 md:p-10 text-left text-[#4B3A33] shadow-sm">
          <h1 className="mb-6 text-3xl font-semibold md:text-4xl">
            {policy.title}
          </h1>
          {policy.lastUpdated && (
            <p className="mb-6 text-sm text-[#7A6A61]">
              {locale === 'en' ? 'Last updated:' : 'Dernière mise à jour :'}{' '}
              {new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              }).format(new Date(policy.lastUpdated))}
            </p>
          )}
          <article
            className="prose max-w-none prose-headings:text-[#4B3A33] prose-p:text-[#5A4A43]"
            dangerouslySetInnerHTML={{
              __html: formatLegalContent(policy.content || ''),
            }}
          />
        </div>
      </section>
    </Layout>
  )
}
