import { supabase } from './supabase';
import type {
  Addon,
  CustomDesign,
  PricingConfig,
  Product,
  ProductSize,
} from './types';

const FALLBACK_PRICING: PricingConfig[] = [
  {
    id: 'fallback-tufting',
    rug_type: 'tufting',
    label: 'Tufting Rug',
    price_per_sqft: 450,
    min_order_price: 5000,
    shape_surcharge: 500,
    currency: 'BDT',
    currency_symbol: '৳',
  },
  {
    id: 'fallback-jute',
    rug_type: 'jute',
    label: 'Jute Handcraft',
    price_per_sqft: 280,
    min_order_price: 3000,
    shape_surcharge: 300,
    currency: 'BDT',
    currency_symbol: '৳',
  },
];

const FALLBACK_ADDONS: Addon[] = [
  { id: 'addon-1', code: 'anti_slip', label: 'Anti-slip backing', description: 'Non-slip latex backing for safety', price: 800, active: true, sort_order: 1 },
  { id: 'addon-2', code: 'premium_finishing', label: 'Premium finishing', description: 'Hand-finished edges and detail work', price: 1200, active: true, sort_order: 2 },
  { id: 'addon-3', code: 'special_border', label: 'Special border', description: 'Custom woven border trim', price: 600, active: true, sort_order: 3 },
  { id: 'addon-4', code: 'extra_thick', label: 'Extra-thick pile', description: 'Thicker, plusher pile height', price: 1000, active: true, sort_order: 4 },
  { id: 'addon-5', code: 'custom_shape', label: 'Custom shape', description: 'Non-standard shaped rug cutting', price: 1500, active: true, sort_order: 5 },
  { id: 'addon-6', code: 'gift_packaging', label: 'Gift packaging', description: 'Premium gift wrap and card', price: 500, active: true, sort_order: 6 },
  { id: 'addon-7', code: 'rush_production', label: 'Rush production', description: 'Priority production within 7 days', price: 2000, active: true, sort_order: 7 },
];

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Sundarbans Braided Jute',
    slug: 'sundarbans-braided-jute',
    category: 'JUTE HANDCRAFT',
    material: '100% Organic Golden Jute',
    description: 'Hand-braided by rural artisans using golden Bengal jute. Features a warm, earthy texture that grounds living spaces naturally.',
    image_url: 'https://images.pexels.com/photos/36346077/pexels-photo-36346077.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    gallery: ['https://images.pexels.com/photos/36346077/pexels-photo-36346077.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000'],
    base_price: 6800,
    stock_status: 'In Stock',
    care_info: 'Vacuum regularly without beater bar. Blot spills immediately with a dry cloth.',
    production_info: 'Handwoven in Bangladesh over 2–3 weeks.',
    shipping_info: 'Free delivery across Bangladesh within 3–5 business days.',
    is_featured: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    name: 'Terracotta Arch Tufted Rug',
    slug: 'terracotta-arch-tufted-rug',
    category: 'TUFTING RUGS',
    material: 'New Zealand Wool Blend',
    description: 'Sculpted high-low pile tufted rug inspired by Bengal terracotta architecture, featuring warm rust and sand tones.',
    image_url: 'https://images.pexels.com/photos/28379849/pexels-photo-28379849.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    gallery: ['https://images.pexels.com/photos/28379849/pexels-photo-28379849.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000'],
    base_price: 14500,
    stock_status: 'In Stock',
    care_info: 'Spot clean with mild detergent. Professional rug cleaning recommended annually.',
    production_info: 'Hand-tufted and carved by studio artisans in 4–6 weeks.',
    shipping_info: 'Complimentary insured shipping throughout Bangladesh.',
    is_featured: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    name: 'Kantha Stitch Runner',
    slug: 'kantha-stitch-runner',
    category: 'JUTE HANDCRAFT',
    material: 'Handspun Jute & Cotton Weave',
    description: 'Delicate contrasting cotton stitchwork woven into a durable flatweave jute base.',
    image_url: 'https://images.pexels.com/photos/30670363/pexels-photo-30670363.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    gallery: ['https://images.pexels.com/photos/30670363/pexels-photo-30670363.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000'],
    base_price: 5400,
    stock_status: 'In Stock',
    care_info: 'Shake out dust regularly and keep away from prolonged moisture.',
    production_info: 'Handwoven on traditional pit looms.',
    shipping_info: 'Free delivery within Bangladesh.',
    is_featured: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-4',
    name: 'Monsoon Wave Abstract Tuft',
    slug: 'monsoon-wave-abstract-tuft',
    category: 'TUFTING RUGS',
    material: 'Plush Acrylic & Wool Yarn',
    description: 'Fluid organic contours hand-carved for three-dimensional depth and plush underfoot comfort.',
    image_url: 'https://images.pexels.com/photos/17596646/pexels-photo-17596646.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    gallery: ['https://images.pexels.com/photos/17596646/pexels-photo-17596646.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000'],
    base_price: 16200,
    stock_status: 'Made to Order',
    care_info: 'Vacuum gently. Avoid harsh chemicals.',
    production_info: 'Made to order in 4–6 weeks.',
    shipping_info: 'Free delivery within Bangladesh.',
    is_featured: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
];

