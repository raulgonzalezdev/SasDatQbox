/**
 * Script para iniciar un túnel ngrok para Supabase
 * Ejecutar con: node scripts/start-supabase-tunnel.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ruta a ngrok (ajusta esto según tu instalación)
const NGROK_PATH = 'C:\\ngrok\\ngrok.exe'; // Ruta a ngrok.exe en Windows

// Puerto de Supabase
const SUPABASE_PORT = 54321;

// Función para verificar si ngrok existe
function checkNgrok() {
  try {
    if (!fs.existsSync(NGROK_PATH)) {
      console.error(`❌ No se encontró ngrok en la ruta: ${NGROK_PATH}`);
      console.error('   Asegúrate de que la ruta sea correcta o instala ngrok desde https://ngrok.com/download');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Error al verificar ngrok:', err.message);
    process.exit(1);
  }
}

// Función para iniciar ngrok
function startNgrok() {
  console.log(`\n🚀 Iniciando túnel ngrok para Supabase (puerto ${SUPABASE_PORT})...`);
  
  try {
    // Ejecutar ngrok
    const output = execSync(`"${NGROK_PATH}" http ${SUPABASE_PORT} --log=stdout`, { encoding: 'utf8' });
    console.log(output);
  } catch (error) {
    console.error('❌ Error al iniciar ngrok:', error.message);
    
    // Mostrar la salida del comando para depuración
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(error.stderr);
    
    process.exit(1);
  }
}

// Ejecutar el script
checkNgrok();
startNgrok(); 