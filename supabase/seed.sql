-- Insertar usuarios de prueba
-- Primero necesitamos crear usuarios en auth.users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES 
  (gen_random_uuid(), 'usuario1@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', NOW(), '{"full_name":"Juan Pérez", "avatar_url":"https://randomuser.me/api/portraits/men/1.jpg"}'),
  (gen_random_uuid(), 'usuario2@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', NOW(), '{"full_name":"María García", "avatar_url":"https://randomuser.me/api/portraits/women/1.jpg"}'),
  (gen_random_uuid(), 'usuario3@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', NOW(), '{"full_name":"Carlos Rodríguez", "avatar_url":"https://randomuser.me/api/portraits/men/2.jpg"}'),
  (gen_random_uuid(), 'usuario4@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', NOW(), '{"full_name":"Ana Martínez", "avatar_url":"https://randomuser.me/api/portraits/women/2.jpg"}'),
  (gen_random_uuid(), 'usuario5@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', NOW(), '{"full_name":"Roberto López", "avatar_url":"https://randomuser.me/api/portraits/men/3.jpg"}');

-- Los triggers deberían haber creado automáticamente entradas en la tabla users
-- Pero vamos a actualizar algunos campos adicionales
UPDATE pos.users
SET billing_address = '{"line1":"Calle Principal 123","city":"Madrid","state":"Madrid","postal_code":"28001","country":"ES"}'
WHERE email = 'usuario1@example.com';

UPDATE pos.users
SET billing_address = '{"line1":"Avenida Central 456","city":"Barcelona","state":"Cataluña","postal_code":"08001","country":"ES"}'
WHERE email = 'usuario2@example.com';

UPDATE pos.users
SET billing_address = '{"line1":"Plaza Mayor 789","city":"Valencia","state":"Valencia","postal_code":"46001","country":"ES"}'
WHERE email = 'usuario3@example.com';

-- Insertar datos de prueba para el esquema POS

-- Insertar negocios
INSERT INTO pos.businesses (id, user_id, name, legal_name, tax_id, phone, email, website, logo_url, address, currency, timezone)
SELECT 
  gen_random_uuid(),
  id,
  CASE 
    WHEN email = 'usuario1@example.com' THEN 'Tienda Central'
    WHEN email = 'usuario2@example.com' THEN 'Supermercado Express'
    ELSE 'Negocio ' || email
  END,
  CASE 
    WHEN email = 'usuario1@example.com' THEN 'Tienda Central S.L.'
    WHEN email = 'usuario2@example.com' THEN 'Super Express S.A.'
    ELSE 'Empresa ' || email
  END,
  CASE 
    WHEN email = 'usuario1@example.com' THEN 'B12345678'
    WHEN email = 'usuario2@example.com' THEN 'A87654321'
    ELSE 'X' || substr(id::text, 1, 8)
  END,
  CASE 
    WHEN email = 'usuario1@example.com' THEN '+34912345678'
    WHEN email = 'usuario2@example.com' THEN '+34987654321'
    ELSE '+34' || substr(id::text, 1, 9)
  END,
  CASE 
    WHEN email = 'usuario1@example.com' THEN 'info@tiendacentral.com'
    WHEN email = 'usuario2@example.com' THEN 'info@superexpress.com'
    ELSE 'info@' || substr(email, strpos(email, '@') + 1)
  END,
  CASE 
    WHEN email = 'usuario1@example.com' THEN 'www.tiendacentral.com'
    WHEN email = 'usuario2@example.com' THEN 'www.superexpress.com'
    ELSE 'www.' || substr(email, strpos(email, '@') + 1)
  END,
  CASE 
    WHEN email = 'usuario1@example.com' THEN 'https://example.com/logos/tienda1.png'
    WHEN email = 'usuario2@example.com' THEN 'https://example.com/logos/tienda2.png'
    ELSE 'https://example.com/logos/default.png'
  END,
  CASE 
    WHEN email = 'usuario1@example.com' THEN '{"street":"Calle Mayor 123","city":"Madrid","postal_code":"28001","country":"ES"}'
    WHEN email = 'usuario2@example.com' THEN '{"street":"Avenida Principal 456","city":"Barcelona","postal_code":"08001","country":"ES"}'
    ELSE '{"street":"Calle Ejemplo 789","city":"Valencia","postal_code":"46001","country":"ES"}'
  END,
  'EUR',
  'Europe/Madrid'
