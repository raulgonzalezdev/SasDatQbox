/**
 * POS SYSTEM SCHEMA
 * This migration creates all the tables needed for the POS system
 */

-- Create schema for POS system
CREATE SCHEMA IF NOT EXISTS pos;

-- Enable Row Level Security on all tables
ALTER DEFAULT PRIVILEGES IN SCHEMA pos GRANT ALL ON TABLES TO postgres, service_role;

/**
 * BUSINESS MANAGEMENT
 */

-- Businesses table
CREATE TABLE pos.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  legal_name TEXT,
  tax_id TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  address JSONB,
  currency TEXT DEFAULT 'USD',
  timezone TEXT DEFAULT 'UTC',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Business locations
CREATE TABLE pos.business_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  name TEXT NOT NULL,
  address JSONB,
  phone TEXT,
  email TEXT,
  is_main_location BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Business settings
CREATE TABLE pos.business_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(business_id)
);

/**
 * USER MANAGEMENT AND PERMISSIONS
 */

-- Roles
CREATE TABLE pos.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(business_id, name)
);

-- Permissions
CREATE TABLE pos.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  module TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(name)
);

-- Role permissions
CREATE TABLE pos.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID REFERENCES pos.roles NOT NULL,
  permission_id UUID REFERENCES pos.permissions NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(role_id, permission_id)
);

-- User roles
CREATE TABLE pos.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  role_id UUID REFERENCES pos.roles NOT NULL,
  business_id UUID REFERENCES pos.businesses NOT NULL,
  location_id UUID REFERENCES pos.business_locations,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, role_id, business_id)
);

/**
 * INVENTORY MANAGEMENT
 */

-- Categories
CREATE TABLE pos.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES pos.categories,
  image_url TEXT,
  color TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Products inventory
CREATE TABLE pos.products_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  category_id UUID REFERENCES pos.categories,
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT,
  barcode TEXT,
  unit TEXT DEFAULT 'unit',
  image_url TEXT,
  cost_price DECIMAL(19, 4),
  selling_price DECIMAL(19, 4) NOT NULL,
  tax_type TEXT DEFAULT 'inclusive',
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  is_service BOOLEAN DEFAULT FALSE,
  track_inventory BOOLEAN DEFAULT TRUE,
  min_stock_level INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Product inventory locations
CREATE TABLE pos.product_inventory_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES pos.products_inventory NOT NULL,
  location_id UUID REFERENCES pos.business_locations NOT NULL,
  quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(product_id, location_id)
);

-- Suppliers
CREATE TABLE pos.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  address JSONB,
  tax_id TEXT,
  notes TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Purchase orders
CREATE TABLE pos.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  location_id UUID REFERENCES pos.business_locations NOT NULL,
  supplier_id UUID REFERENCES pos.suppliers NOT NULL,
  reference_no TEXT,
  order_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  expected_delivery_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft',
  payment_status TEXT DEFAULT 'pending',
  notes TEXT,
  total_amount DECIMAL(19, 4) DEFAULT 0,
  discount_amount DECIMAL(19, 4) DEFAULT 0,
  tax_amount DECIMAL(19, 4) DEFAULT 0,
  shipping_amount DECIMAL(19, 4) DEFAULT 0,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Purchase order items
CREATE TABLE pos.purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID REFERENCES pos.purchase_orders NOT NULL,
  product_id UUID REFERENCES pos.products_inventory NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(19, 4) NOT NULL,
  discount_amount DECIMAL(19, 4) DEFAULT 0,
  tax_amount DECIMAL(19, 4) DEFAULT 0,
  total_amount DECIMAL(19, 4) NOT NULL,
  received_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Stock adjustments
CREATE TABLE pos.stock_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  location_id UUID REFERENCES pos.business_locations NOT NULL,
  reference_no TEXT,
  adjustment_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  adjustment_type TEXT NOT NULL,
  reason TEXT,
  total_amount DECIMAL(19, 4) DEFAULT 0,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Stock adjustment items
