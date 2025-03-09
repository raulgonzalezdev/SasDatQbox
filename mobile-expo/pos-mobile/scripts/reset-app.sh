#!/bin/bash

# Detener cualquier proceso de Expo en ejecución
echo "Deteniendo procesos de Expo..."
pkill -f "expo"

# Limpiar la caché
echo "Limpiando caché..."
rm -rf node_modules/.cache
rm -rf .expo
rm -rf .babel-cache

# Instalar dependencias
echo "Instalando dependencias..."
npm install

# Iniciar la aplicación
echo "Iniciando la aplicación..."
npx expo start --clear 