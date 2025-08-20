-- Migración para agregar campos businessName e isPremium a la tabla users
-- Ejecutar en la base de datos PostgreSQL

-- Agregar columna businessName
ALTER TABLE pos.users ADD COLUMN IF NOT EXISTS businessName VARCHAR;

-- Agregar columna isPremium con valor por defecto false
ALTER TABLE pos.users ADD COLUMN IF NOT EXISTS isPremium BOOLEAN DEFAULT FALSE;

-- Comentarios para documentar los nuevos campos
COMMENT ON COLUMN pos.users.businessName IS 'Nombre del negocio del usuario';
COMMENT ON COLUMN pos.users.isPremium IS 'Indica si el usuario tiene suscripción premium';
