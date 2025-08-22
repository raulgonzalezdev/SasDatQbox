import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '@/store/appStore';
import { Colors } from '@/constants/GlobalStyles';

export default function SplashPage() {
  const { isAuthenticated, user, forceLanding, setForceLanding } = useAppStore();

  console.log('📱 SplashPage - Estado:', { 
    isAuthenticated, 
    user: !!user, 
    forceLanding 
  });

  useEffect(() => {
    const redirectToAppropriateScreen = () => {
      console.log('🔄 Decidiendo redirección...', { 
        isAuthenticated, 
        hasUser: !!user, 
        forceLanding 
      });
      
      // Pequeño delay para mostrar el splash
      setTimeout(() => {
        // Si hay flag de forzar landing (después de logout)
        if (forceLanding) {
          console.log('🔄 ForceLanding activo, redirigiendo a landing original...');
          setForceLanding(false); // Reset del flag
          router.replace('/landing');
          return;
        }
        
        if (isAuthenticated && user) {
          console.log('✅ Usuario autenticado, redirigiendo a app principal...');
          // Si está autenticado, ir a la app principal
          router.replace('/(drawer)');
        } else {
          console.log('❌ Usuario no autenticado, redirigiendo a landing original...');
          // Si no está autenticado, ir a la landing page original (con traducciones corregidas)
          router.replace('/landing');
        }
      }, 1000);
    };

    redirectToAppropriateScreen();
  }, [isAuthenticated, user, forceLanding, setForceLanding]);

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