import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User, UserInput, UserLogin, AuthResponse } from '../types/user';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuración de JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Registrar un nuevo usuario
export const registerUser = async (userData: UserInput): Promise<AuthResponse> => {
  // Verificar si el usuario ya existe
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('email', userData.email)
    .single();

  if (existingUser) {
    throw new Error('El usuario ya existe');
  }

  // Crear usuario en Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
  });

  if (authError) {
    throw new Error(authError.message);
  }

  if (!authData.user) {
    throw new Error('Error al crear el usuario');
  }

  // Crear perfil de usuario en la tabla users
  const { data: user, error: userError } = await supabase
    .from('users')
    .insert([
      {
        id: authData.user.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        phone: userData.phone,
        avatar_url: userData.avatar_url,
      },
    ])
    .select()
    .single();

  if (userError) {
    throw new Error(userError.message);
  }

  // Generar token JWT
  const token = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { user, token };
};

// Iniciar sesión
export const loginUser = async (loginData: UserLogin): Promise<AuthResponse> => {
  // Autenticar con Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: loginData.email,
    password: loginData.password,
  });

  if (authError) {
    throw new Error('Credenciales inválidas');
  }

  if (!authData.user) {
    throw new Error('Usuario no encontrado');
  }

  // Obtener datos del usuario
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (userError) {
    throw new Error(userError.message);
  }

  // Generar token JWT
  const token = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { user, token };
};

// Obtener usuario por ID
export const getUserById = async (userId: string): Promise<User> => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error('Usuario no encontrado');
  }

  return user;
};

// Actualizar usuario
export const updateUser = async (userId: string, userData: Partial<UserInput>): Promise<User> => {
  const { data: user, error } = await supabase
    .from('users')
    .update({
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone: userData.phone,
      avatar_url: userData.avatar_url,
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return user;
}; 