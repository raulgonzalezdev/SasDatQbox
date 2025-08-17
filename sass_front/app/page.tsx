import Pricing from '@/components/ui/Pricing/Pricing';
import Testimonials from '@/components/ui/Landing/Testimonials';
import LogoCloud from '@/components/ui/Landing/LogoCloud';
import { Box, Typography, Container, Grid, Button, Paper } from '@mui/material';
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

      {/* Aquí podrías añadir un componente visual atractivo, como una imagen o un video corto */}
      
      {/* Sección de Características (ID para el ancla del Navbar) */}
      <Box id="features" sx={{ bgcolor: 'background.paper', py: { xs: 10, md: 16 } }}>
        <Container>
          <Typography variant="h2" component="h2" textAlign="center" fontWeight="bold" sx={{ mb: 8 }}>
            Mejor que tu software actual
          </Typography>
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" component="h3" gutterBottom>Tu tiempo es para tus pacientes</Typography>
              <Typography color="text.secondary">Olvídate del papeleo. Automatiza la gestión de expedientes, recetas y facturación para enfocarte en lo que realmente importa.</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" component="h3" gutterBottom>Tu consulta en la nube</Typography>
              <Typography color="text.secondary">Accede a toda la información de tus pacientes en tiempo real, desde cualquier dispositivo y con la máxima seguridad.</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" component="h3" gutterBottom>Seguridad de nivel hospitalario</Typography>
              <Typography color="text.secondary">Tus fondos y la información de tus pacientes están protegidos y asegurados en todo momento con encriptación de extremo a extremo.</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Sección de Precios (ID para el ancla del Navbar) */}
      <Box id="pricing" sx={{ py: { xs: 10, md: 16 } }}>
        <Pricing
          user={null}
          products={mockProducts}
          subscription={null}
        />
      </Box>
      
      {/* Sección de Testimonios */}
      <Testimonials />
      
      {/* Sección de Logo Cloud */}
      <LogoCloud />
    </Box>
  );
}
