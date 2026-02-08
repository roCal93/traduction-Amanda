import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  const previewTokenPresent = !!process.env.STRAPI_PREVIEW_TOKEN
  const previewSecretPresent = !!process.env.PREVIEW_SECRET
  const tokenLen = process.env.STRAPI_PREVIEW_TOKEN ? process.env.STRAPI_PREVIEW_TOKEN.length : 0
  const secretLen = process.env.PREVIEW_SECRET ? process.env.PREVIEW_SECRET.length : 0

  return NextResponse.json({
    previewTokenPresent,
    previewSecretPresent,
    tokenLen,
    secretLen,
  })
}
