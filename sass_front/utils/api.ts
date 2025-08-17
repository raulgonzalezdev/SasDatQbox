const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001/api/v1';

// Interfaz para un error de API estructurado
interface ApiErrorData {
  detail?: string | { msg: string; type: string }[];
}

// Clase de error personalizada para manejar errores de la API
export class ApiError extends Error {
  status: number;
  data: ApiErrorData;

  constructor(message: string, status: number, data: ApiErrorData) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Función fetch personalizada isomórfica (funciona en cliente y servidor)
export const customFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    // Añadimos 'credentials: include' para enviar cookies entre dominios
    credentials: 'include',
    // Añadimos 'no-store' para asegurarnos de que las llamadas del lado del servidor
    // no sean cacheadas por Next.js, especialmente para datos de usuario.
    cache: 'no-store',
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorData: ApiErrorData = {};
    let errorMessage = response.statusText;

    try {
      errorData = await response.json();
      // Intentamos obtener un mensaje más específico del cuerpo del error
      if (errorData.detail) {
        if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        } else if (Array.isArray(errorData.detail) && errorData.detail[0]?.msg) {
          errorMessage = errorData.detail[0].msg;
        }
      }
    } catch (e) {
      // Si el cuerpo del error no es JSON, usamos el statusText que ya teníamos.
    }
    
    throw new ApiError(errorMessage, response.status, errorData);
  }

  // Si la respuesta es 204 No Content, no hay cuerpo que parsear
  if (response.status === 204) {
    return null;
  }

  try {
    return await response.json();
  } catch (error) {
    // Si la respuesta exitosa no tiene cuerpo JSON (ej. 200 OK sin body),
    // devolvemos un objeto vacío para no romper la cadena.
    return {};
  }
};
