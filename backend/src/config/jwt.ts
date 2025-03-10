import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Verificar si las variables tienen valores reales o son placeholders
const isPlaceholder = (value: string) => {
  return value.includes('your_') || value === '';
};

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Verificar configuración
if (isPlaceholder(JWT_SECRET)) {
  console.warn('⚠️ La variable JWT_SECRET contiene un valor placeholder. Se usará una clave por defecto.');
  console.warn('Para mayor seguridad, actualiza el archivo .env con una clave JWT personalizada.');
}

if (process.env.NODE_ENV === 'production' && (JWT_SECRET === 'default_secret_key' || isPlaceholder(JWT_SECRET))) {
  console.error('⚠️ ADVERTENCIA DE SEGURIDAD: Usando clave JWT por defecto en producción. Esto es extremadamente inseguro.');
  console.error('Por favor, actualiza el archivo .env con una clave JWT segura antes de ejecutar en producción.');
}

export const generateToken = (payload: any): string => {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  } catch (error) {
    console.error('Error al generar token JWT:', error);
    throw new Error('Error al generar token de autenticación');
  }
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expirado. Por favor, inicia sesión nuevamente');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Token inválido');
    } else {
      console.error('Error al verificar token JWT:', error);
      throw new Error('Error de autenticación');
    }
  }
}; 