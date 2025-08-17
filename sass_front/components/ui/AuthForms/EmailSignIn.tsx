'use client';

import { Box, TextField, Button, CircularProgress } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import React from 'react';

export default function EmailSignIn() {
  const { login, isLoggingIn } = useAuth();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const payload = {
      username: formData.get('email') as string,
      password: formData.get('password') as string,
    };
    
    login({ payload }); // Llamamos a la mutación con el formato correcto
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        mt: 3 
      }}
    >
      <TextField
        required
        fullWidth
        id="email"
        label="Correo Electrónico"
        name="email"
        autoComplete="email"
        autoFocus
        disabled={isLoggingIn}
      />
      <TextField
        required
        fullWidth
        name="password"
        label="Contraseña"
        type="password"
        id="password"
        autoComplete="current-password"
        disabled={isLoggingIn}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isLoggingIn}
        sx={{ mt: 3, mb: 2 }}
      >
        {isLoggingIn ? <CircularProgress size={24} /> : 'Iniciar Sesión'}
      </Button>
    </Box>
  );
}
