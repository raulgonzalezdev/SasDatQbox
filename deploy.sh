#!/bin/bash

# Script de despliegue para SasDatQbox con Cloudflare Tunnel
# Para el dominio spaininsideapp.nl

set -e

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Iniciando despliegue de SasDatQbox con Cloudflare Tunnel ===${NC}"

# Verificar si docker está instalado
if ! [ -x "$(command -v docker)" ]; then
  echo -e "${RED}Error: Docker no está instalado.${NC}" >&2
  echo -e "Instale Docker: https://docs.docker.com/get-docker/"
  exit 1
fi

# Verificar si docker compose está instalado
if ! [ -x "$(command -v docker)" ] || ! docker compose version > /dev/null 2>&1; then
  echo -e "${RED}Error: Docker Compose no está instalado.${NC}" >&2
  echo -e "Instale Docker Compose: https://docs.docker.com/compose/install/"
  exit 1
fi

# Dar permisos de ejecución al script check-env.sh
if [ -f check-env.sh ]; then
  chmod +x check-env.sh

  # Ejecutar la verificación de variables de entorno
  echo -e "${YELLOW}Verificando variables de entorno...${NC}"
  ./check-env.sh
  if [ $? -ne 0 ]; then
    echo -e "${RED}La verificación de variables de entorno falló. Siga las instrucciones anteriores.${NC}"
    exit 1
  fi
fi

# Crear directorios necesarios
mkdir -p nginx/conf.d nginx/html certbot/www

# Verificar si los archivos de configuración existen
if [ ! -f nginx/conf.d/app.conf ]; then
  echo -e "${YELLOW}No se encontró la configuración de Nginx. Creando configuración básica...${NC}"
  
  # Crear archivo de configuración básico de nginx
  cat > nginx/conf.d/app.conf << EOF
server {
    listen 80;
    server_name spaininsideapp.nl www.spaininsideapp.nl;

    # Ruta para la verificación de Let's Encrypt
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Contenido estático
    location /static/ {
        alias /usr/share/nginx/html/static/;
        expires 30d;
    }

    # Proxy hacia la aplicación Next.js
    location / {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
  
  echo -e "${GREEN}Configuración de Nginx creada.${NC}"
fi

# Crear página HTML básica para pruebas
if [ ! -f nginx/html/index.html ]; then
  echo -e "${YELLOW}Creando página HTML básica para pruebas...${NC}"
  mkdir -p nginx/html
  cat > nginx/html/index.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Spain Inside App</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }
        h1 {
            color: #e63946;
        }
        .info {
            background-color: #f1faee;
            border-radius: 5px;
            padding: 20px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <h1>Spain Inside App</h1>
    <p>Esta es una página de prueba para verificar la correcta configuración del servidor.</p>
    <div class="info">
        <p>Si estás viendo esta página, Nginx está funcionando correctamente.</p>
        <p>La aplicación real debería estar cargando pronto.</p>
    </div>
</body>
</html>
EOF
  echo -e "${GREEN}Página HTML de prueba creada.${NC}"
fi

# Construir y levantar contenedores
echo -e "${GREEN}Construyendo contenedores...${NC}"
docker compose build

echo -e "${GREEN}Iniciando servicios...${NC}"
docker compose up -d

# Iniciar túnel Cloudflare
echo -e "${GREEN}Iniciando túnel Cloudflare...${NC}"
docker compose up -d cloudflared

echo -e "${GREEN}=== Despliegue completado con éxito ===${NC}"
echo -e "La aplicación ahora está disponible en: https://spaininsideapp.nl"
echo ""
echo -e "${YELLOW}Para verificar el estado de los contenedores:${NC} docker compose ps"
echo -e "${YELLOW}Para ver logs:${NC} docker compose logs -f"
echo -e "${YELLOW}Para ver logs del túnel:${NC} docker compose logs -f cloudflared" 