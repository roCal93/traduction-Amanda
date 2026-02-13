'use client'

import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  const pathname = usePathname()
  const segments = pathname?.split('/').filter(Boolean) || []
  const locale =
    segments[0] === 'en' || segments[0] === 'fr' || segments[0] === 'it'
      ? segments[0]
      : 'fr'

  const content = {
    fr: {
      title: '404',
      message: "Cette page n'existe pas.",
      button: "Retour à l'accueil",
    },
    en: {
      title: '404',
      message: "This page doesn't exist.",
      button: 'Back to home',
    },
    it: {
      title: '404',
      message: 'Questa pagina non esiste.',
      button: 'Torna alla home',
    },
  }

  const text = content[locale as 'fr' | 'en' | 'it']

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: '#FFF1F1',
      }}
      aria-labelledby="notfound-title"
    >
      <h1
        id="notfound-title"
        style={{ fontSize: '3rem', marginBottom: '1rem' }}
      >
        {text.title}
      </h1>

      <p style={{ marginBottom: '1.5rem', color: '#374151' }}>{text.message}</p>

      <Button href={`/${locale}`}>{text.button}</Button>
    </main>
  )
}
