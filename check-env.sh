#!/bin/bash

# Verificar si .env existe en sass_front
if [ -f sass_front/.env ]; then
  echo "Copiando .env desde sass_front a la raíz..."
  cp sass_front/.env .env
  echo "Archivo .env copiado correctamente."
elif [ -f sass_front/.env.local ]; then
  echo "Copiando .env.local desde sass_front a la raíz como .env..."
  cp sass_front/.env.local .env
  echo "Archivo .env.local copiado correctamente como .env."
else
  # Si no existe en sass_front, buscar en la raíz
  if [ ! -f .env ]; then
    echo "ADVERTENCIA: No se encontró archivo .env en el proyecto."
    echo "Creando archivo .env de ejemplo..."
    
    # Crear un archivo .env básico
    cat > .env << EOL
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Sitio web
NEXT_PUBLIC_SITE_URL=https://spaininsideapp.nl
EOL
    echo "Archivo .env de ejemplo creado. Por favor, edítelo con sus credenciales antes de continuar."
    exit 1
  else
    echo "Archivo .env encontrado en la raíz del proyecto."
  fi
fi

# Verificar si hay variables vacías en .env
if grep -q "=$" .env; then
  echo "ADVERTENCIA: El archivo .env contiene variables sin valor."
  echo "Por favor, complete todas las variables en el archivo .env antes de continuar."
  exit 1
fi

echo "Verificación de archivo .env completada." 