FROM auth.users
WHERE email IN ('usuario1@example.com', 'usuario2@example.com', 'usuario3@example.com');

-- Insertar configuraciones de negocios
INSERT INTO pos.business_settings (id, business_id, settings)
SELECT 
  gen_random_uuid(),
  id,
  '{
    "theme": "light",
    "language": "es",
    "currency": "EUR",
    "timezone": "Europe/Madrid",
    "date_format": "DD/MM/YYYY",
    "time_format": "24h",
    "notifications": {
      "email": true,
      "sms": false,
      "push": true
    }
  }'::jsonb
FROM pos.businesses;

-- Insertar ubicaciones de negocios
INSERT INTO pos.business_locations (id, business_id, name, address, phone, email, is_main_location)
SELECT 
  gen_random_uuid(),
  id,
  CASE 
    WHEN name = 'Tienda Central' THEN 'Sede Principal'
    WHEN name = 'Supermercado Express' THEN 'Local Principal'
    ELSE 'Sede ' || name
  END,
  address,
  phone,
  email,
  true
FROM pos.businesses;

-- Insertar roles
INSERT INTO pos.roles (id, business_id, name, description, is_default)
SELECT 
  gen_random_uuid(),
  id,
  CASE 
    WHEN name = 'Tienda Central' THEN 'Administrador'
    WHEN name = 'Supermercado Express' THEN 'Gerente'
    ELSE 'Admin'
  END,
  'Acceso total al sistema',
  true
FROM pos.businesses;

-- Insertar permisos
INSERT INTO pos.permissions (id, name, description, module)
VALUES 
  (gen_random_uuid(), 'manage_users', 'Gestionar usuarios', 'users'),
  (gen_random_uuid(), 'manage_inventory', 'Gestionar inventario', 'inventory'),
  (gen_random_uuid(), 'manage_sales', 'Gestionar ventas', 'sales'),
  (gen_random_uuid(), 'view_reports', 'Ver reportes', 'reports');

-- Insertar permisos de roles
INSERT INTO pos.role_permissions (id, role_id, permission_id)
SELECT 
  gen_random_uuid(),
  r.id,
  p.id
FROM pos.roles r
CROSS JOIN pos.permissions p;

-- Insertar roles de usuario
INSERT INTO pos.user_roles (id, user_id, role_id, business_id, location_id)
SELECT 
  gen_random_uuid(),
  b.user_id,
  r.id,
  b.id,
  l.id
FROM pos.businesses b
JOIN pos.roles r ON r.business_id = b.id
JOIN pos.business_locations l ON l.business_id = b.id;

-- Insertar categorías
INSERT INTO pos.categories (id, business_id, name, description, image_url, color, active)
SELECT 
  gen_random_uuid(),
  id,
  CASE 
    WHEN name = 'Tienda Central' THEN 'Electrónicos'
    WHEN name = 'Supermercado Express' THEN 'Alimentos'
    ELSE 'General'
  END,
  CASE 
    WHEN name = 'Tienda Central' THEN 'Productos electrónicos'
    WHEN name = 'Supermercado Express' THEN 'Productos alimenticios'
    ELSE 'Productos generales'
  END,
  CASE 
    WHEN name = 'Tienda Central' THEN 'https://example.com/categories/electronics.png'
    WHEN name = 'Supermercado Express' THEN 'https://example.com/categories/food.png'
    ELSE 'https://example.com/categories/general.png'
  END,
  CASE 
    WHEN name = 'Tienda Central' THEN '#FF0000'
    WHEN name = 'Supermercado Express' THEN '#00FF00'
    ELSE '#0000FF'
  END,
  true
FROM pos.businesses;

