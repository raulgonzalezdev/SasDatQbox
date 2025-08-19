'use client';
import { Box } from '@mui/material';
import Navbar from '@/components/ui/Navbar/Navbar';
import Hero from '@/components/ui/Landing/Hero';
import FeaturesSection from '@/components/ui/Landing/FeaturesSection';
import SocialProof from '@/components/ui/Landing/SocialProof';
import Testimonials from '@/components/ui/Landing/Testimonials';
import Pricing from '@/components/ui/Pricing/Pricing';
import FAQ from '@/components/ui/Landing/FAQ';
import AboutSection from '@/components/ui/Landing/AboutSection';
import SecuritySection from '@/components/ui/Landing/SecuritySection';
import Footer from '@/components/ui/Footer/Footer';
import FloatingChatButton from '@/components/ui/Landing/FloatingChatButton';
import ContactDrawer from '@/components/ui/Landing/ContactDrawer';

export default function HomePage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      {/* Hero Section */}
      <Hero />

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

      {/* About Section */}
      <AboutSection />

      {/* Security Section */}
      <SecuritySection />

      {/* Footer */}
      <Footer />

      {/* Floating Chat Button */}
      <FloatingChatButton />

      {/* Contact Drawer */}
      <ContactDrawer />
    </Box>
  );
}
