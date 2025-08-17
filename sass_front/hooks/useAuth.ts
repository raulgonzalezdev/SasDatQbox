'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';
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
  const res = await customFetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  return res; // customFetch ya devuelve el JSON
};

const registerUser = async ({ payload }: AuthPayload) => {
  const res = await customFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res; // customFetch ya devuelve el JSON
};

const logoutUser = async () => {
  return await customFetch('/auth/logout', { method: 'POST' });
};

// --- Main Auth Hook ---
export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, status, setUserAndAuth, setStatus, logout: localLogout } = useAppStore();

  // Efecto para verificar la sesión del usuario al cargar la app
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const userData = await customFetch('/auth/me');
        setUserAndAuth(userData);
      } catch (error) {
        setUserAndAuth(null);
      }
    };

    if (status === 'loading') {
      checkUserStatus();
    }
  }, [status, setUserAndAuth]);

  const { mutate: login, isPending: isLoggingIn } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      toast.success('¡Bienvenido de nuevo!');
      setUserAndAuth(data);
      queryClient.setQueryData(['user'], data);
      router.push('/account');
    },
    onError: (error) => {
      localLogout();
      handleApiError(error);
    },
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
    user,
    status,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    isLoggingIn,
    isRegistering,
    login,
    register,
    logout,
  };
}
