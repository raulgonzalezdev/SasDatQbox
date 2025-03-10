# Script para iniciar la aplicación Expo en modo LAN
# Autor: Claude
# Fecha: 09/03/2025

# Limpiar la caché de Expo
Write-Host "Limpiando caché de Expo..." -ForegroundColor Yellow
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue .expo
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue node_modules/.cache/expo
Write-Host "Caché limpiada correctamente." -ForegroundColor Green

# Configurar variables de entorno
$env:EXPO_DEBUG = 1
$env:NODE_OPTIONS = "--dns-result-order=ipv4first"
Write-Host "Variables de entorno configuradas." -ForegroundColor Green

# Iniciar la aplicación en modo LAN
Write-Host "Iniciando aplicación en modo LAN..." -ForegroundColor Cyan
Write-Host "Para escanear el código QR, usa la aplicación Expo Go en tu dispositivo." -ForegroundColor Cyan
npx expo start --lan --clear 