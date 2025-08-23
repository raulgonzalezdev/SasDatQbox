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
  const { isAuthenticated, user, isExploring } = useAppStore();

  console.log('🛡️ AuthGuard - Verificando:', { 
    requireAuth, 
    isAuthenticated, 
    hasUser: !!user,
    userId: user?.id,
    isExploring
  });

  useEffect(() => {
    // Si requiere autenticación estricta
    if (requireAuth && !isAuthenticated && !isExploring) {
      console.log('🔒 AuthGuard: Acceso protegido, redirigiendo a landing...');
      router.replace('/landing');
      return;
    }

    // Si está autenticado, verificar datos válidos
    if (requireAuth && isAuthenticated && (!user || !user.id)) {
      console.log('👤 AuthGuard: Datos de usuario inválidos, redirigiendo a landing...');
      console.log('👤 User data:', user);
      router.replace('/landing');
      return;
    }

    // Log del estado final
    if (isAuthenticated && user) {
      console.log('✅ AuthGuard: Usuario autenticado válido');
    } else if (isExploring) {
      console.log('🔍 AuthGuard: Modo explorar activo');
    }
  }, [isAuthenticated, user, requireAuth, isExploring]);

  // Si requiere autenticación estricta pero no está autenticado ni explorando
  if (requireAuth && !isAuthenticated && !isExploring) {
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
