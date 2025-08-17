'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useRegister } from '@/lib/hooks/useAuth';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof formSchema>;

export default function SignUp() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const registerMutation = useRegister();

  const onSubmit = async (data: FormData) => {
    try {
      await registerMutation.mutateAsync(data);
      console.log('Registration successful!');
      router.push('/signin'); // Redirect to signin page on successful registration
    } catch (error) {
      console.error('Registration failed:', error);
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
        autoComplete="new-password"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      {registerMutation.error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          Error: {registerMutation.error.message}
        </Typography>
      )}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? 'Signing Up...' : 'Sign Up'}
      </Button>
      <Typography variant="body2" sx={{ mt: 2 }}>
        <Link href="/signin/password_signin" passHref>
          Already have an account? Sign in
        </Link>
      </Typography>
    </Box>
  );
}
