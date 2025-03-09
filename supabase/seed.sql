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

-- Insertar datos en la tabla customers (mapeo de usuarios a clientes de Stripe)
INSERT INTO pos.customers (id, stripe_customer_id)
SELECT id, 'cus_' || substr(id::text, 1, 8)
FROM pos.users
WHERE email IN ('usuario1@example.com', 'usuario2@example.com', 'usuario3@example.com', 'usuario4@example.com', 'usuario5@example.com');

-- Insertar productos
INSERT INTO pos.products (id, active, name, description, image, metadata)
VALUES 
  (gen_random_uuid(), true, 'Plan Básico', 'Acceso a funcionalidades básicas de la plataforma', 'https://example.com/images/basic.png', '{"features": ["Acceso básico", "Soporte por email", "1 proyecto"]}'),
  (gen_random_uuid(), true, 'Plan Profesional', 'Acceso a funcionalidades avanzadas para profesionales', 'https://example.com/images/pro.png', '{"features": ["Acceso completo", "Soporte prioritario", "5 proyectos", "Análisis avanzados"]}'),
  (gen_random_uuid(), true, 'Plan Empresarial', 'Solución completa para empresas con necesidades avanzadas', 'https://example.com/images/enterprise.png', '{"features": ["Acceso completo", "Soporte 24/7", "Proyectos ilimitados", "API dedicada", "Personalización"]}');

-- Insertar precios para los productos
INSERT INTO pos.prices (id, product_id, active, description, unit_amount, currency, type, interval, interval_count, trial_period_days, metadata)
SELECT 
  'price_' || substr(id::text, 1, 8) || '_monthly',
  id,
  true,
  name || ' - Mensual',
  CASE 
    WHEN name LIKE '%Básico%' THEN 999
    WHEN name LIKE '%Profesional%' THEN 1999
    WHEN name LIKE '%Empresarial%' THEN 4999
  END,
  'eur',
  'recurring',
  'month',
  1,
  7,
  '{}'
FROM pos.products;

-- Insertar suscripciones
INSERT INTO pos.subscriptions (
  id, 
  user_id, 
  status, 
  metadata, 
  price_id, 
  quantity, 
  cancel_at_period_end, 
  created, 
  current_period_start, 
  current_period_end, 
  ended_at, 
  cancel_at, 
  canceled_at, 
  trial_start, 
  trial_end
)
SELECT 
  'sub_' || substr(u.id::text, 1, 8),
  u.id,
  CASE 
    WHEN u.email = 'usuario4@example.com' THEN 'canceled'
    WHEN u.email = 'usuario5@example.com' THEN 'past_due'
    WHEN u.email = 'usuario3@example.com' THEN 'trialing'
    ELSE 'active'
  END,
  '{}',
  p.id,
  1,
  u.email = 'usuario4@example.com',
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '30 days',
  NOW() + INTERVAL '30 days',
  CASE WHEN u.email = 'usuario4@example.com' THEN NOW() ELSE NULL END,
  CASE WHEN u.email = 'usuario4@example.com' THEN NOW() ELSE NULL END,
  CASE WHEN u.email = 'usuario4@example.com' THEN NOW() - INTERVAL '15 days' ELSE NULL END,
  NOW() - INTERVAL '37 days',
  NOW() - INTERVAL '30 days'
FROM pos.users u
CROSS JOIN pos.prices p
WHERE u.email IN ('usuario1@example.com', 'usuario2@example.com', 'usuario3@example.com', 'usuario4@example.com', 'usuario5@example.com')
AND p.description LIKE '%Mensual%';

-- Datos de prueba para el esquema POS