CREATE TABLE pos.stock_adjustment_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_adjustment_id UUID REFERENCES pos.stock_adjustments NOT NULL,
  product_id UUID REFERENCES pos.products_inventory NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(19, 4) NOT NULL,
  total_amount DECIMAL(19, 4) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Stock transfers
CREATE TABLE pos.stock_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  reference_no TEXT,
  transfer_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  from_location_id UUID REFERENCES pos.business_locations NOT NULL,
  to_location_id UUID REFERENCES pos.business_locations NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Stock transfer items
CREATE TABLE pos.stock_transfer_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_transfer_id UUID REFERENCES pos.stock_transfers NOT NULL,
  product_id UUID REFERENCES pos.products_inventory NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(19, 4) NOT NULL,
  total_amount DECIMAL(19, 4) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

/**
 * SALES MANAGEMENT
 */

-- Customers
CREATE TABLE pos.customers_pos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  user_id UUID REFERENCES auth.users,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address JSONB,
  tax_id TEXT,
  notes TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Payment methods
CREATE TABLE pos.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_cash BOOLEAN DEFAULT FALSE,
  is_card BOOLEAN DEFAULT FALSE,
  is_bank_transfer BOOLEAN DEFAULT FALSE,
  is_online BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Taxes
CREATE TABLE pos.taxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  name TEXT NOT NULL,
  rate DECIMAL(5, 2) NOT NULL,
  is_inclusive BOOLEAN DEFAULT TRUE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Discounts
CREATE TABLE pos.discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL,
  discount_value DECIMAL(19, 4) NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE,
  ends_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Sales
CREATE TABLE pos.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  location_id UUID REFERENCES pos.business_locations NOT NULL,
  customer_id UUID REFERENCES pos.customers_pos,
  reference_no TEXT,
  invoice_no TEXT,
  sale_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  status TEXT DEFAULT 'completed',
  payment_status TEXT DEFAULT 'paid',
  notes TEXT,
  subtotal DECIMAL(19, 4) NOT NULL,
  discount_amount DECIMAL(19, 4) DEFAULT 0,
  tax_amount DECIMAL(19, 4) DEFAULT 0,
  total_amount DECIMAL(19, 4) NOT NULL,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Sale items
CREATE TABLE pos.sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID REFERENCES pos.sales NOT NULL,
  product_id UUID REFERENCES pos.products_inventory NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(19, 4) NOT NULL,
  discount_amount DECIMAL(19, 4) DEFAULT 0,
  tax_amount DECIMAL(19, 4) DEFAULT 0,
  total_amount DECIMAL(19, 4) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Payments
CREATE TABLE pos.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  sale_id UUID REFERENCES pos.sales,
  payment_method_id UUID REFERENCES pos.payment_methods NOT NULL,
  amount DECIMAL(19, 4) NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  reference_no TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

/**
 * RESTAURANT MANAGEMENT
 */

-- Tables
CREATE TABLE pos.tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  location_id UUID REFERENCES pos.business_locations NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  capacity INTEGER DEFAULT 4,
  status TEXT DEFAULT 'available',
  position JSONB,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table reservations
CREATE TABLE pos.table_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  location_id UUID REFERENCES pos.business_locations NOT NULL,
  table_id UUID REFERENCES pos.tables NOT NULL,
  customer_id UUID REFERENCES pos.customers_pos,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  party_size INTEGER NOT NULL,
  reservation_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'confirmed',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Menu items
CREATE TABLE pos.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  product_id UUID REFERENCES pos.products_inventory NOT NULL,
  category_id UUID REFERENCES pos.categories,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(19, 4) NOT NULL,
  image_url TEXT,
  preparation_time INTEGER,
  is_vegetarian BOOLEAN DEFAULT FALSE,
  is_vegan BOOLEAN DEFAULT FALSE,
  is_gluten_free BOOLEAN DEFAULT FALSE,
  spice_level INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Menu modifiers
CREATE TABLE pos.menu_modifiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  min_selections INTEGER DEFAULT 0,
  max_selections INTEGER DEFAULT 1,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Menu modifier options
