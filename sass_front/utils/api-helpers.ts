'use client';

import { toast } from 'react-hot-toast';
import { ApiError } from '@/utils/api';

// Interfaz para un error de API estructurado
interface ApiErrorData {
  detail?: string | { msg: string; type: string }[];
}

// Función auxiliar para extraer un mensaje de error legible
const getErrorMessage = (errorData: ApiErrorData, fallback: string): string => {
  if (errorData.detail) {
    if (typeof errorData.detail === 'string') {
      return errorData.detail;
    }
    if (Array.isArray(errorData.detail) && errorData.detail[0]?.msg) {
      return errorData.detail[0].msg;
    }
  }
  return fallback;
};

// Manejador de errores para mostrar notificaciones en el cliente
export const handleApiError = (error: unknown) => {
  let message: string;

  if (error instanceof ApiError) {
    message = getErrorMessage(error.data, error.message);
  } else if (error instanceof Error) {
    message = error.message;
  } else {
    message = 'Ocurrió un error inesperado.';
  }
  
  toast.error(message);
  console.error(error); // Loguear el error para depuración
};
