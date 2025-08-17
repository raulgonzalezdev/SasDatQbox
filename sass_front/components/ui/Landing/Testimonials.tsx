"use client";
import { Box, Typography, Grid, Paper, Avatar, Rating } from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslations, useMessages } from 'next-intl';

const defaultTestimonials = [
  {
    name: 'Mariana López',
    initial: 'M',
    rating: 5,
    quote: 'Gran iniciativa, muy útil y sencilla, deseando que llegue la tarjeta física pronto. Creo que ahora la uso más que mi banco.',
  },
  {
    name: 'Carlos',
    initial: 'C',
    rating: 4.5,
    quote: 'La aplicación funciona muy bien, hasta ahora no he podido tener ningún problema. La he usado en Europa, y ya la recomendé a varios amigos.',
  },
  {
    name: 'Pipo',
    initial: 'P',
    rating: 5,
    quote: 'Me salva full pa pagos. Ayer estaba lenta pero creo que era porque aquí había puente y todos la estábamos usando, lol.',
  },
];

const imageBubbles = [
    { src: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=200', size: 100, top: '20%', left: '15%' },
    { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', size: 60, top: '10%', left: '45%' },
    { src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200', size: 250, top: '40%', left: '30%' },
    { src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200', size: 80, top: '75%', left: '10%' },
    { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', size: 120, top: '80%', left: '55%' },
];

export default function Testimonials() {
  const t = useTranslations('Testimonials');
  const messages = useMessages();
  const testimonials = (messages?.Testimonials?.items ?? defaultTestimonials) as Array<any>;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    arrows: false,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, overflow: 'hidden' }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
            <Box sx={{ 
                position: 'relative', 
                height: { xs: '400px', md: '600px' }, 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {[...Array(5)].map((_, i) => (
                    <Box key={i} sx={{
                        position: 'absolute',
                        borderRadius: '50%',
                        border: '1px solid #e0e0e0',
                        width: `${150 + i * 120}px`,
                        height: `${150 + i * 120}px`,
                    }} />
                ))}
                {imageBubbles.map((bubble, index) => (
                    <Avatar 
                        key={index}
                        src={bubble.src}
                        sx={{
                            width: bubble.size,
                            height: bubble.size,
                            position: 'absolute',
                            top: bubble.top,
                            left: bubble.left,
                            border: '4px solid white',
                        }}
                    />
                ))}
            </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: { xs: 'center', md: 'left' }, pr: { md: 4 } }}>
            <Typography variant="h2" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
              {t('title')}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 6 }}>
              {t('subtitle')}
            </Typography>
            <Box sx={{ maxWidth: { xs: 320, sm: 400, md: '100%' }, mx: 'auto' }}>
              <Slider {...sliderSettings}>
                {testimonials.map((testimonial) => (
                  <Box key={testimonial.name} sx={{ px: 1.5 }}>
                    <Paper
                      elevation={3}
                      sx={{ p: 3, mb: 3, height: '100%' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>{testimonial.initial || testimonial.name?.[0]}</Avatar>
                        <Typography variant="subtitle1" fontWeight="bold">{testimonial.name}</Typography>
                        <Rating value={testimonial.rating} precision={0.5} readOnly sx={{ ml: 'auto' }} />
                      </Box>
                      <Typography variant="body1">"{testimonial.quote}"</Typography>
                    </Paper>
                  </Box>
                ))}
              </Slider>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
