'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type FormData = z.infer<typeof formSchema>;

export default function PasswordSignIn() {
  const { login, isLoggingIn } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    const payload = {
      username: data.email,
      password: data.password,
    };
    login({ payload });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Correo Electrónico"
        autoComplete="email"
        autoFocus
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
        disabled={isLoggingIn}
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
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
        disabled={isLoggingIn}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isLoggingIn}
      >
        {isLoggingIn ? <CircularProgress size={24} /> : 'Iniciar Sesión'}
      </Button>
      <Typography variant="body2" sx={{ mt: 2 }}>
        <Link href="/signin/forgot_password" passHref>
          ¿Olvidaste tu contraseña?
        </Link>
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        <Link href="/signin/signup" passHref>
          ¿No tienes una cuenta? Regístrate
        </Link>
      </Typography>
    </Box>
  );
}
