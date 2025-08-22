// API URLs y endpoints para BoxDoctor Mobile
import { API_BASE_URL } from '../config/env';

// Endpoints de autenticación
export const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  PROFILE: '/auth/profile',
  REFRESH: '/auth/refresh',
};

// Endpoints de citas médicas
export const APPOINTMENT_ENDPOINTS = {
  LIST: '/appointments',
  CREATE: '/appointments',
  GET: (id: string) => `/appointments/${id}`,
  UPDATE: (id: string) => `/appointments/${id}`,
  DELETE: (id: string) => `/appointments/${id}`,
  CONFIRM: (id: string) => `/appointments/${id}/confirm`,
  CANCEL: (id: string) => `/appointments/${id}/cancel`,
  RESCHEDULE: (id: string) => `/appointments/${id}/reschedule`,
};

// Endpoints de pacientes
export const PATIENT_ENDPOINTS = {
  LIST: '/patients',
  CREATE: '/patients',
  GET: (id: string) => `/patients/${id}`,
  UPDATE: (id: string) => `/patients/${id}`,
  DELETE: (id: string) => `/patients/${id}`,
  SEARCH: '/patients/search',
  MEDICAL_HISTORY: (id: string) => `/patients/${id}/medical-history`,
};

// Endpoints de consultas médicas
export const CONSULTATION_ENDPOINTS = {
  LIST: '/consultations',
  CREATE: '/consultations',
  GET: (id: string) => `/consultations/${id}`,
  UPDATE: (id: string) => `/consultations/${id}`,
  DELETE: (id: string) => `/consultations/${id}`,
  START: (id: string) => `/consultations/${id}/start`,
  END: (id: string) => `/consultations/${id}/end`,
  NOTES: (id: string) => `/consultations/${id}/notes`,
};

// Endpoints de recetas médicas
export const PRESCRIPTION_ENDPOINTS = {
  LIST: '/prescriptions',
  CREATE: '/prescriptions',
  GET: (id: string) => `/prescriptions/${id}`,
  UPDATE: (id: string) => `/prescriptions/${id}`,
  DELETE: (id: string) => `/prescriptions/${id}`,
  PRINT: (id: string) => `/prescriptions/${id}/print`,
  MEDICATIONS: '/medications',
};

// Endpoints de chat
export const CHAT_ENDPOINTS = {
  CONVERSATIONS: '/chat/conversations',
  MESSAGES: (conversationId: string) => `/chat/conversations/${conversationId}/messages`,
  SEND_MESSAGE: (conversationId: string) => `/chat/conversations/${conversationId}/messages`,
  MARK_READ: (conversationId: string) => `/chat/conversations/${conversationId}/read`,
  CREATE_CONVERSATION: '/chat/conversations',
};

// Endpoints de pagos
export const PAYMENT_ENDPOINTS = {
  LIST: '/payments',
  CREATE: '/payments',
  GET: (id: string) => `/payments/${id}`,
  UPDATE: (id: string) => `/payments/${id}`,
  DELETE: (id: string) => `/payments/${id}`,
  METHODS: '/payments/methods',
  ADD_METHOD: '/payments/methods',
  REMOVE_METHOD: (id: string) => `/payments/methods/${id}`,
  PROCESS: (id: string) => `/payments/${id}/process`,
};

// Endpoints de usuarios
export const USER_ENDPOINTS = {
  PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  CHANGE_PASSWORD: '/users/change-password',
  UPLOAD_AVATAR: '/users/avatar',
  NOTIFICATIONS: '/users/notifications',
  SETTINGS: '/users/settings',
};

// Endpoints de sistema
export const SYSTEM_ENDPOINTS = {
  HEALTH: '/health',
  STATUS: '/status',
  VERSION: '/version',
  CONFIG: '/config',
};

// Función para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// Función para construir URLs con parámetros
export const buildApiUrlWithParams = (endpoint: string, params: Record<string, string>): string => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  return url.toString();
};

// Configuración de headers comunes
export const getAuthHeaders = (token: string) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

export const getDefaultHeaders = () => ({
  'Content-Type': 'application/json',
});

// Exportar todas las constantes
export default {
  AUTH_ENDPOINTS,
  APPOINTMENT_ENDPOINTS,
  PATIENT_ENDPOINTS,
  CONSULTATION_ENDPOINTS,
  PRESCRIPTION_ENDPOINTS,
  CHAT_ENDPOINTS,
  PAYMENT_ENDPOINTS,
  USER_ENDPOINTS,
  SYSTEM_ENDPOINTS,
  buildApiUrl,
  buildApiUrlWithParams,
  getAuthHeaders,
  getDefaultHeaders,
}; 