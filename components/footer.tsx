"use client"
import type React from "react"
import type { ComponentProps, ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from "lucide-react"
import Image from "next/image"
import { useTranslations } from 'next-intl'

interface FooterLink {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>  
}

interface FooterSection {
  label: string
  links: FooterLink[]
}

export function Footer() {
  const t = useTranslations()
  
  const footerLinks: FooterSection[] = [
    {
      label: "GBWC",
      links: [
        { title: t('nav.about'), href: '/about' },
        { title: t('nav.events'), href: '/events' },
        { title: t('nav.initiatives'), href: '/initiatives' },
        { title: t('nav.partners'), href: '/partners' },
      ],
    },
    {
      label: t('footer.secretariat'),
      links: [
        { title: t('footer.head'), href: '#' },
        { title: t('footer.assistant'), href: '#' },
      ],
    },
    {
      label: "Social",
      links: [
        { title: "Facebook", href: "#", icon: FacebookIcon },
        { title: "Instagram", href: "#", icon: InstagramIcon },
        { title: "LinkedIn", href: "#", icon: LinkedinIcon },
      ],
    },
  ]

  return (
    <footer className="md:rounded-t-6xl relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t border-gray-700 bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)] px-6 py-12 lg:py-16">
      <div className="bg-foreground/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

      <div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
        <AnimatedContainer className="space-y-4">
          <div className="text-white font-cormorant font-bold text-2xl">GBWC</div>
          <p className="text-gray-400 text-sm max-w-xs">{t('footer.about')}</p>
          <div className="text-gray-500 mt-8 text-xs md:mt-0 md:block hidden">
            <p>{t('footer.rights')}</p>
          </div>
        </AnimatedContainer>

        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-3 xl:col-span-2 xl:mt-0">
          {footerLinks.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
              <div className="mb-10 md:mb-0">
                <h3 className="text-xs text-white font-bold uppercase">{section.label}</h3>
                <ul className="text-gray-400 mt-4 space-y-2 text-sm">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <a
                        href={link.href}
                        className="hover:text-gold inline-flex items-center transition-all duration-300"
                      >
                        {link.icon && <link.icon className="me-1 size-4" />}
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>

      <div className="md:hidden mt-8 text-center space-y-2">
        <p className="text-gray-500 text-xs">{t('footer.rights')}</p>
      </div>

      <div className="hidden md:block mt-8 pt-6 border-t border-gray-700 w-full">
        <p className="text-gray-600 text-xs text-center">Global Businesswomen Council © 2023-2025</p>
      </div>
    </footer>
  )
}

type ViewAnimationProps = {
  delay?: number
  className?: ComponentProps<typeof motion.div>["className"]
  children: ReactNode
}

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion()

  // Always render the same DOM structure (motion.div) to avoid server/client
  // hydration mismatches. useReducedMotion() returns null on the server and a
  // boolean on the client, so conditionally returning `children` (no wrapper)
  // vs <motion.div> (with wrapper) causes a <div> mismatch during hydration.
  return (
    <motion.div
      initial={shouldReduceMotion ? false : { filter: "blur(4px)", translateY: -8, opacity: 0 }}
      whileInView={shouldReduceMotion ? {} : { filter: "blur(0px)", translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={shouldReduceMotion ? {} : { delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}