-- Insertar negocios
INSERT INTO pos.businesses (id, user_id, name, legal_name, tax_id, phone, email, website, logo_url, address, currency, timezone)
SELECT 
  gen_random_uuid(),
  u.id,
  CASE 
    WHEN u.email = 'usuario1@example.com' THEN 'Tienda Central'
    WHEN u.email = 'usuario2@example.com' THEN 'Supermercado Express'
  END,
  CASE 
    WHEN u.email = 'usuario1@example.com' THEN 'Tienda Central S.L.'
    WHEN u.email = 'usuario2@example.com' THEN 'Super Express S.A.'
  END,
  CASE 
    WHEN u.email = 'usuario1@example.com' THEN 'B12345678'
    WHEN u.email = 'usuario2@example.com' THEN 'A87654321'
  END,
  CASE 
    WHEN u.email = 'usuario1@example.com' THEN '+34912345678'
    WHEN u.email = 'usuario2@example.com' THEN '+34987654321'
  END,
  CASE 
    WHEN u.email = 'usuario1@example.com' THEN 'info@tiendacentral.com'
    WHEN u.email = 'usuario2@example.com' THEN 'info@superexpress.com'
  END,
  CASE 
    WHEN u.email = 'usuario1@example.com' THEN 'www.tiendacentral.com'
    WHEN u.email = 'usuario2@example.com' THEN 'www.superexpress.com'
  END,
  CASE 
    WHEN u.email = 'usuario1@example.com' THEN 'https://example.com/logos/tienda1.png'
    WHEN u.email = 'usuario2@example.com' THEN 'https://example.com/logos/tienda2.png'
  END,
  CASE 
    WHEN u.email = 'usuario1@example.com' THEN '{"street":"Calle Mayor 123","city":"Madrid","postal_code":"28001","country":"ES"}'
    WHEN u.email = 'usuario2@example.com' THEN '{"street":"Avenida Principal 456","city":"Barcelona","postal_code":"08001","country":"ES"}'
  END,
  'EUR',
  'Europe/Madrid'
FROM pos.users u
WHERE u.email IN ('usuario1@example.com', 'usuario2@example.com');

-- Insertar configuraciones de negocios
INSERT INTO pos.business_settings (id, business_id, settings)
SELECT 
  gen_random_uuid(),
  b.id,
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
FROM pos.businesses b;

-- Insertar ubicaciones de negocios
INSERT INTO pos.business_locations (id, business_id, name, address, phone, email, is_main_location)
SELECT 
  gen_random_uuid(),
  b.id,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 'Sede Principal'
    WHEN b.name = 'Supermercado Express' THEN 'Local Principal'
  END,
  b.address,
  b.phone,
  b.email,
  true
FROM pos.businesses b;

-- Insertar roles
INSERT INTO pos.roles (id, business_id, name, description, is_default)
SELECT 
  gen_random_uuid(),
  b.id,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 'Administrador'
    WHEN b.name = 'Supermercado Express' THEN 'Gerente'
  END,
  'Acceso total al sistema',
  true
FROM pos.businesses b;

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
CROSS JOIN pos.permissions p
WHERE r.name IN ('Administrador', 'Gerente');

-- Insertar roles de usuario
INSERT INTO pos.user_roles (id, user_id, role_id, business_id, location_id)
SELECT 
  gen_random_uuid(),
  u.id,
  r.id,
  b.id,
  l.id
FROM pos.users u
JOIN pos.businesses b ON b.user_id = u.id
JOIN pos.roles r ON r.business_id = b.id
JOIN pos.business_locations l ON l.business_id = b.id
WHERE u.email IN ('usuario1@example.com', 'usuario2@example.com');

-- Insertar categorías
INSERT INTO pos.categories (id, business_id, name, description, parent_id, image_url, color, active)
SELECT 
  gen_random_uuid(),
  b.id,
  'Electrónicos',
  'Productos electrónicos',
  NULL,
  'https://example.com/categories/electronics.png',
  '#FF0000',
  true
FROM pos.businesses b
WHERE b.name = 'Tienda Central';

-- Insertar productos de inventario
INSERT INTO pos.products_inventory (id, business_id, category_id, name, description, sku, barcode, unit, image_url, cost_price, selling_price, tax_type, tax_rate, is_service, track_inventory, min_stock_level, active)
SELECT 
  gen_random_uuid(),
  b.id,
  c.id,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 'iPhone 13'
    WHEN b.name = 'Supermercado Express' THEN 'Leche Entera'
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 'iPhone 13 128GB'
    WHEN b.name = 'Supermercado Express' THEN 'Leche entera 1L'
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 'IPH13-128'
    WHEN b.name = 'Supermercado Express' THEN 'LECHE-1L'
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN '1234567890123'
    WHEN b.name = 'Supermercado Express' THEN '9876543210987'
  END,
  'unit',
  CASE 
    WHEN b.name = 'Tienda Central' THEN 'https://example.com/products/iphone13.png'
    WHEN b.name = 'Supermercado Express' THEN 'https://example.com/products/leche.png'
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 799.99
    WHEN b.name = 'Supermercado Express' THEN 0.89
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 999.99
    WHEN b.name = 'Supermercado Express' THEN 1.29
  END,
  'inclusive',
  CASE 
    WHEN b.name = 'Tienda Central' THEN 21.00
    WHEN b.name = 'Supermercado Express' THEN 4.00
  END,
  false,
  true,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 5
    WHEN b.name = 'Supermercado Express' THEN 10
  END,
  true
