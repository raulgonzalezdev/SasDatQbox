#!/bin/bash

# Script de despliegue para SasDatQbox
# Compatible con el dominio spaininsideapp.nl

set -e

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Iniciando despliegue de SasDatQbox ===${NC}"

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
chmod +x check-env.sh

# Ejecutar la verificación de variables de entorno
echo -e "${YELLOW}Verificando variables de entorno...${NC}"
./check-env.sh
if [ $? -ne 0 ]; then
  echo -e "${RED}La verificación de variables de entorno falló. Siga las instrucciones anteriores.${NC}"
  exit 1
fi

# Crear directorios necesarios
mkdir -p nginx/conf.d nginx/ssl certbot/www certbot/conf

# Verificar si los archivos de configuración existen
if [ ! -f nginx/conf.d/app.conf ]; then
  echo -e "${YELLOW}No se encontró la configuración de Nginx${NC}"
  echo -e "${RED}Ejecute primero: git pull para obtener todos los archivos de configuración${NC}"
  exit 1
fi

# Solicitar certificado SSL si no existe
if [ ! -d certbot/conf/live/spaininsideapp.nl ]; then
  echo -e "${YELLOW}Solicitando certificado SSL para spaininsideapp.nl${NC}"
  
  # Iniciar nginx para verificación de dominio
  docker compose up -d nginx
  
  # Solicitar certificado
  docker compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot \
    --email admin@spaininsideapp.nl --agree-tos --no-eff-email \
    -d spaininsideapp.nl -d www.spaininsideapp.nl
  
  # Reiniciar nginx para cargar certificados
  docker compose restart nginx
fi

# Construir y levantar contenedores
echo -e "${GREEN}Construyendo contenedores...${NC}"
docker compose build

echo -e "${GREEN}Iniciando servicios...${NC}"
docker compose up -d

echo -e "${GREEN}=== Despliegue completado con éxito ===${NC}"
echo -e "La aplicación ahora está disponible en: https://spaininsideapp.nl"
echo ""
echo -e "${YELLOW}Para verificar el estado de los contenedores:${NC} docker compose ps"
echo -e "${YELLOW}Para ver logs:${NC} docker compose logs -f" 