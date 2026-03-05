"use client"

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { Footer } from "@/components/footer"
import Aurora from "@/components/Aurora"

export default function EventsPage() {
  const t = useTranslations()
  const router = useRouter()
  
  const events = [
    {
      slug: 'plenary-i-2023',
      title: t('events.plenary1.title'),
      theme: t('events.plenary1.theme'),
      date: t('events.plenary1.date'),
      location: t('events.plenary1.location'),
    },
    {
      slug: 'plenary-ii-2024',
      title: t('events.plenary2.title'),
      theme: t('events.plenary2.theme'),
      date: t('events.plenary2.date'),
      location: t('events.plenary2.location'),
    },
    {
      slug: 'plenary-iii-2025',
      title: t('events.plenary3.title'),
      theme: t('events.plenary3.theme'),
      date: t('events.plenary3.date'),
      location: t('events.plenary3.location'),
    },
  ]
  
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <main className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 w-full h-full">
          <Aurora colorStops={["#475569", "#64748b", "#475569"]} amplitude={1.2} blend={0.6} speed={0.8} />
        </div>
        <div className="relative z-10">
          <GlassmorphismNav />
          
          <section className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-16 font-cormorant">
                {t('pages.events.title')}
              </h1>
              
              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                {events.map((event) => (
                  <div
                    key={event.slug}
                    onClick={() => router.push(`/events/${event.slug}`)}
                    className="bg-gray-900/50 backdrop-blur border border-gray-700 rounded-lg p-8 hover:border-gold transition-colors cursor-pointer h-full"
                  >
                    <h2 className="text-2xl font-bold text-white mb-4 font-cormorant">
                      {event.title}
                    </h2>
                    <p className="text-gray-400 mb-4">
                      {event.theme}
                    </p>
                    <div className="space-y-2 text-gray-400">
                      <p><span className="text-gold">📅</span> {event.date}</p>
                      <p><span className="text-gold">📍</span> {event.location}</p>
                    </div>
                    <div className="mt-6 text-gold hover:text-white transition-colors">
                      {t('learnMore')} →
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          <Footer />
        </div>
      </main>
    </div>
  )
}