FROM pos.businesses b
JOIN pos.categories c ON c.business_id = b.id;

-- Insertar ubicaciones de inventario
INSERT INTO pos.product_inventory_locations (id, product_id, location_id, quantity)
SELECT 
  gen_random_uuid(),
  pi.id,
  l.id,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 15
    WHEN b.name = 'Supermercado Express' THEN 50
  END
FROM pos.products_inventory pi
JOIN pos.businesses b ON b.id = pi.business_id
JOIN pos.business_locations l ON l.business_id = b.id;

-- Insertar proveedores
INSERT INTO pos.suppliers (id, business_id, name, contact_name, email, phone, address, tax_id, notes, active)
SELECT 
  gen_random_uuid(),
  b.id,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 'Apple Inc.'
    WHEN b.name = 'Supermercado Express' THEN 'Lácteos SA'
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 'John Doe'
    WHEN b.name = 'Supermercado Express' THEN 'María García'
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 'john@apple.com'
    WHEN b.name = 'Supermercado Express' THEN 'maria@lacteos.com'
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN '+1234567890'
    WHEN b.name = 'Supermercado Express' THEN '+34987654321'
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN '{"street":"1 Apple Park Way","city":"Cupertino","state":"CA","postal_code":"95014","country":"US"}'
    WHEN b.name = 'Supermercado Express' THEN '{"street":"Calle Lácteos 123","city":"Valencia","postal_code":"46001","country":"ES"}'
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 'US123456789'
    WHEN b.name = 'Supermercado Express' THEN 'B12345678'
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 'Proveedor principal de electrónicos'
    WHEN b.name = 'Supermercado Express' THEN 'Proveedor de productos lácteos'
  END,
  true
FROM pos.businesses b;

-- Insertar órdenes de compra
INSERT INTO pos.purchase_orders (id, business_id, location_id, supplier_id, reference_no, order_date, expected_delivery_date, status, payment_status, notes, total_amount, discount_amount, tax_amount, shipping_amount, created_by)
SELECT 
  gen_random_uuid(),
  b.id,
  l.id,
  s.id,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 'PO-001'
    WHEN b.name = 'Supermercado Express' THEN 'PO-002'
  END,
  NOW(),
  NOW() + INTERVAL '7 days',
  'pending',
  'pending',
  CASE 
    WHEN b.name = 'Tienda Central' THEN 'Pedido de iPhones'
    WHEN b.name = 'Supermercado Express' THEN 'Pedido de leche'
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 15999.80
    WHEN b.name = 'Supermercado Express' THEN 178.00
  END,
  0.00,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 3359.96
    WHEN b.name = 'Supermercado Express' THEN 37.38
  END,
  0.00,
  u.id
FROM pos.businesses b
JOIN pos.business_locations l ON l.business_id = b.id
JOIN pos.suppliers s ON s.business_id = b.id
JOIN pos.users u ON u.id = b.user_id;

-- Insertar items de órdenes de compra
INSERT INTO pos.purchase_order_items (id, purchase_order_id, product_id, quantity, unit_price, discount_amount, tax_amount, total_amount)
SELECT 
  gen_random_uuid(),
  po.id,
  pi.id,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 20
    WHEN b.name = 'Supermercado Express' THEN 200
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 799.99
    WHEN b.name = 'Supermercado Express' THEN 0.89
  END,
  0.00,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 1679.98
    WHEN b.name = 'Supermercado Express' THEN 37.38
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 15999.80
    WHEN b.name = 'Supermercado Express' THEN 178.00
  END
FROM pos.purchase_orders po
JOIN pos.businesses b ON b.id = po.business_id
JOIN pos.products_inventory pi ON pi.business_id = b.id;

