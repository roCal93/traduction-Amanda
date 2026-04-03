'use client'

import { useMemo, useState } from 'react'

const CONSENT_COOKIE_NAME = 'cookie_consent'
const ONE_YEAR = 60 * 60 * 24 * 365

function setConsentCookie(value: 'accepted' | 'rejected') {
  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`
}

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(true)

  const isEn = useMemo(() => {
    if (typeof document === 'undefined') return false
    return document.documentElement.lang?.toLowerCase().startsWith('en')
  }, [])

  const labels = isEn
    ? {
        text: 'We use audience measurement cookies to improve the website. You can accept or refuse these cookies.',
        learnMore: 'Privacy policy',
        learnMoreHref: '/en/privacy-policy',
        accept: 'Accept',
        reject: 'Refuse',
      }
    : {
        text: "Nous utilisons des cookies de mesure d'audience pour améliorer le site. Vous pouvez accepter ou refuser ces cookies.",
        learnMore: 'Politique de confidentialité',
        learnMoreHref: '/fr/privacy-policy',
        accept: 'Accepter',
        reject: 'Refuser',
      }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[300] px-4 pb-4">
      <div className="mx-auto max-w-4xl rounded-xl border border-[#F5B5AE] bg-[#FFF8D9]/95 p-4 text-[#4B3A33] shadow-xl backdrop-blur-sm">
        <p className="text-sm leading-relaxed">
          {labels.text}{' '}
          <a
            href={labels.learnMoreHref}
            className="underline hover:opacity-75 text-[#7A4E45]"
          >
            {labels.learnMore}
          </a>
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setConsentCookie('rejected')
              setVisible(false)
            }}
            className="rounded-full border border-[#EAA39B] px-5 py-2 text-sm font-medium text-[#7A4E45] transition-colors hover:bg-[#FFEFE9]"
          >
            {labels.reject}
          </button>
          <button
            type="button"
            onClick={() => {
              setConsentCookie('accepted')
              setVisible(false)
              window.dispatchEvent(new Event('cookie-consent-accepted'))
            }}
            className="rounded-full bg-[#F88379] px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-[#e67369]"
          >
            {labels.accept}
          </button>
        </div>
      </div>
    </div>
  )
}
