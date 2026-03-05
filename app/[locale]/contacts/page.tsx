"use client"

import { useTranslations } from 'next-intl'
import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { Footer } from "@/components/footer"
import Aurora from "@/components/Aurora"

export default function ContactsPage() {
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
                {t('pages.contacts.title')}
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed mb-12">
                {t('pages.contacts.description')}
              </p>
              
              <div className="grid gap-8">
                <div className="bg-gray-900/50 backdrop-blur border border-gray-700 rounded-lg p-8">
                  <h2 className="text-2xl font-bold text-white mb-4 font-cormorant">
                    {t('pages.contacts.secretariatHead')}
                  </h2>
                  <p className="text-gray-300 mb-2">Bibigul Maserbaeva</p>
                  <p className="text-gray-400 mb-4">
                    <span className="text-gold">{t('pages.contacts.phone')}:</span> +7 702 731 4400
                  </p>
                  <p className="text-gray-400">
                    <span className="text-gold">{t('pages.contacts.email')}:</span> bibigul.maserbaeva@gbwc.network
                  </p>
                </div>
                
                <div className="bg-gray-900/50 backdrop-blur border border-gray-700 rounded-lg p-8">
                  <h2 className="text-2xl font-bold text-white mb-4 font-cormorant">
                    {t('pages.contacts.form')}
                  </h2>
                  <form className="space-y-4">
                    <input
                      type="text"
                      placeholder={t('pages.contacts.formNameLabel')}
                      className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                    />
                    <input
                      type="email"
                      placeholder={t('pages.contacts.formEmailLabel')}
                      className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                    />
                    <textarea
                      placeholder={t('pages.contacts.formMessageLabel')}
                      rows={5}
                      className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="w-full bg-gold text-black font-bold py-2 rounded hover:bg-yellow-500 transition-colors"
                    >
                      {t('pages.contacts.formSubmit')}
                    </button>
                  </form>
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
