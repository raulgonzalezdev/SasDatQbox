import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_ENDPOINTS, buildApiUrl, getAuthHeaders, getDefaultHeaders } from '../constants/api';

// Clave para almacenar el token en AsyncStorage
const TOKEN_KEY = '@medical_app_token';
const USER_KEY = '@medical_app_user';

// Interfaces para los datos de usuario médico
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: 'doctor' | 'patient' | 'admin';
  businessName?: string; // Opcional, valor por defecto en el cliente
  isPremium?: boolean; // Opcional, valor por defecto en el cliente
  created_at: Date;
  updated_at: Date;
}

export interface UserRegistrationData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'doctor' | 'patient';
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthStatus {
  isAuthenticated: boolean;
  user: User | null;
}

// Función para obtener el token almacenado
export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Función para guardar el token
export const saveToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

// Función para eliminar el token
export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// Función para guardar datos del usuario
export const saveUser = async (user: User): Promise<void> => {
  try {
    // Asignar valores por defecto si no están presentes
    const userWithDefaults = {
      ...user,
      businessName: user.businessName || '',
      isPremium: user.isPremium || false
    };
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userWithDefaults));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

// Función para obtener datos del usuario
export const getUser = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_KEY);
    if (userData) {
      const user = JSON.parse(userData);
      // Asignar valores por defecto si no están presentes
      return {
        ...user,
        businessName: user.businessName || '',
        isPremium: user.isPremium || false
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Función para eliminar datos del usuario
export const removeUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error removing user:', error);
  }
};

// Función para registrar un nuevo usuario
export const register = async (userData: UserRegistrationData): Promise<AuthResponse> => {
  console.log('🔍 Registrando usuario médico');
  
  try {
    const response = await fetch(buildApiUrl(AUTH_ENDPOINTS.REGISTER), {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || data.message || 'Error en el registro');
    }

    // El backend devuelve { token, token_type, user }
    const { user, token } = data;

    // Asignar valores por defecto si no están presentes
    const userWithDefaults = {
      ...user,
      businessName: user.businessName || '',
      isPremium: user.isPremium || false
    };

    // Guardar token y datos del usuario
    await saveToken(token);
    await saveUser(userWithDefaults);

    return { user: userWithDefaults, token };
  } catch (error) {
    console.error('❌ Error al registrar:', error);
    throw error;
  }
};

// Función para iniciar sesión
export const login = async (loginData: UserLoginData): Promise<AuthResponse> => {
  console.log('🔍 Iniciando sesión médico');
  
  try {
    const response = await fetch(buildApiUrl(AUTH_ENDPOINTS.LOGIN), {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || data.message || 'Error en el inicio de sesión');
    }

    // El backend devuelve { token, token_type, user }
    const { user, token } = data;

    // Asignar valores por defecto si no están presentes
    const userWithDefaults = {
      ...user,
      businessName: user.businessName || '',
      isPremium: user.isPremium || false
    };

    // Guardar token y datos del usuario
    await saveToken(token);
    await saveUser(userWithDefaults);

    return { user: userWithDefaults, token };
  } catch (error) {
    console.error('❌ Error al iniciar sesión:', error);
    throw error;
  }
};

// Función para cerrar sesión
export const logout = async (): Promise<void> => {
  console.log('🔍 Cerrando sesión');
  
  try {
    const token = await getToken();
    
    if (token) {
      // Intentar hacer logout en el servidor
      await fetch(buildApiUrl(AUTH_ENDPOINTS.LOGOUT), {
        method: 'POST',
        headers: getAuthHeaders(token),
      });
    }
  } catch (error) {
    console.error('Error en logout del servidor:', error);
  } finally {
    // Siempre limpiar datos locales
    await removeToken();
    await removeUser();
  }
};

// Función para verificar el estado de autenticación
export const checkAuthStatus = async (): Promise<AuthStatus> => {
  try {
    const token = await getToken();
    const user = await getUser();

    if (!token || !user) {
      return { isAuthenticated: false, user: null };
    }

    // Verificar token con el servidor
    const response = await fetch(buildApiUrl(AUTH_ENDPOINTS.ME), {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    if (response.ok) {
      const data = await response.json();
      const updatedUser = data.user || user;
      
      // Asignar valores por defecto si no están presentes
      const userWithDefaults = {
        ...updatedUser,
        businessName: updatedUser.businessName || '',
        isPremium: updatedUser.isPremium || false
      };
      
      // Actualizar datos del usuario si es necesario
      await saveUser(userWithDefaults);
      
      return { isAuthenticated: true, user: userWithDefaults };
    } else {
      // Token inválido, limpiar datos
      await removeToken();
      await removeUser();
      return { isAuthenticated: false, user: null };
    }
  } catch (error) {
    console.error('Error checking auth status:', error);
    return { isAuthenticated: false, user: null };
  }
};

// Función para actualizar perfil del usuario
export const updateProfile = async (userData: Partial<User>): Promise<User> => {
  try {
    const token = await getToken();
    
    if (!token) {
      throw new Error('No autenticado');
    }

    const response = await fetch(buildApiUrl(AUTH_ENDPOINTS.PROFILE), {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar perfil');
    }

    const updatedUser = data.user;
    await saveUser(updatedUser);

    return updatedUser;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Función para refrescar el token
export const refreshToken = async (): Promise<string | null> => {
  try {
    const token = await getToken();
    
    if (!token) {
      return null;
    }

    const response = await fetch(buildApiUrl(AUTH_ENDPOINTS.REFRESH), {
      method: 'POST',
      headers: getAuthHeaders(token),
    });

    if (response.ok) {
      const data = await response.json();
      // El backend devuelve { token, token_type, user }
      const newToken = data.token;
      const user = data.user;
      
      if (newToken) {
        await saveToken(newToken);
        if (user) {
          // Asignar valores por defecto si no están presentes
          const userWithDefaults = {
            ...user,
            businessName: user.businessName || '',
            isPremium: user.isPremium || false
          };
          await saveUser(userWithDefaults);
        }
        return newToken;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}; 