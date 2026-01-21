import { describe, it, expect } from 'vitest'
import { buildMetadata } from './seo'

describe('buildMetadata', () => {
  it('builds basic metadata', () => {
    const result = buildMetadata({
      title: 'Test Title',
      description: 'Test Description',
      url: 'https://example.com',
    })

    expect(result.title).toBe('Test Title')
    expect(result.description).toBe('Test Description')
    expect(result.robots).toBe('index, follow')
    expect(result.alternates?.canonical).toBe('https://example.com')
    expect(result.openGraph?.title).toBe('Test Title')
    expect(result.openGraph?.url).toBe('https://example.com')
    expect(result.twitter?.title).toBe('Test Title')
  })

  it('handles noIndex', () => {
    const result = buildMetadata({
      title: 'Test',
      noIndex: true,
    })

    expect(result.robots).toBe('noindex, nofollow')
  })

  it('handles alternates', () => {
    const result = buildMetadata({
      title: 'Test',
      alternates: [
        { hreflang: 'en', href: 'https://example.com/en' },
        { hreflang: 'fr', href: 'https://example.com/fr' },
      ],
    })

    expect(result.alternates?.languages).toEqual({
      en: 'https://example.com/en',
      fr: 'https://example.com/fr',
    })
  })

  it('handles image', () => {
    const result = buildMetadata({
      title: 'Test',
      image: 'https://example.com/image.jpg',
    })

    // openGraph.images can be an object or an array; normalize to array for assertions
    const ogImages = Array.isArray(result.openGraph?.images)
      ? result.openGraph?.images
      : result.openGraph?.images
      ? [result.openGraph?.images]
      : []

    const firstOg = ogImages[0]
    const ogUrl = typeof firstOg === 'string' ? firstOg : (firstOg as any)?.url
    expect(ogUrl).toBe('https://example.com/image.jpg')
    if (typeof firstOg !== 'string') {
      expect((firstOg as any).width).toBe(1200)
      expect((firstOg as any).height).toBe(630)
    }

    // twitter.images can be a string or an array; normalize to array
    const twImages = Array.isArray(result.twitter?.images)
      ? result.twitter?.images
      : result.twitter?.images
      ? [result.twitter?.images]
      : []

    expect(twImages[0]).toBe('https://example.com/image.jpg')
  })
})
