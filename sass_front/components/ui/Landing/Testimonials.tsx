'use client';

import Slider from 'react-slick';
import { Box, Typography, Paper, Avatar, Rating } from '@mui/material';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
  {
    name: 'Pipo',
    title: 'Desarrollador',
    avatar: '/path-to-avatar/pipo.jpg',
    rating: 5,
    quote:
      'Me salva full pa pagos. Ayer estaba lenta pero creo que era porque aquí había puente y todos la estábamos usando, lol.'
  },
  {
    name: 'Mariana López',
    title: 'Diseñadora UX',
    avatar: '/path-to-avatar/mariana.jpg',
    rating: 5,
    quote:
      'Gran iniciativa, muy útil y sencilla, deseando que llegue la tarjeta física pronto. Creo que ahora la uso más que mi banco.'
  },
  {
    name: 'Carlos R.',
    title: 'Emprendedor',
    avatar: '/path-to-avatar/carlos.jpg',
    rating: 4.5,
    quote:
      'La aplicación funciona sin problemas, se la recomiendo a todos mis colegas en el sector.'
  }
];

export default function Testimonials() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
      <Box sx={{ maxWidth: 'md', mx: 'auto', px: 3, textAlign: 'center' }}>
        <Typography variant="h2" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
          Nuestros usuarios nos aman
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 6 }}>
          Cientos de miles de usuarios de todo el mundo confían en nosotros.
        </Typography>
        <Slider {...settings}>
          {testimonials.map((testimonial) => (
            <Box key={testimonial.name} sx={{ px: 2 }}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 4, 
                  mx: 'auto', 
                  maxWidth: 500, 
                  textAlign: 'left',
                  borderRadius: 2
                }}
              >
                <Rating value={testimonial.rating} precision={0.5} readOnly />
                <Typography variant="body1" sx={{ my: 2 }}>
                  "{testimonial.quote}"
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src={testimonial.avatar} alt={testimonial.name} sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">{testimonial.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{testimonial.title}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
}
