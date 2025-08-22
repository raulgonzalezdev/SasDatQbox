'use client';
import { Box, Typography, Container, Paper, Avatar, Grid } from '@mui/material';
import { useTranslations, useLocale } from 'next-intl';
import Navbar from '@/components/ui/Navbar/Navbar';
import Footer from '@/components/ui/Footer/Footer';
import ContactDrawer from '@/components/ui/Landing/ContactDrawer';
import { useState } from 'react';

export default function AboutUsPage() {
  const locale = useLocale();
  const t = useTranslations('About');
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleContactClick = () => {
    setIsContactOpen(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Box sx={{ flex: 1 }}>
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
              {t('missionTitle')}
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4, fontStyle: 'italic' }}>
              {t('missionSubtitle')}
            </Typography>
            <Grid container spacing={4} sx={{ mt: 4 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>{t('aboutBoxDoctorTitle')}</Typography>
                <Typography paragraph align="left">
                  {t('aboutBoxDoctorP1')}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>{t('ourTeamTitle')}</Typography>
                <Typography paragraph align="left">
                  {t('ourTeamP1')}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      <Footer onContactClick={handleContactClick} />
      <ContactDrawer open={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </Box>
  );
}
