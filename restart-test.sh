#!/bin/bash

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Reiniciando contenedores para prueba básica ===${NC}"

# Asegurar que los directorios existen
mkdir -p nginx/conf.d nginx/ssl nginx/html certbot/www certbot/conf

# Detener contenedores existentes
echo -e "${YELLOW}Deteniendo contenedores existentes...${NC}"
docker compose down

# Levantar solo nginx para prueba
echo -e "${GREEN}Iniciando Nginx para prueba...${NC}"
docker compose up -d nginx

echo -e "${GREEN}=== Prueba iniciada correctamente ===${NC}"
echo -e "La aplicación de prueba ahora debería estar disponible en: http://spaininsideapp.nl"
echo ""
echo -e "${YELLOW}Para verificar el estado:${NC} docker compose ps"
echo -e "${YELLOW}Para ver logs:${NC} docker compose logs -f nginx"
echo -e "${YELLOW}Para detener la prueba:${NC} docker compose down" 