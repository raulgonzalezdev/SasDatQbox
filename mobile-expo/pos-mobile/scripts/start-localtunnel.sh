#!/bin/bash

# Limpiar la caché de Expo
echo "Limpiando caché de Expo..."
rm -rf .expo
rm -rf node_modules/.cache/expo

# Iniciar la aplicación en modo LAN en segundo plano
echo "Iniciando la aplicación en modo LAN..."
npx expo start --lan --clear &
EXPO_PID=$!

# Esperar a que Expo inicie
echo "Esperando a que Expo inicie..."
sleep 10

# Iniciar localtunnel
echo "Iniciando localtunnel..."
lt --port 8081 --subdomain posmobile

# Manejar la terminación
function cleanup {
  echo "Deteniendo Expo..."
  kill $EXPO_PID
  exit 0
}

# Capturar señales de terminación
trap cleanup SIGINT SIGTERM

# Mantener el script en ejecución
wait $EXPO_PID 