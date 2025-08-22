-- Add is_active and is_superuser columns to the users table if they don't exist.
-- This is necessary because the User model in the code has these fields,
-- but the database schema might be out of sync if migrations failed.

ALTER TABLE pos.users
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS is_superuser BOOLEAN DEFAULT FALSE;
