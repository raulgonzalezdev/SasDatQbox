# Dockerfile Multi-etapa para el Monorepo de SasDatQbox

# --- Etapa 1: Backend Builder ---
# Construye el entorno del backend con todas las dependencias.
FROM python:3.10-slim as backend-builder
WORKDIR /usr/src/app

# Instalar dependencias del sistema si son necesarias
# RUN apt-get update && apt-get install -y ...

# Crear e instalar en un entorno virtual
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copiar solo el archivo de requerimientos e instalar dependencias primero
# para aprovechar el cache de Docker
COPY fastapi_backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del código del backend
COPY fastapi_backend/ .


# --- Etapa 2: Backend Production ---
# Imagen final y optimizada para el backend.
FROM python:3.10-slim as backend-production
WORKDIR /usr/src/app

# Copiar el entorno virtual con las dependencias desde la etapa anterior
COPY --from=backend-builder /opt/venv /opt/venv

# Copiar el código fuente del backend
COPY --from=backend-builder /usr/src/app .

# Exponer el puerto y definir el comando de inicio
ENV PATH="/opt/venv/bin:$PATH"
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]


# --- Etapa 3: Frontend Builder ---
# Construye la aplicación de Next.js.
FROM node:18-alpine as frontend-builder
WORKDIR /usr/src/app

# Copiar archivos de definición de paquetes e instalar dependencias
COPY sass_front/package.json sass_front/pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install

# Copiar el resto del código del frontend
COPY sass_front/ .

# Construir la aplicación
RUN pnpm run build


# --- Etapa 4: Frontend Production ---
# Imagen final para servir la aplicación de Next.js.
FROM node:18-alpine as frontend-production
WORKDIR /usr/src/app

# Copiar artefactos de construcción desde la etapa anterior
COPY --from=frontend-builder /usr/src/app/package.json .
COPY --from=frontend-builder /usr/src/app/.next ./.next
COPY --from=frontend-builder /usr/src/app/public ./public
COPY --from=frontend-builder /usr/src/app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]