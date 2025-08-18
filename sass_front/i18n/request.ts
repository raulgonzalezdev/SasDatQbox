import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is valid, default to 'es' if not
  const validLocale = locale && ['en', 'es'].includes(locale) ? locale : 'es';
  
  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default
  };
});