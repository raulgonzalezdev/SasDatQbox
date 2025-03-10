import { ENDPOINTS } from '../constants/api';
import * as api from './api';

// Interfaz para la respuesta del endpoint de salud
export interface HealthResponse {
  status: string;
  message: string;
  environment: string;
  timestamp: string;
}

// Función para verificar la salud del backend
export const checkHealth = async (): Promise<HealthResponse> => {
  return api.get<HealthResponse>(ENDPOINTS.HEALTH, { requireAuth: false });
}; 