const FALLBACK_DESIGNS: CustomDesign[] = [
  { id: 'des-1', name: 'Modern Abstract 12', category: 'Abstract', image_url: 'https://images.pexels.com/photos/28379849/pexels-photo-28379849.jpeg?auto=compress&cs=tinysrgb&h=600&w=600', complexity: 'standard', sort_order: 1 },
  { id: 'des-2', name: 'Linear Flow', category: 'Minimal', image_url: 'https://images.pexels.com/photos/36346077/pexels-photo-36346077.jpeg?auto=compress&cs=tinysrgb&h=600&w=600', complexity: 'simple', sort_order: 2 },
  { id: 'des-3', name: 'Botanical Trail', category: 'Floral', image_url: 'https://images.pexels.com/photos/30670363/pexels-photo-30670363.jpeg?auto=compress&cs=tinysrgb&h=600&w=600', complexity: 'standard', sort_order: 3 },
  { id: 'des-4', name: 'Geo Grid', category: 'Geometric', image_url: 'https://images.pexels.com/photos/17596646/pexels-photo-17596646.jpeg?auto=compress&cs=tinysrgb&h=600&w=600', complexity: 'simple', sort_order: 4 },
  { id: 'des-5', name: 'Forest Whisper', category: 'Nature', image_url: 'https://images.pexels.com/photos/28379849/pexels-photo-28379849.jpeg?auto=compress&cs=tinysrgb&h=600&w=600', complexity: 'standard', sort_order: 5 },
  { id: 'des-6', name: 'Heritage Medallion', category: 'Traditional', image_url: 'https://images.pexels.com/photos/36346077/pexels-photo-36346077.jpeg?auto=compress&cs=tinysrgb&h=600&w=600', complexity: 'complex', sort_order: 6 },
];

export async function fetchPricingConfig(): Promise<PricingConfig[]> {
  try {
    const { data, error } = await supabase.from('pricing_config').select('*');
    if (error || !data || data.length === 0) return FALLBACK_PRICING;
    return data;
  } catch {
    return FALLBACK_PRICING;
  }
}

export async function fetchAddons(): Promise<Addon[]> {
  try {
    const { data, error } = await supabase
      .from('addons')
      .select('*')
      .eq('active', true)
      .order('sort_order');
    if (error || !data || data.length === 0) return FALLBACK_ADDONS;
    return data;
  } catch {
    return FALLBACK_ADDONS;
  }
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order');
    if (error || !data || data.length === 0) return FALLBACK_PRODUCTS;
    return data;
  } catch {
    return FALLBACK_PRODUCTS;
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (!error && data) return data;
  } catch {
    // ignore and use fallback
  }
  return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function fetchProductSizes(productId: string): Promise<ProductSize[]> {
  try {
    const { data, error } = await supabase
      .from('product_sizes')
      .select('*')
      .eq('product_id', productId)
      .order('price');
    if (!error && data && data.length > 0) return data;
  } catch {
    // ignore and use fallback
  }
  const prod = FALLBACK_PRODUCTS.find((p) => p.id === productId);
  const base = prod?.base_price ?? 6800;
  return [
    { id: `${productId}-s1`, product_id: productId, label: '4 × 6 ft', width_ft: 4, length_ft: 6, price: base },
    { id: `${productId}-s2`, product_id: productId, label: '5 × 8 ft', width_ft: 5, length_ft: 8, price: Math.round(base * 1.45) },
    { id: `${productId}-s3`, product_id: productId, label: '6 × 9 ft', width_ft: 6, length_ft: 9, price: Math.round(base * 1.9) },
  ];
}

export async function fetchCustomDesigns(): Promise<CustomDesign[]> {
  try {
    const { data, error } = await supabase
      .from('custom_designs')
      .select('*')
      .order('sort_order');
    if (error || !data || data.length === 0) return FALLBACK_DESIGNS;
    return data;
  } catch {
    return FALLBACK_DESIGNS;
  }
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
  try {
    const { data, error } = await supabase
      .from('custom_orders')
      .insert(order)
      .select()
      .single();
    if (!error && data) return data;
  } catch {
    // Fallback to in-memory/local confirmation when Supabase is offline
  }
  return { id: `local-${Date.now()}`, ...order, created_at: new Date().toISOString() };
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
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    if (!error && data) return data;
  } catch {
    // Fallback when Supabase is offline
  }
  return { id: `local-${Date.now()}`, ...order, created_at: new Date().toISOString() };
}

export async function fetchAllCustomOrders() {
  try {
    const { data, error } = await supabase
      .from('custom_orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

export async function fetchAllOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
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