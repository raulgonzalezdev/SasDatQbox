"use client";
import { Box, Typography, Grid } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import VideocamIcon from '@mui/icons-material/Videocam';
import GroupIcon from '@mui/icons-material/Group';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import { useMessages } from 'next-intl';

const defaultStats = [
  {
    icon: <VideocamIcon fontSize="large" color="primary" />,
    value: '10.000+',
    label: 'Consultas por vídeo realizadas',
  },
  {
    icon: <StarIcon fontSize="large" style={{ color: '#FFC107' }} />,
    value: '4.9 ★',
    label: 'Clasificación de Play Store',
  },
  {
    icon: <GroupIcon fontSize="large" color="primary" />,
    value: '500+',
    label: 'Profesionales de la salud',
  },
  {
    icon: <BrandingWatermarkIcon fontSize="large" color="primary" />,
    value: '50+',
    label: 'Productos de marca blanca',
  },
];

export default function SocialProof() {
  const messages = useMessages();
  const stats = messages?.SocialProof?.stats ?? defaultStats;

  return (
    <Box sx={{ py: 4 }}>
      <Grid container justifyContent="center" spacing={2}>
        {stats.map((stat: any) => (
          <Grid item key={stat.label} xs={6} sm={3}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              textAlign: 'center'
            }}>
              {stat.icon}
              <Typography variant="h5" component="p" fontWeight="bold" sx={{ mt: 1 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
