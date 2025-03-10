import { Request, Response } from 'express';
import * as userService from '../services/userService';
import { UserRegistrationData, UserLoginData, UserUpdateData, PasswordChangeData } from '../types/userTypes';

export const register = async (req: Request, res: Response) => {
  try {
    const userData: UserRegistrationData = req.body;
    
    // Validar datos
    if (!userData.email || !userData.password || !userData.name) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor, proporciona email, contraseña y nombre'
      });
    }

    const result = await userService.registerUser(userData);
    
    res.status(201).json({
      status: 'success',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log('🔍 [LOGIN] Iniciando proceso de login');
    console.log('📦 [LOGIN] Datos recibidos:', JSON.stringify({
      email: req.body.email,
      passwordLength: req.body.password ? req.body.password.length : 0
    }));
    
    const { email, password } = req.body;
    
    // Validar datos
    if (!email || !password) {
      console.log('❌ [LOGIN] Error: Datos incompletos');
      return res.status(400).json({
        status: 'error',
        message: 'Por favor, proporciona email y contraseña'
      });
    }

    console.log('🔄 [LOGIN] Llamando al servicio de login');
    const result = await userService.loginUser({ email, password });
    console.log('✅ [LOGIN] Login exitoso para el usuario:', email);
    
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error: any) {
    console.error('❌ [LOGIN] Error en el proceso de login:', error.message);
    console.error('❌ [LOGIN] Stack de error:', error.stack);
    
    res.status(401).json({
      status: 'error',
      message: error.message
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const user = await userService.getUserById(userId);
    
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error: any) {
    res.status(404).json({
      status: 'error',
      message: error.message
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const updateData: UserUpdateData = req.body;
    
    const updatedUser = await userService.updateUser(userId, updateData);
    
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword }: PasswordChangeData = req.body;
    
    // Validar datos
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor, proporciona la contraseña actual y la nueva contraseña'
      });
    }

    await userService.changePassword(userId, currentPassword, newPassword);
    
    res.status(200).json({
      status: 'success',
      message: 'Contraseña actualizada correctamente'
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
}; 