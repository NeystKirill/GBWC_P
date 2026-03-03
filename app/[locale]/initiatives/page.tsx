"use client"

import { useTranslations } from 'next-intl'
import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { Footer } from "@/components/footer"
import Aurora from "@/components/Aurora"

export default function InitiativesPage() {
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
                {t('pages.initiatives.title')}
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed mb-12">
                {t('pages.initiatives.description')}
              </p>
              
              <div className="grid gap-8">
                <div className="bg-gray-900/50 backdrop-blur border border-gray-700 rounded-lg p-8">
                  <h2 className="text-2xl font-bold text-white mb-4 font-cormorant">
                    Family Support Center
                  </h2>
                  <p className="text-gray-300">
                    Support initiatives for families in difficult situations
                  </p>
                </div>
                
                <div className="bg-gray-900/50 backdrop-blur border border-gray-700 rounded-lg p-8">
                  <h2 className="text-2xl font-bold text-white mb-4 font-cormorant">
                    Vatican Choir
                  </h2>
                  <p className="text-gray-300">
                    Student choir program
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <Footer />
        </div>
      </main>
    </div>
  )
}
