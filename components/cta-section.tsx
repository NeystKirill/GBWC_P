"use client"

import { useEffect, useRef } from "react"
import { useLocale } from "next-intl"

const ctaData: Record<string, { title: string; highlight: string; subtitle: string; cta1: string; cta2: string }> = {
  ru: {
    title: "Присоединиться к",
    highlight: "GBWC",
    subtitle: "Расширьте возможности вашего бизнеса через международное сотрудничество с ведущими женщинами-лидерами из 30+ стран.",
    cta1: "Стать партнером",
    cta2: "Связаться с нами",
  },
  en: {
    title: "Join",
    highlight: "GBWC",
    subtitle: "Expand your business opportunities through international cooperation with leading women leaders from 30+ countries.",
    cta1: "Become a Partner",
    cta2: "Contact Us",
  },
  kz: {
    title: "GBWC-ге",
    highlight: "қосылу",
    subtitle: "30-дан астам елдің жетекші әйел-көшбасшыларымен халықаралық ынтымақтастық арқылы бизнесіңіздің мүмкіндіктерін кеңейтіңіз.",
    cta1: "Серіктес болу",
    cta2: "Бізбен байланысу",
  },
}

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null)
  const currentLocale = useLocale()
  const data = ctaData[currentLocale] || ctaData.ru

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll(".fade-in-element")
            elements.forEach((element, index) => {
              setTimeout(() => {
                element.classList.add("animate-fade-in-up")
              }, index * 200)
            })
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="contact" ref={sectionRef} className="relative py-8 px-4 sm:px-6 lg:px-8 mb-32">
      <div className="relative max-w-4xl mx-auto">
        <div className="fade-in-element opacity-0 translate-y-8 transition-all duration-1000 ease-out text-center p-8 md:p-12 rounded-3xl border border-white/20 bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/15%),theme(backgroundColor.white/5%))]">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6 leading-tight">
            {data.title}{" "}
            <span className="font-bold" style={{ background: "linear-gradient(135deg, #c9a96e 0%, #f5e198 50%, #c9a96e 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {data.highlight}
            </span>
          </h3>
          <p className="text-lg text-white/65 mb-10 max-w-xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={"/{currentLocale}/contacts".replace("{currentLocale}", currentLocale)} className="inline-flex items-center gap-2 px-9 py-4 bg-white text-black rounded-full font-semibold text-base hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl">
              {data.cta1}
            </a>
            <a href={"/{currentLocale}/contacts".replace("{currentLocale}", currentLocale)} className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-semibold text-base border border-white/25 text-white hover:bg-white/10 transition-all duration-300">
              {data.cta2}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
