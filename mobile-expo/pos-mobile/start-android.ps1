# Script para iniciar la aplicación Expo en Android Studio
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

# Configurar la ruta del SDK de Android
$possibleSdkPaths = @(
    "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk",
    "D:\Android\Sdk",
    "C:\Android\Sdk",
    "C:\Program Files\Android\Sdk",
    "C:\Program Files (x86)\Android\Sdk"
)

$sdkPathFound = $false
foreach ($path in $possibleSdkPaths) {
    if (Test-Path $path) {
        $env:ANDROID_HOME = $path
        $env:ANDROID_SDK_ROOT = $path
        $sdkPathFound = $true
        Write-Host "SDK de Android encontrado en: $path" -ForegroundColor Green
        
        # Añadir herramientas del SDK al PATH
        $env:Path = "$path\platform-tools;$path\tools;$path\tools\bin;$env:Path"
        break
    }
}

if (-not $sdkPathFound) {
    Write-Host "No se pudo encontrar automáticamente el SDK de Android." -ForegroundColor Yellow
    Write-Host "Por favor, introduce la ruta completa al SDK de Android:" -ForegroundColor Yellow
    $customPath = Read-Host
    
    if (Test-Path $customPath) {
        $env:ANDROID_HOME = $customPath
        $env:ANDROID_SDK_ROOT = $customPath
        $env:Path = "$customPath\platform-tools;$customPath\tools;$customPath\tools\bin;$env:Path"
        Write-Host "SDK de Android configurado en: $customPath" -ForegroundColor Green
    } else {
        Write-Host "La ruta especificada no existe. No se pudo configurar el SDK de Android." -ForegroundColor Red
        $continue = Read-Host "¿Deseas continuar de todos modos? (s/n)"
        if ($continue -ne "s") {
            Write-Host "Operación cancelada." -ForegroundColor Red
            exit
        }
    }
}

Write-Host "Variables de entorno configuradas." -ForegroundColor Green

# Verificar si Android Studio está en ejecución
Write-Host "Verificando si hay emuladores de Android en ejecución..." -ForegroundColor Magenta
try {
    $adbDevices = & adb devices 2>&1
    if ($adbDevices -match "emulator-" -or $adbDevices -match "device") {
        Write-Host "Dispositivo Android detectado." -ForegroundColor Green
    } else {
        Write-Host "No se detectó ningún emulador o dispositivo Android en ejecución." -ForegroundColor Yellow
        Write-Host "Asegúrate de tener Android Studio abierto con un emulador en ejecución o un dispositivo conectado." -ForegroundColor Yellow
        $continue = Read-Host "¿Deseas continuar de todos modos? (s/n)"
        if ($continue -ne "s") {
            Write-Host "Operación cancelada." -ForegroundColor Red
            exit
        }
    }
} catch {
    Write-Host "Error al ejecutar adb. Asegúrate de que el SDK de Android esté correctamente instalado." -ForegroundColor Red
    $continue = Read-Host "¿Deseas continuar de todos modos? (s/n)"
    if ($continue -ne "s") {
        Write-Host "Operación cancelada." -ForegroundColor Red
        exit
    }
}

# Iniciar la aplicación en Android
Write-Host "Iniciando aplicación en Android..." -ForegroundColor Cyan
npx expo start --android --clear 