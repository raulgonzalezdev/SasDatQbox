'use client';

import { useState, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Box, Zoom } from '@mui/material';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { PropsWithChildren, Suspense } from 'react'; // Importar Suspense
import MuiRegistry from '@/lib/MuiRegistry';
import FloatingChatButton from '@/components/ui/FloatingChatButton';
import SupportChatPopover from '@/components/ui/Landing/SupportChatPopover';

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isChatOpen, setChatOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const chatButtonRef = useRef<HTMLButtonElement>(null);

  const handleChatOpen = () => {
    setAnchorEl(chatButtonRef.current);
    setChatOpen(true);
  };

  const handleChatClose = () => {
    setAnchorEl(null);
    setChatOpen(false);
  };

  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        <QueryClientProvider client={queryClient}>
          <MuiRegistry>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh'
              }}
            >
              <Navbar />
              <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
              </Box>
              <Footer />
            </Box>
            <Zoom in={!isChatOpen} unmountOnExit>
                <FloatingChatButton ref={chatButtonRef} onClick={handleChatOpen} />
            </Zoom>
            <SupportChatPopover
              open={isChatOpen}
              onClose={handleChatClose}
              anchorEl={anchorEl}
            />
            <Suspense>
              <Toaster />
            </Suspense>
          </MuiRegistry>
        </QueryClientProvider>
      </body>
    </html>
  );
}
