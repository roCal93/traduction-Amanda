import { afterEach, describe, expect, it, vi } from 'vitest'
import { GET } from '../app/api/carousel-image/route'

const originalStrapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

afterEach(() => {
  if (originalStrapiUrl === undefined) {
    delete process.env.NEXT_PUBLIC_STRAPI_URL
  } else {
    process.env.NEXT_PUBLIC_STRAPI_URL = originalStrapiUrl
  }
  vi.restoreAllMocks()
})

describe('carousel image proxy', () => {
  it('requests a responsive Cloudinary image and preserves indexing controls', async () => {
    process.env.NEXT_PUBLIC_STRAPI_URL = 'https://strapi.example.com'
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    fetchMock.mockResolvedValueOnce(
      Response.json({
        data: [
          {
            image: {
              url: 'https://res.cloudinary.com/demo/image/upload/v1/test.png',
            },
          },
        ],
      })
    )
    fetchMock.mockResolvedValueOnce(
      new Response('image data', { headers: { 'Content-Type': 'image/webp' } })
    )

    const response = await GET(
      new Request(
        'https://example.com/api/carousel-image?documentId=abc&width=480',
        {
          headers: { Accept: 'image/webp,image/*' },
        }
      )
    )

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'https://res.cloudinary.com/demo/image/upload/c_limit,w_480,h_170,q_auto,f_auto/v1/test.png',
      expect.objectContaining({ headers: { Accept: 'image/webp,image/*' } })
    )
    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('image/webp')
    expect(response.headers.get('Vary')).toBe('Accept')
    expect(response.headers.get('X-Robots-Tag')).toContain('noimageindex')
    expect(await response.text()).toBe('image data')
  })

  it('keeps non-Cloudinary images unchanged', async () => {
    process.env.NEXT_PUBLIC_STRAPI_URL = 'https://strapi.example.com'
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    fetchMock.mockResolvedValueOnce(
      Response.json({ data: [{ image: { url: '/uploads/test.png' } }] })
    )
    fetchMock.mockResolvedValueOnce(new Response('image data'))

    expect(
      (
        await GET(
          new Request(
            'https://example.com/api/carousel-image?documentId=abc&width=256'
          )
        )
      ).status
    ).toBe(200)
    expect(fetchMock.mock.calls[1][0]).toBe(
      'https://strapi.example.com/uploads/test.png'
    )
  })

  it.each(['0', '-1', '257', '1921', '1.5', 'not-a-number'])(
    'rejects invalid width %s without fetching',
    async (width) => {
      const fetchMock = vi.spyOn(globalThis, 'fetch')
      const response = await GET(
        new Request(
          `https://example.com/api/carousel-image?documentId=abc&width=${width}`
        )
      )
      expect(response.status).toBe(400)
      expect(fetchMock).not.toHaveBeenCalled()
    }
  )
})
