/**
 * Script para probar la conexión con Supabase y diagnosticar problemas
 * Ejecutar con: node scripts/test-supabase-connection.js
 */

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Cargar variables de entorno
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log(`${colors.green}✅ Archivo .env cargado${colors.reset}`);
} else {
  console.error(`${colors.red}❌ No se encontró el archivo .env${colors.reset}`);
  process.exit(1);
}

// Obtener la URL de Supabase
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  console.error(`${colors.red}❌ No se encontró la variable EXPO_PUBLIC_SUPABASE_URL en el archivo .env${colors.reset}`);
  process.exit(1);
}

if (!SUPABASE_ANON_KEY) {
  console.error(`${colors.red}❌ No se encontró la variable EXPO_PUBLIC_SUPABASE_ANON_KEY en el archivo .env${colors.reset}`);
  process.exit(1);
}

console.log(`${colors.bright}${colors.cyan}=== Probando conexión con Supabase ===${colors.reset}\n`);
console.log(`${colors.yellow}URL de Supabase: ${SUPABASE_URL}${colors.reset}`);

// Función para probar la conexión con Supabase
async function testConnection() {
  // Probar el endpoint de health
  try {
    console.log(`\n${colors.yellow}1. Probando endpoint de health...${colors.reset}`);
    const healthUrl = `${SUPABASE_URL}/auth/v1/health`;
    console.log(`   URL: ${healthUrl}`);
    
    const healthResponse = await fetch(healthUrl);
    const healthStatus = healthResponse.status;
    const healthText = await healthResponse.text();
    
    console.log(`   Código de estado: ${healthStatus}`);
    console.log(`   Respuesta: ${healthText}`);
    
    if (healthStatus === 200) {
      console.log(`   ${colors.green}✅ Endpoint de health accesible${colors.reset}`);
    } else {
      console.log(`   ${colors.red}❌ Endpoint de health no accesible${colors.reset}`);
    }
  } catch (error) {
    console.error(`   ${colors.red}❌ Error al conectar con el endpoint de health: ${error.message}${colors.reset}`);
  }
  
  // Probar el endpoint de autenticación
  try {
    console.log(`\n${colors.yellow}2. Probando endpoint de autenticación...${colors.reset}`);
    const authUrl = `${SUPABASE_URL}/auth/v1/token?grant_type=password`;
    console.log(`   URL: ${authUrl}`);
    
    const authResponse = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const authStatus = authResponse.status;
    let authText;
    
    try {
      // Intentar obtener la respuesta como JSON
      const authJson = await authResponse.json();
      authText = JSON.stringify(authJson, null, 2);
    } catch (e) {
      // Si no es JSON, obtener como texto
      authText = await authResponse.text();
    }
    
    console.log(`   Código de estado: ${authStatus}`);
    console.log(`   Respuesta: ${authText}`);
    
    if (authStatus === 200 || authStatus === 400) {
      // 400 es aceptable porque significa que las credenciales son incorrectas, pero el endpoint funciona
      console.log(`   ${colors.green}✅ Endpoint de autenticación accesible${colors.reset}`);
    } else {
      console.log(`   ${colors.red}❌ Endpoint de autenticación no accesible${colors.reset}`);
    }
  } catch (error) {
    console.error(`   ${colors.red}❌ Error al conectar con el endpoint de autenticación: ${error.message}${colors.reset}`);
  }
  
  // Diagnóstico de problemas comunes
  console.log(`\n${colors.bright}${colors.cyan}=== Diagnóstico ===${colors.reset}\n`);
  
  // Verificar si la URL es HTTPS
  if (!SUPABASE_URL.startsWith('https://')) {
    console.log(`${colors.yellow}⚠️ La URL de Supabase no usa HTTPS${colors.reset}`);
    console.log(`   Esto puede causar problemas en dispositivos físicos.`);
    console.log(`   Considera usar ngrok para obtener una URL HTTPS.`);
  }
  
  // Verificar si es una URL de ngrok
  if (SUPABASE_URL.includes('ngrok.io') || SUPABASE_URL.includes('ngrok-free.app')) {
    console.log(`${colors.green}✅ Estás usando ngrok (${SUPABASE_URL})${colors.reset}`);
    console.log(`   Asegúrate de que ngrok sigue ejecutándose.`);
  }
  
  // Verificar si es una URL local
  if (SUPABASE_URL.includes('localhost') || SUPABASE_URL.includes('127.0.0.1')) {
    console.log(`${colors.yellow}⚠️ Estás usando una URL local (${SUPABASE_URL})${colors.reset}`);
    console.log(`   Esto no funcionará en dispositivos físicos.`);
    console.log(`   Usa la IP de tu computadora o ngrok para dispositivos físicos.`);
  }
  
  // Verificar si es una URL de IP local
  const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
  if (ipRegex.test(SUPABASE_URL)) {
    console.log(`${colors.yellow}⚠️ Estás usando una IP local (${SUPABASE_URL})${colors.reset}`);
    console.log(`   Esto funcionará solo si el dispositivo está en la misma red.`);
  }
  
  console.log(`\n${colors.bright}${colors.cyan}=== Recomendaciones ===${colors.reset}\n`);
  
  console.log(`${colors.yellow}1. Si estás usando un emulador Android:${colors.reset}`);
  console.log(`   Usa http://10.0.2.2:54321 como URL de Supabase.`);
  
  console.log(`\n${colors.yellow}2. Si estás usando un simulador iOS:${colors.reset}`);
  console.log(`   Usa http://localhost:54321 como URL de Supabase.`);
  
  console.log(`\n${colors.yellow}3. Si estás usando un dispositivo físico:${colors.reset}`);
  console.log(`   Usa ngrok para obtener una URL HTTPS accesible desde cualquier red:`);
  console.log(`   npm run supabase-ngrok`);
  
  console.log(`\n${colors.yellow}4. Si sigues teniendo problemas:${colors.reset}`);
  console.log(`   - Verifica que Supabase esté ejecutándose`);
  console.log(`   - Reinicia ngrok si estás usándolo`);
  console.log(`   - Asegúrate de que no hay firewalls bloqueando la conexión`);
}

// Ejecutar la prueba
testConnection().catch(error => {
  console.error(`${colors.red}❌ Error inesperado: ${error.message}${colors.reset}`);
}); 