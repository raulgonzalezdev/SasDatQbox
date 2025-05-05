FROM node:18-alpine AS base

# Instalar dependencias solo cuando se modifique package.json
FROM base AS deps
WORKDIR /app

COPY sass_front/package.json sass_front/package-lock.json* ./
RUN npm install

# Construir la aplicación
FROM base AS builder
WORKDIR /app

# Definir argumentos de construcción
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG STRIPE_SECRET_KEY
ARG STRIPE_WEBHOOK_SECRET
ARG SUPABASE_SERVICE_ROLE_KEY

# Pasar los argumentos como variables de entorno
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
ENV STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET
ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
ENV NEXT_PUBLIC_SITE_URL=https://simuladorparametrica.com

COPY --from=deps /app/node_modules ./node_modules
COPY sass_front/ .
COPY .env .env.local

# Configuración de variables de entorno para producción
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Verificar que la compilación produzca la carpeta standalone
RUN npm run build && \
    if [ ! -d .next/standalone ]; then \
    echo "Error: La compilación no generó la carpeta standalone. Verifica la configuración de Next.js." && \
    exit 1; \
    fi

# Imagen de producción
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.env.local ./.env.local

# Copiar los archivos de construcción
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"] 