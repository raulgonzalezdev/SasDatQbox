import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/api';

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
  businessName?: string;
  isPremium: boolean;
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
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

// Función para obtener datos del usuario
export const getUser = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
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
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en el registro');
    }

    const { user, token } = data;

    // Guardar token y datos del usuario
    await saveToken(token);
    await saveUser(user);

    return { user, token };
  } catch (error) {
    console.error('❌ Error al registrar:', error);
    throw error;
  }
};

// Función para iniciar sesión
export const login = async (loginData: UserLoginData): Promise<AuthResponse> => {
  console.log('🔍 Iniciando sesión médico');
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en el inicio de sesión');
    }

    const { user, token } = data;

    // Guardar token y datos del usuario
    await saveToken(token);
    await saveUser(user);

    return { user, token };
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
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      const updatedUser = data.user || user;
      
      // Actualizar datos del usuario si es necesario
      await saveUser(updatedUser);
      
      return { isAuthenticated: true, user: updatedUser };
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

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
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