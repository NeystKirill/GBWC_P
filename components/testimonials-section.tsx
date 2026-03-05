"use client"

import { useEffect, useRef } from "react"
import { useLocale } from "next-intl"

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)
const MapPinIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)
const UsersIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const sessions = {
  ru: [
    {
      num: "I",
      title: "Пленарное заседание",
      theme: "Новые возможности для бизнеса и инвестиций в меняющейся реальности",
      date: "7 июня 2023",
      location: "Hilton Astana, г. Астана",
      participants: "ЕБРР, Всемирный Банк, Baker McKenzie, Citi, UN Women, IFC",
      highlight: "Первая международная встреча платформы с участием глобальных лидеров",
      href: "/events/plenary-1",
      gradient: "from-slate-800/60 to-slate-900/40",
      accent: "#c9a96e",
    },
    {
      num: "II",
      title: "Пленарное заседание",
      theme: "Зелёные и социальные инвестиции. Развитие малого и среднего бизнеса",
      date: "31 октября 2024",
      location: "Дворец Независимости, г. Астана",
      participants: "Microsoft, VEON, Polpharma, ЕБРР, Baker McKenzie, Citi",
      highlight: "Обсуждение устойчивого развития и поддержки МСП",
      href: "/events/plenary-2",
      gradient: "from-emerald-900/40 to-slate-900/40",
      accent: "#6ee7b7",
    },
    {
      num: "III",
      title: "Пленарное заседание",
      theme: "Социальные инвестиции глазами женщин-лидеров",
      date: "24 июня 2025",
      location: "Дворец Независимости, г. Астана",
      participants: "30+ международных организаций и лидеров бизнеса",
      highlight: "Фокус на роли женщин в социальных инвестициях",
      href: "/events/plenary-3",
      gradient: "from-violet-900/40 to-slate-900/40",
      accent: "#a78bfa",
    },
  ],
  en: [
    {
      num: "I",
      title: "Plenary Session",
      theme: "New Opportunities for Business and Investment in a Changing Reality",
      date: "June 7, 2023",
      location: "Hilton Astana, Astana",
      participants: "EBRD, World Bank, Baker McKenzie, Citi, UN Women, IFC",
      highlight: "First international gathering of the platform with global leaders",
      href: "/events/plenary-1",
      gradient: "from-slate-800/60 to-slate-900/40",
      accent: "#c9a96e",
    },
    {
      num: "II",
      title: "Plenary Session",
      theme: "Green and Social Investments. SME Development",
      date: "October 31, 2024",
      location: "Palace of Independence, Astana",
      participants: "Microsoft, VEON, Polpharma, EBRD, Baker McKenzie, Citi",
      highlight: "Focus on sustainable development and SME support",
      href: "/events/plenary-2",
      gradient: "from-emerald-900/40 to-slate-900/40",
      accent: "#6ee7b7",
    },
    {
      num: "III",
      title: "Plenary Session",
      theme: "Social Investments Through the Eyes of Women Leaders",
      date: "June 24, 2025",
      location: "Palace of Independence, Astana",
      participants: "30+ international organizations and business leaders",
      highlight: "Focus on the role of women in social investments",
      href: "/events/plenary-3",
      gradient: "from-violet-900/40 to-slate-900/40",
      accent: "#a78bfa",
    },
  ],
  kz: [
    {
      num: "I",
      title: "Пленарлық отырыс",
      theme: "Өзгермелі шындықтағы бизнес пен инвестицияға жаңа мүмкіндіктер",
      date: "2023 жылғы 7 маусым",
      location: "Hilton Astana, Астана қ.",
      participants: "ЕҚДБ, Дүниежүзілік Банк, Baker McKenzie, Citi, UN Women, IFC",
      highlight: "Платформаның жаhандық көшбасшылармен алғашқы халықаралық жиыны",
      href: "/events/plenary-1",
      gradient: "from-slate-800/60 to-slate-900/40",
      accent: "#c9a96e",
    },
    {
      num: "II",
      title: "Пленарлық отырыс",
      theme: "Жасыл және әлеуметтік инвестициялар. Шағын және орта бизнесті дамыту",
      date: "2024 жылғы 31 қазан",
      location: "Тәуелсіздік сарайы, Астана",
      participants: "Microsoft, VEON, Polpharma, ЕҚДБ, Baker McKenzie, Citi",
      highlight: "Тұрақты даму мен ШОБ-ды қолдауға баса назар",
      href: "/events/plenary-2",
      gradient: "from-emerald-900/40 to-slate-900/40",
      accent: "#6ee7b7",
    },
    {
      num: "III",
      title: "Пленарлық отырыс",
      theme: "Әйел-көшбасшылар көзімен әлеуметтік инвестициялар",
      date: "2025 жылғы 24 маусым",
      location: "Тәуелсіздік сарайы, Астана",
      participants: "30+ халықаралық ұйымдар мен бизнес-көшбасшылар",
      highlight: "Әлеуметтік инвестициялардағы әйелдердің рөліне назар",
      href: "/events/plenary-3",
      gradient: "from-violet-900/40 to-slate-900/40",
      accent: "#a78bfa",
    },
  ],
}

