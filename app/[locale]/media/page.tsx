"use client"

import { useTranslations } from 'next-intl'
import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { Footer } from "@/components/footer"
import Aurora from "@/components/Aurora"

export default function MediaPage() {
  const t = useTranslations()
  
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <main className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 w-full h-full">
          <Aurora colorStops={["#475569", "#64748b", "#475569"]} amplitude={1.2} blend={0.6} speed={0.8} />
        </div>
        <div className="relative z-10">
          <GlassmorphismNav />
          
          <section className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8 font-cormorant">
                {t('pages.media.title')}
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                {t('pages.media.description')}
              </p>
            </div>
          </section>
          
          <Footer />
        </div>
      </main>
    </div>
  )
}
