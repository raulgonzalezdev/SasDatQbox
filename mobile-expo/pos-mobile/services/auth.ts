import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from '../config/supabase';
import { SUPABASE_URL } from '../config/env';

// Clave para almacenar el token en AsyncStorage
const TOKEN_KEY = '@pos_app_token';
const USER_KEY = '@pos_app_user';

// Interfaces para los datos de usuario
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  billing_address?: any;
  payment_method?: any;
  created_at: Date;
  updated_at: Date;
}

export interface UserRegistrationData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Función para registrar un nuevo usuario directamente con Supabase
export const register = async (userData: UserRegistrationData): Promise<AuthResponse> => {
  console.log('🔍 Registrando usuario con Supabase Auth');
  
  // Registrar con Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone
      }
    }
  });
  
  if (authError) {
    console.error('❌ Error al registrar con Supabase Auth:', authError.message);
    throw new Error(authError.message);
  }
  
  if (!authData.user) {
    throw new Error('No se pudo crear el usuario');
  }
  
  // Crear un objeto de usuario con el formato esperado
  const user: User = {
    id: authData.user.id,
    first_name: userData.first_name,
    last_name: userData.last_name,
    email: userData.email,
    phone: userData.phone,
    avatar_url: authData.user.user_metadata?.avatar_url,
    created_at: new Date(),
    updated_at: new Date()
  };
  
  // Guardar el token y los datos del usuario
  const token = authData.session?.access_token || '';
  await AsyncStorage.setItem(TOKEN_KEY, token);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  
  return { user, token };
};

// Función para iniciar sesión directamente con Supabase
export const login = async (loginData: UserLoginData): Promise<AuthResponse> => {
  console.log('🔍 Iniciando sesión con Supabase Auth');
  console.log('🔌 URL de Supabase:', SUPABASE_URL);
  console.log('🔑 Datos de login:', { email: loginData.email, passwordLength: loginData.password?.length || 0 });
  
  try {
    // Usar exactamente el formato de la documentación de Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password
    });
    
    // Imprimir la respuesta completa para depuración
    console.log('📦 Respuesta completa de Supabase:', JSON.stringify(data, null, 2));
    
    if (error) {
      console.error('❌ Error de Supabase:', error.message);
      throw error;
    }
    
    if (!data || !data.user) {
      console.error('❌ No se recibieron datos de usuario');
      throw new Error('No se recibieron datos de usuario');
    }
    
    console.log('✅ Autenticación exitosa para:', data.user.email);
    
    // Crear un objeto de usuario con el formato esperado
    const user: User = {
      id: data.user.id,
      first_name: data.user.user_metadata?.first_name || 'Usuario',
      last_name: data.user.user_metadata?.last_name || 'Supabase',
      email: data.user.email || '',
      phone: data.user.phone || '',
      avatar_url: data.user.user_metadata?.avatar_url,
      created_at: new Date(data.user.created_at),
      updated_at: new Date(data.user.updated_at || data.user.created_at)
    };
    
    // Guardar el token y los datos del usuario
    const token = data.session?.access_token || '';
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    
    return { user, token };
  } catch (error: any) {
    console.error('❌ Error en el servicio de login:', error);
    
    // Intentar capturar más detalles sobre el error
    if (error.message && error.message.includes('JSON Parse error')) {
      console.error('❌ Error de análisis JSON. La respuesta del servidor no es JSON válido.');
      console.error('❌ Esto puede ocurrir si la URL de Supabase es incorrecta o si hay un problema con CORS.');
      
      // Intentar hacer una solicitud simple para verificar la conexión
      try {
        console.log('🔍 Intentando verificar la salud del servidor...');
        const response = await fetch(`${SUPABASE_URL}/auth/v1/health`);
        const responseText = await response.text();
        console.log('🔍 Respuesta de health check:', responseText);
      } catch (healthCheckError: any) {
        console.error('❌ Error al verificar la salud del servidor:', healthCheckError.message);
      }
    }
    
    // Para propósitos de demostración, permitir el inicio de sesión con cuentas de prueba
    if (loginData.email.includes('@free.com') || loginData.email.includes('@premium.com') || loginData.email.includes('@business.com')) {
      console.log('🔄 Usando cuenta de demostración:', loginData.email);
      
      // Simular diferentes tipos de usuarios según el correo electrónico
      const isPremium = loginData.email.includes('@premium.com') || loginData.email.includes('@business.com');
      
      // Crear un usuario simulado
      const user: User = {
        id: Math.random().toString(36).substring(2, 9),
        first_name: 'Usuario',
        last_name: 'Demo',
        email: loginData.email,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      // Generar un token simulado
      const token = 'demo_token_' + Math.random().toString(36).substring(2, 15);
      
      // Guardar el usuario y el token
      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      
      return { user, token };
    }
    
    throw error;
  }
};

// Función para cerrar sesión
export const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
};

// Función para obtener el token
export const getToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(TOKEN_KEY);
};

// Función para eliminar el token
export const removeToken = async (): Promise<void> => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

// Función para obtener los datos del usuario actual
export const getCurrentUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  
  const userJson = await AsyncStorage.getItem(USER_KEY);
  if (userJson) {
    return JSON.parse(userJson) as User;
  }
  
  // Si no hay datos en AsyncStorage, obtener de Supabase
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single();
  
  if (userData) {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    return userData as User;
  }
  
  return null;
};

// Función para obtener el perfil del usuario desde Supabase
export const getProfile = async (): Promise<User> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('No autenticado');
  }
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error || !data) {
    throw new Error('Error al obtener el perfil');
  }
  
  return data as User;
};

// Función para actualizar el perfil del usuario
export const updateProfile = async (userData: Partial<User>): Promise<User> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('No autenticado');
  }
  
  // Actualizar en Supabase
  const { data, error } = await supabase
    .from('users')
    .update(userData)
    .eq('id', user.id)
    .select()
    .single();
  
  if (error || !data) {
    throw new Error('Error al actualizar el perfil');
  }
  
  // Actualizar los datos del usuario en AsyncStorage
  const currentUser = await getCurrentUser();
  if (currentUser) {
    const updatedUser = { ...currentUser, ...data };
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  }
  
  return data as User;
}; 