import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { Colors } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';
import { checkAuthStatus } from '@/services/auth';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, setAuthenticated, setUser } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Verificar el estado de autenticación al cargar la app
        const authStatus = await checkAuthStatus();
        if (authStatus.isAuthenticated && authStatus.user) {
          setAuthenticated(true);
          setUser(authStatus.user);
        }
      } catch (error) {
        console.log('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (loaded) {
      initializeApp();
      SplashScreen.hideAsync();
    }
  }, [loaded, setAuthenticated, setUser]);

  if (!loaded || isLoading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <View style={{ flex: 1, backgroundColor: Colors.primary }}>
          <CustomStatusBar backgroundColor={Colors.primary} barStyle="dark-content" />
          <Stack screenOptions={{ 
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' }
          }}>
            {/* Pantalla de splash */}
            <Stack.Screen name="index" options={{ animation: 'fade' }} />
            
            {/* Landing page - mostrada cuando no está autenticado */}
            <Stack.Screen name="landing" options={{ animation: 'slide_from_bottom' }} />
            
            {/* Pantallas de autenticación */}
            <Stack.Screen name="auth" options={{ animation: 'fade' }} />
            
            {/* App principal - mostrada cuando está autenticado */}
            <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
            
            {/* Pantallas de perfil y configuración */}
            <Stack.Screen name="profile" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="help" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="about" options={{ animation: 'slide_from_right' }} />
            
            {/* Otras pantallas */}
            <Stack.Screen name="+not-found" />
          </Stack>
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
