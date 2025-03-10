import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Obtener variables de entorno
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

console.log('🔧 [SUPABASE] Configurando cliente Supabase');
console.log('🔧 [SUPABASE] URL:', supabaseUrl);
console.log('🔧 [SUPABASE] Key disponible:', !!supabaseKey);

// Verificar si las variables están definidas
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ [SUPABASE] Error: Las variables de entorno SUPABASE_URL y SUPABASE_KEY son requeridas');
  process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Verificar la conexión
try {
  supabase.from('users').select('count', { count: 'exact', head: true })
    .then((result: any) => {
      if (result.error) {
        console.error('❌ [SUPABASE] Error al verificar la conexión:', result.error.message);
      } else {
        console.log('✅ [SUPABASE] Conexión a Supabase establecida correctamente');
      }
    });
} catch (error: any) {
  console.error('❌ [SUPABASE] Error al verificar la conexión:', error.message);
}

export { supabase }; 