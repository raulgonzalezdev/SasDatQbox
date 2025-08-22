'use client';

import { Box, TextField, Button, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import React from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function EmailSignIn() {
  const { login, isLoggingIn } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

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
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="current-password"
        disabled={isLoggingIn}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
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
