import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { Colors } from '@/constants/GlobalStyles';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
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
            {/* Pantallas principales */}
            <Stack.Screen name="index" options={{ animation: 'fade' }} />
            <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
            
            {/* Pantallas de autenticación */}
            <Stack.Screen name="auth" options={{ animation: 'fade' }} />
            
            {/* Pantallas de perfil y configuración */}
            <Stack.Screen name="profile" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="help" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="about" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="landing" options={{ animation: 'slide_from_bottom' }} />
            
            {/* Otras pantallas */}
            <Stack.Screen name="+not-found" />
          </Stack>
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
