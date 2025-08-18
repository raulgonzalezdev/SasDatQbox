'use client';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import Image from 'next/image';
import Navbar from '@/components/ui/Navbar/Navbar';
import FeaturesSection from '@/components/ui/Landing/FeaturesSection';
import SocialProof from '@/components/ui/Landing/SocialProof';
import Testimonials from '@/components/ui/Landing/Testimonials';
import Pricing from '@/components/ui/Pricing/Pricing';
import FAQ from '@/components/ui/Landing/FAQ';
import Footer from '@/components/ui/Footer/Footer';
import FloatingChatButton from '@/components/ui/Landing/FloatingChatButton';
import ContactDrawer from '@/components/ui/Landing/ContactDrawer';

export default function HomePage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 3,
                  lineHeight: 1.2
                }}
              >
                Plataforma de Telemedicina Moderna
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  color: 'text.secondary',
                  mb: 4,
                  lineHeight: 1.6
                }}
              >
                Conecta profesionales de la salud con pacientes de manera segura y eficiente
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    fontSize: '1.1rem',
                    textTransform: 'none'
                  }}
                >
                  Comenzar Ahora
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  color="primary"
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    fontSize: '1.1rem',
                    textTransform: 'none'
                  }}
                >
                  Ver Demo
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', height: { xs: 300, md: 400 } }}>
                <Image
                  src="https://mejorconsalud.as.com/wp-content/uploads/2023/10/tecnologia-medica-768x432.jpg?auto=webp&quality=7500&width=1920&crop=16:9,smart,safe&format=webp&optimize=medium&dpr=2&fit=cover&fm=webp&q=75&w=1920&h=1080"
                  alt="Telemedicina moderna"
                  fill
                  style={{ objectFit: 'cover', borderRadius: '16px' }}
                  priority
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <FeaturesSection />

      {/* Social Proof */}
      <SocialProof />

      {/* Testimonials */}
      <Testimonials />

      {/* Pricing */}
      <Pricing />

      {/* FAQ */}
      <FAQ />

      {/* Footer */}
      <Footer />

      {/* Floating Chat Button */}
      <FloatingChatButton />

      {/* Contact Drawer */}
      <ContactDrawer />
    </Box>
  );
}
