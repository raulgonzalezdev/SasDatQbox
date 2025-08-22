# Plan de Refactorización del Backend

Este documento describe el plan para refactorizar el backend de este proyecto, migrando de una arquitectura basada en Supabase a un backend personalizado con FastAPI y PostgreSQL.

## Fases del Proyecto

1.  **Análisis Profundo:** Revisar las reglas en `.cursor`, el esquema de la base de datos en las migraciones de Supabase y la lógica de negocio existente en el backend de Node.js para entender completamente la funcionalidad actual y el estilo de codificación.
2.  **Fundación del Nuevo Backend:** Crear una nueva carpeta para el backend de FastAPI (`fastapi_backend`) con una estructura organizada, configuración de entorno virtual y dependencias iniciales (FastAPI, Uvicorn, SQLAlchemy, Alembic, Psycopg2).
3.  **Migración del Esquema:** Traducir el esquema SQL de Supabase a modelos de SQLAlchemy en Python. Usar Alembic para generar una migración inicial que cree estas tablas en la base de datos PostgreSQL.
4.  **Implementación de Autenticación JWT:** Desarrollar los endpoints y la lógica para el registro de usuarios, inicio de sesión y renovación de tokens JWT.
5.  **Desarrollo de las APIs:** Reimplementar la lógica de negocio (usuarios, suscripciones, etc.) del backend de Node.js en los nuevos endpoints de FastAPI.
6.  **Integración con el Frontend:** Modificar gradualmente el frontend de Next.js (`sass_front`) y la app móvil (`mobile-expo`) para que consuman las nuevas APIs del backend de FastAPI.
7.  **Limpieza:** Una vez que el nuevo sistema esté validado y funcionando, eliminar el antiguo directorio `backend` y los archivos de configuración de Supabase.
