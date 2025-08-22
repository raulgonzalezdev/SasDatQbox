#!/bin/bash

# Script para reiniciar contenedores para prueba básica
# Compatible con Cloudflare Tunnel

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Reiniciando contenedores para prueba básica ===${NC}"

# Detener contenedores existentes
echo -e "${YELLOW}Deteniendo contenedores existentes...${NC}"
docker compose down

# Verificar que los archivos de configuración de cloudflared existen
if [ ! -f config.yml ] || [ ! -f creds.json ]; then
  echo -e "${RED}Error: No se encontraron los archivos de configuración de cloudflared${NC}"
  echo -e "${YELLOW}Asegúrate de que config.yml y creds.json existen en el directorio actual${NC}"
  exit 1
fi

# Iniciar Nginx y app para prueba
echo -e "${YELLOW}Iniciando Nginx para prueba...${NC}"
docker compose up -d app nginx

echo -e "${GREEN}=== Prueba iniciada correctamente ===${NC}"
echo -e "La aplicación de prueba ahora debería estar disponible en: http://datqbox.online"
echo ""
echo -e "${YELLOW}Para verificar el estado:${NC} docker compose ps"
echo -e "${YELLOW}Para ver logs:${NC} docker compose logs -f nginx"
echo -e "${YELLOW}Para detener la prueba:${NC} docker compose down"

# Preguntar si desea iniciar también el túnel Cloudflare
echo ""
read -p "¿Desea iniciar también el túnel Cloudflare? [s/n]: " iniciar_tunel

if [[ $iniciar_tunel == "s" || $iniciar_tunel == "S" ]]; then
  echo -e "${YELLOW}Iniciando túnel Cloudflare...${NC}"
  docker compose up -d cloudflared
  echo -e "${GREEN}Túnel Cloudflare iniciado.${NC}"
  echo -e "El sitio ahora debería estar disponible en: https://datqbox.online"
  echo -e "${YELLOW}Para ver logs del túnel:${NC} docker compose logs -f cloudflared"
fi 