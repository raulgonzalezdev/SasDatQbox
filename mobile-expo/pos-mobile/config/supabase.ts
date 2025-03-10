import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './env';

// Verificar que las variables de entorno estén definidas
if (!SUPABASE_URL) {
  console.error('❌ SUPABASE_URL no está definida en el archivo .env');
}

if (!SUPABASE_ANON_KEY) {
  console.error('❌ SUPABASE_ANON_KEY no está definida en el archivo .env');
}

// Imprimir información de depuración
console.log('🔌 Inicializando cliente de Supabase con:');
console.log('🔌 URL:', SUPABASE_URL);
console.log('🔌 KEY:', SUPABASE_ANON_KEY ? `${SUPABASE_ANON_KEY.substring(0, 5)}...` : 'No definida');

// Crear el cliente de Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Función para verificar la conexión con Supabase
export const checkSupabaseConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Intentar hacer una solicitud simple
    const response = await fetch(`${SUPABASE_URL}/auth/v1/health`);
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

// Función para verificar la autenticación
export const checkSupabaseAuth = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      return {
        success: false,
        message: `Error: ${error.message}`
      };
    }
    
    return {
      success: true,
      message: `Sesión: ${data.session ? 'Activa' : 'No hay sesión activa'}`
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Error: ${error.message}`
    };
  }
};

// Exportar el cliente por defecto
export default supabase; 