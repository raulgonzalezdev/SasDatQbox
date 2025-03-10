/**
 * Script para encontrar la dirección IP local
 * Ejecutar con: node scripts/find-local-ip.js
 */

const { networkInterfaces } = require('os');

// Obtener todas las interfaces de red
const nets = networkInterfaces();
const results = {};

// Iterar sobre las interfaces
for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    // Omitir interfaces no IPv4 y loopback
    if (net.family === 'IPv4' && !net.internal) {
      if (!results[name]) {
        results[name] = [];
      }
      results[name].push(net.address);
    }
  }
}

console.log('\n🔍 Direcciones IP locales encontradas:');
console.log('=====================================');

// Mostrar resultados
let found = false;
for (const [interface, addresses] of Object.entries(results)) {
  if (addresses.length > 0) {
    found = true;
    console.log(`\n📱 Interfaz: ${interface}`);
    addresses.forEach((address, index) => {
      console.log(`   IP ${index + 1}: ${address}`);
    });
  }
}

if (!found) {
  console.log('\n❌ No se encontraron direcciones IP locales.');
  console.log('   Asegúrate de estar conectado a una red.');
} else {
  console.log('\n✅ Usa una de estas direcciones IP en tu archivo .env:');
  console.log('   EXPO_PUBLIC_SUPABASE_URL=http://TU_IP_AQUÍ:54321');
}

console.log('\n'); 