-- Insertar ajustes de inventario
INSERT INTO pos.stock_adjustments (id, business_id, location_id, reference_no, adjustment_date, adjustment_type, reason, total_amount, created_by)
SELECT 
  gen_random_uuid(),
  b.id,
  l.id,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 'SA-001'
    WHEN b.name = 'Supermercado Express' THEN 'SA-002'
  END,
  NOW(),
  CASE 
    WHEN b.name = 'Tienda Central' THEN 'damage'
    WHEN b.name = 'Supermercado Express' THEN 'found'
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 'Productos dañados en transporte'
    WHEN b.name = 'Supermercado Express' THEN 'Productos encontrados en inventario'
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN -999.99
    WHEN b.name = 'Supermercado Express' THEN 12.90
  END,
  u.id
FROM pos.businesses b
JOIN pos.business_locations l ON l.business_id = b.id
JOIN pos.users u ON u.id = b.user_id;

-- Insertar items de ajustes de inventario
INSERT INTO pos.stock_adjustment_items (id, stock_adjustment_id, product_id, quantity, unit_price, total_amount)
SELECT 
  gen_random_uuid(),
  sa.id,
  pi.id,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 1
    WHEN b.name = 'Supermercado Express' THEN 10
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 999.99
    WHEN b.name = 'Supermercado Express' THEN 1.29
  END,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 999.99
    WHEN b.name = 'Supermercado Express' THEN 12.90
  END
FROM pos.stock_adjustments sa
JOIN pos.businesses b ON b.id = sa.business_id
JOIN pos.products_inventory pi ON pi.business_id = b.id;

-- Insertar transferencias de inventario
INSERT INTO pos.stock_transfers (id, business_id, reference_no, transfer_date, from_location_id, to_location_id, status, notes, created_by)
SELECT 
  gen_random_uuid(),
  b.id,
  'ST-001',
  NOW(),
  l1.id,
  l2.id,
  'pending',
  'Transferencia de inventario entre ubicaciones',
  u.id
FROM pos.businesses b
JOIN pos.business_locations l1 ON l1.business_id = b.id
JOIN pos.business_locations l2 ON l2.business_id = b.id AND l2.id != l1.id
JOIN pos.users u ON u.id = b.user_id
WHERE b.name = 'Tienda Central'
LIMIT 1;

-- Insertar items de transferencias de inventario
INSERT INTO pos.stock_transfer_items (id, stock_transfer_id, product_id, quantity, unit_price, total_amount)
SELECT 
  gen_random_uuid(),
  st.id,
  pi.id,
  5,
  pi.selling_price,
  pi.selling_price * 5
FROM pos.stock_transfers st
JOIN pos.products_inventory pi ON pi.business_id = st.business_id
WHERE st.reference_no = 'ST-001';

-- Insertar clientes POS
INSERT INTO pos.customers_pos (id, business_id, user_id, name, email, phone, address, tax_id, notes, active)
SELECT 
  gen_random_uuid(),
  b.id,
  u.id,
  u.full_name,
  u.email,
  NULL,
  u.billing_address,
  NULL,
  'Cliente registrado',
  true
FROM pos.businesses b
JOIN pos.users u ON u.id = b.user_id;

-- Insertar métodos de pago
INSERT INTO pos.payment_methods (id, business_id, name, description, is_cash, is_card, is_bank_transfer, is_online, active)
SELECT 
  gen_random_uuid(),
  b.id,
  'Efectivo',
  'Pago en efectivo',
  true,
  false,
  false,
  false,
  true
FROM pos.businesses b;

-- Insertar impuestos
INSERT INTO pos.taxes (id, business_id, name, rate, is_inclusive, active)
SELECT 
  gen_random_uuid(),
  b.id,
  'IVA 21%',
  21.00,
  true,
  true
FROM pos.businesses b;

-- Insertar descuentos
INSERT INTO pos.discounts (id, business_id, name, description, discount_type, discount_value, starts_at, ends_at, active)
SELECT 
  gen_random_uuid(),
  b.id,
  'Descuento 10%',
  'Descuento del 10% en todos los productos',
  'percentage',
  10.00,
  NOW(),
  NOW() + INTERVAL '30 days',
  true
FROM pos.businesses b;

-- Insertar ventas
INSERT INTO pos.sales (id, business_id, location_id, customer_id, reference_no, invoice_no, sale_date, status, payment_status, notes, subtotal, discount_amount, tax_amount, total_amount, created_by)
SELECT 
  gen_random_uuid(),
  b.id,
  l.id,
  cp.id,
  'SALE-001',
  'INV-001',
  NOW(),
  'completed',
  'paid',
  'Venta de prueba',
  999.99,
  0.00,
  209.99,
  1209.98,
  u.id
