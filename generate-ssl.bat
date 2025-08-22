@echo off
echo === Generador de certificados SSL para datqbox.online ===

REM Verificar si Docker está instalado
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Docker no esta instalado.
    echo Instale Docker: https://docs.docker.com/get-docker/
    exit /b 1
)

REM Crear directorios necesarios
mkdir nginx\conf.d 2>nul
mkdir nginx\ssl 2>nul
mkdir certbot\www 2>nul
mkdir certbot\conf 2>nul

REM Crear archivos base para Nginx
echo Creando archivos de configuración base para Nginx...

REM Crear options-ssl-nginx.conf
echo ssl_session_cache shared:le_nginx_SSL:10m; > certbot\conf\options-ssl-nginx.conf
echo ssl_session_timeout 1440m; >> certbot\conf\options-ssl-nginx.conf
echo ssl_protocols TLSv1.2 TLSv1.3; >> certbot\conf\options-ssl-nginx.conf
echo ssl_prefer_server_ciphers off; >> certbot\conf\options-ssl-nginx.conf
echo ssl_ciphers "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384"; >> certbot\conf\options-ssl-nginx.conf

REM Crear ssl-dhparams.pem
echo -----BEGIN DH PARAMETERS----- > certbot\conf\ssl-dhparams.pem
echo MIIBCAKCAQEAp4sJiU4KAqSMmmTyqH/3AO0mdmZTACcovWJx6vw+YKp/gkGEurcO >> certbot\conf\ssl-dhparams.pem
echo 1KLG7o2Iwk4zT1WHHE96ZuFQW8uIlPE7ookhNnx2mA+5jRW1+T02+j3FhZ9MvdXn >> certbot\conf\ssl-dhparams.pem
echo zEzBGLNGYFrbGSu3NchyyLkKDL5nG2NHrkt66nx5ZdKnZTiEeOAKrBTQ6K+7ES2v >> certbot\conf\ssl-dhparams.pem
echo 0j4Pw2HMLKa3il6x6M1UDExXBbMqeQiZUGqd++Ci4QltnSYVfPhSJKUVV/zivBe9 >> certbot\conf\ssl-dhparams.pem
echo 4NW70VOGw0m9LJL8WxbCKGLCe3CtYOa22ORYnK1UIHZGccYUPxGVcI/WDS9AXCm3 >> certbot\conf\ssl-dhparams.pem
echo dzGfhJsNqUxHO/7OOZMoK6j0BjzpGH/iQ8YBFqHxNPgUWyU+jPY7ab/F7eDmGCOU >> certbot\conf\ssl-dhparams.pem
echo XPiM9BwWwCwIDAQAB >> certbot\conf\ssl-dhparams.pem
echo -----END DH PARAMETERS----- >> certbot\conf\ssl-dhparams.pem

REM Crear nginx-http.conf para solicitar certificado
echo server { > nginx\conf.d\nginx-http.conf
echo     listen 80; >> nginx\conf.d\nginx-http.conf
echo     server_name datqbox.online www.datqbox.online; >> nginx\conf.d\nginx-http.conf
echo     location ^~ /.well-known/acme-challenge/ { >> nginx\conf.d\nginx-http.conf
echo         root /var/www/certbot; >> nginx\conf.d\nginx-http.conf
echo     } >> nginx\conf.d\nginx-http.conf
echo     location / { >> nginx\conf.d\nginx-http.conf
echo         return 301 https://$host$request_uri; >> nginx\conf.d\nginx-http.conf
echo     } >> nginx\conf.d\nginx-http.conf
echo } >> nginx\conf.d\nginx-http.conf

REM Iniciar Nginx solo para el reto de certificación
echo Iniciando Nginx para la verificación de dominio...
docker run -d --name nginx-ssl --rm -p 80:80 -v %cd%\nginx\conf.d:/etc/nginx/conf.d -v %cd%\certbot\www:/var/www/certbot nginx:alpine

echo Esperando 5 segundos para que Nginx se inicie...
timeout /t 5 /nobreak > nul

REM Solicitar certificado con Certbot
echo Solicitando certificado SSL con Certbot...
docker run --rm -v %cd%\certbot\conf:/etc/letsencrypt -v %cd%\certbot\www:/var/www/certbot certbot/certbot certonly --webroot --webroot-path=/var/www/certbot --email gq.raul@gmail.com --agree-tos --no-eff-email -d datqbox.online -d www.datqbox.online

REM Detener Nginx
echo Deteniendo Nginx temporal...
docker stop nginx-ssl