CREATE TABLE pos.menu_modifier_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modifier_id UUID REFERENCES pos.menu_modifiers NOT NULL,
  name TEXT NOT NULL,
  price DECIMAL(19, 4) DEFAULT 0,
  is_default BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Menu item modifiers
CREATE TABLE pos.menu_item_modifiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID REFERENCES pos.menu_items NOT NULL,
  modifier_id UUID REFERENCES pos.menu_modifiers NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(menu_item_id, modifier_id)
);

-- Orders
CREATE TABLE pos.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  location_id UUID REFERENCES pos.business_locations NOT NULL,
  table_id UUID REFERENCES pos.tables,
  customer_id UUID REFERENCES pos.customers_pos,
  sale_id UUID REFERENCES pos.sales,
  order_number TEXT,
  order_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  subtotal DECIMAL(19, 4) NOT NULL,
  discount_amount DECIMAL(19, 4) DEFAULT 0,
  tax_amount DECIMAL(19, 4) DEFAULT 0,
  total_amount DECIMAL(19, 4) NOT NULL,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Order items
CREATE TABLE pos.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES pos.orders NOT NULL,
  menu_item_id UUID REFERENCES pos.menu_items NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(19, 4) NOT NULL,
  discount_amount DECIMAL(19, 4) DEFAULT 0,
  tax_amount DECIMAL(19, 4) DEFAULT 0,
  total_amount DECIMAL(19, 4) NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Order item modifiers
CREATE TABLE pos.order_item_modifiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID REFERENCES pos.order_items NOT NULL,
  modifier_option_id UUID REFERENCES pos.menu_modifier_options NOT NULL,
  price DECIMAL(19, 4) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Kitchen orders
CREATE TABLE pos.kitchen_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  location_id UUID REFERENCES pos.business_locations NOT NULL,
  order_id UUID REFERENCES pos.orders NOT NULL,
  ticket_number TEXT,
  status TEXT DEFAULT 'pending',
  preparation_start_time TIMESTAMP WITH TIME ZONE,
  preparation_end_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Kitchen order items
CREATE TABLE pos.kitchen_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kitchen_order_id UUID REFERENCES pos.kitchen_orders NOT NULL,
  order_item_id UUID REFERENCES pos.order_items NOT NULL,
  status TEXT DEFAULT 'pending',
  preparation_start_time TIMESTAMP WITH TIME ZONE,
  preparation_end_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

/**
 * REPORTING AND ANALYTICS
 */

-- Reports
CREATE TABLE pos.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  report_type TEXT NOT NULL,
  parameters JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Analytics data
CREATE TABLE pos.analytics_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  data_type TEXT NOT NULL,
  data_date DATE NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE pos.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.business_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.products_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.product_inventory_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.stock_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.stock_adjustment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.stock_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.stock_transfer_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.customers_pos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.taxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.table_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.menu_modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.menu_modifier_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.menu_item_modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.order_item_modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.kitchen_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.kitchen_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos.analytics_data ENABLE ROW LEVEL SECURITY;

-- Create policies for each table
CREATE POLICY "Users can view their own businesses" ON pos.businesses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own business locations" ON pos.business_locations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.businesses
      WHERE id = business_locations.business_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own business settings" ON pos.business_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.businesses
      WHERE id = business_settings.business_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view roles in their businesses" ON pos.roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.businesses
      WHERE id = roles.business_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view permissions" ON pos.permissions
  FOR SELECT USING (true);

