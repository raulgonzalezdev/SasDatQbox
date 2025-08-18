
import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import ClientLayoutWrapper from './ClientLayoutWrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://boxdoctor.com'),
  title: 'BoxDoctor - Plataforma de Telemedicina',
  description: 'Plataforma integral de telemedicina diseñada para conectar profesionales de la salud con pacientes de manera segura y eficiente.',
  openGraph: {
    title: 'BoxDoctor - Plataforma de Telemedicina',
    description: 'Plataforma integral de telemedicina diseñada para conectar profesionales de la salud con pacientes de manera segura y eficiente.',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BoxDoctor - Plataforma de Telemedicina',
    description: 'Plataforma integral de telemedicina diseñada para conectar profesionales de la salud con pacientes de manera segura y eficiente.',
    images: ['/og-image.png'],
  },
};

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body
        style={{
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        <NextIntlClientProvider messages={messages}>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
