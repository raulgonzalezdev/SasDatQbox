'use client';

import EmailSignIn from '@/components/ui/AuthForms/EmailSignIn';
import { Box, Typography, Container, Paper } from '@mui/material';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';

export default function SignInPage() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) => theme.palette.mode === 'dark' 
          ? 'linear-gradient(to top right, #1a1a1a, #2d2d2d)' 
          : 'linear-gradient(to top right, #f0f4f8, #ffffff)',
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper 
          elevation={0} // Quitamos la sombra base para usar una personalizada
          sx={{ 
            padding: 4, 
            width: '100%',
            borderRadius: 3, // Bordes más redondeados
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#2d2d2d' : '#ffffff',
            color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
            boxShadow: (theme) => theme.palette.mode === 'dark' 
              ? '0 10px 25px rgba(0, 0, 0, 0.3), 0 5px 10px rgba(0, 0, 0, 0.2)' 
              : '0 10px 25px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.04)',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)', // Efecto de elevación al pasar el mouse
            }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Logo width={120} height={120} disabledLink={true} />
            </Box>
            <Typography 
              component="h1" 
              variant="h5"
              sx={{ 
                color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                fontWeight: 'bold'
              }}
            >
              Iniciar Sesión
            </Typography>
            <EmailSignIn />
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 2,
                '& a': {
                  color: (theme) => theme.palette.mode === 'dark' ? '#4db6ac' : '#1976d2',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }
              }}
            >
              <Link href="/signin/signup" passHref>
                ¿No tienes una cuenta? Regístrate
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
