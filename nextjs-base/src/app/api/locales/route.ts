import { NextResponse } from 'next/server'
import { getSupportedLocales, defaultLocale } from '@/lib/supported-locales'

export async function GET() {
  const locales = await getSupportedLocales()

  return NextResponse.json(
    { locales, defaultLocale },
    {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=3600',
      },
    }
  )
}
