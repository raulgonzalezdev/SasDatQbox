// Configuración de variables de entorno para BoxDoctor Mobile
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Detectar el tipo de dispositivo/emulador
const isAndroidEmulator = Platform.OS === 'android' && Constants.executionEnvironment === 'bare';
const isIOSSimulator = Platform.OS === 'ios' && Constants.executionEnvironment === 'bare';
const isPhysicalDevice = Constants.executionEnvironment === 'standalone';
const isWeb = Platform.OS === 'web';

// Obtener la URL de la API según el entorno
const getApiBaseUrl = () => {
  // Primero intentar usar la variable de entorno
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (envUrl) return envUrl;

  // Si no hay variable de entorno, usar valores predeterminados según el dispositivo
  if (isAndroidEmulator) {
    return 'http://10.0.2.2:8001/api/v1'; // Especial para emulador Android
  } else if (isIOSSimulator) {
    return 'http://localhost:8001/api/v1'; // Para simulador iOS
  } else if (isWeb) {
    return 'http://localhost:8001/api/v1'; // Para desarrollo web
  } else if (isPhysicalDevice) {
    // Para dispositivos físicos, deberías configurar tu IP local en .env
    console.warn('⚠️ Para dispositivos físicos, configura EXPO_PUBLIC_API_BASE_URL con tu IP local en .env');
    return 'http://192.168.1.X:8001/api/v1'; // Placeholder, debe ser reemplazado
  } else {
    // Valor predeterminado para entornos desconocidos
    return 'http://localhost:8001/api/v1';
  }
};

// Configuración de la API
export const API_BASE_URL = getApiBaseUrl();

// Configuración de autenticación
export const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// URLs del sitio web
export const SITE_URL = process.env.EXPO_PUBLIC_SITE_URL || 'https://boxdoctor.com';
export const DEV_URL = process.env.EXPO_PUBLIC_DEV_URL || 'http://localhost:3000';

// Feature flags
export const DEV_MODE = process.env.EXPO_PUBLIC_DEV_MODE === 'true';
export const DEBUG_LOGS = process.env.EXPO_PUBLIC_DEBUG_LOGS === 'true';

// Verificar si las variables críticas están definidas
if (!API_BASE_URL) {
  console.error('❌ API_BASE_URL no está definida');
}

// Mostrar la configuración en desarrollo
if (__DEV__ && DEBUG_LOGS) {
  console.log('📱 ========================================');
  console.log('📱 CONFIGURACIÓN DE ENTORNO - BOXDOCTOR MOBILE');
  console.log('📱 ========================================');
  console.log('📱 Entorno de ejecución:', Constants.executionEnvironment);
  console.log('📱 Plataforma:', Platform.OS);
  console.log('📱 Dispositivo Android Emulator:', isAndroidEmulator);
  console.log('📱 Dispositivo iOS Simulator:', isIOSSimulator);
  console.log('📱 Dispositivo Físico:', isPhysicalDevice);
  console.log('📱 Web:', isWeb);
  console.log('🔌 API Base URL:', API_BASE_URL);
  console.log('🔌 Site URL:', SITE_URL);
  console.log('🔌 Dev URL:', DEV_URL);
  console.log('🔌 Dev Mode:', DEV_MODE);
  console.log('🔌 Debug Logs:', DEBUG_LOGS);
  console.log('📱 ========================================');
}

// Función para obtener la URL correcta según el entorno
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// Función para verificar la conectividad con la API
export const checkApiConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const text = await response.text();
    
    return {
      success: response.ok,
      message: `Respuesta: ${text}`
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Error: ${error.message}`
    };
  }
};

// Exportar todas las variables de entorno
export default {
  API_BASE_URL,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  SITE_URL,
  DEV_URL,
  DEV_MODE,
  DEBUG_LOGS,
  getApiUrl,
  checkApiConnection,
}; 