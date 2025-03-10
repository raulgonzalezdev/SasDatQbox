import { Request, Response } from 'express';
import * as userService from '../services/userService';
import { UserInput, UserLogin } from '../types/user';

// Registrar un nuevo usuario
export const register = async (req: Request, res: Response) => {
  try {
    const userData: UserInput = req.body;
    const result = await userService.registerUser(userData);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Iniciar sesión
export const login = async (req: Request, res: Response) => {
  try {
    const loginData: UserLogin = req.body;
    const result = await userService.loginUser(loginData);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

// Obtener perfil del usuario
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; // Asumiendo que el middleware de autenticación añade el usuario a la solicitud
    const user = await userService.getUserById(userId);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

// Actualizar perfil del usuario
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; // Asumiendo que el middleware de autenticación añade el usuario a la solicitud
    const userData = req.body;
    const updatedUser = await userService.updateUser(userId, userData);
    res.status(200).json(updatedUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}; 