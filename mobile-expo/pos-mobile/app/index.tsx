import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '@/store/appStore';
import { Colors } from '@/constants/GlobalStyles';

export default function SplashPage() {
  const { 
    isAuthenticated, 
    user, 
    forceLanding, 
    setForceLanding,
    isExploring,
    hasSeenOnboarding,
    setExploring,
    setHasSeenOnboarding 
  } = useAppStore();

  console.log('📱 SplashPage - Estado:', { 
    isAuthenticated, 
    user: !!user, 
    forceLanding,
    isExploring,
    hasSeenOnboarding
  });

  useEffect(() => {
    const redirectToAppropriateScreen = () => {
      console.log('🔄 Decidiendo redirección...', { 
        isAuthenticated, 
        hasUser: !!user, 
        forceLanding,
        isExploring,
        hasSeenOnboarding
      });
      
      // Pequeño delay para mostrar el splash
      setTimeout(() => {
        // Si hay flag de forzar landing (después de logout)
        if (forceLanding) {
          console.log('🔄 ForceLanding activo, redirigiendo a landing...');
          setForceLanding(false); // Reset del flag
          router.replace('/landing');
          return;
        }
        
        // PRIORIDAD 1: Usuario autenticado → Ir a app
        if (isAuthenticated && user) {
          console.log('✅ Usuario autenticado, redirigiendo a app principal...');
          router.replace('/(drawer)');
          return;
        }
        
        // PRIORIDAD 2: Usuario explorando → Ir a app como invitado
        if (isExploring && hasSeenOnboarding) {
          console.log('🔍 Usuario explorando, redirigiendo a app como invitado...');
          router.replace('/(drawer)');
          return;
        }
        
        // PRIORIDAD 3: Primera vez → Mostrar landing
        console.log('🏠 Primera vez o sin sesión, redirigiendo a landing...');
        router.replace('/landing');
      }, 1000);
    };

    redirectToAppropriateScreen();
  }, [isAuthenticated, user, forceLanding, setForceLanding, isExploring, hasSeenOnboarding]);

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: Colors.primary, 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
      <ActivityIndicator size="large" color={Colors.secondary} />
    </View>
  );
} 