import { supabase } from './supabase';
import type {
  Addon,
  CustomDesign,
  PricingConfig,
  Product,
  ProductSize,
} from './types';

export async function fetchPricingConfig(): Promise<PricingConfig[]> {
  const { data, error } = await supabase.from('pricing_config').select('*');
  if (error) throw error;
  return data ?? [];
}

export async function fetchAddons(): Promise<Addon[]> {
  const { data, error } = await supabase
    .from('addons')
    .select('*')
    .eq('active', true)
    .order('sort_order');
  if (error) throw error;
  return data ?? [];
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order');
  if (error) throw error;
  return data ?? [];
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchProductSizes(productId: string): Promise<ProductSize[]> {
  const { data, error } = await supabase
    .from('product_sizes')
    .select('*')
    .eq('product_id', productId)
    .order('price');
  if (error) throw error;
  return data ?? [];
}

export async function fetchCustomDesigns(): Promise<CustomDesign[]> {
  const { data, error } = await supabase
    .from('custom_designs')
    .select('*')
    .order('sort_order');
  if (error) throw error;
  return data ?? [];
}

export function generateOrderNumber(prefix: string): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${ts}${rand}`;
}

export async function createCustomOrder(order: {
  order_number: string;
  user_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  rug_type: string;
  shape: string;
  width: number | null;
  length: number | null;
  diameter: number | null;
  unit: string;
  area_sqft: number;
  design_id: string | null;
  design_name: string | null;
  uploaded_artwork_url: string | null;
  colors: Record<string, string>;
  addon_codes: string[];
  base_price: number;
  addon_total: number;
  total_price: number;
  advance_paid: number;
  remaining: number;
  payment_method: string;
  bkash_sender_number: string | null;
  bkash_trx_id: string | null;
  notes: string;
}) {
  const { data, error } = await supabase
    .from('custom_orders')
    .insert(order)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createOrder(order: {
  order_number: string;
  user_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  country: string;
  address: string;
  city: string;
  postal_code: string;
  items: unknown[];
  subtotal: number;
  total: number;
  advance_paid: number;
  remaining: number;
  payment_method: string;
}) {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchAllCustomOrders() {
  const { data, error } = await supabase
    .from('custom_orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateCustomOrderProductionStatus(id: string, status: string) {
  const { error } = await supabase
    .from('custom_orders')
    .update({ production_status: status })
    .eq('id', id);
  if (error) throw error;
}

export async function updatePricingConfig(
  rugType: string,
  pricePerSqft: number,
  minOrderPrice: number,
  shapeSurcharge: number
) {
  const { error } = await supabase
    .from('pricing_config')
    .update({
      price_per_sqft: pricePerSqft,
      min_order_price: minOrderPrice,
      shape_surcharge: shapeSurcharge,
      updated_at: new Date().toISOString(),
    })
    .eq('rug_type', rugType);
  if (error) throw error;
}

export const PRODUCTION_STATUSES = [
  'Order Received',
  'Design Review',
  'Design Approved',
  'Production Started',
  'Quality Check',
  'Ready for Delivery',
  'Shipped',
  'Delivered',
] as const;