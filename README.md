# Sistema POS SaaS con Gestión de Inventario y Facturación

Este proyecto implementa un sistema POS (Point of Sale) completo como SaaS (Software as a Service) con capacidades de gestión de inventario, facturación, y funcionalidades específicas para restaurantes (mesas, comandas, pedidos).

## Estructura del Proyecto

- **sass_front/**: Frontend web con Next.js
- **mobile-lynx/**: Aplicación móvil con Lynx
- **supabase/**: Configuración y migraciones de Supabase
- **fastapi_backend/**: Nuevo backend con FastAPI y PostgreSQL

## Tecnologías Utilizadas

- **Backend**: Supabase (PostgreSQL, Auth, Storage, Functions) / **FastAPI (Python) con PostgreSQL**
- **API**: RESTful con Next.js API Routes / **FastAPI**
- **Web Frontend**: Next.js, Material UI, Tailwind CSS
- **Mobile**: Lynx (React para móviles)
- **Base de Datos**: PostgreSQL (Supabase) / **PostgreSQL**

## Configuración del Entorno de Desarrollo

### Requisitos Previos

- Node.js (v18 o superior)
- npm o pnpm
- Supabase CLI
- Git
- Docker y Docker Compose

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

4. Configurar Supabase local (si aún se utiliza):
   ```
   cd ../../
   npx supabase start
   ```

### Ejecución (Antiguo Backend Supabase)

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

## Ejecución y Despliegue Local (Nuevo Backend FastAPI)

Para levantar el nuevo backend de FastAPI y la base de datos PostgreSQL utilizando Docker Compose, sigue estos pasos:

### 1. Configuración del Entorno

Asegúrate de tener un archivo `.env` en la raíz del proyecto con las variables de entorno necesarias para la base de datos y el backend. Por ejemplo:

```
POSTGRES_DB=sasdatqbox
POSTGRES_USER=sas_user
POSTGRES_PASSWORD=ML!gsx90l02
DATABASE_URL="postgresql://sas_user:ML!gsx90l02@db:5432/sasdatqbox"
SECRET_KEY=super-secret-jwt-token-with-at-least-32-characters-long
```

### 2. Levantar los Contenedores

Desde la raíz del proyecto, ejecuta el siguiente comando para construir y levantar los servicios definidos en `docker-compose.yml`:

```bash
docker-compose up --build -d
```

Esto iniciará el contenedor de PostgreSQL (`db`) y el contenedor del backend de FastAPI (`fastapi_backend`).

### 3. Ejecutar Migraciones de Base de Datos

Una vez que los contenedores estén levantados, puedes ejecutar las migraciones de Alembic para aplicar el esquema de la base de datos. Primero, asegúrate de que el servicio `db` esté completamente inicializado antes de ejecutar las migraciones.

Para ejecutar las migraciones, puedes acceder al contenedor de `fastapi_backend` y ejecutar los comandos de Alembic:

```bash
docker-compose exec fastapi_backend alembic upgrade head
```

Este comando aplicará todas las migraciones pendientes a tu base de datos PostgreSQL.

### 4. Acceso a la API

Una vez que el backend esté corriendo y las migraciones aplicadas, la API de FastAPI estará disponible. Puedes acceder a la documentación interactiva de Swagger UI en:

`http://localhost:8000/docs`

Y a la documentación de ReDoc en:

`http://localhost:8000/redoc`

### 5. Detener los Contenedores

Para detener y remover los contenedores, redes y volúmenes creados por `docker-compose`:

```bash
docker-compose down
```

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