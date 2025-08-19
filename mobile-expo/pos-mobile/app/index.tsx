import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '@/store/appStore';
import { Colors } from '@/constants/GlobalStyles';

export default function SplashPage() {
  const { isAuthenticated } = useAppStore();

  useEffect(() => {
    const redirectToAppropriateScreen = () => {
      // Pequeño delay para mostrar el splash
      setTimeout(() => {
        if (isAuthenticated) {
          // Si está autenticado, ir a la app principal
          router.replace('/(tabs)');
        } else {
          // Si no está autenticado, ir a la landing page
          router.replace('/landing');
        }
      }, 1000);
    };

    redirectToAppropriateScreen();
  }, [isAuthenticated]);

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