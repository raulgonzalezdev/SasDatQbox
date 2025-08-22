import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '@/store/appStore';
import { Colors } from '@/constants/GlobalStyles';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAuth = true }) => {
  const { isAuthenticated, user } = useAppStore();

  console.log('🛡️ AuthGuard - Verificando:', { 
    requireAuth, 
    isAuthenticated, 
    hasUser: !!user,
    userId: user?.id 
  });

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      console.log('🔒 AuthGuard: Usuario no autenticado, redirigiendo a landing original...');
      router.replace('/landing');
      return;
    }

    if (requireAuth && (!user || !user.id)) {
      console.log('👤 AuthGuard: Datos de usuario inválidos, redirigiendo a landing original...');
      console.log('👤 User data:', user);
      router.replace('/landing');
      return;
    }

    if (requireAuth && isAuthenticated && user) {
      console.log('✅ AuthGuard: Usuario válido, permitiendo acceso');
    }
  }, [isAuthenticated, user, requireAuth]);

  // Si requiere autenticación pero no está autenticado, mostrar loading
  if (requireAuth && (!isAuthenticated || !user)) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
      }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
