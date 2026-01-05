'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { LanguageSwitcher } from '@/components/locale/LanguageSwitcher'

export const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname() ?? '/'
  const segments = pathname.split('/')
  const currentLocale = segments[1] === 'fr' || segments[1] === 'en' ? segments[1] : 'fr'

  const getLocalizedHref = (path: string) => `/${currentLocale}${path}`

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <>
      {/* Burger Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
        aria-label="Toggle menu"
      >
        <span className={`block w-6 h-0.5 bg-gray-800 transition-transform ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-gray-800 transition-opacity ${isOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-gray-800 transition-transform ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleMenu}></div>
          <div className="absolute top-0 left-0 w-64 h-full bg-white shadow-lg transform transition-transform">
            <div className="p-6">
              <button onClick={toggleMenu} className="mb-4 text-gray-800">
                ✕
              </button>
              <nav className="flex flex-col space-y-4">
                <Link href={getLocalizedHref('/')} prefetch onClick={toggleMenu}>
                  <Button variant="secondary" className="w-full">Accueil</Button>
                </Link>
                <Link href={getLocalizedHref('/a-propos')} prefetch onClick={toggleMenu}>
                  <Button variant="secondary" className="w-full">À propos</Button>
                </Link>
                <Link href={getLocalizedHref('/services')} prefetch onClick={toggleMenu}>
                  <Button variant="secondary" className="w-full">Services</Button>
                </Link>
                <Link href={getLocalizedHref('/contact')} prefetch onClick={toggleMenu}>
                  <Button variant="secondary" className="w-full">Contact</Button>
                </Link>
                <div className="pt-4 border-t border-gray-200 flex justify-center">
                  <LanguageSwitcher />
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  )
}