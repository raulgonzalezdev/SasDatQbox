'use client';

import SignUp from '@/components/ui/AuthForms/Signup';
import { Box, Typography, Container, Paper } from '@mui/material';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';

export default function SignUpPage() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to top right, #f0f4f8, #ffffff)',
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper 
          elevation={0}
          sx={{ 
            padding: 4, 
            width: '100%',
            borderRadius: 3,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.04)',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
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
            <Typography component="h1" variant="h5">
              Crear Cuenta
            </Typography>
            <SignUp />
            <Typography variant="body2" sx={{ mt: 2 }}>
              <Link href="/signin" passHref>
                ¿Ya tienes una cuenta? Inicia sesión
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
