#!/bin/bash

# Limpiar la caché de Expo
echo "Limpiando caché de Expo..."
rm -rf .expo
rm -rf node_modules/.cache/expo

# Establecer variables de entorno para el modo tunnel
export EXPO_USE_TUNNEL=1
export EXPO_DEBUG=1
export EXPO_TUNNEL_SUBDOMAIN=posmobile
export NODE_OPTIONS=--dns-result-order=ipv4first

# Iniciar la aplicación en modo tunnel
echo "Iniciando la aplicación en modo tunnel..."
npx expo start --tunnel --clear 