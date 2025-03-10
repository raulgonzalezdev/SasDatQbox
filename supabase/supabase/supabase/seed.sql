-- Insertar usuarios de prueba
-- Primero necesitamos crear usuarios en auth.users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES 
  ('d0c24d9d-1234-4123-9123-123456789abc', 'usuario1@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', NOW(), '{"full_name":"Juan Pérez"}'),
  ('d0c24d9d-5678-4123-9123-123456789def', 'usuario2@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', NOW(), '{"full_name":"María García"}');

-- Insertar usuarios en pos.users
-- No es necesario insertar estos registros ya que el trigger los crea automáticamente
-- Sin embargo, necesitamos actualizar algunos campos adicionales
UPDATE pos.users
SET 
  phone = '+34612345678',
  avatar_url = 'https://randomuser.me/api/portraits/men/1.jpg',
  billing_address = '{"line1":"Calle Mayor 123","city":"Madrid","postal_code":"28001","country":"ES"}'
WHERE id = 'd0c24d9d-1234-4123-9123-123456789abc';

UPDATE pos.users
SET 
  phone = '+34687654321',
  avatar_url = 'https://randomuser.me/api/portraits/women/1.jpg',
  billing_address = '{"line1":"Avenida Principal 456","city":"Barcelona","postal_code":"08001","country":"ES"}'
WHERE id = 'd0c24d9d-5678-4123-9123-123456789def';

-- Insertar clientes para Stripe
INSERT INTO pos.customers (id, stripe_customer_id)
VALUES 
  ('d0c24d9d-1234-4123-9123-123456789abc', 'cus_example123'),
  ('d0c24d9d-5678-4123-9123-123456789def', 'cus_example456');

-- Insertar productos de suscripción
INSERT INTO pos.subscription_products (id, active, name, description, image, metadata)
VALUES 
  ('prod_basic', true, 'Plan Básico', 'Plan básico para empresas pequeñas', 'https://example.com/products/basic.png', '{"features": ["1 ubicación", "10 productos", "Soporte por email"]}'),
  ('prod_premium', true, 'Plan Premium', 'Plan premium con todas las características', 'https://example.com/products/premium.png', '{"features": ["Ubicaciones ilimitadas", "Productos ilimitados", "Soporte 24/7"]}');

-- Insertar precios
INSERT INTO pos.prices (id, product_id, active, description, unit_amount, currency, type, interval, interval_count, trial_period_days)
VALUES 
  ('price_basic_monthly', 'prod_basic', true, 'Mensual', 1999, 'eur', 'recurring', 'month', 1, 14),
  ('price_basic_yearly', 'prod_basic', true, 'Anual', 19990, 'eur', 'recurring', 'year', 1, 14),
  ('price_premium_monthly', 'prod_premium', true, 'Mensual', 4999, 'eur', 'recurring', 'month', 1, 14),
  ('price_premium_yearly', 'prod_premium', true, 'Anual', 49990, 'eur', 'recurring', 'year', 1, 14);

-- Insertar suscripciones
INSERT INTO pos.subscriptions (id, user_id, status, price_id, quantity, cancel_at_period_end, current_period_start, current_period_end)
VALUES 
  ('sub_123example', 'd0c24d9d-1234-4123-9123-123456789abc', 'active', 'price_premium_monthly', 1, false, NOW(), NOW() + interval '1 month'),
  ('sub_456example', 'd0c24d9d-5678-4123-9123-123456789def', 'active', 'price_basic_yearly', 1, false, NOW(), NOW() + interval '1 year');

-- Insertar negocios
INSERT INTO pos.businesses (id, name, address, phone, email, tax_number, owner_id)
VALUES 
  (gen_random_uuid(), 'Tienda Central', 'Calle Mayor 123, Madrid', '+34912345678', 'info@tiendacentral.com', 'B12345678', 'd0c24d9d-1234-4123-9123-123456789abc'),
  (gen_random_uuid(), 'Supermercado Express', 'Avenida Principal 456, Barcelona', '+34987654321', 'info@superexpress.com', 'A87654321', 'd0c24d9d-5678-4123-9123-123456789def');

-- Insertar ubicaciones de negocios
INSERT INTO pos.business_locations (id, business_id, name, address, phone)
SELECT 
  gen_random_uuid(),
  id,
  'Sede Principal',
  address,
  phone
FROM pos.businesses;

-- Insertar productos
INSERT INTO pos.products (id, business_id, name, description, sku, barcode, unit_price, cost_price, tax_rate)
SELECT 
  gen_random_uuid(),
  id,
  CASE 
    WHEN name = 'Tienda Central' THEN 'iPhone 13'
    ELSE 'Leche Entera'
  END,
  CASE 
    WHEN name = 'Tienda Central' THEN 'Smartphone Apple iPhone 13 128GB'
    ELSE 'Leche entera 1L'
  END,
  CASE 
    WHEN name = 'Tienda Central' THEN 'IP13-128'
    ELSE 'LECH-01'
  END,
  CASE 
    WHEN name = 'Tienda Central' THEN '8412345678901'
    ELSE '8412345678902'
  END,
  CASE 
    WHEN name = 'Tienda Central' THEN 999.00
    ELSE 1.20
  END,
  CASE 
    WHEN name = 'Tienda Central' THEN 800.00
    ELSE 0.80
  END,
  21.00
FROM pos.businesses;

-- Insertar inventario
INSERT INTO pos.inventory (id, product_id, location_id, quantity)
SELECT 
  gen_random_uuid(),
  p.id,
  l.id,
  CASE 
    WHEN b.name = 'Tienda Central' THEN 10
    ELSE 50
  END
FROM pos.products p
JOIN pos.businesses b ON p.business_id = b.id
JOIN pos.business_locations l ON l.business_id = b.id;
