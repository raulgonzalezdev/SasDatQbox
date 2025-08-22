'use client';

import { useState, useRef, PropsWithChildren, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Box, Zoom } from '@mui/material';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import MuiRegistry from '@/lib/MuiRegistry';
import FloatingChatButton from '@/components/ui/FloatingChatButton';
import SupportChatPopover from '@/components/ui/Landing/SupportChatPopover';
import ContactDrawer from '@/components/ui/Landing/ContactDrawer'; // Importar el nuevo drawer
import React from 'react';

const queryClient = new QueryClient();

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isChatOpen, setChatOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const chatButtonRef = useRef<HTMLButtonElement>(null);
  const [isContactOpen, setContactOpen] = useState(false); // Estado para el drawer de contacto

  const handleChatOpen = () => {
    setAnchorEl(chatButtonRef.current);
    setChatOpen(true);
  };

  const handleChatClose = () => {
    setAnchorEl(null);
    setChatOpen(false);
  };
  
  const handleContactOpen = () => setContactOpen(true);
  const handleContactClose = () => setContactOpen(false);

  return (
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
          <Footer onContactClick={handleContactOpen} />
        </Box>
        <Zoom in={!isChatOpen} unmountOnExit>
            <FloatingChatButton ref={chatButtonRef} onClick={handleChatOpen} />
        </Zoom>
        <SupportChatPopover
          open={isChatOpen}
          onClose={handleChatClose}
          anchorEl={anchorEl}
        />
        <ContactDrawer open={isContactOpen} onClose={handleContactClose} />
        <Suspense>
          <Toaster />
        </Suspense>
      </MuiRegistry>
    </QueryClientProvider>
  );
}