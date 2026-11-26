'use client'

import { useEffect, useRef } from 'react'

export function FadeIn({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (
      !element ||
      element.getBoundingClientRect().top < window.innerHeight ||
      !('IntersectionObserver' in window) ||
      !('animate' in element)
    ) {
      return
    }

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return

      observer.disconnect()
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      element.animate(
        [
          { opacity: 0, transform: 'translateY(40px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 600, easing: 'ease-out' }
      )
    })
    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return <div ref={ref}>{children}</div>
}
