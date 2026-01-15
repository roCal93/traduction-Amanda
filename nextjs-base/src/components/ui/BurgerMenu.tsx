'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { LanguageSwitcher } from '@/components/locale/LanguageSwitcher'
import { scrollToAnchor } from '@/lib/anchor' 

interface ProcessedLink {
  slug: string
  label: string
  isHome: boolean
  anchor?: string
}

interface BurgerMenuProps {
  links?: ProcessedLink[]
  currentLocale: string
}

export const BurgerMenu = ({ links = [], currentLocale }: BurgerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname() ?? '/'

  const getLocalizedHref = (slug: string, isHome: boolean, anchor?: string) => {
    const base = isHome ? `/${currentLocale}` : `/${currentLocale}/${slug}`
    return anchor ? `${base}#${anchor}` : base
  }
  
  const isActive = (slug: string, isHome: boolean) => {
    const fullHref = getLocalizedHref(slug, isHome)
    // ignore anchor because pathname doesn't include it
    return pathname === fullHref.split('#')[0]
  }

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleMenuNavClick = (e: React.MouseEvent, link: ProcessedLink) => {
    const href = getLocalizedHref(link.slug, link.isHome, link.anchor)
    const base = href.split('#')[0]
    const currentBase = pathname.split('#')[0]
    if (base === currentBase && link.anchor) {
      e.preventDefault()
      toggleMenu()
      scrollToAnchor(link.anchor)
    } else {
      toggleMenu()
    }
  }

  return (
    <div className="relative md:hidden">
      <button
        onClick={toggleMenu}
        className="flex flex-col justify-center items-center w-8 h-8 space-y-1"
        aria-label="Toggle menu"
      >
        <span className={`block w-6 h-0.5 bg-gray-800 transition-transform ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-gray-800 transition-opacity ${isOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-gray-800 transition-transform ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={toggleMenu}></div>
          <div className="absolute right-0 top-12 w-64 bg-white shadow-lg rounded-lg z-50 border border-gray-200">
            <nav className="flex flex-col p-4 space-y-2">
              {links.map((link, index) => (
                <Link key={link.slug || index} href={getLocalizedHref(link.slug, link.isHome, link.anchor)} prefetch onClick={(e) => handleMenuNavClick(e, link)}>
                  <Button 
                    variant={isActive(link.slug, link.isHome) ? 'primary' : 'secondary'} 
                    className={`w-full ${isActive(link.slug, link.isHome) ? 'font-semibold' : ''}`}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))} 
              <div className="pt-2 border-t border-gray-200 flex justify-center">
                <LanguageSwitcher />
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  )
}