CREATE POLICY "Users can view role permissions in their businesses" ON pos.role_permissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.roles r
      JOIN pos.businesses b ON b.id = r.business_id
      WHERE r.id = role_permissions.role_id
      AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own roles" ON pos.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view categories in their businesses" ON pos.categories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.businesses
      WHERE id = categories.business_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view products in their businesses" ON pos.products_inventory
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.businesses
      WHERE id = products_inventory.business_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view product locations in their businesses" ON pos.product_inventory_locations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.products_inventory pi
      JOIN pos.businesses b ON b.id = pi.business_id
      WHERE pi.id = product_inventory_locations.product_id
      AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view suppliers in their businesses" ON pos.suppliers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.businesses
      WHERE id = suppliers.business_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view purchase orders in their businesses" ON pos.purchase_orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.businesses
      WHERE id = purchase_orders.business_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view purchase order items in their businesses" ON pos.purchase_order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.purchase_orders po
      JOIN pos.businesses b ON b.id = po.business_id
      WHERE po.id = purchase_order_items.purchase_order_id
      AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view stock adjustments in their businesses" ON pos.stock_adjustments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.businesses
      WHERE id = stock_adjustments.business_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view stock adjustment items in their businesses" ON pos.stock_adjustment_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.stock_adjustments sa
      JOIN pos.businesses b ON b.id = sa.business_id
      WHERE sa.id = stock_adjustment_items.stock_adjustment_id
      AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view stock transfers in their businesses" ON pos.stock_transfers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.businesses
      WHERE id = stock_transfers.business_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view stock transfer items in their businesses" ON pos.stock_transfer_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.stock_transfers st
      JOIN pos.businesses b ON b.id = st.business_id
      WHERE st.id = stock_transfer_items.stock_transfer_id
      AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view customers in their businesses" ON pos.customers_pos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.businesses
      WHERE id = customers_pos.business_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view payment methods in their businesses" ON pos.payment_methods
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.businesses
      WHERE id = payment_methods.business_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view taxes in their businesses" ON pos.taxes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.businesses
      WHERE id = taxes.business_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view discounts in their businesses" ON pos.discounts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.businesses
      WHERE id = discounts.business_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view sales in their businesses" ON pos.sales
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.businesses
      WHERE id = sales.business_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view sale items in their businesses" ON pos.sale_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.sales s
      JOIN pos.businesses b ON b.id = s.business_id
      WHERE s.id = sale_items.sale_id
      AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view payments in their businesses" ON pos.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.sales s
      JOIN pos.businesses b ON b.id = s.business_id
      WHERE s.id = payments.sale_id
      AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view tables in their businesses" ON pos.tables
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.businesses
      WHERE id = tables.business_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view table reservations in their businesses" ON pos.table_reservations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.businesses
      WHERE id = table_reservations.business_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view menu items in their businesses" ON pos.menu_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.businesses
      WHERE id = menu_items.business_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view menu modifiers in their businesses" ON pos.menu_modifiers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.businesses
      WHERE id = menu_modifiers.business_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view menu modifier options in their businesses" ON pos.menu_modifier_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.menu_modifiers mm
      JOIN pos.businesses b ON b.id = mm.business_id
      WHERE mm.id = menu_modifier_options.modifier_id
      AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view menu item modifiers in their businesses" ON pos.menu_item_modifiers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.menu_items mi
      JOIN pos.businesses b ON b.id = mi.business_id
      WHERE mi.id = menu_item_modifiers.menu_item_id
      AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view orders in their businesses" ON pos.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.businesses
      WHERE id = orders.business_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view order items in their businesses" ON pos.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.orders o
      JOIN pos.businesses b ON b.id = o.business_id
      WHERE o.id = order_items.order_id
      AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view order item modifiers in their businesses" ON pos.order_item_modifiers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.order_items oi
      JOIN pos.orders o ON o.id = oi.order_id
      JOIN pos.businesses b ON b.id = o.business_id
      WHERE oi.id = order_item_modifiers.order_item_id
      AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view kitchen orders in their businesses" ON pos.kitchen_orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.businesses
      WHERE id = kitchen_orders.business_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view kitchen order items in their businesses" ON pos.kitchen_order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.kitchen_orders ko
      JOIN pos.businesses b ON b.id = ko.business_id
      WHERE ko.id = kitchen_order_items.kitchen_order_id
      AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view reports in their businesses" ON pos.reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.businesses
      WHERE id = reports.business_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view analytics data in their businesses" ON pos.analytics_data
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pos.businesses
      WHERE id = analytics_data.business_id
      AND user_id = auth.uid()
    )
  );

-- Add the pos schema tables to realtime publication
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE 
  products, 
  prices, 
  pos.businesses, 
  pos.business_locations, 
  pos.products_inventory, 
  pos.sales, 
  pos.orders; 