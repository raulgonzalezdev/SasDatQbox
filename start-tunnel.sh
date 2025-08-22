#!/bin/bash

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Iniciando túnel Cloudflare ===${NC}"

# Detener el servicio cloudflared si ya está en ejecución
echo -e "${YELLOW}Deteniendo túnel existente si hay alguno...${NC}"
docker compose stop cloudflared
docker compose rm -f cloudflared

# Levantar el servicio nginx si no está en ejecución
echo -e "${YELLOW}Verificando estado de Nginx...${NC}"
if [ -z "$(docker ps -q -f name=nginx)" ]; then
  echo -e "${YELLOW}Nginx no está ejecutándose. Iniciando...${NC}"
  docker compose up -d nginx
else
  echo -e "${GREEN}Nginx ya está en ejecución.${NC}"
fi

# Iniciar el túnel
echo -e "${GREEN}Iniciando túnel Cloudflare...${NC}"
docker compose up -d cloudflared

echo -e "${GREEN}=== Túnel Cloudflare iniciado correctamente ===${NC}"
echo -e "El servicio debería estar disponible en: https://datqbox.online"
echo ""
echo -e "${YELLOW}Para verificar el estado:${NC} docker compose ps"
echo -e "${YELLOW}Para ver logs del túnel:${NC} docker compose logs -f cloudflared"
echo -e "${YELLOW}Para detener el túnel:${NC} docker compose stop cloudflared" 