REM Verificar si se generaron los certificados
if exist certbot\conf\live\datqbox.online\fullchain.pem (
    echo.
    echo ¡Certificados generados con éxito!
    echo Los certificados están en la carpeta certbot\conf\live\datqbox.online\
    echo.
    echo Para completar la configuración, ejecuta:
    echo docker compose up -d
) else (
    echo.
    echo ERROR: No se pudieron generar los certificados SSL.
    echo Verifica que el dominio datqbox.online apunte a esta máquina
    echo y que el puerto 80 esté abierto en el firewall.
)

REM Reemplazar el archivo app.conf con una versión que funcione
echo Creando archivo de configuración app.conf para Nginx...
echo server { > nginx\conf.d\app.conf
echo     listen 80; >> nginx\conf.d\app.conf
echo     server_name datqbox.online www.datqbox.online; >> nginx\conf.d\app.conf
echo     server_tokens off; >> nginx\conf.d\app.conf
echo. >> nginx\conf.d\app.conf
echo     location /.well-known/acme-challenge/ { >> nginx\conf.d\app.conf
echo         root /var/www/certbot; >> nginx\conf.d\app.conf
echo     } >> nginx\conf.d\app.conf
echo. >> nginx\conf.d\app.conf
echo     location / { >> nginx\conf.d\app.conf
echo         return 301 https://$host$request_uri; >> nginx\conf.d\app.conf
echo     } >> nginx\conf.d\app.conf
echo } >> nginx\conf.d\app.conf
echo. >> nginx\conf.d\app.conf
echo server { >> nginx\conf.d\app.conf
echo     listen 443 ssl; >> nginx\conf.d\app.conf
echo     server_name datqbox.online www.datqbox.online; >> nginx\conf.d\app.conf
echo     server_tokens off; >> nginx\conf.d\app.conf
echo. >> nginx\conf.d\app.conf
echo     ssl_certificate /etc/letsencrypt/live/datqbox.online/fullchain.pem; >> nginx\conf.d\app.conf
echo     ssl_certificate_key /etc/letsencrypt/live/datqbox.online/privkey.pem; >> nginx\conf.d\app.conf
echo     ssl_session_cache shared:le_nginx_SSL:10m; >> nginx\conf.d\app.conf
echo     ssl_session_timeout 1440m; >> nginx\conf.d\app.conf
echo     ssl_protocols TLSv1.2 TLSv1.3; >> nginx\conf.d\app.conf
echo     ssl_prefer_server_ciphers off; >> nginx\conf.d\app.conf
echo. >> nginx\conf.d\app.conf
echo     client_max_body_size 20M; >> nginx\conf.d\app.conf
echo. >> nginx\conf.d\app.conf
echo     location / { >> nginx\conf.d\app.conf
echo         proxy_pass http://app:3000; >> nginx\conf.d\app.conf
echo         proxy_set_header Host $host; >> nginx\conf.d\app.conf
echo         proxy_set_header X-Real-IP $remote_addr; >> nginx\conf.d\app.conf
echo         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; >> nginx\conf.d\app.conf
echo         proxy_set_header X-Forwarded-Proto $scheme; >> nginx\conf.d\app.conf
echo         proxy_set_header Upgrade $http_upgrade; >> nginx\conf.d\app.conf
echo         proxy_set_header Connection "upgrade"; >> nginx\conf.d\app.conf
echo     } >> nginx\conf.d\app.conf
echo. >> nginx\conf.d\app.conf
echo     location /_next/static { >> nginx\conf.d\app.conf
echo         proxy_pass http://app:3000; >> nginx\conf.d\app.conf
echo         add_header Cache-Control "public, max-age=31536000, immutable"; >> nginx\conf.d\app.conf
echo     } >> nginx\conf.d\app.conf
echo. >> nginx\conf.d\app.conf
echo     location /api { >> nginx\conf.d\app.conf
echo         proxy_pass http://app:3000; >> nginx\conf.d\app.conf
echo         proxy_http_version 1.1; >> nginx\conf.d\app.conf
echo         proxy_set_header Upgrade $http_upgrade; >> nginx\conf.d\app.conf
echo         proxy_set_header Connection "upgrade"; >> nginx\conf.d\app.conf
echo         proxy_set_header Host $host; >> nginx\conf.d\app.conf
echo         proxy_cache_bypass $http_upgrade; >> nginx\conf.d\app.conf
echo     } >> nginx\conf.d\app.conf
echo } >> nginx\conf.d\app.conf

echo.
echo El script ha terminado. Si los certificados se generaron correctamente,
echo puedes continuar con el despliegue usando docker compose up -d
echo. 