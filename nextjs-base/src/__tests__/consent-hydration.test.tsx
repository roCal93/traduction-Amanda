// @vitest-environment jsdom
import { act } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import CookieConsentBanner from '../components/shared/CookieConsentBanner'
import ConditionalAnalytics from '../components/shared/ConditionalAnalytics'

const navigation = vi.hoisted(() => ({ pathname: '/fr' }))

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
}))
vi.mock('@vercel/analytics/react', () => ({
  Analytics: () => <span>Analytics</span>,
}))
vi.mock('@vercel/speed-insights/next', () => ({
  SpeedInsights: () => <span>Speed Insights</span>,
}))

beforeAll(() => vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true))
afterAll(() => vi.unstubAllGlobals())

afterEach(() => {
  document.cookie = 'cookie_consent=; Path=/; Max-Age=0'
  document.body.innerHTML = ''
  navigation.pathname = '/fr'
})

describe('consent hydration', () => {
  it.each([true, false])(
    'hydrates the server consent state (accepted: %s)',
    async (initialAccepted) => {
      const element = <ConditionalAnalytics initialAccepted={initialAccepted} />
      const html = renderToString(element)
      document.cookie = 'cookie_consent=accepted; Path=/'
      const container = document.createElement('div')
      container.innerHTML = html
      document.body.appendChild(container)
      const errors: unknown[] = []
      let root: ReturnType<typeof hydrateRoot>

      await act(async () => {
        root = hydrateRoot(container, element, {
          onRecoverableError: (error) => errors.push(error),
        })
      })

      expect(errors).toEqual([])
      expect(container.textContent).toBe(
        initialAccepted ? 'AnalyticsSpeed Insights' : ''
      )

      if (!initialAccepted) {
        await act(async () => {
          window.dispatchEvent(new Event('cookie-consent-accepted'))
        })
        expect(container.textContent).toBe('AnalyticsSpeed Insights')
      }

      await act(async () => root.unmount())
    }
  )

  it('renders the English banner consistently and updates it on navigation', async () => {
    navigation.pathname = '/en'
    const element = <CookieConsentBanner />
    const container = document.createElement('div')
    container.innerHTML = renderToString(element)
    document.documentElement.lang = 'fr'
    document.body.appendChild(container)
    const errors: unknown[] = []
    let root: ReturnType<typeof hydrateRoot>

    await act(async () => {
      root = hydrateRoot(container, element, {
        onRecoverableError: (error) => errors.push(error),
      })
    })
    expect(errors).toEqual([])
    expect(container.textContent).toContain('We use audience measurement')
    expect(container.querySelector('a')?.getAttribute('href')).toBe(
      '/en/privacy-policy'
    )

    navigation.pathname = '/fr'
    await act(async () => root.render(<CookieConsentBanner />))
    expect(container.textContent).toContain('Nous utilisons des cookies')

    await act(async () => root.unmount())
  })
})
