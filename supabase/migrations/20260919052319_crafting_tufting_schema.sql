/*
# Crafting & Tufting — Core Schema

1. Purpose
   Supports a premium handmade rug e-commerce site with two product lines
   (Jute Handcraft, Tufting Rugs), a custom rug configurator with a
   server-validated pricing engine, ready-made product catalog, cart/checkout
   with 50% advance payment, and an admin dashboard for managing products,
   pricing, and orders.

2. New Tables
   - pricing_config: admin-configurable price per sq ft per rug type + global settings
   - addons: optional add-ons with configurable prices
   - products: ready-made catalog items
   - product_sizes: size variants with per-size price for ready-made products
   - custom_designs: browsable design library for the configurator
   - custom_orders: custom rug orders with full spec + 50% advance
   - orders: ready-made product orders
   - reviews: customer reviews

3. Security
   - RLS enabled on all tables. Public storefront: anon can browse and
     create orders. Admin writes are done via service role in edge functions.
   - Public read on catalog tables (anon, authenticated). Admin write via
     authenticated role (admin gated in app).
   - custom_orders, orders: anon/authenticated can INSERT (guest checkout);
     SELECT restricted to owner (user_id) or admin (authenticated).
*/

-- ============ pricing_config ============
CREATE TABLE IF NOT EXISTS pricing_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rug_type text NOT NULL,
  label text NOT NULL,
  price_per_sqft numeric NOT NULL DEFAULT 0,
  min_order_price numeric NOT NULL DEFAULT 0,
  shape_surcharge numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'BDT',
  currency_symbol text NOT NULL DEFAULT '৳',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pricing_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_pricing" ON pricing_config;
CREATE POLICY "public_read_pricing" ON pricing_config FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_write_pricing" ON pricing_config;
CREATE POLICY "admin_write_pricing" ON pricing_config
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ addons ============
CREATE TABLE IF NOT EXISTS addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  label text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0
);

ALTER TABLE addons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_addons" ON addons;
CREATE POLICY "public_read_addons" ON addons FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_write_addons" ON addons;
CREATE POLICY "admin_write_addons" ON addons
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ products ============
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL,
  material text,
  description text,
  image_url text,
  gallery jsonb DEFAULT '[]',
  base_price numeric NOT NULL DEFAULT 0,
  stock_status text NOT NULL DEFAULT 'In Stock',
  care_info text,
  production_info text,
  shipping_info text,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_write_products" ON products;
CREATE POLICY "admin_write_products" ON products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ product_sizes ============
CREATE TABLE IF NOT EXISTS product_sizes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label text NOT NULL,
  width_ft numeric NOT NULL,
  length_ft numeric NOT NULL,
  price numeric NOT NULL DEFAULT 0
);

ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_product_sizes" ON product_sizes;
CREATE POLICY "public_read_product_sizes" ON product_sizes FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_write_product_sizes" ON product_sizes;
CREATE POLICY "admin_write_product_sizes" ON product_sizes
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ custom_designs ============
CREATE TABLE IF NOT EXISTS custom_designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  image_url text,
  complexity text NOT NULL DEFAULT 'standard',
  sort_order int NOT NULL DEFAULT 0
);

