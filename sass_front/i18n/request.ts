import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  console.log('🔍 i18n Request Debug:');
  console.log('  - Requested locale:', locale);
  const validLocale = locale && ['en', 'es'].includes(locale) ? locale : 'es';
  console.log('  - Resolved locale:', validLocale);
  const messages = (await import(`../messages/${validLocale}.json`)).default;
  console.log('  - Loaded message keys:', Object.keys(messages));
  return {
    locale: validLocale,
    messages
  };
});
