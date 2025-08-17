'use client';

import { useState }s from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useLogin } from '@/lib/hooks/useAuth';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof formSchema>;

export default function PasswordSignIn() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const loginMutation = useLogin();

  const onSubmit = async (data: FormData) => {
    try {
      await loginMutation.mutateAsync(data);
      router.push('/account'); // Redirect to account page on successful login
    } catch (error) {
      console.error('Login failed:', error);
      // Error message is handled by the mutation's error state and displayed below
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        autoComplete="email"
        autoFocus
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      {loginMutation.error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          Error: {loginMutation.error.message}
        </Typography>
      )}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
      </Button>
      <Typography variant="body2" sx={{ mt: 2 }}>
        <Link href="/signin/forgot_password" passHref>
          Forgot your password?
        </Link>
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        <Link href="/signin/signup" passHref>
          Don't have an account? Sign up
        </Link>
      </Typography>
    </Box>
  );
}
