import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import "../globals.css"
import { PageTransition } from "@/components/page-transition"
import { NavigationTransition } from "@/components/navigation-transition"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Dancing_Script, Caveat } from "next/font/google"

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
  display: "swap",
})

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Global Businesswomen Council",
  description:
    "International dialogue platform for women in business and investment",
  generator: "v0.app",
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  
  // Validate that the locale is supported
  const locales = ['ru', 'en', 'kz']
  if (!locales.includes(locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className="dark">
      <body className={`font-sans antialiased ${dancingScript.variable} ${caveat.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <Suspense fallback={null}>
            <NavigationTransition />
            <PageTransition>{children}</PageTransition>
          </Suspense>
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
