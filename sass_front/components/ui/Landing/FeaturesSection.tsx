"use client";
import { Box, Typography, Grid, Paper } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import LanguageIcon from '@mui/icons-material/Language';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DescriptionIcon from '@mui/icons-material/Description';
import ChatIcon from '@mui/icons-material/Chat';
import PaymentIcon from '@mui/icons-material/Payment';
import { ReactElement } from 'react';
import { useTranslations, useMessages } from 'next-intl';

interface Feature {
  icon: ReactElement;
  title: string;
}

// default labels kept for fallback when translations are missing
const defaultFeatures: Feature[] = [
  { icon: <VideocamIcon sx={{ fontSize: 40 }} />, title: 'Consultas por vídeo' },
  { icon: <SystemUpdateAltIcon sx={{ fontSize: 40 }} />, title: 'Integración de EMR y EHR' },
  { icon: <AccessibilityNewIcon sx={{ fontSize: 40 }} />, title: 'Herramientas para el paciente' },
  { icon: <LanguageIcon sx={{ fontSize: 40 }} />, title: 'Compatibilidad de idiomas' },
  { icon: <EventAvailableIcon sx={{ fontSize: 40 }} />, title: 'Programación de citas' },
  { icon: <DescriptionIcon sx={{ fontSize: 40 }} />, title: 'Gestión de recetas' },
  { icon: <ChatIcon sx={{ fontSize: 40 }} />, title: 'Mensajería en tiempo real' },
  { icon: <PaymentIcon sx={{ fontSize: 40 }} />, title: 'Procesamiento de pagos' },
];

export default function FeaturesSection() {
  const t = useTranslations('Features');
  const messages = useMessages();
  const translations = messages?.Features?.items as Array<{ title: string }>; 
  const features = translations && translations.length ? translations.map((it, i) => ({ ...defaultFeatures[i], title: it.title })) : defaultFeatures;

  return (
    <Box id="features" sx={{ bgcolor: 'background.paper', py: { xs: 10, md: 16 } }}>
      <Box sx={{ maxWidth: 'lg', mx: 'auto', px: 3 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          textAlign="center" 
          fontWeight="bold" 
          sx={{ 
            mb: 2, 
            color: 'primary.main',
            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' }
          }}
        >
          {t('title')}
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          textAlign="center" 
          sx={{ 
            mb: 8,
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
          }}
        >
          {t('subtitle')}
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={3} key={feature.title}>
              <Paper 
                elevation={2}
                sx={{ 
                  p: 3, 
                  textAlign: 'center', 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  }
                }}
              >
                <Box color="primary.main" mb={2}>{feature.icon}</Box>
                <Typography variant="h6" component="h3" fontWeight="bold">{feature.title}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
