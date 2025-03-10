import bcrypt from 'bcrypt';
import { supabase } from '../config/supabase';
import { generateToken } from '../config/jwt';
import { 
  User, 
  UserRegistrationData, 
  UserLoginData, 
  AuthResponse, 
  UserUpdateData,
  UserRole,
  SubscriptionStatus
} from '../types/userTypes';

export const registerUser = async (userData: UserRegistrationData): Promise<AuthResponse> => {
  // Verificar si el usuario ya existe
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('email', userData.email)
    .single();

  if (existingUser) {
    throw new Error('El usuario con este correo electrónico ya existe');
  }

  // Encriptar la contraseña
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  // Crear el usuario
  const { data: newUser, error } = await supabase
    .from('users')
    .insert([
      {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        businessName: userData.businessName || null,
        role: UserRole.USER,
        isActive: true,
        subscriptionStatus: SubscriptionStatus.TRIAL,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
    .select()
    .single();

  if (error || !newUser) {
    throw new Error('Error al registrar el usuario: ' + error?.message);
  }

  // Generar token
  const token = generateToken({ id: newUser.id });

  // Eliminar la contraseña del objeto de usuario
  const { password, ...userWithoutPassword } = newUser;

  return {
    user: userWithoutPassword as Omit<User, 'password'>,
    token
  };
};

export const loginUser = async (loginData: UserLoginData): Promise<AuthResponse> => {
  console.log('🔍 [SERVICE] Iniciando servicio de login para:', loginData.email);
  
  try {
    // Intentar autenticar con Supabase Auth
    console.log('🔄 [SERVICE] Autenticando con Supabase Auth');
    
    // Primero intentamos con la autenticación nativa de Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password
    });

    if (authError) {
      console.log('❌ [SERVICE] Error en autenticación con Supabase Auth:', authError.message);
      
      // Si falla la autenticación nativa, intentamos con nuestra tabla de usuarios personalizada
      console.log('🔄 [SERVICE] Intentando autenticación con tabla de usuarios personalizada');
      
      // Buscar el usuario en nuestra tabla
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', loginData.email)
        .single();

      console.log('🔄 [SERVICE] Respuesta de Supabase:', { 
        encontrado: !!user, 
        error: error ? error.message : null 
      });

      if (error || !user) {
        console.log('❌ [SERVICE] Usuario no encontrado o error en Supabase');
        throw new Error('Credenciales incorrectas');
      }

      // Verificar si la cuenta está activa
      if (!user.isActive) {
        console.log('❌ [SERVICE] Cuenta desactivada');
        throw new Error('Esta cuenta ha sido desactivada');
      }

      // Verificar la contraseña
      console.log('🔄 [SERVICE] Verificando contraseña');
      const isPasswordCorrect = await bcrypt.compare(loginData.password, user.password);
      
      if (!isPasswordCorrect) {
        console.log('❌ [SERVICE] Contraseña incorrecta');
        throw new Error('Credenciales incorrectas');
      }

      // Generar token
      console.log('🔄 [SERVICE] Generando token JWT');
      const token = generateToken({ id: user.id });

      // Eliminar la contraseña del objeto de usuario
      const { password, ...userWithoutPassword } = user;

      console.log('✅ [SERVICE] Login exitoso con tabla personalizada');
      return {
        user: userWithoutPassword as Omit<User, 'password'>,
        token
      };
    }
    
    // Si llegamos aquí, la autenticación con Supabase Auth fue exitosa
    console.log('✅ [SERVICE] Login exitoso con Supabase Auth');
    
    // Obtener los datos del usuario de nuestra tabla
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', loginData.email)
      .single();
      
    if (userError || !userData) {
      console.log('❌ [SERVICE] Usuario autenticado pero no encontrado en nuestra tabla');
      throw new Error('Usuario autenticado pero no encontrado en el sistema');
    }
    
    // Eliminar la contraseña del objeto de usuario
    const { password, ...userWithoutPassword } = userData;
    
    return {
      user: userWithoutPassword as Omit<User, 'password'>,
      token: authData.session?.access_token || ''
    };
  } catch (error) {
    console.error('❌ [SERVICE] Error en el servicio de login:', error);
    throw error;
  }
};

export const getUserById = async (userId: string): Promise<Omit<User, 'password'>> => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !user) {
    throw new Error('Usuario no encontrado');
  }

  // Eliminar la contraseña del objeto de usuario
  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword as Omit<User, 'password'>;
};

export const updateUser = async (userId: string, updateData: UserUpdateData): Promise<Omit<User, 'password'>> => {
  // Verificar si el correo electrónico ya está en uso
  if (updateData.email) {
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', updateData.email)
      .neq('id', userId)
      .single();

    if (existingUser) {
      throw new Error('El correo electrónico ya está en uso');
    }
  }

  // Actualizar el usuario
  const { data: updatedUser, error } = await supabase
    .from('users')
    .update({
      ...updateData,
      updatedAt: new Date()
    })
    .eq('id', userId)
    .select()
    .single();

  if (error || !updatedUser) {
    throw new Error('Error al actualizar el usuario: ' + error?.message);
  }

  // Eliminar la contraseña del objeto de usuario
  const { password, ...userWithoutPassword } = updatedUser;

  return userWithoutPassword as Omit<User, 'password'>;
};

export const changePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {
  // Buscar el usuario
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !user) {
    throw new Error('Usuario no encontrado');
  }

  // Verificar la contraseña actual
  const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordCorrect) {
    throw new Error('La contraseña actual es incorrecta');
  }

  // Encriptar la nueva contraseña
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Actualizar la contraseña
  const { error: updateError } = await supabase
    .from('users')
    .update({
      password: hashedPassword,
      updatedAt: new Date()
    })
    .eq('id', userId);

  if (updateError) {
    throw new Error('Error al actualizar la contraseña: ' + updateError.message);
  }
}; 