ALTER TABLE custom_designs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_designs" ON custom_designs;
CREATE POLICY "public_read_designs" ON custom_designs FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_write_designs" ON custom_designs;
CREATE POLICY "admin_write_designs" ON custom_designs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ custom_orders ============
CREATE TABLE IF NOT EXISTS custom_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  user_id uuid,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  rug_type text NOT NULL,
  shape text NOT NULL,
  width numeric,
  length numeric,
  diameter numeric,
  unit text NOT NULL DEFAULT 'ft',
  area_sqft numeric NOT NULL,
  design_id uuid,
  design_name text,
  uploaded_artwork_url text,
  colors jsonb DEFAULT '{}',
  addon_codes jsonb DEFAULT '[]',
  base_price numeric NOT NULL,
  addon_total numeric NOT NULL DEFAULT 0,
  total_price numeric NOT NULL,
  advance_paid numeric NOT NULL,
  remaining numeric NOT NULL,
  payment_method text,
  payment_status text NOT NULL DEFAULT 'Pending',
  production_status text NOT NULL DEFAULT 'Order Received',
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE custom_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "insert_custom_orders" ON custom_orders;
CREATE POLICY "insert_custom_orders" ON custom_orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "select_own_custom_orders" ON custom_orders;
CREATE POLICY "select_own_custom_orders" ON custom_orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "admin_all_custom_orders" ON custom_orders;
CREATE POLICY "admin_all_custom_orders" ON custom_orders FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "admin_update_custom_orders" ON custom_orders;
CREATE POLICY "admin_update_custom_orders" ON custom_orders FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- ============ orders (ready-made) ============
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  user_id uuid,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  country text,
  address text,
  city text,
  postal_code text,
  items jsonb NOT NULL DEFAULT '[]',
  subtotal numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  advance_paid numeric NOT NULL DEFAULT 0,
  remaining numeric NOT NULL DEFAULT 0,
  payment_method text,
  payment_status text NOT NULL DEFAULT 'Pending',
  status text NOT NULL DEFAULT 'Order Received',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "insert_orders" ON orders;
CREATE POLICY "insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders" ON orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "admin_all_orders" ON orders;
CREATE POLICY "admin_all_orders" ON orders FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "admin_update_orders" ON orders;
CREATE POLICY "admin_update_orders" ON orders FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- ============ reviews ============
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  author text NOT NULL,
  rating int NOT NULL DEFAULT 5,
  title text,
  body text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_reviews" ON reviews;
CREATE POLICY "public_read_reviews" ON reviews FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_reviews" ON reviews;
CREATE POLICY "insert_reviews" ON reviews FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- ============ Seed: pricing_config ============
INSERT INTO pricing_config (rug_type, label, price_per_sqft, min_order_price, shape_surcharge)
VALUES
  ('tufting', 'Tufting Rug', 450, 5000, 500),
  ('jute', 'Jute Handcraft', 280, 3000, 300)
ON CONFLICT DO NOTHING;

-- ============ Seed: addons ============
INSERT INTO addons (code, label, description, price, sort_order) VALUES
  ('anti_slip', 'Anti-slip backing', 'Non-slip latex backing for safety', 800, 1),
  ('premium_finishing', 'Premium finishing', 'Hand-finished edges and detail work', 1200, 2),
  ('special_border', 'Special border', 'Custom woven border trim', 600, 3),
  ('extra_thick', 'Extra-thick pile', 'Thicker, plusher pile height', 1000, 4),
  ('custom_shape', 'Custom shape', 'Non-standard shaped rug cutting', 1500, 5),
  ('gift_packaging', 'Gift packaging', 'Premium gift wrap and card', 500, 6),
  ('rush_production', 'Rush production', 'Priority production within 7 days', 2000, 7)
ON CONFLICT (code) DO NOTHING;

-- ============ Seed: custom_designs ============
INSERT INTO custom_designs (name, category, complexity, sort_order) VALUES
  ('Modern Abstract 12', 'Abstract', 'standard', 1),
  ('Linear Flow', 'Minimal', 'simple', 2),
  ('Botanical Trail', 'Floral', 'standard', 3),
  ('Geo Grid', 'Geometric', 'simple', 4),
  ('Forest Whisper', 'Nature', 'standard', 5),
  ('Urban Pulse', 'Modern', 'standard', 6),
  ('Playground Joy', 'Kids', 'standard', 7),
  ('Heritage Medallion', 'Traditional', 'complex', 8),
  ('Islamic Star', 'Islamic / Geometric', 'complex', 9),
  ('Soft Horizon', 'Minimal', 'simple', 10)
ON CONFLICT DO NOTHING;
