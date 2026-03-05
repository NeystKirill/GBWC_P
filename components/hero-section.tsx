"use client"

import { useEffect, useState } from "react"
import { useLocale } from "next-intl"
import { useParams } from "next/navigation"

const partnersRow1 = [
  "ЕБРР", "Всемирный Банк", "Baker McKenzie", "Citi", "KAFC", "ICBDF", "AIFC"
]

const partnersRow2 = [
  "UN Women", "IFC", "ЦАРЭС", "Samruk-Kazyna", "KazakhInvest", "Правительство РК",
  "Forbes Kazakhstan", "Alem Sulu", "KazMunayGas", "EBRD", "UNDP", "ADB", "IsDB"
]

function MarqueeRow({ items, reverse = false, speed = 30 }: { items: string[], reverse?: boolean, speed?: number }) {
  const tripled = [...items, ...items, ...items]
  const animName = reverse ? "marqueeReverse" : "marqueeForward"
  return (
    <div className="relative overflow-hidden w-full py-2">
      <div className="absolute left-0 top-0 h-full w-16 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.5), transparent)" }} />
      <div className="absolute right-0 top-0 h-full w-16 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, rgba(0,0,0,0.5), transparent)" }} />
      <div
        className="flex items-center gap-6"
        style={{
          animation: `${animName} ${speed}s linear infinite`,
          willChange: "transform",
          whiteSpace: "nowrap",
        }}
      >
        {tripled.map((name, i) => (
          <div
            key={i}
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-white/70 text-sm font-medium flex-shrink-0"
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  )
}

const subtitles: Record<string, string> = {
  ru: "Международная диалоговая платформа для женщин в бизнесе и инвестициях. Объединяем лидеров из 30+ стран для устойчивого развития.",
  kz: "Бизнес пен инвестиция саласындағы әйелдерге арналған халықаралық диалог платформасы.",
  en: "International dialogue platform for women in business and investment. Uniting leaders from 30+ countries.",
}

const labels: Record<string, { sessions: string; countries: string; participants: string; founded: string; cta1: string; cta2: string; partners: string }> = {
  ru: { sessions: "Заседания", countries: "Стран", participants: "Участников", founded: "Основана", cta1: "Заседания", cta2: "Стать партнером", partners: "Спонсировано нашими партнерами" },
  kz: { sessions: "Отырыс", countries: "Ел", participants: "Қатысушы", founded: "Құрылды", cta1: "Отырыстар", cta2: "Серіктес болу", partners: "Серіктестерімізбен демеушіленді" },
  en: { sessions: "Sessions", countries: "Countries", participants: "Participants", founded: "Founded", cta1: "Sessions", cta2: "Become a Partner", partners: "Sponsored by our partners" },
}

const goldGradient = "linear-gradient(135deg, #c9a96e 0%, #f5e198 45%, #c9a96e 100%)"
const whiteGradient = "linear-gradient(160deg, #ffffff 0%, rgba(255,255,255,0.65) 100%)"

export function HeroSection() {
  // useLocale() is SSR-safe with next-intl — consistent between server and client
  const locale = useLocale()
  const L = labels[locale] || labels.ru
  const subtitle = subtitles[locale] || subtitles.ru

  // titlePhase animation — client-only, use mounted guard to avoid hydration mismatch
  const [mounted, setMounted] = useState(false)
  const [titlePhase, setTitlePhase] = useState<"council" | "gbwc">("council")

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setTitlePhase(prev => prev === "gbwc" ? "council" : "gbwc")
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  // councilVisible drives the cross-fade. Before mount, show "council" statically (matching SSR).
  const councilVisible = !mounted || titlePhase === "council"
  const gbwcVisible = mounted && titlePhase === "gbwc"

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 relative">
      <style>{`
        @keyframes marqueeForward {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marqueeReverse {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-1 { animation: fadeSlideUp 0.8s ease-out 0.1s both; }
        .anim-2 { animation: fadeSlideUp 0.8s ease-out 0.3s both; }
        .anim-3 { animation: fadeSlideUp 0.8s ease-out 0.5s both; }
        .anim-4 { animation: fadeSlideUp 0.8s ease-out 0.65s both; }
        .anim-5 { animation: fadeSlideUp 0.8s ease-out 0.8s both; }
      `}</style>

      <div className="max-w-5xl mx-auto text-center relative z-10 w-full">

        {/* Eyebrow */}
        <div className="anim-1 mt-16 mb-4">
          <span className="text-white/50 text-xs sm:text-sm uppercase tracking-[0.35em] font-light">
            Global Businesswomen
          </span>
        </div>

        {/* Animated title — both elements always in DOM, cross-fade via opacity */}
        <div className="anim-2 mb-8">
          <div className="relative h-24 sm:h-28 md:h-36 flex items-center justify-center overflow-hidden">
            {/* "Council" */}
            <div
              aria-hidden={!councilVisible}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: councilVisible ? 1 : 0,
                transform: councilVisible ? "translateY(0) scale(1)" : "translateY(10px) scale(0.97)",
                transition: mounted ? "opacity 0.5s ease-out, transform 0.5s ease-out" : "none",
                pointerEvents: councilVisible ? "auto" : "none",
              }}
            >
              <h1
                className="text-6xl sm:text-7xl md:text-9xl font-bold leading-none select-none"
                style={{ background: whiteGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
              >
                Council
              </h1>
            </div>
            {/* "GBWC" */}
            <div
              aria-hidden={!gbwcVisible}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: gbwcVisible ? 1 : 0,
                transform: gbwcVisible ? "translateY(0) scale(1)" : "translateY(10px) scale(0.97)",
                transition: mounted ? "opacity 0.5s ease-out, transform 0.5s ease-out" : "none",
                pointerEvents: gbwcVisible ? "auto" : "none",
              }}
            >
              <h1
                className="text-6xl sm:text-7xl md:text-9xl font-bold leading-none select-none"
                style={{ background: goldGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
              >
                GBWC
              </h1>
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <p className="anim-3 text-base sm:text-lg text-white/65 max-w-xl mx-auto mb-10 leading-relaxed font-light px-4">
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="anim-4 flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <a
            href={`/${locale}/events`}
            className="bg-white text-black font-semibold rounded-full px-9 py-3.5 text-sm sm:text-base hover:bg-gray-100 transition-all duration-300 cursor-pointer"
          >
            {L.cta1}
          </a>
          <a
            href={`/${locale}/contacts`}
            className="rounded-full px-9 py-3.5 text-sm sm:text-base font-semibold border border-white/30 text-white hover:bg-white/10 transition-all duration-300 cursor-pointer"
          >
            {L.cta2}
          </a>
        </div>

        {/* Stats */}
        <div className="anim-4 flex items-center justify-center gap-8 sm:gap-14 mb-14 flex-wrap">
          {[
            { num: "3", label: L.sessions },
            { num: "30+", label: L.countries },
            { num: "70+", label: L.participants },
            { num: "2023", label: L.founded },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold text-white">{stat.num}</div>
              <div className="text-xs text-white/50 uppercase tracking-wider mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Partner marquees */}
        <div className="anim-5">
          <p className="text-xs text-white/35 uppercase tracking-[0.25em] mb-5">{L.partners}</p>
          <div className="space-y-3">
            <MarqueeRow items={partnersRow1} reverse={false} speed={22} />
            <MarqueeRow items={partnersRow2} reverse={true} speed={32} />
          </div>
        </div>

      </div>
    </section>
  )
}
