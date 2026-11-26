// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FadeIn } from '../components/animations/FadeIn'

let intersectionCallback: IntersectionObserverCallback
const observe = vi.fn()
const disconnect = vi.fn()
const animate = vi.fn()
const originalAnimate = Object.getOwnPropertyDescriptor(
  Element.prototype,
  'animate'
)

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: IntersectionObserverCallback) {
        intersectionCallback = callback
      }
      observe = observe
      disconnect = disconnect
    }
  )
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: false }))
  )
  Object.defineProperty(Element.prototype, 'animate', {
    configurable: true,
    value: animate,
  })
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  if (originalAnimate) {
    Object.defineProperty(Element.prototype, 'animate', originalAnimate)
  } else {
    Reflect.deleteProperty(Element.prototype, 'animate')
  }
  observe.mockReset()
  disconnect.mockReset()
  animate.mockReset()
})

function setTop(top: number) {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    top,
    bottom: top + 100,
    left: 0,
    right: 100,
    width: 100,
    height: 100,
    x: 0,
    y: top,
    toJSON: () => ({}),
  })
}

function enterViewport() {
  intersectionCallback(
    [{ isIntersecting: true } as IntersectionObserverEntry],
    {} as IntersectionObserver
  )
}

describe('FadeIn', () => {
  it('renders visible content in server HTML', () => {
    expect(renderToString(<FadeIn>Important content</FadeIn>)).toBe(
      '<div>Important content</div>'
    )
  })

  it('does not animate content already in the viewport', () => {
    setTop(100)
    render(<FadeIn>Important content</FadeIn>)
    expect(observe).not.toHaveBeenCalled()
    expect(animate).not.toHaveBeenCalled()
  })

  it('animates initially offscreen content only when it enters the viewport', () => {
    setTop(window.innerHeight + 100)
    const { getByText } = render(<FadeIn>Later content</FadeIn>)
    expect(observe).toHaveBeenCalledWith(getByText('Later content'))
    expect(animate).not.toHaveBeenCalled()

    enterViewport()
    expect(disconnect).toHaveBeenCalled()
    expect(animate).toHaveBeenCalledWith(
      [
        { opacity: 0, transform: 'translateY(40px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 600, easing: 'ease-out' }
    )
  })

  it('does not animate when reduced motion is requested', () => {
    setTop(window.innerHeight + 100)
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true }))
    )
    render(<FadeIn>Later content</FadeIn>)
    enterViewport()
    expect(animate).not.toHaveBeenCalled()
  })
})
