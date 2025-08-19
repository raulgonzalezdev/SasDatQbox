'use client';
import { Box, Typography, Container, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function DashboardFooter() {
  const t = useTranslations('Dashboard.footer');

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1a1a1a' : theme.palette.primary.main,
        color: 'white',
        borderTop: '1px solid',
        borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
        borderRadius: '8px 8px 0 0', // Subtle rounded top corners
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="body2" sx={{ 
            color: 'white', // Keep the white color for copyright
            fontWeight: 500, // Keep the bold weight
            opacity: 0.95 // Increase opacity for better contrast
          }}>
            © {new Date().getFullYear()} BoxDoctor. {t('rights')}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <MuiLink
              component={Link}
              href="/#sobre-nosotros"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'white',
                textDecoration: 'none',
                opacity: 0.9,
                fontSize: '0.875rem',
                fontWeight: 500,
                '&:hover': {
                  opacity: 1,
                  textDecoration: 'underline',
                  color: (theme) => theme.palette.mode === 'dark' ? '#4db6ac' : '#ffffff',
                },
              }}
            >
              {t('about')}
            </MuiLink>
            <MuiLink
              component={Link}
              href="/#seguridad"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'white',
                textDecoration: 'none',
                opacity: 0.9,
                fontSize: '0.875rem',
                fontWeight: 500,
                '&:hover': {
                  opacity: 1,
                  textDecoration: 'underline',
                  color: (theme) => theme.palette.mode === 'dark' ? '#4db6ac' : '#ffffff',
                },
              }}
            >
              {t('security')}
            </MuiLink>
            <MuiLink
              component={Link}
              href="/blog"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'white',
                textDecoration: 'none',
                opacity: 0.9,
                fontSize: '0.875rem',
                fontWeight: 500,
                '&:hover': {
                  opacity: 1,
                  textDecoration: 'underline',
                  color: (theme) => theme.palette.mode === 'dark' ? '#4db6ac' : '#ffffff',
                },
              }}
            >
              {t('blog')}
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