FROM pos.businesses b
JOIN pos.business_locations l ON l.business_id = b.id
JOIN pos.customers_pos cp ON cp.business_id = b.id
JOIN pos.users u ON u.id = b.user_id
WHERE b.name = 'Tienda Central'
LIMIT 1;

-- Insertar items de venta
INSERT INTO pos.sale_items (id, sale_id, product_id, quantity, unit_price, discount_amount, tax_amount, total_amount)
SELECT 
  gen_random_uuid(),
  s.id,
  pi.id,
  1,
  pi.selling_price,
  0.00,
  pi.selling_price * 0.21,
  pi.selling_price * 1.21
FROM pos.sales s
JOIN pos.products_inventory pi ON pi.business_id = s.business_id
WHERE s.reference_no = 'SALE-001';

-- Insertar pagos
INSERT INTO pos.payments (id, business_id, sale_id, payment_method_id, amount, payment_date, reference_no, notes, created_by)
SELECT 
  gen_random_uuid(),
  b.id,
  s.id,
  pm.id,
  s.total_amount,
  s.sale_date,
  'PAY-001',
  'Pago de prueba',
  u.id
FROM pos.sales s
JOIN pos.businesses b ON b.id = s.business_id
JOIN pos.payment_methods pm ON pm.business_id = b.id
JOIN pos.users u ON u.id = s.created_by
WHERE s.reference_no = 'SALE-001';

-- Insertar mesas
INSERT INTO pos.tables (id, business_id, location_id, name, description, capacity, status, position, active)
SELECT 
  gen_random_uuid(),
  b.id,
  l.id,
  'Mesa 1',
  'Mesa principal',
  4,
  'available',
  '{"x": 100, "y": 100}'::jsonb,
  true
FROM pos.businesses b
JOIN pos.business_locations l ON l.business_id = b.id
WHERE b.name = 'Supermercado Express'
LIMIT 1;

-- Insertar reservas de mesas
INSERT INTO pos.table_reservations (id, business_id, location_id, table_id, customer_id, customer_name, customer_email, customer_phone, party_size, reservation_date, end_time, status, notes)
SELECT 
  gen_random_uuid(),
  b.id,
  l.id,
  t.id,
  cp.id,
  cp.name,
  cp.email,
  cp.phone,
  4,
  NOW() + INTERVAL '1 day',
  NOW() + INTERVAL '1 day' + INTERVAL '2 hours',
  'confirmed',
  'Reserva de prueba'
FROM pos.tables t
JOIN pos.businesses b ON b.id = t.business_id
JOIN pos.business_locations l ON l.business_id = b.id
JOIN pos.customers_pos cp ON cp.business_id = b.id
WHERE b.name = 'Supermercado Express'
LIMIT 1;

-- Insertar items de menú
INSERT INTO pos.menu_items (id, business_id, product_id, category_id, name, description, price, image_url, preparation_time, is_vegetarian, is_vegan, is_gluten_free, spice_level, active)
SELECT 
  gen_random_uuid(),
  b.id,
  pi.id,
  c.id,
  pi.name,
  pi.description,
  pi.selling_price,
  pi.image_url,
  15,
  false,
  false,
  false,
  0,
  true
FROM pos.products_inventory pi
JOIN pos.businesses b ON b.id = pi.business_id
JOIN pos.categories c ON c.business_id = b.id
WHERE b.name = 'Supermercado Express'
LIMIT 1;

-- Insertar modificadores de menú
INSERT INTO pos.menu_modifiers (id, business_id, name, description, min_selections, max_selections, active)
SELECT 
  gen_random_uuid(),
  b.id,
  'Temperatura',
  'Seleccione la temperatura de la bebida',
  1,
  1,
  true
FROM pos.businesses b
WHERE b.name = 'Supermercado Express'
LIMIT 1;

-- Insertar opciones de modificadores
INSERT INTO pos.menu_modifier_options (id, modifier_id, name, price, is_default, active)
SELECT 
  gen_random_uuid(),
  mm.id,
  'Caliente',
  0.00,
  true,
  true
FROM pos.menu_modifiers mm
JOIN pos.businesses b ON b.id = mm.business_id
WHERE b.name = 'Supermercado Express'
LIMIT 1;

-- Insertar modificadores de items de menú
INSERT INTO pos.menu_item_modifiers (id, menu_item_id, modifier_id)
SELECT 
  gen_random_uuid(),
  mi.id,
  mm.id
