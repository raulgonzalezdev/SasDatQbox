#!/bin/bash

echo "Deteniendo servicios actuales..."
docker compose down

echo "Limpiando caché de Docker..."
docker system prune -f

echo "Reconstruyendo la imagen de la aplicación..."
docker compose build app

echo "Iniciando todos los servicios..."
docker compose up -d

echo "Verificando el estado de los servicios..."
docker compose ps

echo "Mostrando logs de la aplicación..."
docker compose logs -f app nginx cloudflared 