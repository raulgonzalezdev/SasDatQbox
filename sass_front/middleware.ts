import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['es', 'en'], // Must match the locales in next.config.js

  // Used when no locale matches
  defaultLocale: 'es', // Must match the defaultLocale in next.config.js
  
  // Force default locale and disable automatic locale detection
  localePrefix: 'always'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};