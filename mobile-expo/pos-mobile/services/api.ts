import { API_BASE_URL } from '../constants/api';
import { getToken, removeToken } from './auth';

// Tipos de respuesta de la API
interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

// Opciones para las solicitudes
interface RequestOptions {
  requireAuth?: boolean;
  contentType?: string;
}

// Clase para manejar errores de la API
export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

// Función para manejar las respuestas de la API
const handleResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type');
  
  try {
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      // Verificar si la respuesta tiene el formato esperado
      if (data.status === 'success' || data.status === 'error') {
        // Formato de respuesta de nuestro backend
        if (!response.ok || data.status === 'error') {
          throw new ApiError(data.message || 'Error en la solicitud', response.status);
        }
        
        return data.data as T;
      } else {
        // Otro formato de respuesta JSON
        if (!response.ok) {
          throw new ApiError(data.message || 'Error en la solicitud', response.status);
        }
        
        return data as T;
      }
    } else {
      // Respuesta no JSON
      if (!response.ok) {
        throw new ApiError(`Error en la solicitud: ${response.statusText}`, response.status);
      }
      
      return {} as T;
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else if (error instanceof Error) {
      console.error('Error al procesar la respuesta:', error);
      throw new ApiError(`Error al procesar la respuesta: ${error.message}`, response.status);
    } else {
      throw new ApiError('Error desconocido al procesar la respuesta', response.status);
    }
  }
};

// Función para obtener los headers de la solicitud
const getHeaders = async (requireAuth: boolean, contentType: string): Promise<HeadersInit> => {
  const headers: HeadersInit = {
    'Content-Type': contentType,
    'Accept': 'application/json',
  };
  
  if (requireAuth) {
    const token = await getToken();
    if (!token) {
      throw new ApiError('No autenticado', 401);
    }
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Función para realizar solicitudes GET
export const get = async <T>(
  endpoint: string, 
  options: RequestOptions = { requireAuth: false, contentType: 'application/json' }
): Promise<T> => {
  try {
    const { requireAuth = false, contentType = 'application/json' } = options;
    const headers = await getHeaders(requireAuth, contentType);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });
    
    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      // Si hay un error de autenticación, eliminar el token
      await removeToken();
    }
    throw error;
  }
};

// Función para realizar solicitudes POST
export const post = async <T>(
  endpoint: string, 
  data: any, 
  options: RequestOptions = { requireAuth: false, contentType: 'application/json' }
): Promise<T> => {
  try {
    const { requireAuth = false, contentType = 'application/json' } = options;
    const headers = await getHeaders(requireAuth, contentType);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: contentType === 'application/json' ? JSON.stringify(data) : data,
    });
    
    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      // Si hay un error de autenticación, eliminar el token
      await removeToken();
    }
    throw error;
  }
};

// Función para realizar solicitudes PUT
export const put = async <T>(
  endpoint: string, 
  data: any, 
  options: RequestOptions = { requireAuth: true, contentType: 'application/json' }
): Promise<T> => {
  try {
    const { requireAuth = true, contentType = 'application/json' } = options;
    const headers = await getHeaders(requireAuth, contentType);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: contentType === 'application/json' ? JSON.stringify(data) : data,
    });
    
    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      // Si hay un error de autenticación, eliminar el token
      await removeToken();
    }
    throw error;
  }
};

// Función para realizar solicitudes PATCH
export const patch = async <T>(
  endpoint: string, 
  data: any, 
  options: RequestOptions = { requireAuth: true, contentType: 'application/json' }
): Promise<T> => {
  try {
    const { requireAuth = true, contentType = 'application/json' } = options;
    const headers = await getHeaders(requireAuth, contentType);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: contentType === 'application/json' ? JSON.stringify(data) : data,
    });
    
    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      // Si hay un error de autenticación, eliminar el token
      await removeToken();
    }
    throw error;
  }
};

// Función para realizar solicitudes DELETE
export const del = async <T>(
  endpoint: string, 
  options: RequestOptions = { requireAuth: true, contentType: 'application/json' }
): Promise<T> => {
  try {
    const { requireAuth = true, contentType = 'application/json' } = options;
    const headers = await getHeaders(requireAuth, contentType);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    
    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      // Si hay un error de autenticación, eliminar el token
      await removeToken();
    }
    throw error;
  }
}; 