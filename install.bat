@echo off
echo === Iniciando instalacion de SasDatQbox ===

REM Verificar si Docker está instalado
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Docker no esta instalado.
    echo Instale Docker: https://docs.docker.com/get-docker/
    exit /b 1
)

REM Verificar si Docker Compose está instalado
docker compose version >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Docker Compose no esta instalado.
    echo Instale Docker Compose: https://docs.docker.com/compose/install/
    exit /b 1
)

REM Crear directorios necesarios
mkdir nginx\conf.d 2>nul
mkdir nginx\ssl 2>nul
mkdir certbot\www 2>nul
mkdir certbot\conf 2>nul

REM Verificar si existe el archivo .env
if not exist .env (
    echo No se encontro el archivo .env
    echo Debe crear un archivo .env con las credenciales necesarias
    
    REM Generar archivo .env de ejemplo si no existe
    if not exist .env.example (
        echo # Supabase > .env.example
        echo NEXT_PUBLIC_SUPABASE_URL= >> .env.example
        echo NEXT_PUBLIC_SUPABASE_ANON_KEY= >> .env.example
        echo SUPABASE_SERVICE_ROLE_KEY= >> .env.example
        echo. >> .env.example
        echo # Stripe >> .env.example
        echo NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY= >> .env.example
        echo STRIPE_SECRET_KEY= >> .env.example
        echo STRIPE_WEBHOOK_SECRET= >> .env.example
        echo. >> .env.example
        echo # Sitio web >> .env.example
        echo NEXT_PUBLIC_SITE_URL=https://spaininsideapp.nl >> .env.example
    )
    
    copy .env.example .env
    echo Por favor, edite el archivo .env con sus credenciales antes de continuar
    exit /b 1
)

REM Verificar si los archivos de configuración existen
if not exist nginx\conf.d\app.conf (
    echo No se encontro la configuracion de Nginx
    exit /b 1
)

REM Construir y levantar contenedores
echo Construyendo contenedores...
docker compose build

echo Iniciando servicios...
docker compose up -d

echo === Despliegue completado con exito ===
echo La aplicacion ahora esta disponible en: https://spaininsideapp.nl
echo.
echo Para verificar el estado de los contenedores: docker compose ps
echo Para ver logs: docker compose logs -f 