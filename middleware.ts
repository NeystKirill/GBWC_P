import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['ru', 'en', 'kz'],

  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: 'ru'
})

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!_next|_vercel|.*\\..*).)*']
}
