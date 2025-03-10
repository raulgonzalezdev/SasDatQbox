# Script para iniciar la aplicación Expo en diferentes modos
# Autor: Claude
# Fecha: 09/03/2025

# Función para mostrar el menú de opciones
function Show-Menu {
    Clear-Host
    Write-Host "===== MENU DE INICIO DE EXPO POS MOBILE =====" -ForegroundColor Cyan
    Write-Host "1. Iniciar en modo LAN (recomendado para desarrollo local)" -ForegroundColor Green
    Write-Host "2. Iniciar en modo Túnel (para acceder desde fuera de la red)" -ForegroundColor Yellow
    Write-Host "3. Iniciar en Android (requiere emulador o dispositivo conectado)" -ForegroundColor Magenta
    Write-Host "4. Iniciar en Web" -ForegroundColor Blue
    Write-Host "5. Limpiar caché y node_modules" -ForegroundColor Red
    Write-Host "6. Configurar SDK de Android" -ForegroundColor DarkYellow
    Write-Host "Q. Salir" -ForegroundColor Gray
    Write-Host "==========================================" -ForegroundColor Cyan
}

# Función para limpiar la caché
function Clear-ExpoCache {
    Write-Host "Limpiando caché de Expo..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force -ErrorAction SilentlyContinue .expo
    Remove-Item -Recurse -Force -ErrorAction SilentlyContinue node_modules/.cache/expo
    Write-Host "Caché limpiada correctamente." -ForegroundColor Green
}

# Función para establecer variables de entorno
function Set-ExpoEnv {
    $env:EXPO_USE_TUNNEL = 1
    $env:EXPO_DEBUG = 1
    $env:NODE_OPTIONS = "--dns-result-order=ipv4first"
    Write-Host "Variables de entorno configuradas." -ForegroundColor Green
}

# Función para configurar el SDK de Android
function Set-AndroidSDK {
    Write-Host "Configurando SDK de Android..." -ForegroundColor DarkYellow
    
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
            return $false
        }
    }
    
    # Guardar la configuración para futuras sesiones
    $saveConfig = Read-Host "¿Deseas guardar esta configuración para futuras sesiones? (s/n)"
    if ($saveConfig -eq "s") {
        try {
            # Guardar para el usuario actual
            [System.Environment]::SetEnvironmentVariable("ANDROID_HOME", $env:ANDROID_HOME, [System.EnvironmentVariableTarget]::User)
            [System.Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $env:ANDROID_SDK_ROOT, [System.EnvironmentVariableTarget]::User)
            Write-Host "Configuración guardada para el usuario actual." -ForegroundColor Green
        } catch {
            Write-Host "Error al guardar la configuración: $_" -ForegroundColor Red
        }
    }
    
    return $true
}

# Función para iniciar en modo LAN
function Start-ExpoLan {
    Clear-ExpoCache
    Write-Host "Iniciando aplicación en modo LAN..." -ForegroundColor Cyan
    npx expo start --lan --clear
}

# Función para iniciar en modo Túnel
function Start-ExpoTunnel {
    Clear-ExpoCache
    Set-ExpoEnv
    Write-Host "Iniciando aplicación en modo Túnel..." -ForegroundColor Yellow
    Write-Host "Si hay problemas con el túnel, intenta usar el modo LAN." -ForegroundColor Yellow
    npx expo start --tunnel --clear
}

# Función para iniciar en Android
function Start-ExpoAndroid {
    Clear-ExpoCache
    
    # Verificar si el SDK de Android está configurado
    if (-not $env:ANDROID_HOME -or -not (Test-Path $env:ANDROID_HOME)) {
        Write-Host "El SDK de Android no está configurado correctamente." -ForegroundColor Yellow
        $configureSDK = Read-Host "¿Deseas configurar el SDK de Android ahora? (s/n)"
        if ($configureSDK -eq "s") {
            $result = Set-AndroidSDK
            if (-not $result) {
                Write-Host "No se pudo configurar el SDK de Android. Operación cancelada." -ForegroundColor Red
                return
            }
        } else {
            Write-Host "Operación cancelada." -ForegroundColor Red
            return
        }
    }
    
    # Verificar si hay dispositivos Android conectados
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
                return
            }
        }
    } catch {
        Write-Host "Error al ejecutar adb. Asegúrate de que el SDK de Android esté correctamente instalado." -ForegroundColor Red
        $continue = Read-Host "¿Deseas continuar de todos modos? (s/n)"
        if ($continue -ne "s") {
            Write-Host "Operación cancelada." -ForegroundColor Red
            return
        }
    }
    
    Write-Host "Iniciando aplicación en Android..." -ForegroundColor Magenta
    npx expo start --android --clear
}

# Función para iniciar en Web
function Start-ExpoWeb {
    Clear-ExpoCache
    Write-Host "Iniciando aplicación en Web..." -ForegroundColor Blue
    npx expo start --web --clear
}

# Función para limpiar completamente
function Clear-ExpoComplete {
    Write-Host "Limpiando caché y node_modules..." -ForegroundColor Red
    Remove-Item -Recurse -Force -ErrorAction SilentlyContinue .expo
    Remove-Item -Recurse -Force -ErrorAction SilentlyContinue node_modules/.cache/expo
    
    $confirmation = Read-Host "¿Deseas eliminar también node_modules y reinstalar? (s/n)"
    if ($confirmation -eq 's') {
        Write-Host "Eliminando node_modules..." -ForegroundColor Red
        Remove-Item -Recurse -Force -ErrorAction SilentlyContinue node_modules
        Write-Host "Reinstalando dependencias..." -ForegroundColor Yellow
        npm install
        Write-Host "Dependencias reinstaladas correctamente." -ForegroundColor Green
    }
    
    Write-Host "Limpieza completada." -ForegroundColor Green
}

# Bucle principal
do {
    Show-Menu
    $input = Read-Host "Selecciona una opción"
    
    switch ($input) {
        '1' { Start-ExpoLan }
        '2' { Start-ExpoTunnel }
        '3' { Start-ExpoAndroid }
        '4' { Start-ExpoWeb }
        '5' { Clear-ExpoComplete }
        '6' { Set-AndroidSDK }
        'q' { return }
        default { Write-Host "Opción no válida. Intenta de nuevo." -ForegroundColor Red }
    }
    
    if ($input -ne 'q' -and $input -ne '1' -and $input -ne '2' -and $input -ne '3' -and $input -ne '4' -and $input -ne '5' -and $input -ne '6') {
        Write-Host "Presiona cualquier tecla para continuar..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
} while ($input -ne 'q') 