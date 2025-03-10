import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';
import { supabase } from '../config/supabase';

// Extender la interfaz Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('🔍 [AUTH] Verificando autenticación');
    
    // 1) Obtener el token
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('🔄 [AUTH] Token encontrado en el header');
    }

    if (!token) {
      console.log('❌ [AUTH] No se encontró token');
      return res.status(401).json({
        status: 'error',
        message: 'No estás autenticado. Por favor, inicia sesión para obtener acceso.'
      });
    }

    // 2) Verificar el token
    console.log('🔄 [AUTH] Verificando token JWT');
    const decoded = verifyToken(token);
    console.log('✅ [AUTH] Token verificado correctamente, ID de usuario:', decoded.id);

    // 3) Verificar si el usuario existe
    console.log('🔄 [AUTH] Buscando usuario en Supabase');
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.id)
      .single();

    if (error || !user) {
      console.log('❌ [AUTH] Usuario no encontrado o error en Supabase:', error?.message);
      return res.status(401).json({
        status: 'error',
        message: 'El usuario al que pertenece este token ya no existe.'
      });
    }
    console.log('✅ [AUTH] Usuario encontrado:', user.email);

    // 4) Verificar si el usuario está activo
    if (!user.isActive) {
      console.log('❌ [AUTH] Cuenta de usuario desactivada');
      return res.status(401).json({
        status: 'error',
        message: 'Esta cuenta ha sido desactivada. Contacta al soporte para más información.'
      });
    }

    // 5) Agregar el usuario a la solicitud
    req.user = user;
    console.log('✅ [AUTH] Autenticación exitosa para:', user.email);
    next();
  } catch (error: any) {
    console.error('❌ [AUTH] Error en la autenticación:', error.message);
    console.error('❌ [AUTH] Stack de error:', error.stack);
    
    return res.status(401).json({
      status: 'error',
      message: 'No estás autenticado. Por favor, inicia sesión para obtener acceso.'
    });
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'No tienes permiso para realizar esta acción.'
      });
    }
    next();
  };
}; 