"use client";
import { Box, Typography } from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslations } from 'next-intl';

const logos = [
  { name: 'Circle', component: <Typography variant="h6" component="span">CIRCLE</Typography> },
  { name: 'Fireblocks', component: <Typography variant="h6" component="span">FIREBLOCKS</Typography> },
  { name: 'Mastercard', component: <Typography variant="h6" component="span">MASTERCARD</Typography> },
  { name: 'Stellar', component: <Typography variant="h6" component="span">STELLAR</Typography> },
  { name: 'Visa', component: <Typography variant="h6" component="span">VISA</Typography> },
  { name: 'Stripe', component: <Typography variant="h6" component="span">STRIPE</Typography> },
];

export default function LogoCloud() {
  const t = useTranslations('LogoCloud');
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 5000,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'linear',
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  return (
    <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'background.paper', overflow: 'hidden' }}>
      <Box sx={{ maxWidth: 'lg', mx: 'auto', px: 3 }}>
        <Typography 
          textAlign="center" 
          variant="h6" 
          color="text.secondary" 
          sx={{ 
            mb: { xs: 4, md: 6 },
            fontSize: { xs: '0.9rem', md: '1.25rem' }
          }}
        >
          {t('trustedBy')}
        </Typography>
        <Slider {...settings}>
          {logos.map((logo) => (
            <Box key={logo.name} sx={{ px: { xs: 1, md: 2 } }}>
              <Box sx={{
                textAlign: 'center',
                color: 'text.secondary',
                filter: 'grayscale(100%)',
                opacity: 0.6,
                transition: 'all 0.3s ease',
                fontSize: { xs: '0.8rem', sm: '1rem', md: '1.25rem' },
                '&:hover': {
                  filter: 'grayscale(0%)',
                  opacity: 1,
                  color: 'text.primary',
                }
              }}>
                {logo.component}
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
}
