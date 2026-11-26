'use client'

import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function ConditionalAnalytics({
  initialAccepted,
}: {
  initialAccepted: boolean
}) {
  const [accepted, setAccepted] = useState(initialAccepted)

  useEffect(() => {
    const handler = () => setAccepted(true)
    window.addEventListener('cookie-consent-accepted', handler)
    return () => window.removeEventListener('cookie-consent-accepted', handler)
  }, [])

  if (!accepted) return null
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  )
}
