"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, X, ArrowRight, Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations, useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'

export function GlassmorphismNav() {
  const t = useTranslations()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const lastScrollY = useRef(0)

  const currentLocale = useLocale()
  
  const locales = [
    { code: 'ru', name: 'Русский' },
    { code: 'en', name: 'English' },
    { code: 'kz', name: 'Қазақша' }
  ]

  const navigation = [
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.events'), href: '/events' },
    { name: t('nav.initiatives'), href: '/initiatives' },
    { name: t('nav.partners'), href: '/partners' },
    { name: t('nav.media'), href: '/media' },
    { name: t('nav.contacts'), href: '/contacts' },
  ]

  const changeLocale = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPathname = segments.join('/')
    window.location.href = newPathname
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasLoaded(true)
    }, 100)

    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY

        // Only hide/show after scrolling past 50px to avoid flickering at top
        if (currentScrollY > 50) {
          if (currentScrollY > lastScrollY.current && currentScrollY - lastScrollY.current > 5) {
            // Scrolling down - hide navbar
            setIsVisible(false)
          } else if (lastScrollY.current - currentScrollY > 5) {
            // Scrolling up - show navbar
            setIsVisible(true)
          }
        } else {
          // Always show navbar when near top
          setIsVisible(true)
        }

        lastScrollY.current = currentScrollY
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar, { passive: true })

      return () => {
        window.removeEventListener("scroll", controlNavbar)
        clearTimeout(timer)
      }
    }

    return () => clearTimeout(timer)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      <nav
        className={`fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-20 md:-translate-y-24 opacity-0"
        } ${hasLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        style={{
          transition: hasLoaded ? "all 0.5s ease-out" : "opacity 0.8s ease-out, transform 0.8s ease-out",
        }}
      >
        {/* Main Navigation */}
        <div className="w-[90vw] max-w-xs md:max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-3 md:px-6 md:py-2">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center hover:scale-105 transition-transform duration-200 cursor-pointer"
              >
                <div className="text-white font-cormorant font-bold text-lg md:text-xl">GBWC</div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={`/${currentLocale}${item.href}`}
                    className="text-white/80 hover:text-white hover:scale-105 transition-all duration-200 font-medium cursor-pointer text-sm"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Language Selector and CTA Button */}
              <div className="hidden md:flex items-center space-x-4">
                {/* Language Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsLangOpen(!isLangOpen)}
                    className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors p-2"
                  >
                    <Globe size={18} />
                    <span className="text-sm uppercase">{currentLocale}</span>
                  </button>
                  
                  {isLangOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2 space-y-1 z-50">
                      {locales.map((locale) => (
                        <button
                          key={locale.code}
                          onClick={() => {
                            changeLocale(locale.code)
                            setIsLangOpen(false)
                          }}
                          className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                            currentLocale === locale.code
                              ? 'bg-gold text-black font-bold'
                              : 'text-white/80 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {locale.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <Link
                  href={`/${currentLocale}/contacts`}
                  className="relative bg-white hover:bg-gray-50 text-black font-medium px-6 py-2 rounded-full flex items-center transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group"
                >
                  <span className="mr-2 text-sm">{t('nav.contacts')}</span>
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden text-white hover:scale-110 transition-transform duration-200 cursor-pointer"
              >
                <div className="relative w-6 h-6">
                  <Menu
                    size={24}
                    className={`absolute inset-0 transition-all duration-300 ${
                      isOpen ? "opacity-0 rotate-180 scale-75" : "opacity-100 rotate-0 scale-100"
                    }`}
                  />
                  <X
                    size={24}
                    className={`absolute inset-0 transition-all duration-300 ${
                      isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-180 scale-75"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="md:hidden relative">
          {/* Backdrop overlay */}
          <div
            className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-all duration-300 ${
              isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsOpen(false)}
            style={{ top: "0", left: "0", right: "0", bottom: "0", zIndex: -1 }}
          />

          {/* Menu container */}
          <div
            className={`mt-2 w-[90vw] max-w-xs mx-auto transition-all duration-500 ease-out transform-gpu ${
              isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-8 scale-95 pointer-events-none"
            }`}
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl">
              <div className="flex flex-col space-y-1">
                {navigation.map((item, index) => (
                  <Link
                    key={item.name}
                    href={`/${currentLocale}${item.href}`}
                    className={`text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-3 py-3 text-left transition-all duration-300 font-medium cursor-pointer transform hover:scale-[1.02] hover:translate-x-1 ${
                      isOpen ? "animate-mobile-menu-item" : ""
                    }`}
                    style={{
                      animationDelay: isOpen ? `${index * 80 + 100}ms` : "0ms",
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="h-px bg-white/10 my-2" />
                
                {/* Language selector in mobile menu */}
                <div className="px-3 py-3">
                  <p className="text-white/60 text-xs font-medium mb-2">{t('nav.language')}</p>
                  <div className="flex space-x-2">
                    {locales.map((locale) => (
                      <button
                        key={locale.code}
                        onClick={() => {
                          changeLocale(locale.code)
                          setIsOpen(false)
                        }}
                        className={`px-3 py-1 rounded text-xs transition-colors ${
                          currentLocale === locale.code
                            ? 'bg-gold text-black font-bold'
                            : 'bg-white/10 text-white/80 hover:text-white'
                        }`}
                      >
                        {locale.code.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
