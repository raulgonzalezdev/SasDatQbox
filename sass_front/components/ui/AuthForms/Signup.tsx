'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

// Esquema de validación con Zod
const formSchema = z.object({
  first_name: z.string().min(1, 'El nombre es requerido'),
  last_name: z.string().min(1, 'El apellido es requerido'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

type FormData = z.infer<typeof formSchema>;

export default function SignUp() {
  const { register: signup, isRegistering } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    signup({ payload: data }); // Llamamos a la mutación con el formato correcto
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        required
        fullWidth
        id="first_name"
        label="Nombre"
        autoComplete="given-name"
        autoFocus
        {...register('first_name')}
        error={!!errors.first_name}
        helperText={errors.first_name?.message}
        disabled={isRegistering}
      />
      <TextField
        required
        fullWidth
        id="last_name"
        label="Apellido"
        autoComplete="family-name"
        {...register('last_name')}
        error={!!errors.last_name}
        helperText={errors.last_name?.message}
        disabled={isRegistering}
      />
      <TextField
        required
        fullWidth
        id="email"
        label="Correo Electrónico"
        autoComplete="email"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
        disabled={isRegistering}
      />
      <TextField
        required
        fullWidth
        name="password"
        label="Contraseña"
        type="password"
        id="password"
        autoComplete="new-password"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
        disabled={isRegistering}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isRegistering}
      >
        {isRegistering ? <CircularProgress size={24} /> : 'Crear Cuenta'}
      </Button>
      <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
        <Link href="/signin">
          ¿Ya tienes una cuenta? Inicia sesión
        </Link>
      </Typography>
    </Box>
  );
}
