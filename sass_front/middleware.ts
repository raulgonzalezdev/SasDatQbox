import createMiddleware from 'next-intl/middleware';

// Middleware de internacionalización
const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['es', 'en'],

  // Used when no locale matches
  defaultLocale: 'es',
  
  // Force default locale and disable automatic locale detection
  localePrefix: 'always'
});

export default function middleware(request) {
  // Solo aplicar el middleware de internacionalización
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};