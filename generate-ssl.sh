#!/bin/bash

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Generador de certificados SSL para datqbox.online ===${NC}"

# Verificar si docker está instalado
if ! [ -x "$(command -v docker)" ]; then
  echo -e "${RED}Error: Docker no está instalado.${NC}" >&2
  echo -e "Instale Docker: https://docs.docker.com/get-docker/"
  exit 1
fi

# Crear directorios necesarios
mkdir -p nginx/conf.d nginx/ssl certbot/www certbot/conf

# Crear archivos base para Nginx
echo -e "${YELLOW}Creando archivos de configuración base para Nginx...${NC}"

# Crear options-ssl-nginx.conf
cat > certbot/conf/options-ssl-nginx.conf << EOL
ssl_session_cache shared:le_nginx_SSL:10m;
ssl_session_timeout 1440m;
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;
ssl_ciphers "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384";
EOL

# Crear ssl-dhparams.pem
cat > certbot/conf/ssl-dhparams.pem << EOL
-----BEGIN DH PARAMETERS-----
MIIBCAKCAQEAp4sJiU4KAqSMmmTyqH/3AO0mdmZTACcovWJx6vw+YKp/gkGEurcO
1KLG7o2Iwk4zT1WHHE96ZuFQW8uIlPE7ookhNnx2mA+5jRW1+T02+j3FhZ9MvdXn
zEzBGLNGYFrbGSu3NchyyLkKDL5nG2NHrkt66nx5ZdKnZTiEeOAKrBTQ6K+7ES2v
0j4Pw2HMLKa3il6x6M1UDExXBbMqeQiZUGqd++Ci4QltnSYVfPhSJKUVV/zivBe9
4NW70VOGw0m9LJL8WxbCKGLCe3CtYOa22ORYnK1UIHZGccYUPxGVcI/WDS9AXCm3
dzGfhJsNqUxHO/7OOZMoK6j0BjzpGH/iQ8YBFqHxNPgUWyU+jPY7ab/F7eDmGCOU
XPiM9BwWwCwIDAQAB
-----END DH PARAMETERS-----
EOL

# Crear nginx-http.conf para solicitar certificado
cat > nginx/conf.d/nginx-http.conf << EOL
server {
    listen 80;
    server_name datqbox.online www.datqbox.online;
    location ^~ /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    location / {
        return 301 https://\$host\$request_uri;
    }
}
EOL

# Iniciar Nginx solo para el reto de certificación
echo -e "${YELLOW}Iniciando Nginx para la verificación de dominio...${NC}"
docker run -d --name nginx-ssl --rm -p 80:80 -v $(pwd)/nginx/conf.d:/etc/nginx/conf.d -v $(pwd)/certbot/www:/var/www/certbot nginx:alpine

echo "Esperando 5 segundos para que Nginx se inicie..."
sleep 5

# Solicitar certificado con Certbot
echo -e "${YELLOW}Solicitando certificado SSL con Certbot...${NC}"
docker run --rm -v $(pwd)/certbot/conf:/etc/letsencrypt -v $(pwd)/certbot/www:/var/www/certbot certbot/certbot certonly --webroot --webroot-path=/var/www/certbot --email gq.raul@gmail.com --agree-tos --no-eff-email -d datqbox.online -d www.datqbox.online

# Detener Nginx
echo -e "${YELLOW}Deteniendo Nginx temporal...${NC}"
docker stop nginx-ssl

# Verificar si se generaron los certificados
if [ -f certbot/conf/live/datqbox.online/fullchain.pem ]; then
    echo -e "${GREEN}¡Certificados generados con éxito!${NC}"
    echo -e "Los certificados están en la carpeta ${YELLOW}certbot/conf/live/datqbox.online/${NC}"
    echo ""
    echo -e "Para completar la configuración, ejecuta: ${YELLOW}docker compose up -d${NC}"
else
    echo -e "${RED}ERROR: No se pudieron generar los certificados SSL.${NC}"
    echo -e "Verifica que el dominio datqbox.online apunte a esta máquina"
    echo -e "y que el puerto 80 esté abierto en el firewall."
fi

# Reemplazar el archivo app.conf con una versión que funcione
echo -e "${YELLOW}Creando archivo de configuración app.conf para Nginx...${NC}"
cat > nginx/conf.d/app.conf << EOL
server {
    listen 80;
    server_name datqbox.online www.datqbox.online;
    server_tokens off;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name datqbox.online www.datqbox.online;
    server_tokens off;

    ssl_certificate /etc/letsencrypt/live/datqbox.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/datqbox.online/privkey.pem;
    ssl_session_cache shared:le_nginx_SSL:10m;
    ssl_session_timeout 1440m;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;

    client_max_body_size 20M;

    location / {
        proxy_pass http://app:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /_next/static {
        proxy_pass http://app:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /api {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

echo ""
echo -e "${GREEN}El script ha terminado. Si los certificados se generaron correctamente,${NC}"
echo -e "puedes continuar con el despliegue usando ${YELLOW}docker compose up -d${NC}"
echo ""

# Hacer ejecutable el script deploy.sh
chmod +x deploy.sh 