-- Crear esquema POS
CREATE SCHEMA IF NOT EXISTS pos;

-- Habilitar RLS en auth.users
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

/*
 * USUARIOS
 * Tabla que contiene datos de usuarios. Los usuarios solo deben poder ver y actualizar sus propios datos.
 */
CREATE TABLE pos.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  billing_address JSONB,
  payment_method JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configurar Row Level Security (RLS)
ALTER TABLE pos.users ENABLE ROW LEVEL SECURITY;

-- Crear políticas de acceso
CREATE POLICY "Los usuarios pueden ver su propio perfil" 
  ON pos.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil" 
  ON pos.users FOR UPDATE
  USING (auth.uid() = id);

/**
* This trigger automatically creates a user entry when a new user signs up via Supabase Auth.
*/ 
CREATE FUNCTION pos.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO pos.users (id, first_name, last_name, avatar_url)
  VALUES (
    new.id, 
    split_part(new.raw_user_meta_data->>'full_name', ' ', 1),
    split_part(new.raw_user_meta_data->>'full_name', ' ', 2),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE pos.handle_new_user();

/**
* CUSTOMERS
* Note: this is a private table that contains a mapping of user IDs to Stripe customer IDs.
*/
CREATE TABLE pos.customers (
  -- UUID from auth.users
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  -- The user's customer ID in Stripe. User must not be able to update this.
  stripe_customer_id TEXT
);
ALTER TABLE pos.customers ENABLE ROW LEVEL SECURITY;
-- No policies as this is a private table that the user must not have access to.

/*
 * NEGOCIOS
 */
CREATE TABLE pos.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  tax_number TEXT,
  owner_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configurar RLS para businesses
ALTER TABLE pos.businesses ENABLE ROW LEVEL SECURITY;

-- Crear políticas de acceso
CREATE POLICY "Los propietarios pueden ver sus negocios"
  ON pos.businesses FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Los propietarios pueden actualizar sus negocios"
  ON pos.businesses FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Los propietarios pueden insertar negocios"
  ON pos.businesses FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Los propietarios pueden eliminar sus negocios"
  ON pos.businesses FOR DELETE
  USING (auth.uid() = owner_id);

/*
 * UBICACIONES DE NEGOCIO
 */
CREATE TABLE pos.business_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configurar RLS para business_locations
ALTER TABLE pos.business_locations ENABLE ROW LEVEL SECURITY;

-- Crear políticas de acceso
CREATE POLICY "Los propietarios pueden ver sus ubicaciones"
  ON pos.business_locations FOR SELECT
  USING (auth.uid() = (SELECT owner_id FROM pos.businesses WHERE id = business_id));

CREATE POLICY "Los propietarios pueden actualizar sus ubicaciones"
  ON pos.business_locations FOR UPDATE
  USING (auth.uid() = (SELECT owner_id FROM pos.businesses WHERE id = business_id));

CREATE POLICY "Los propietarios pueden insertar ubicaciones"
  ON pos.business_locations FOR INSERT
  WITH CHECK (auth.uid() = (SELECT owner_id FROM pos.businesses WHERE id = business_id));

CREATE POLICY "Los propietarios pueden eliminar sus ubicaciones"
  ON pos.business_locations FOR DELETE
  USING (auth.uid() = (SELECT owner_id FROM pos.businesses WHERE id = business_id));

/** 
* PRODUCTS SUBSCRIPTION
* Note: products are created and managed in Stripe and synced to our DB via Stripe webhooks.
*/
CREATE TABLE pos.subscription_products (
  -- Product ID from Stripe, e.g. prod_1234.
  id TEXT PRIMARY KEY,
  -- Whether the product is currently available for purchase.
  active BOOLEAN,
  -- The product's name, meant to be displayable to the customer.
  name TEXT,
  -- The product's description, meant to be displayable to the customer.
  description TEXT,
  -- A URL of the product image in Stripe, meant to be displayable to the customer.
  image TEXT,
  -- Set of key-value pairs, used to store additional information about the object in a structured format.
  metadata JSONB
);
ALTER TABLE pos.subscription_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access." ON pos.subscription_products FOR SELECT USING (true);

/**
* PRICES
* Note: prices are created and managed in Stripe and synced to our DB via Stripe webhooks.
*/
CREATE TYPE pos.pricing_type AS ENUM ('one_time', 'recurring');
CREATE TYPE pos.pricing_plan_interval AS ENUM ('day', 'week', 'month', 'year');
CREATE TABLE pos.prices (
  -- Price ID from Stripe, e.g. price_1234.
  id TEXT PRIMARY KEY,
  -- The ID of the product that this price belongs to.
  product_id TEXT REFERENCES pos.subscription_products, 
  -- Whether the price can be used for new purchases.
  active BOOLEAN,
  -- A brief description of the price.
  description TEXT,
  -- The unit amount as a positive integer in the smallest currency unit.
  unit_amount BIGINT,
  -- Three-letter ISO currency code, in lowercase.
  currency TEXT CHECK (char_length(currency) = 3),
  -- One of `one_time` or `recurring` depending on whether the price is for a one-time purchase or a recurring (subscription) purchase.
  type pos.pricing_type,
  -- The frequency at which a subscription is billed. One of `day`, `week`, `month` or `year`.
  interval pos.pricing_plan_interval,
  -- The number of intervals between subscription billings.
  interval_count INTEGER,
  -- Default number of trial days when subscribing a customer to this price.
  trial_period_days INTEGER,
  -- Set of key-value pairs, used to store additional information about the object in a structured format.
  metadata JSONB
);
ALTER TABLE pos.prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access." ON pos.prices FOR SELECT USING (true);

/**
* SUBSCRIPTIONS
* Note: subscriptions are created and managed in Stripe and synced to our DB via Stripe webhooks.
*/
CREATE TYPE pos.subscription_status AS ENUM ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid', 'paused');
CREATE TABLE pos.subscriptions (
  -- Subscription ID from Stripe, e.g. sub_1234.
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  -- The status of the subscription object, one of subscription_status type above.
  status pos.subscription_status,
  -- Set of key-value pairs, used to store additional information about the object in a structured format.
  metadata JSONB,
  -- ID of the price that created this subscription.
  price_id TEXT REFERENCES pos.prices,
  -- Quantity multiplied by the unit amount of the price creates the amount of the subscription.
  quantity INTEGER,
  -- If true the subscription has been canceled by the user and will be deleted at the end of the billing period.
  cancel_at_period_end BOOLEAN,
  -- Time at which the subscription was created.
  created TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- Start of the current period that the subscription has been invoiced for.
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- End of the current period that the subscription has been invoiced for.
  current_period_end TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- If the subscription has ended, the timestamp of the date the subscription ended.
  ended_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  -- A date in the future at which the subscription will automatically get canceled.
  cancel_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  -- If the subscription has been canceled, the date of that cancellation.
  canceled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  -- If the subscription has a trial, the beginning of that trial.
  trial_start TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  -- If the subscription has a trial, the end of that trial.
  trial_end TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
ALTER TABLE pos.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Can only view own subs data." ON pos.subscriptions FOR SELECT USING (auth.uid() = user_id);

/*
 * PRODUCTOS POS
 */
CREATE TABLE pos.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT,
  barcode TEXT,
  unit_price NUMERIC(10,2) NOT NULL,
  cost_price NUMERIC(10,2),
  tax_rate NUMERIC(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configurar RLS para products
ALTER TABLE pos.products ENABLE ROW LEVEL SECURITY;

-- Crear políticas de acceso
CREATE POLICY "Los propietarios pueden ver sus productos"
  ON pos.products FOR SELECT
  USING (auth.uid() = (SELECT owner_id FROM pos.businesses WHERE id = business_id));

CREATE POLICY "Los propietarios pueden actualizar sus productos"
  ON pos.products FOR UPDATE
  USING (auth.uid() = (SELECT owner_id FROM pos.businesses WHERE id = business_id));

CREATE POLICY "Los propietarios pueden insertar productos"
  ON pos.products FOR INSERT
  WITH CHECK (auth.uid() = (SELECT owner_id FROM pos.businesses WHERE id = business_id));

CREATE POLICY "Los propietarios pueden eliminar sus productos"
  ON pos.products FOR DELETE
  USING (auth.uid() = (SELECT owner_id FROM pos.businesses WHERE id = business_id));

/*
 * INVENTARIO
 */
CREATE TABLE pos.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES pos.products NOT NULL,
  location_id UUID REFERENCES pos.business_locations NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configurar RLS para inventory
ALTER TABLE pos.inventory ENABLE ROW LEVEL SECURITY;

-- Crear políticas de acceso
CREATE POLICY "Los propietarios pueden ver su inventario"
  ON pos.inventory FOR SELECT
  USING (auth.uid() = (
    SELECT owner_id FROM pos.businesses b
    JOIN pos.business_locations l ON l.business_id = b.id
    WHERE l.id = location_id
  ));

CREATE POLICY "Los propietarios pueden actualizar su inventario"
  ON pos.inventory FOR UPDATE
  USING (auth.uid() = (
    SELECT owner_id FROM pos.businesses b
    JOIN pos.business_locations l ON l.business_id = b.id
    WHERE l.id = location_id
  ));

CREATE POLICY "Los propietarios pueden insertar inventario"
  ON pos.inventory FOR INSERT
  WITH CHECK (auth.uid() = (
    SELECT owner_id FROM pos.businesses b
    JOIN pos.business_locations l ON l.business_id = b.id
    WHERE l.id = location_id
  ));

CREATE POLICY "Los propietarios pueden eliminar su inventario"
  ON pos.inventory FOR DELETE
  USING (auth.uid() = (
    SELECT owner_id FROM pos.businesses b
    JOIN pos.business_locations l ON l.business_id = b.id
    WHERE l.id = location_id
  ));

/*
 * TRANSFERENCIAS DE STOCK
 */
CREATE TABLE pos.stock_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  from_location_id UUID REFERENCES pos.business_locations NOT NULL,
  to_location_id UUID REFERENCES pos.business_locations NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configurar RLS para stock_transfers
ALTER TABLE pos.stock_transfers ENABLE ROW LEVEL SECURITY;

-- Crear políticas de acceso
CREATE POLICY "Los propietarios pueden ver sus transferencias"
  ON pos.stock_transfers FOR SELECT
  USING (auth.uid() = (SELECT owner_id FROM pos.businesses WHERE id = business_id));

CREATE POLICY "Los propietarios pueden actualizar sus transferencias"
  ON pos.stock_transfers FOR UPDATE
  USING (auth.uid() = (SELECT owner_id FROM pos.businesses WHERE id = business_id));

CREATE POLICY "Los propietarios pueden insertar transferencias"
  ON pos.stock_transfers FOR INSERT
  WITH CHECK (auth.uid() = (SELECT owner_id FROM pos.businesses WHERE id = business_id));

CREATE POLICY "Los propietarios pueden eliminar sus transferencias"
  ON pos.stock_transfers FOR DELETE
  USING (auth.uid() = (SELECT owner_id FROM pos.businesses WHERE id = business_id));

/*
 * ITEMS DE TRANSFERENCIA DE STOCK
 */
CREATE TABLE pos.stock_transfer_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_id UUID REFERENCES pos.stock_transfers NOT NULL,
  product_id UUID REFERENCES pos.products NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configurar RLS para stock_transfer_items
ALTER TABLE pos.stock_transfer_items ENABLE ROW LEVEL SECURITY;

-- Crear políticas de acceso
CREATE POLICY "Los propietarios pueden ver sus items de transferencia"
  ON pos.stock_transfer_items FOR SELECT
  USING (auth.uid() = (
    SELECT owner_id FROM pos.businesses b
    JOIN pos.stock_transfers t ON t.business_id = b.id
    WHERE t.id = transfer_id
  ));

CREATE POLICY "Los propietarios pueden actualizar sus items de transferencia"
  ON pos.stock_transfer_items FOR UPDATE
  USING (auth.uid() = (
    SELECT owner_id FROM pos.businesses b
    JOIN pos.stock_transfers t ON t.business_id = b.id
    WHERE t.id = transfer_id
  ));

CREATE POLICY "Los propietarios pueden insertar items de transferencia"
  ON pos.stock_transfer_items FOR INSERT
  WITH CHECK (auth.uid() = (
    SELECT owner_id FROM pos.businesses b
    JOIN pos.stock_transfers t ON t.business_id = b.id
    WHERE t.id = transfer_id
  ));

CREATE POLICY "Los propietarios pueden eliminar sus items de transferencia"
  ON pos.stock_transfer_items FOR DELETE
  USING (auth.uid() = (
    SELECT owner_id FROM pos.businesses b
    JOIN pos.stock_transfers t ON t.business_id = b.id
    WHERE t.id = transfer_id
  ));

/**
 * REALTIME SUBSCRIPTIONS
 * Only allow realtime listening on public tables.
 */
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE pos.subscription_products, pos.prices;
