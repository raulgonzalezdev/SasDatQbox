# Sistema POS SaaS con Gestión de Inventario y Facturación

Este proyecto implementa un sistema POS (Point of Sale) completo como SaaS (Software as a Service) con capacidades de gestión de inventario, facturación, y funcionalidades específicas para restaurantes (mesas, comandas, pedidos).

## Estructura del Proyecto

- **sass_front/**: Frontend web con Next.js
- **mobile-lynx/**: Aplicación móvil con Lynx
- **supabase/**: Configuración y migraciones de Supabase

## Tecnologías Utilizadas

- **Backend**: Supabase (PostgreSQL, Auth, Storage, Functions)
- **API**: RESTful con Next.js API Routes
- **Web Frontend**: Next.js, Material UI, Tailwind CSS
- **Mobile**: Lynx (React para móviles)
- **Base de Datos**: PostgreSQL (Supabase)

## Configuración del Entorno de Desarrollo

### Requisitos Previos

- Node.js (v18 o superior)
- npm o pnpm
- Supabase CLI
- Git

### Instalación

1. Clonar el repositorio:
   ```
   git clone <URL_DEL_REPOSITORIO>
   cd SasDatQbox
   ```

2. Instalar dependencias del frontend web:
   ```
   cd sass_front
   npm install
   ```

3. Instalar dependencias de la aplicación móvil:
   ```
   cd ../mobile-lynx/pos-mobile
   npm install
   ```

4. Configurar Supabase local:
   ```
   cd ../../
   npx supabase start
   ```

### Ejecución

1. Iniciar el frontend web:
   ```
   cd sass_front
   npm run dev
   ```

2. Iniciar la aplicación móvil:
   ```
   cd ../mobile-lynx/pos-mobile
   npm run dev
   ```

3. Acceder a la aplicación web en [http://localhost:3000](http://localhost:3000)

## Estructura de la Base de Datos

El proyecto utiliza una base de datos PostgreSQL gestionada por Supabase con las siguientes tablas principales:

- **users**: Información de usuarios
- **businesses**: Negocios registrados en la plataforma
- **products_inventory**: Productos en inventario
- **sales**: Ventas/facturas
- **orders**: Órdenes/comandas para restaurantes

## Funcionalidades Principales

- Gestión de inventario
- Facturación y ventas
- Gestión de mesas y comandas para restaurantes
- Reportes y analíticas
- Sistema de suscripciones

## Contribución

1. Hacer fork del repositorio
2. Crear una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Hacer commit de tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Hacer push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request 