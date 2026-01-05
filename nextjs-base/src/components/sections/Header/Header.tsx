'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { BurgerMenu } from '@/components/ui/BurgerMenu'
import { LanguageSwitcher } from '@/components/locale/LanguageSwitcher'

export const Header = () => {
  const pathname = usePathname() ?? '/'
  const segments = pathname.split('/')
  const currentLocale = segments[1] === 'fr' || segments[1] === 'en' ? segments[1] : 'fr'

  const getLocalizedHref = (path: string) => `/${currentLocale}${path}`

  return (
    <header className="flex justify-between items-center p-6 bg-gray-100">
      <BurgerMenu />
      <Link href={`/${currentLocale}`} prefetch>
        <h1 className="text-2xl font-bold cursor-pointer">Hakuna Mataweb</h1>
      </Link>
      <div className="flex items-center space-x-12">
        <nav className="hidden md:flex space-x-4">
          <Link href={getLocalizedHref('/a-propos')} prefetch>
            <Button variant="secondary">À propos</Button>
          </Link>
          <Link href={getLocalizedHref('/services')} prefetch>
            <Button variant="secondary">Services</Button>
          </Link>
          <Link href={getLocalizedHref('/contact')} prefetch>
            <Button variant="secondary">Contact</Button>
          </Link>
        </nav>
        <div className="hidden md:block">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}
