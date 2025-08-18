'use client';
import Pricing from '@/components/ui/Pricing/Pricing';
import Testimonials from '@/components/ui/Landing/Testimonials';
import LogoCloud from '@/components/ui/Landing/LogoCloud';
import FeaturesSection from '@/components/ui/Landing/FeaturesSection';
import FAQ from '@/components/ui/Landing/FAQ';
import SocialProof from '@/components/ui/Landing/SocialProof';
import { Box, Typography, Container, Button, Grid } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import {useTranslations} from 'next-intl';

export default function LandingPage() {
  const t = useTranslations('Hero');
  
  const mockProducts = [
    {
      id: 'prod_free',
      name: 'Gratis',
      description: 'Ideal para empezar a digitalizar tu consulta. 15 pacientes máximo.',
      mostPopular: false,
      prices: [
        {
          id: 'price_free',
          unit_amount: 0,
          currency: 'usd',
          interval: 'month',
        },
      ],
    },
    {
      id: 'prod_standard',
      name: 'Estándar',
      description: 'Todas las funcionalidades, hasta 500 pacientes y consultas ilimitadas.',
      mostPopular: true,
      prices: [
        {
          id: 'price_standard_monthly',
          unit_amount: 4900, // $49.00
          currency: 'usd',
          interval: 'month',
        },
      ],
    },
    {
      id: 'prod_premium',
      name: 'Premium',
      description: 'Para clínicas con múltiples consultorios y asistentes. Pacientes ilimitados.',
      mostPopular: false,
      prices: [
        {
          id: 'price_premium_monthly',
          unit_amount: 19900, // $199.00
          currency: 'usd',
          interval: 'month',
        },
      ],
    },
    {
      id: 'prod_enterprise',
      name: 'Corporativo',
      description: 'Solución a medida para hospitales y grandes organizaciones.',
      mostPopular: false,
      prices: [
        {
          id: 'price_enterprise_monthly',
          unit_amount: null,
          currency: 'usd',
          interval: 'month',
        },
      ],
    },
  ];

  return (
    <Box>
      {/* Sección Hero */}
      <Container sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography 
                variant="h3" 
                component="h1" 
                fontWeight="bold" 
                sx={{ 
                  mb: 3,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3.75rem' }
                }}
              >
                {t('title')}
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ 
                  mb: 4,
                  fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
                }}
              >
                {t('subtitle')}
              </Typography>
              <Button variant="contained" color="primary" size="large" component={Link} href="/#contact">
                {t('cta')}
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{
              position: 'relative',
              width: '100%',
              height: { xs: 300, md: 400 },
              borderRadius: 2,
              boxShadow: (theme) => theme.shadows[6],
              overflow: 'hidden', // Necesario para que el borde redondeado afecte a la imagen
            }}>
              <Image
                src="https://mejorconsalud.as.com/wp-content/uploads/2023/10/tecnologia-medica-768x432.jpg?auto=webp&quality=7500&width=1920&crop=16:9,smart,safe&format=webp&optimize=medium&dpr=2&fit=cover&fm=webp&q=75&w=1920&h=1080"
                alt="Tecnología médica avanzada"
                layout="fill"
                objectFit="cover"
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      {/* Sección de Prueba Social (Métricas) */}
      <SocialProof />
      
      {/* Nueva Sección de Características */}
      <FeaturesSection />
      
      {/* Sección de Precios */}
      <Box id="pricing" sx={{ py: { xs: 10, md: 16 } }}>
        <Pricing user={null} products={mockProducts} subscription={null} />
      </Box>
      
      {/* Sección de Testimonios */}
      <Testimonials />
      
      {/* Sección de Logo Cloud */}
      <LogoCloud />

      {/* Sección de Preguntas Frecuentes */}
      <div id="help">
        <FAQ />
      </div>
    </Box>
  );
}
