
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Providers from '@/components/Providers';
import { rubik } from '../fonts';

export const metadata: Metadata = {
  metadataBase: new URL('https://boxdoctor.com'),
  title: {
    default: 'BoxDoctor - Plataforma de Telemedicina',
    template: '%s | BoxDoctor'
  },
  description: 'Plataforma de telemedicina moderna y segura para profesionales de la salud',
  keywords: ['telemedicina', 'salud', 'consultas médicas', 'plataforma médica'],
  authors: [{ name: 'BoxDoctor Team' }],
  creator: 'BoxDoctor',
  publisher: 'BoxDoctor',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://boxdoctor.com',
    title: 'BoxDoctor - Plataforma de Telemedicina',
    description: 'Plataforma de telemedicina moderna y segura para profesionales de la salud',
    siteName: 'BoxDoctor',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BoxDoctor - Plataforma de Telemedicina',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BoxDoctor - Plataforma de Telemedicina',
    description: 'Plataforma de telemedicina moderna y segura para profesionales de la salud',
    images: ['/og-image.png'],
    creator: '@boxdoctor',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
    languages: {
      'es-ES': '/es',
      'en-US': '/en',
    },
  },
};

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale} className={rubik.variable}>
      <body>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <Suspense fallback={<div>Loading...</div>}>
              {children}
            </Suspense>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