FROM pos.menu_items mi
JOIN pos.menu_modifiers mm ON mm.business_id = mi.business_id
JOIN pos.businesses b ON b.id = mi.business_id
WHERE b.name = 'Supermercado Express'
LIMIT 1;

-- Insertar órdenes
INSERT INTO pos.orders (id, business_id, location_id, table_id, customer_id, sale_id, order_number, order_type, status, notes, subtotal, discount_amount, tax_amount, total_amount, created_by)
SELECT 
  gen_random_uuid(),
  b.id,
  l.id,
  t.id,
  cp.id,
  s.id,
  'ORD-001',
  'dine_in',
  'pending',
  'Orden de prueba',
  999.99,
  0.00,
  209.99,
  1209.98,
  u.id
FROM pos.sales s
JOIN pos.businesses b ON b.id = s.business_id
JOIN pos.business_locations l ON l.business_id = b.id
JOIN pos.tables t ON t.business_id = b.id
JOIN pos.customers_pos cp ON cp.business_id = b.id
JOIN pos.users u ON u.id = s.created_by
WHERE b.name = 'Supermercado Express'
LIMIT 1;

-- Insertar items de orden
INSERT INTO pos.order_items (id, order_id, menu_item_id, quantity, unit_price, discount_amount, tax_amount, total_amount, notes, status)
SELECT 
  gen_random_uuid(),
  o.id,
  mi.id,
  1,
  mi.price,
  0.00,
  mi.price * 0.21,
  mi.price * 1.21,
  'Item de prueba',
  'pending'
FROM pos.orders o
JOIN pos.menu_items mi ON mi.business_id = o.business_id
JOIN pos.businesses b ON b.id = o.business_id
WHERE b.name = 'Supermercado Express'
LIMIT 1;

-- Insertar modificadores de items de orden
INSERT INTO pos.order_item_modifiers (id, order_item_id, modifier_option_id, price)
SELECT 
  gen_random_uuid(),
  oi.id,
  mmo.id,
  mmo.price
FROM pos.order_items oi
JOIN pos.menu_modifier_options mmo ON mmo.modifier_id IN (
  SELECT modifier_id FROM pos.menu_item_modifiers WHERE menu_item_id = oi.menu_item_id
)
JOIN pos.businesses b ON b.id = oi.order_id IN (
  SELECT id FROM pos.orders WHERE business_id = b.id
)
WHERE b.name = 'Supermercado Express'
LIMIT 1;

-- Insertar órdenes de cocina
INSERT INTO pos.kitchen_orders (id, business_id, location_id, order_id, ticket_number, status, preparation_start_time, preparation_end_time, notes)
SELECT 
  gen_random_uuid(),
  b.id,
  l.id,
  o.id,
  'KIT-001',
  'pending',
  NULL,
  NULL,
  'Orden de cocina de prueba'
FROM pos.orders o
JOIN pos.businesses b ON b.id = o.business_id
JOIN pos.business_locations l ON l.business_id = b.id
WHERE b.name = 'Supermercado Express'
LIMIT 1;

-- Insertar items de órdenes de cocina
INSERT INTO pos.kitchen_order_items (id, kitchen_order_id, order_item_id, status, preparation_start_time, preparation_end_time)
SELECT 
  gen_random_uuid(),
  ko.id,
  oi.id,
  'pending',
  NULL,
  NULL
FROM pos.kitchen_orders ko
JOIN pos.order_items oi ON oi.order_id = ko.order_id
JOIN pos.businesses b ON b.id = ko.business_id
WHERE b.name = 'Supermercado Express'
LIMIT 1;

-- Insertar reportes
INSERT INTO pos.reports (id, business_id, name, description, report_type, parameters, created_by)
SELECT 
  gen_random_uuid(),
  b.id,
  'Ventas Diarias',
  'Reporte de ventas del día',
  'sales_daily',
  '{"start_date": "2024-01-01", "end_date": "2024-01-31"}'::jsonb,
  u.id
FROM pos.businesses b
JOIN pos.users u ON u.id = b.user_id;

-- Insertar datos analíticos
INSERT INTO pos.analytics_data (id, business_id, data_type, data_date, data)
SELECT 
  gen_random_uuid(),
  b.id,
  'sales',
  CURRENT_DATE,
  '{
    "total_sales": 1209.98,
    "total_items": 1,
    "average_ticket": 1209.98
  }'::jsonb
FROM pos.businesses b; 