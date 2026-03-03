"use client"

import { useEffect, useRef } from "react"
import { useLocale } from "next-intl"

const GlobeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
)
const TrendingIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)
const HeartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)
const LinkIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
)

const featuresData = {
  ru: {
    eyebrow: "Ключевые направления",
    title: "Что делает GBWC",
    subtitle: "Четыре стратегических направления для развития международного бизнеса и социальных инвестиций",
    items: [
      {
        icon: "globe",
        title: "Пленарные заседания",
        desc: "Международные диалоговые платформы, объединяющие женщин-лидеров бизнеса, инвесторов и политиков для обмена опытом и налаживания партнёрств.",
        stat: "3 заседания",
        statLabel: "проведено с 2023 года",
      },
      {
        icon: "trending",
        title: "Зелёные инвестиции",
        desc: "Продвижение устойчивых и ответственных инвестиций. Создание инвестиционных возможностей в социальной и экологической сферах.",
        stat: "30+ стран",
        statLabel: "охвачено участием",
      },
      {
        icon: "heart",
        title: "Социальные проекты",
        desc: "Реализация конкретных инициатив: Центр поддержки семей в Алматы, международные культурные обмены, проекты в сфере образования.",
        stat: "2024–2025",
        statLabel: "реализованные проекты",
      },
      {
        icon: "link",
        title: "Международные связи",
        desc: "Расширение коммуникаций между бизнесом, государством и международными организациями. Создание долгосрочных партнёрств.",
        stat: "70+ участников",
        statLabel: "на каждом заседании",
      },
    ],
  },
  en: {
    eyebrow: "Key Areas",
    title: "What GBWC Does",
    subtitle: "Four strategic directions for developing international business and social investments",
    items: [
      {
        icon: "globe",
        title: "Plenary Sessions",
        desc: "International dialogue platforms bringing together women business leaders, investors and policymakers for knowledge exchange and partnership building.",
        stat: "3 sessions",
        statLabel: "held since 2023",
      },
      {
        icon: "trending",
        title: "Green Investments",
        desc: "Promoting sustainable and responsible investments. Creating investment opportunities in social and environmental spheres.",
        stat: "30+ countries",
        statLabel: "represented",
      },
      {
        icon: "heart",
        title: "Social Projects",
        desc: "Implementing concrete initiatives: Family Support Center in Almaty, international cultural exchanges, education projects.",
        stat: "2024–2025",
        statLabel: "implemented projects",
      },
      {
        icon: "link",
        title: "International Connections",
        desc: "Expanding communication between business, government and international organizations. Creating long-term partnerships.",
        stat: "70+ participants",
        statLabel: "per session",
      },
    ],
  },
  kz: {
    eyebrow: "Негізгі бағыттар",
    title: "GBWC не істейді",
    subtitle: "Халықаралық бизнес пен әлеуметтік инвестицияларды дамытудың төрт стратегиялық бағыты",
    items: [
      {
        icon: "globe",
        title: "Пленарлық отырыстар",
        desc: "Бизнес-көшбасшыларды, инвесторларды және саясаткерлерді тәжірибе алмасу үшін біріктіретін халықаралық диалог платформалары.",
        stat: "3 отырыс",
        statLabel: "2023 жылдан бері",
      },
      {
        icon: "trending",
        title: "Жасыл инвестициялар",
        desc: "Тұрақты инвестицияларды ілгерілету. Әлеуметтік және экологиялық салалардағы инвестициялық мүмкіндіктерді қалыптастыру.",
        stat: "30+ ел",
        statLabel: "қамтылды",
      },
      {
        icon: "heart",
        title: "Әлеуметтік жобалар",
        desc: "Нақты бастамаларды жүзеге асыру: Алматыдағы отбасыларды қолдау орталығы, халықаралық мәдени алмасулар.",
        stat: "2024–2025",
        statLabel: "жүзеге асырылған жобалар",
      },
      {
        icon: "link",
        title: "Халықаралық байланыстар",
        desc: "Бизнес, мемлекет және халықаралық ұйымдар арасындағы коммуникацияны кеңейту. Ұзақмерзімді серіктестіктер құру.",
        stat: "70+ қатысушы",
        statLabel: "әр отырыста",
      },
    ],
  },
}

const iconMap = { globe: GlobeIcon, trending: TrendingIcon, heart: HeartIcon, link: LinkIcon }
const accentColors = ["#c9a96e", "#6ee7b7", "#f9a8d4", "#818cf8"]

export function FeaturesSection() {
  const sectionRef = useRef(null)
  const currentLocale = useLocale()
  const data = featuresData[currentLocale] || featuresData.ru

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll(".fade-in-element")
            elements.forEach((element, index) => {
              setTimeout(() => {
                element.classList.add("animate-fade-in-up")
              }, index * 150)
            })
          }
        })
      },
      { threshold: 0.1 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="features" ref={sectionRef} className="relative py-20 px-4 sm:px-6 lg:px-8">
      <style>{`
        @keyframes fadeInUpFeature {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUpFeature 0.7s ease-out forwards; }
        .fade-in-element { opacity: 0; }
      `}</style>

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="fade-in-element inline-flex items-center gap-2 text-white/50 text-xs font-medium tracking-widest uppercase mb-6">
            <div className="w-8 h-px bg-white/30" />
            {data.eyebrow}
            <div className="w-8 h-px bg-white/30" />
          </div>
          <h2 className="fade-in-element text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">
            {data.title}
          </h2>
          <p className="fade-in-element text-lg text-white/60 max-w-xl mx-auto">
            {data.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.items.map((item, i) => {
            const Icon = iconMap[item.icon]
            const accent = accentColors[i]
            return (
              <div
                key={i}
                className="fade-in-element group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-white/20 hover:bg-white/8 transition-all duration-300"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: accent + "20", color: accent }}
                >
                  <Icon />
                </div>
                <h3 className="text-white font-semibold text-base mb-3">{item.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed mb-5">{item.desc}</p>
                <div className="border-t border-white/10 pt-4">
                  <div className="text-lg font-bold" style={{ color: accent }}>{item.stat}</div>
                  <div className="text-white/40 text-xs mt-0.5">{item.statLabel}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
