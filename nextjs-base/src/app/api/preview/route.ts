import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')
  const url = searchParams.get('url')
  const status = searchParams.get('status')

  // Vérifier le secret si défini
  if (process.env.PREVIEW_SECRET && secret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 })
  }

  // Comportement configurable : soit utiliser Next.js Draft Mode, soit utiliser uniquement le paramètre ?draft=true
  const useDraftMode = process.env.USE_DRAFT_MODE === 'true'

  // Si on utilise Draft Mode, toujours l'activer en preview (même pour published) pour bypass le cache
  if (useDraftMode) {
    const dm = await draftMode()
    dm.enable()
  }

  // Rediriger vers l'URL fournie par Strapi (sécurisée par secret)
  const baseUrl = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const destinationUrl = url ? new URL(url, baseUrl) : new URL('/', baseUrl)

  // Ajouter le paramètre ?draft=true pour indiquer aux pages de fetcher le bon statut
  if (status !== 'published') {
    destinationUrl.searchParams.set('draft', 'true')
  }

  return NextResponse.redirect(destinationUrl.toString())
}
