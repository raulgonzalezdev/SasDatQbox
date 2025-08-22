#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🧹 Limpiando caché completo de la aplicación...');

try {
  // 1. Limpiar caché de Expo
  console.log('📱 Limpiando caché de Expo...');
  execSync('npx expo start --clear', { stdio: 'inherit' });

  // 2. Limpiar node_modules y reinstalar
  console.log('📦 Limpiando node_modules...');
  execSync('rm -rf node_modules package-lock.json', { stdio: 'inherit' });
  
  console.log('📦 Reinstalando dependencias...');
  execSync('npm install', { stdio: 'inherit' });

  // 3. Limpiar caché de Metro
  console.log('🚇 Limpiando caché de Metro...');
  execSync('npx metro --reset-cache', { stdio: 'inherit' });

  console.log('✅ Caché limpiado completamente!');
  console.log('🚀 Ahora ejecuta: npx expo start');

} catch (error) {
  console.error('❌ Error limpiando caché:', error.message);
  process.exit(1);
}
