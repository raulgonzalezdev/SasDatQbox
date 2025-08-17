'use client';

import { useState } from 'react';
import { useLogin, useRegister } from '../../lib/hooks/useAuth';
import { TextField, Button, Typography, Box, Container, Paper } from '@mui/material';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const isLoading = loginMutation.isPending || registerMutation.isPending;
  const error = loginMutation.error?.message || registerMutation.error?.message || null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === 'login') {
        await loginMutation.mutateAsync({ email, password });
        // Handle successful login, e.g., redirect to dashboard
        console.log('Login successful!');
      } else {
        await registerMutation.mutateAsync({ email, password });
        // Handle successful registration, e.g., show success message
        console.log('Registration successful!');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      // Error message is already handled by the `error` state derived from mutations
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          {mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
        </Typography>
        
        <Box component="form" onSubmit={handleAuth} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              Error: {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? 'Procesando...' : mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
          </Button>
        </Box>

        <Button
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          color="primary"
          sx={{ mt: 2 }}
        >
          {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </Button>
      </Paper>
    </Container>
  );
}
