'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from '@/store/appStore';
import { customFetch } from '@/utils/api';
import { handleApiError } from '@/utils/api-helpers';

// --- Type Definitions ---
interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'doctor' | 'patient';
}

interface AuthPayload {
  payload: Record<string, any>;
}

// --- API Fetcher Functions ---
const fetchUser = async (): Promise<User> => {
  const res = await customFetch('/auth/me');
  if (!res.ok) {
    throw new Error('Not authenticated');
  }
  return res.json();
};

const loginUser = async ({ payload }: AuthPayload) => {
  const body = new URLSearchParams(payload).toString();
  return await customFetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
};

const registerUser = async ({ payload }: AuthPayload) => {
  return await customFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

const logoutUser = async () => {
  return await customFetch('/auth/logout', { method: 'POST' });
};

// --- Main Auth Hook ---
export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, setUser, logout: localLogout } = useAppStore();

  // Query to fetch the current user
  const { data: currentUser, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    retry: false, // Don't retry on error, as it's likely a 401
    refetchOnWindowFocus: false,
  });

  // Effect to sync Zustand store with React Query state
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
    if (isError) {
      setUser(null);
    }
  }, [currentUser, isError, setUser]);

  // Mutation for logging in
  const { mutate: login, isPending: isLoggingIn } = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      toast.success('¡Bienvenido de nuevo!');
      // Invalidate the user query to refetch it
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.push('/account');
    },
    onError: handleApiError,
  });

  // Mutation for registering
  const { mutate: register, isPending: isRegistering } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success('¡Registro exitoso! Por favor, inicia sesión.');
      router.push('/signin');
    },
    onError: handleApiError,
  });

  // Mutation for logging out
  const { mutateAsync: logoutMutation } = useMutation({
    mutationFn: logoutUser,
  });

  const logout = async () => {
    localLogout();
    try {
      await logoutMutation();
      queryClient.setQueryData(['user'], null); // Clear user data immediately
      toast.success('Has cerrado sesión.');
      router.push('/');
    } catch (error) {
      handleApiError(error);
    }
  };

  return {
    user: user,
    isLoading,
    isLoggingIn,
    isRegistering,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };
}
