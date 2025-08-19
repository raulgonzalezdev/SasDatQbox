'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from '@/store/appStore';
import { customFetch } from '@/utils/api';
import { handleApiError } from '@/utils/api-helpers';
import { clearAllAuthData } from '@/utils/auth-helpers';
import { useParams } from 'next/navigation';

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
  const params = useParams();
  const locale = params.locale as string;

  // Query para verificar el estado de autenticación (solo una vez al cargar)
  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    enabled: status === 'loading', // Solo ejecutar cuando estemos en estado de loading
  });

  // Efecto para sincronizar el estado del store con la query (solo una vez)
  useEffect(() => {
    if (userData && status === 'loading') {
      setUserAndAuth(userData);
    } else if (error && status === 'loading') {
      setUserAndAuth(null);
    }
  }, [userData, error, status, setUserAndAuth]);

  const { mutate: login, isPending: isLoggingIn } = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      toast.success('¡Bienvenido de nuevo!');
      // Después del login exitoso, obtener los datos del usuario
      try {
        const userData = await fetchUser();
        setUserAndAuth(userData);
        queryClient.setQueryData(['user'], userData);
      } catch (error) {
        console.error('Error fetching user data after login:', error);
        // Si no podemos obtener los datos del usuario, al menos establecer el estado como autenticado
        setUserAndAuth(data);
      }
      // Redirigir al dashboard después del login exitoso
      router.push(`/${locale}/account`);
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
      router.push(`/${locale}/signin`);
    },
    onError: handleApiError,
  });

  // Mutation for logging out
  const { mutateAsync: logoutMutation } = useMutation({
    mutationFn: logoutUser,
  });

  const logout = async () => {
    try {
      await logoutMutation();
    } catch (error) {
      console.error('Error during server logout:', error);
    } finally {
      // Siempre limpiar todo el estado de autenticación, sin importar si el servidor responde o no
      clearAllAuthData(); // Limpiar cookies y localStorage
      localLogout(); // Limpiar el store
      queryClient.setQueryData(['user'], null); // Clear user data immediately
      queryClient.invalidateQueries({ queryKey: ['user'] }); // Invalidar la query
      toast.success('Has cerrado sesión.');
      
      // Redirigir a la landing page después del logout
      // Asegurarse de que siempre redirija a la landing page, no al dashboard
      const currentLocale = locale || 'es'; // Fallback a español si no hay locale
      router.push(`/${currentLocale}`);
    }
  };

  // Función para verificar manualmente la autenticación (solo cuando sea necesario)
  const checkAuth = useCallback(async () => {
    // Solo verificar si no estamos ya autenticados
    if (status === 'authenticated') {
      return true;
    }
    
    try {
      const userData = await customFetch('/auth/me');
      setUserAndAuth(userData);
      queryClient.setQueryData(['user'], userData);
      return true;
    } catch (error) {
      setUserAndAuth(null);
      queryClient.setQueryData(['user'], null);
      return false;
    }
  }, [status, setUserAndAuth, queryClient]);

  return {
    user,
    status,
    isLoading: status === 'loading' || isLoading,
    isAuthenticated: status === 'authenticated',
    isLoggingIn,
    isRegistering,
    login,
    register,
    logout,
    checkAuth,
  };
}