-- Insertar productos de inventario
INSERT INTO pos.products_inventory (id, business_id, category_id, name, description, sku, barcode, unit, image_url, cost_price, selling_price, tax_type, tax_rate, is_service, track_inventory, min_stock_level, active)
SELECT 
  gen_random_uuid(),
  b.id,
  c.id,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 'iPhone 13'
    WHEN b.name = 'Supermercado Express' THEN 'Leche Entera'
    ELSE 'Producto ' || b.name
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 'Smartphone Apple iPhone 13 128GB'
    WHEN b.name = 'Supermercado Express' THEN 'Leche entera 1L'
    ELSE 'Descripción de ' || b.name
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 'IP13-128'
    WHEN b.name = 'Supermercado Express' THEN 'LECH-01'
    ELSE 'SKU-' || substr(b.id::text, 1, 6)
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN '8412345678901'
    WHEN b.name = 'Supermercado Express' THEN '8412345678902'
    ELSE '84123456789' || substr(b.id::text, 1, 2)
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 'unidad'
    WHEN b.name = 'Supermercado Express' THEN 'litro'
    ELSE 'unidad'
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 'https://example.com/products/iphone13.png'
    WHEN b.name = 'Supermercado Express' THEN 'https://example.com/products/milk.png'
    ELSE 'https://example.com/products/default.png'
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 800.00
    WHEN b.name = 'Supermercado Express' THEN 0.80
    ELSE 10.00
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 999.00
    WHEN b.name = 'Supermercado Express' THEN 1.20
    ELSE 15.00
  END,
  'inclusive',
  21.00,
  false,
  true,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 5
    WHEN b.name = 'Supermercado Express' THEN 20
    ELSE 10
  END,
  true
FROM pos.businesses b
JOIN pos.categories c ON c.business_id = b.id;

-- Insertar inventario de productos por ubicación
INSERT INTO pos.product_inventory_locations (id, product_id, location_id, quantity)
SELECT 
  gen_random_uuid(),
  p.id,
  l.id,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 10
    WHEN b.name = 'Supermercado Express' THEN 50
    ELSE 25
  END
FROM pos.businesses b
JOIN pos.business_locations l ON l.business_id = b.id
JOIN pos.products_inventory p ON p.business_id = b.id;

-- Insertar proveedores
INSERT INTO pos.suppliers (id, business_id, name, contact_name, email, phone, address, tax_id, active)
SELECT 
  gen_random_uuid(),
  b.id,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 'Apple España'
    WHEN b.name = 'Supermercado Express' THEN 'Lácteos del Norte'
    ELSE 'Proveedor ' || b.name
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 'Juan Distribuidor'
    WHEN b.name = 'Supermercado Express' THEN 'María Proveedora'
    ELSE 'Contacto ' || b.name
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 'info@apple-distribuidor.es'
    WHEN b.name = 'Supermercado Express' THEN 'info@lacteosnorte.es'
    ELSE 'info@proveedor-' || substr(b.id::text, 1, 6) || '.es'
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN '+34911234567'
    WHEN b.name = 'Supermercado Express' THEN '+34922345678'
    ELSE '+34933' || substr(b.id::text, 1, 6)
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN '{"street":"Calle Distribuidor 123","city":"Madrid","postal_code":"28001","country":"ES"}'
    WHEN b.name = 'Supermercado Express' THEN '{"street":"Avenida Láctea 456","city":"Asturias","postal_code":"33001","country":"ES"}'
    ELSE '{"street":"Calle Proveedor 789","city":"Valencia","postal_code":"46001","country":"ES"}'
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 'B87654321'
    WHEN b.name = 'Supermercado Express' THEN 'A12345678'
    ELSE 'X' || substr(b.id::text, 1, 8)
  END,
  true
FROM pos.businesses b;

-- Insertar datos analíticos
INSERT INTO pos.analytics_data (id, business_id, location_id, date, type, data)
SELECT 
  gen_random_uuid(),
  b.id,
  l.id,
  CURRENT_DATE,
  'sales',
  '{
    "total_sales": 1209.98,
    "total_items": 1,
    "average_ticket": 1209.98
  }'::jsonb
FROM pos.businesses b
JOIN pos.business_locations l ON l.business_id = b.id; 