'use client';
import { Box, Typography, Container, Paper } from '@mui/material';
import { useTranslations, useLocale } from 'next-intl';
import Navbar from '@/components/ui/Navbar/Navbar';
import Footer from '@/components/ui/Footer/Footer';
import ContactDrawer from '@/components/ui/Landing/ContactDrawer';
import { useState } from 'react';

export default function SecurityPage() {
  const locale = useLocale();
  const t = useTranslations('Security');
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleContactClick = () => {
    setIsContactOpen(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Box sx={{ flex: 1 }}>
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
              {t('title')}
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
              {t('subtitle')}
            </Typography>
            <Typography paragraph>
              {t('p1')}
            </Typography>
            <Typography paragraph>
              {t('p2')}
            </Typography>
          </Paper>
        </Container>
      </Box>

      <Footer onContactClick={handleContactClick} />
      <ContactDrawer open={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </Box>
  );
}
