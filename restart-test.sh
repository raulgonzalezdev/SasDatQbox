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

# Iniciar Nginx y app para prueba
echo -e "${YELLOW}Iniciando Nginx para prueba...${NC}"
docker compose up -d app nginx

echo -e "${GREEN}=== Prueba iniciada correctamente ===${NC}"
echo -e "La aplicación de prueba ahora debería estar disponible en: http://spaininsideapp.nl"
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
  echo -e "El sitio ahora debería estar disponible en: https://spaininsideapp.nl"
  echo -e "${YELLOW}Para ver logs del túnel:${NC} docker compose logs -f cloudflared"
fi 