import { Box, Typography, Link, Grid } from '@mui/material';

export default function LogoCloud() {
  return (
    <Box sx={{ mt: 6, textAlign: 'center' }}>
      <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.3em', color: 'text.secondary' }}>
        Traído a usted por
      </Typography>
      <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ my: 3 }}>
        <Grid item>
          <Link href="https://nextjs.org" aria-label="Next.js Link" target="_blank" rel="noopener">
            <Box component="img" src="/nextjs.svg" alt="Next.js Logo" sx={{ height: { xs: 30, sm: 48 }, filter: 'invert(1)' }} />
          </Link>
        </Grid>
        <Grid item>
          <Link href="https://vercel.com" aria-label="Vercel.com Link" target="_blank" rel="noopener">
            <Box component="img" src="/vercel.svg" alt="Vercel.com Logo" sx={{ height: 30, filter: 'invert(1)' }} />
          </Link>
        </Grid>
        <Grid item>
          <Link href="https://stripe.com" aria-label="stripe.com Link" target="_blank" rel="noopener">
            <Box component="img" src="/stripe.svg" alt="stripe.com Logo" sx={{ height: 48, filter: 'invert(1)' }} />
          </Link>
        </Grid>
        <Grid item>
          <Link href="https://github.com" aria-label="github.com Link" target="_blank" rel="noopener">
            <Box component="img" src="/github.svg" alt="github.com Logo" sx={{ height: 32, filter: 'invert(1)' }} />
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
}
