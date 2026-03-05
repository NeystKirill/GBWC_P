import { getRequestConfig } from 'next-intl/server'

const messages = {
  ru: () => import('../messages/ru.json'),
  en: () => import('../messages/en.json'),
  kz: () => import('../messages/kz.json'),
} as const

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = requestLocale as keyof typeof messages

  // If no locale is provided, use 'ru' as default
  if (!locale || !(locale in messages)) {
    locale = 'ru'
  }

  return {
    locale,
    messages: (await messages[locale]()).default,
  }
})
