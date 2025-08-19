import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export default getRequestConfig(async ({ locale }) => {
  console.log('🔍 i18n Config Debug:');
  console.log('  - Requested locale:', locale);
  
  if (!['es', 'en'].includes(locale as any)) {
    console.log('  - Locale not found, redirecting to default');
    notFound();
  }

  const messages = (await import(`./messages/${locale}.json`)).default;
  console.log('  - Loaded messages for locale:', locale);
  console.log('  - Available keys:', Object.keys(messages));

  return {
    locale: locale as string,
    messages
  };
});
