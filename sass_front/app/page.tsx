import Pricing from '@/components/ui/Pricing/Pricing';
import Testimonials from '@/components/ui/Landing/Testimonials';
import LogoCloud from '@/components/ui/Landing/LogoCloud';
import FeaturesSection from '@/components/ui/Landing/FeaturesSection';
import { Box, Typography, Container, Button } from '@mui/material';
import Link from 'next/link';

export default function LandingPage() {
  
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
      <Container sx={{ textAlign: 'center', py: { xs: 10, md: 16 } }}>
        <Typography variant="h1" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
          Tu cuenta médica sin fronteras.
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 6, maxWidth: '700px', mx: 'auto' }}>
          Ahorra tiempo, gestiona pacientes y recibe pagos globalmente sin límites. Te damos la bienvenida a la revolución de la telemedicina.
        </Typography>
        <Button variant="contained" color="primary" size="large" component={Link} href="/signin/signup">
          Crear cuenta ¡gratis!
        </Button>
      </Container>
      
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
    </Box>
  );
}
