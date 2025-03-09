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

-- Customers POS
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
  code TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(business_id, code)
);

-- Taxes
CREATE TABLE pos.taxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  name TEXT NOT NULL,
  rate DECIMAL(5, 2) NOT NULL,
  type TEXT DEFAULT 'percentage',
  is_compound BOOLEAN DEFAULT FALSE,
  is_recoverable BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(business_id, name)
);

-- Discounts
CREATE TABLE pos.discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'percentage',
  value DECIMAL(19, 4) NOT NULL,
  min_purchase_amount DECIMAL(19, 4) DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(business_id, name)
);

-- Sales
CREATE TABLE pos.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  location_id UUID REFERENCES pos.business_locations NOT NULL,
  customer_id UUID REFERENCES pos.customers_pos,
  reference_no TEXT,
  sale_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  status TEXT DEFAULT 'completed',
  payment_status TEXT DEFAULT 'paid',
  notes TEXT,
  subtotal_amount DECIMAL(19, 4) DEFAULT 0,
  discount_amount DECIMAL(19, 4) DEFAULT 0,
  tax_amount DECIMAL(19, 4) DEFAULT 0,
  total_amount DECIMAL(19, 4) DEFAULT 0,
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
  sale_id UUID REFERENCES pos.sales NOT NULL,
  payment_method_id UUID REFERENCES pos.payment_methods NOT NULL,
  amount DECIMAL(19, 4) NOT NULL,
  reference_no TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tables
CREATE TABLE pos.tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  location_id UUID REFERENCES pos.business_locations NOT NULL,
  name TEXT NOT NULL,
  capacity INTEGER,
  status TEXT DEFAULT 'available',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table reservations
CREATE TABLE pos.table_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID REFERENCES pos.tables NOT NULL,
  customer_id UUID REFERENCES pos.customers_pos NOT NULL,
  reservation_date TIMESTAMP WITH TIME ZONE NOT NULL,
  number_of_guests INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Menu items
CREATE TABLE pos.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  category_id UUID REFERENCES pos.categories,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price DECIMAL(19, 4) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Menu modifiers
CREATE TABLE pos.menu_modifiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_required BOOLEAN DEFAULT FALSE,
  min_selections INTEGER DEFAULT 0,
  max_selections INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Menu modifier options
CREATE TABLE pos.menu_modifier_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modifier_id UUID REFERENCES pos.menu_modifiers NOT NULL,
  name TEXT NOT NULL,
  price_adjustment DECIMAL(19, 4) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Menu item modifiers
CREATE TABLE pos.menu_item_modifiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID REFERENCES pos.menu_items NOT NULL,
  modifier_id UUID REFERENCES pos.menu_modifiers NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(menu_item_id, modifier_id)
);

-- Orders
CREATE TABLE pos.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  location_id UUID REFERENCES pos.business_locations NOT NULL,
  table_id UUID REFERENCES pos.tables,
  customer_id UUID REFERENCES pos.customers_pos,
  order_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  notes TEXT,
  subtotal_amount DECIMAL(19, 4) DEFAULT 0,
  discount_amount DECIMAL(19, 4) DEFAULT 0,
  tax_amount DECIMAL(19, 4) DEFAULT 0,
  total_amount DECIMAL(19, 4) DEFAULT 0,
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
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Order item modifiers
CREATE TABLE pos.order_item_modifiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID REFERENCES pos.order_items NOT NULL,
  modifier_option_id UUID REFERENCES pos.menu_modifier_options NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Kitchen orders
CREATE TABLE pos.kitchen_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES pos.orders NOT NULL,
  status TEXT DEFAULT 'pending',
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
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Reports
CREATE TABLE pos.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  location_id UUID REFERENCES pos.business_locations NOT NULL,
  type TEXT NOT NULL,
  parameters JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'pending',
  result JSONB,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Analytics data
CREATE TABLE pos.analytics_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES pos.businesses NOT NULL,
  location_id UUID REFERENCES pos.business_locations NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(business_id, location_id, date, type)
);

-- Enable Row Level Security on all tables
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