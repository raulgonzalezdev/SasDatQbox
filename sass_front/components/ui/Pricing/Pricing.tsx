"use client";
import { Box, Typography, Grid, Card, CardContent, Button, Chip } from '@mui/material';
import { useState } from 'react';

// Tipos de datos
type Interval = 'month' | 'year';
interface Plan {
  name: string;
  description: string;
  price: string | number;
  isPopular?: boolean;
  buttonText: string;
  action: 'subscribe' | 'contact';
}

// Default plans (fallback if translations not provided)
const defaultPlans: Plan[] = [
  {
    name: 'Gratis',
    description: 'Ideal para empezar a digitalizar tu consulta. 15 pacientes máximo.',
    price: 0,
    buttonText: 'Suscribirse',
    action: 'subscribe',
  },
  {
    name: 'Estándar',
    description: 'Todas las funcionalidades, hasta 500 pacientes y consultas ilimitadas.',
    price: 49,
    isPopular: true,
    buttonText: 'Suscribirse',
    action: 'subscribe',
  },
  {
    name: 'Premium',
    description: 'Para clínicas con múltiples consultorios y asistentes. Pacientes ilimitados.',
    price: 199,
    buttonText: 'Suscribirse',
    action: 'subscribe',
  },
  {
    name: 'Corporativo',
    description: 'Solución a medida para hospitales y grandes organizaciones.',
    price: 'Contactar',
    buttonText: 'Contactar Ventas',
    action: 'contact',
  },
];

import { useTranslations, useMessages } from 'next-intl';
export default function Pricing() {
  const t = useTranslations('Pricing');
  const messages = useMessages();
  const plansFromMessages = (messages?.Pricing?.plans ?? null) as unknown as Plan[] | null;
  const plans = plansFromMessages && plansFromMessages.length ? plansFromMessages : defaultPlans;
  return (
    <Box id="pricing" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
      <Box sx={{ maxWidth: 'lg', mx: 'auto', px: 3, textAlign: 'center' }}>
        <Typography variant="h2" component="h2" fontWeight="bold" gutterBottom>
          {t('title')}
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 8 }}>
          {t('subtitle')}
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {plans.map((plan) => (
            <Grid item key={plan.name} xs={12} sm={6} md={3}>
              <Card 
                elevation={3} // Sombra base para todas las tarjetas
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderColor: plan.isPopular ? 'primary.main' : 'transparent', // Borde solo si es popular
                  borderWidth: 2,
                  borderStyle: 'solid',
                  position: 'relative',
                  overflow: 'visible',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: (theme) => theme.shadows[8], // Sombra más intensa al hacer hover
                  },
                }}
              >
                {plan.isPopular && (
                  <Chip 
                    label={t('mostPopular')}
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 1,
                    }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1, p: 3, textAlign: 'left' }}>
                  <Typography variant="h4" component="h3" gutterBottom>{plan.name}</Typography>
                  <Typography color="text.secondary" sx={{ minHeight: '3em', mb: 2 }}>{plan.description}</Typography>
                  
                  {typeof plan.price === 'number' ? (
                    <Typography variant="h3" component="p" sx={{ my: 2 }}>
                      {plan.price} US$
                      <Typography variant="h6" component="span" color="text.secondary">{t('perMonth')}</Typography>
                    </Typography>
                  ) : (
                    <Typography variant="h3" component="p" sx={{ my: 2, fontWeight: 'medium' }}>
                      {plan.price}
                    </Typography>
                  )}
                </CardContent>
                <Box sx={{ p: 3, pt: 0 }}>
                  <Button fullWidth variant="contained" color="primary">
                    {plan.action === 'contact' ? t('contactSales') : t('subscribe')}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
