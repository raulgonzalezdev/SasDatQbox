// Configuración de variables de entorno
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Detectar el tipo de dispositivo/emulador
const isAndroidEmulator = Platform.OS === 'android' && Constants.executionEnvironment === 'bare';
const isIOSSimulator = Platform.OS === 'ios' && Constants.executionEnvironment === 'bare';
const isPhysicalDevice = Constants.executionEnvironment === 'standalone';

// Obtener la URL de Supabase según el entorno
const getSupabaseUrl = () => {
  // Primero intentar usar la variable de entorno
  const envUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  if (envUrl) return envUrl;

  // Si no hay variable de entorno, usar valores predeterminados según el dispositivo
  if (isAndroidEmulator) {
    return 'http://10.0.2.2:54321'; // Especial para emulador Android
  } else if (isIOSSimulator) {
    return 'http://localhost:54321'; // Para simulador iOS
  } else if (isPhysicalDevice) {
    // Para dispositivos físicos, deberías configurar tu IP local en .env
    console.warn('⚠️ Para dispositivos físicos, configura EXPO_PUBLIC_SUPABASE_URL con tu IP local en .env');
    return 'http://192.168.1.X:54321'; // Placeholder, debe ser reemplazado
  } else {
    // Valor predeterminado para desarrollo web o entornos desconocidos
    return 'http://localhost:54321';
  }
};

// Supabase
export const SUPABASE_URL = getSupabaseUrl();
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// API URLs (para compatibilidad con versiones anteriores)
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://10.0.2.2:4000/api';

// Verificar si las variables están definidas
if (!SUPABASE_ANON_KEY) {
  console.warn('⚠️ La clave anónima de Supabase no está definida. Verifica tu archivo .env');
}

// Mostrar la configuración en desarrollo
if (__DEV__) {
  console.log('📱 Entorno de ejecución:', Constants.executionEnvironment);
  console.log('📱 Plataforma:', Platform.OS);
  console.log('🔌 URL de Supabase:', SUPABASE_URL);
  console.log('🔌 API Base URL:', API_BASE_URL);
}

// Exportar todas las variables de entorno
export default {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  API_BASE_URL,
}; 