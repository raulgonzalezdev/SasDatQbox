import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!['es', 'en'].includes(locale as any)) {
    locale = 'es';
  }

  try {
    const messages = (await import(`./messages/${locale}.json`)).default;
    
    return {
      locale: locale as string,
      messages
    };
  } catch (error) {
    // Fallback to default locale
    const messages = (await import('./messages/es.json')).default;
    return {
      locale: 'es',
      messages
    };
  }
});
