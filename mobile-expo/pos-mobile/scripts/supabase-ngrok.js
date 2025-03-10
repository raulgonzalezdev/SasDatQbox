/**
 * Script para iniciar un túnel ngrok para Supabase y actualizar el archivo .env
 * Ejecutar con: node scripts/supabase-ngrok.js
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

// Configuración
const NGROK_PATH = 'C:\\ngrok\\ngrok.exe'; // Ruta a ngrok.exe en Windows
const SUPABASE_PORT = 54321;
const ENV_FILE_PATH = path.join(__dirname, '..', '.env');
const NGROK_API = 'http://localhost:4040/api/tunnels';

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

// Función para verificar si ngrok existe
function checkNgrok() {
  try {
    if (!fs.existsSync(NGROK_PATH)) {
      console.error(`${colors.red}❌ No se encontró ngrok en la ruta: ${NGROK_PATH}${colors.reset}`);
      console.error(`   Asegúrate de que la ruta sea correcta o instala ngrok desde https://ngrok.com/download`);
      process.exit(1);
    }
    console.log(`${colors.green}✅ ngrok encontrado en: ${NGROK_PATH}${colors.reset}`);
  } catch (err) {
    console.error(`${colors.red}❌ Error al verificar ngrok: ${err.message}${colors.reset}`);
    process.exit(1);
  }
}

// Función para obtener la URL de ngrok
function getNgrokUrl() {
  return new Promise((resolve, reject) => {
    // Esperar un momento para que ngrok inicie su API
    setTimeout(() => {
      http.get(NGROK_API, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const tunnels = JSON.parse(data).tunnels;
            const httpsTunnel = tunnels.find(t => t.proto === 'https');
            
            if (httpsTunnel) {
              resolve(httpsTunnel.public_url);
            } else if (tunnels.length > 0) {
              resolve(tunnels[0].public_url);
            } else {
              reject(new Error('No se encontraron túneles activos'));
            }
          } catch (error) {
            reject(error);
          }
        });
      }).on('error', (err) => {
        reject(err);
      });
    }, 2000); // Esperar 2 segundos
  });
}

// Función para actualizar el archivo .env
function updateEnvFile(ngrokUrl) {
  try {
    if (!fs.existsSync(ENV_FILE_PATH)) {
      console.error(`${colors.red}❌ No se encontró el archivo .env en: ${ENV_FILE_PATH}${colors.reset}`);
      console.error(`   Crea el archivo .env basado en .env.example`);
      return;
    }
    
    let envContent = fs.readFileSync(ENV_FILE_PATH, 'utf8');
    
    // Actualizar la URL de Supabase
    envContent = envContent.replace(
      /EXPO_PUBLIC_SUPABASE_URL=.*/,
      `EXPO_PUBLIC_SUPABASE_URL=${ngrokUrl}`
    );
    
    fs.writeFileSync(ENV_FILE_PATH, envContent);
    console.log(`${colors.green}✅ Archivo .env actualizado con la URL de ngrok: ${ngrokUrl}${colors.reset}`);
  } catch (err) {
    console.error(`${colors.red}❌ Error al actualizar el archivo .env: ${err.message}${colors.reset}`);
  }
}

// Función principal
async function main() {
  console.log(`\n${colors.bright}${colors.cyan}=== Iniciando túnel ngrok para Supabase ===${colors.reset}\n`);
  
  // Verificar ngrok
  checkNgrok();
  
  // Iniciar ngrok
  console.log(`${colors.yellow}🚀 Iniciando túnel ngrok para Supabase (puerto ${SUPABASE_PORT})...${colors.reset}`);
  
  const ngrok = spawn(NGROK_PATH, ['http', SUPABASE_PORT]);
  
  ngrok.stdout.on('data', (data) => {
    console.log(`${colors.bright}${data.toString()}${colors.reset}`);
  });
  
  ngrok.stderr.on('data', (data) => {
    console.error(`${colors.red}${data.toString()}${colors.reset}`);
  });
  
  // Obtener la URL de ngrok y actualizar el archivo .env
  try {
    const ngrokUrl = await getNgrokUrl();
    console.log(`${colors.green}✅ Túnel ngrok establecido: ${ngrokUrl}${colors.reset}`);
    
    // Actualizar el archivo .env
    updateEnvFile(ngrokUrl);
    
    console.log(`\n${colors.bright}${colors.cyan}=== Instrucciones ===${colors.reset}`);
    console.log(`${colors.yellow}1. Reinicia tu aplicación Expo para que tome la nueva URL${colors.reset}`);
    console.log(`${colors.yellow}2. Mantén esta ventana abierta mientras uses la aplicación${colors.reset}`);
    console.log(`${colors.yellow}3. Presiona Ctrl+C para detener el túnel cuando termines${colors.reset}\n`);
    
  } catch (error) {
    console.error(`${colors.red}❌ Error al obtener la URL de ngrok: ${error.message}${colors.reset}`);
    ngrok.kill();
    process.exit(1);
  }
  
  // Manejar la terminación del proceso
  process.on('SIGINT', () => {
    console.log(`\n${colors.yellow}👋 Deteniendo el túnel ngrok...${colors.reset}`);
    ngrok.kill();
    process.exit(0);
  });
}

// Ejecutar el script
main(); 