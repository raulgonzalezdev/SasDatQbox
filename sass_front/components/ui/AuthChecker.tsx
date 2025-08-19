'use client';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function AuthChecker() {
  const { status, checkAuth } = useAuth();

  useEffect(() => {
    // Solo verificar una vez al cargar la página si no estamos ya autenticados
    if (status === 'unauthenticated') {
      checkAuth();
    }
  }, [status, checkAuth]);

  // Este componente no renderiza nada, solo maneja la lógica
  return null;
}
