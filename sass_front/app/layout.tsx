import React from 'react';
import { Metadata } from 'next';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
import MuiRegistry from '@/lib/MuiRegistry';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Box } from '@mui/material';
import { Toaster } from 'react-hot-toast'; // Importar de react-hot-toast

const queryClient = new QueryClient();

const title = 'Next.js Subscription Starter';
const description = 'A subscription starter kit built with Next.js, and Stripe.';

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: title,
  description: description,
  openGraph: {
    title: title,
    description: description
  }
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <MuiRegistry>
            <Navbar />
            <Box component="main" id="skip" sx={{ minHeight: 'calc(100vh - 4rem)' }}>
              {children}
            </Box>
            <Footer />
            <Suspense>
              <Toaster />
            </Suspense>
          </MuiRegistry>
        </QueryClientProvider>
      </body>
    </html>
  );
}
