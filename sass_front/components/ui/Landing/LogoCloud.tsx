'use client';

import { Box, Typography, Grid, SvgIcon } from '@mui/material';

// Placeholder logos. In a real app, these would be proper SVG components.
const logos = [
  { name: 'Circle', component: <Typography variant="h4" component="span">CIRCLE</Typography> },
  { name: 'Fireblocks', component: <Typography variant="h4" component="span">FIREBLOCKS</Typography> },
  { name: 'Mastercard', component: <Typography variant="h4" component="span">MASTERCARD</Typography> },
  { name: 'Stellar', component: <Typography variant="h4" component="span">STELLAR</Typography> }
];

export default function LogoCloud() {
  return (
    <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
      <Box sx={{ maxWidth: 'lg', mx: 'auto', px: 3 }}>
        <Typography 
          textAlign="center" 
          variant="h6" 
          color="text.secondary" 
          sx={{ mb: 6 }}
        >
          Contamos con el apoyo y alianzas de prestigio mundial
        </Typography>
        <Grid container spacing={{ xs: 4, sm: 6 }} justifyContent="center" alignItems="center">
          {logos.map((logo) => (
            <Grid item key={logo.name}>
              <Box sx={{
                color: 'text.secondary',
                filter: 'grayscale(100%)',
                opacity: 0.6,
                transition: 'all 0.3s ease',
                '&:hover': {
                  filter: 'grayscale(0%)',
                  opacity: 1,
                  color: 'text.primary',
                }
              }}>
                {logo.component}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
