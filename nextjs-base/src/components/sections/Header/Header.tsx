'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { BurgerMenu } from '@/components/ui/BurgerMenu'
import { LanguageSwitcher } from '@/components/locale/LanguageSwitcher'
import type { StrapiMedia, PageLink } from '@/types/strapi'

export interface HeaderProps {
  logo?: StrapiMedia
  title?: string
  navigation?: PageLink[]
}

export const Header = ({ 
  logo, 
  title = 'My Website', 
  navigation = [] 
}: HeaderProps) => {
  const pathname = usePathname() ?? '/'
  const segments = pathname.split('/')
  const currentLocale = segments[1] === 'fr' || segments[1] === 'en' ? segments[1] : 'fr'

  // Transform PageLink to NavigationLink for easier processing
  const links = navigation
    .filter(link => link.page?.slug) // Only keep links with valid pages
    .map(link => ({
      slug: link.page!.slug,
      label: link.customLabel || link.page!.title,
      isHome: link.page!.slug === 'home'
    }))

  const getLocalizedHref = (slug: string, isHome: boolean) => 
    isHome ? `/${currentLocale}` : `/${currentLocale}/${slug}`
  
  const isActive = (slug: string, isHome: boolean) => {
    const fullHref = getLocalizedHref(slug, isHome)
    return pathname === fullHref
  }

  return (
    <header className="relative flex justify-between items-center p-6 bg-gray-100">
      <Link href={`/${currentLocale}`} prefetch className="flex-1 md:flex-none">
        {logo ? (
          <Image
            src={logo.url}
            alt={logo.alternativeText || title}
            width={logo.width || 180}
            height={logo.height || 60}
            className="cursor-pointer mx-auto md:mx-0"
            priority
          />
        ) : (
          <h1 className="text-2xl font-bold cursor-pointer text-center md:text-left">
            {title.split(' ').map((word, i) => (
              <span key={i} className="block md:inline">
                {word}{i < title.split(' ').length - 1 && ' '}
              </span>
            ))}
          </h1>
        )}
      </Link>
      <div className="hidden md:flex items-center space-x-12">
        <nav className="hidden md:flex space-x-4">
          {links.map((link, index) => (
            <Link key={link.slug || index} href={getLocalizedHref(link.slug, link.isHome)} prefetch>
              <Button 
                variant={isActive(link.slug, link.isHome) ? 'primary' : 'secondary'}
                className={isActive(link.slug, link.isHome) ? 'font-semibold' : ''}
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <LanguageSwitcher />
        </div>
      </div>
      <div className="md:hidden absolute right-6">
        <BurgerMenu links={links} currentLocale={currentLocale} />
      </div>
    </header>
  )
}