const headings = {
  ru: { eyebrow: "История заседаний", title: "Пленарные заседания", subtitle: "Три года диалога, инноваций и международного сотрудничества", viewAll: "Все заседания" },
  en: { eyebrow: "Session History", title: "Plenary Sessions", subtitle: "Three years of dialogue, innovation and international cooperation", viewAll: "All sessions" },
  kz: { eyebrow: "Отырыстар тарихы", title: "Пленарлық отырыстар", subtitle: "Диалог, инновация және халықаралық ынтымақтастықтың үш жылы", viewAll: "Барлық отырыстар" },
}

export function TestimonialsSection() {
  const sectionRef = useRef(null)
  const currentLocale = useLocale()

  const localeSessions = sessions[currentLocale] || sessions.ru
  const H = headings[currentLocale] || headings.ru

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
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="sessions" ref={sectionRef} className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.7s ease-out forwards; }
        .fade-in-element { opacity: 0; }
      `}</style>

      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }} />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="fade-in-element inline-flex items-center gap-2 text-white/50 text-xs font-medium tracking-widest uppercase mb-6">
            <div className="w-8 h-px bg-white/30" />
            {H.eyebrow}
            <div className="w-8 h-px bg-white/30" />
          </div>
          <h2 className="fade-in-element text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 tracking-tight">
            {H.title}
          </h2>
          <p className="fade-in-element text-lg text-white/60 max-w-xl mx-auto">
            {H.subtitle}
          </p>
        </div>

        {/* Session Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {localeSessions.map((session, i) => (
            <a
              key={i}
              href={"/" + currentLocale + session.href}
              className={"fade-in-element group relative flex flex-col rounded-2xl border border-white/10 bg-gradient-to-br " + session.gradient + " backdrop-blur-sm p-6 hover:border-white/25 transition-all duration-400 cursor-pointer overflow-hidden"}
            >
              {/* Session number badge */}
              <div className="flex items-center justify-between mb-6">
                <div
                  className="text-4xl font-bold opacity-20 select-none"
                  style={{ color: session.accent }}
                >
                  {session.num}
                </div>
                <div
                  className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border"
                  style={{ color: session.accent, borderColor: session.accent + "40", background: session.accent + "15" }}
                >
                  {session.title}
                </div>
              </div>

              {/* Theme */}
              <p className="text-white font-medium text-sm leading-relaxed mb-6 flex-1">
                {session.theme}
              </p>

              {/* Meta info */}
              <div className="space-y-2 text-white/50 text-xs">
                <div className="flex items-center gap-2">
                  <CalendarIcon />
                  <span>{session.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon />
                  <span>{session.location}</span>
                </div>
                <div className="flex items-start gap-2">
                  <UsersIcon />
                  <span className="leading-relaxed">{session.participants}</span>
                </div>
              </div>

              {/* Hover accent line */}
              <div
                className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
                style={{ background: "linear-gradient(to right, " + session.accent + ", transparent)" }}
              />
            </a>
          ))}
        </div>

        {/* View all sessions link */}
        <div className="fade-in-element text-center">
          <a
            href={"/" + currentLocale + "/events"}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium border border-white/15 hover:border-white/30 rounded-full px-8 py-3 transition-all duration-300"
          >
            {H.viewAll}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
