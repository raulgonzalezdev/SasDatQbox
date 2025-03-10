import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  throw new Error('Faltan variables de entorno de Supabase');
}

// Cliente para operaciones anónimas (usuarios no autenticados)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Cliente con rol de servicio para operaciones administrativas
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export default { supabaseClient, supabaseAdmin }; 