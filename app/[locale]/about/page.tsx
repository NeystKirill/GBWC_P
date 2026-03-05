"use client"

import { useTranslations } from 'next-intl'
import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { Footer } from "@/components/footer"
import Aurora from "@/components/Aurora"

export default function AboutPage() {
  const t = useTranslations('pages.about')
  
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
                {t('title')}
              </h1>
              
              <div className="space-y-8 text-gray-300">
                <p className="text-lg leading-relaxed">
                  {t('description')}
                </p>
                
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4 font-cormorant">
                    {t('mission')}
                  </h2>
                  <p className="text-lg leading-relaxed">
                    {t('missionText')}
                  </p>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4 font-cormorant">
                    {t('members')}
                  </h2>
                  <ul className="space-y-2 ml-6">
                    {t.raw('membersList').map((member: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-gold mr-3">•</span>
                        <span>{member}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4 font-cormorant">
                    {t('participants')}
                  </h2>
                  <ul className="space-y-2 ml-6">
                    {t.raw('participantsList').map((participant: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-gold mr-3">•</span>
                        <span>{participant}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4 font-cormorant">
                    {t('activities')}
                  </h2>
                  <ul className="space-y-2 ml-6">
                    {t.raw('activitiesList').map((activity: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-gold mr-3">•</span>
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4 font-cormorant">
                    {t('secretariat')}
                  </h2>
                  <p className="text-lg leading-relaxed">
                    {t('secretariatText')}
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
