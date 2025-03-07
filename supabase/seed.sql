-- Insertar usuarios de prueba
-- Primero necesitamos crear usuarios en auth.users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES 
  ('d8a076a0-0382-4a74-8a1b-000000000001', 'usuario1@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', NOW(), '{"full_name":"Juan Pérez", "avatar_url":"https://randomuser.me/api/portraits/men/1.jpg"}'),
  ('d8a076a0-0382-4a74-8a1b-000000000002', 'usuario2@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', NOW(), '{"full_name":"María García", "avatar_url":"https://randomuser.me/api/portraits/women/1.jpg"}'),
  ('d8a076a0-0382-4a74-8a1b-000000000003', 'usuario3@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', NOW(), '{"full_name":"Carlos Rodríguez", "avatar_url":"https://randomuser.me/api/portraits/men/2.jpg"}'),
  ('d8a076a0-0382-4a74-8a1b-000000000004', 'usuario4@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', NOW(), '{"full_name":"Ana Martínez", "avatar_url":"https://randomuser.me/api/portraits/women/2.jpg"}'),
  ('d8a076a0-0382-4a74-8a1b-000000000005', 'usuario5@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', NOW(), '{"full_name":"Roberto López", "avatar_url":"https://randomuser.me/api/portraits/men/3.jpg"}');

-- Los triggers deberían haber creado automáticamente entradas en la tabla users
-- Pero vamos a actualizar algunos campos adicionales
UPDATE public.users
SET billing_address = '{"line1":"Calle Principal 123","city":"Madrid","state":"Madrid","postal_code":"28001","country":"ES"}'
WHERE id = 'd8a076a0-0382-4a74-8a1b-000000000001';

UPDATE public.users
SET billing_address = '{"line1":"Avenida Central 456","city":"Barcelona","state":"Cataluña","postal_code":"08001","country":"ES"}'
WHERE id = 'd8a076a0-0382-4a74-8a1b-000000000002';

UPDATE public.users
SET billing_address = '{"line1":"Plaza Mayor 789","city":"Valencia","state":"Valencia","postal_code":"46001","country":"ES"}'
WHERE id = 'd8a076a0-0382-4a74-8a1b-000000000003';

-- Insertar datos en la tabla customers (mapeo de usuarios a clientes de Stripe)
INSERT INTO public.customers (id, stripe_customer_id)
VALUES 
  ('d8a076a0-0382-4a74-8a1b-000000000001', 'cus_123456789abcdef'),
  ('d8a076a0-0382-4a74-8a1b-000000000002', 'cus_234567890abcdef'),
  ('d8a076a0-0382-4a74-8a1b-000000000003', 'cus_345678901abcdef'),
  ('d8a076a0-0382-4a74-8a1b-000000000004', 'cus_456789012abcdef'),
  ('d8a076a0-0382-4a74-8a1b-000000000005', 'cus_567890123abcdef');

-- Insertar productos
INSERT INTO public.products (id, active, name, description, image, metadata)
VALUES 
  ('prod_basic', true, 'Plan Básico', 'Acceso a funcionalidades básicas de la plataforma', 'https://example.com/images/basic.png', '{"features": ["Acceso básico", "Soporte por email", "1 proyecto"]}'),
  ('prod_pro', true, 'Plan Profesional', 'Acceso a funcionalidades avanzadas para profesionales', 'https://example.com/images/pro.png', '{"features": ["Acceso completo", "Soporte prioritario", "5 proyectos", "Análisis avanzados"]}'),
  ('prod_enterprise', true, 'Plan Empresarial', 'Solución completa para empresas con necesidades avanzadas', 'https://example.com/images/enterprise.png', '{"features": ["Acceso completo", "Soporte 24/7", "Proyectos ilimitados", "API dedicada", "Personalización"]}');

-- Insertar precios para los productos
INSERT INTO public.prices (id, product_id, active, description, unit_amount, currency, type, interval, interval_count, trial_period_days, metadata)
VALUES 
  ('price_basic_monthly', 'prod_basic', true, 'Plan Básico - Mensual', 999, 'eur', 'recurring', 'month', 1, 7, '{}'),
  ('price_basic_yearly', 'prod_basic', true, 'Plan Básico - Anual', 9990, 'eur', 'recurring', 'year', 1, 7, '{"discount": "17%"}'),
  
  ('price_pro_monthly', 'prod_pro', true, 'Plan Profesional - Mensual', 1999, 'eur', 'recurring', 'month', 1, 7, '{}'),
  ('price_pro_yearly', 'prod_pro', true, 'Plan Profesional - Anual', 19990, 'eur', 'recurring', 'year', 1, 7, '{"discount": "17%"}'),
  
  ('price_enterprise_monthly', 'prod_enterprise', true, 'Plan Empresarial - Mensual', 4999, 'eur', 'recurring', 'month', 1, 14, '{}'),
  ('price_enterprise_yearly', 'prod_enterprise', true, 'Plan Empresarial - Anual', 49990, 'eur', 'recurring', 'year', 1, 14, '{"discount": "17%"}');

-- Insertar suscripciones
INSERT INTO public.subscriptions (
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
VALUES 
  (
    'sub_12345', 
    'd8a076a0-0382-4a74-8a1b-000000000001', 
    'active', 
    '{}', 
    'price_basic_monthly', 
    1, 
    false, 
    NOW() - INTERVAL '30 days', 
    NOW() - INTERVAL '30 days', 
    NOW() + INTERVAL '30 days', 
    NULL, 
    NULL, 
    NULL, 
    NOW() - INTERVAL '37 days', 
    NOW() - INTERVAL '30 days'
  ),
  (
    'sub_23456', 
    'd8a076a0-0382-4a74-8a1b-000000000002', 
    'active', 
    '{}', 
    'price_pro_yearly', 
    1, 
    false, 
    NOW() - INTERVAL '60 days', 
    NOW() - INTERVAL '60 days', 
    NOW() + INTERVAL '305 days', 
    NULL, 
    NULL, 
    NULL, 
    NOW() - INTERVAL '67 days', 
    NOW() - INTERVAL '60 days'
  ),
  (
    'sub_34567', 
    'd8a076a0-0382-4a74-8a1b-000000000003', 
    'trialing', 
    '{}', 
    'price_enterprise_monthly', 
    1, 
    false, 
    NOW() - INTERVAL '7 days', 
    NOW() - INTERVAL '7 days', 
    NOW() + INTERVAL '7 days', 
    NULL, 
    NULL, 
    NULL, 
    NOW() - INTERVAL '7 days', 
    NOW() + INTERVAL '7 days'
  ),
  (
    'sub_45678', 
    'd8a076a0-0382-4a74-8a1b-000000000004', 
    'canceled', 
    '{}', 
    'price_pro_monthly', 
    1, 
    true, 
    NOW() - INTERVAL '90 days', 
    NOW() - INTERVAL '30 days', 
    NOW(), 
    NOW(), 
    NOW(), 
    NOW() - INTERVAL '15 days', 
    NOW() - INTERVAL '97 days', 
    NOW() - INTERVAL '90 days'
  ),
  (
    'sub_56789', 
    'd8a076a0-0382-4a74-8a1b-000000000005', 
    'past_due', 
    '{}', 
    'price_basic_yearly', 
    1, 
    false, 
    NOW() - INTERVAL '380 days', 
    NOW() - INTERVAL '15 days', 
    NOW() + INTERVAL '15 days', 
    NULL, 
    NULL, 
    NULL, 
    NOW() - INTERVAL '387 days', 
    NOW() - INTERVAL '380 days'
  ); 