export type RugType = 'tufting' | 'jute';
export type RugShape = 'rectangle' | 'square' | 'circle' | 'oval' | 'custom';
export type Unit = 'ft' | 'in' | 'cm' | 'm';
export type ProductCategory = 'JUTE HANDCRAFT' | 'TUFTING RUGS' | 'READY-MADE' | 'CUSTOM';

export interface PricingConfig {
  id: string;
  rug_type: RugType;
  label: string;
  price_per_sqft: number;
  min_order_price: number;
  shape_surcharge: number;
  currency: string;
  currency_symbol: string;
}

export interface Addon {
  id: string;
  code: string;
  label: string;
  description: string;
  price: number;
  active: boolean;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  material: string;
  description: string;
  image_url: string;
  gallery: string[];
  base_price: number;
  stock_status: string;
  care_info: string;
  production_info: string;
  shipping_info: string;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface ProductSize {
  id: string;
  product_id: string;
  label: string;
  width_ft: number;
  length_ft: number;
  price: number;
}

export interface CustomDesign {
  id: string;
  name: string;
  category: string;
  image_url: string;
  complexity: string;
  sort_order: number;
}

export interface CustomOrder {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  rug_type: RugType;
  shape: RugShape;
  width: number | null;
  length: number | null;
  diameter: number | null;
  unit: Unit;
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
  bkash_sender_number?: string | null;
  bkash_trx_id?: string | null;
  payment_status: string;
  production_status: string;
  notes: string;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  country: string;
  address: string;
  city: string;
  postal_code: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  advance_paid: number;
  remaining: number;
  payment_method: string;
  payment_status: string;
  status: string;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string | null;
  author: string;
  rating: number;
  title: string;
  body: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  type: 'product' | 'custom';
  productId?: string;
  name: string;
  image?: string;
  size?: string;
  quantity: number;
  price: number;
  customConfig?: CustomRugConfig;
}

export interface CustomRugConfig {
  rugType: RugType;
  shape: RugShape;
  width: number;
  length: number;
  diameter: number;
  unit: Unit;
  areaSqft: number;
  designId: string | null;
  designName: string | null;
  uploadedArtworkUrl: string | null;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  addonCodes: string[];
  basePrice: number;
  addonTotal: number;
  totalPrice: number;
  advance: number;
  remaining: number;
}

export interface PricingResult {
  areaSqft: number;
  basePrice: number;
  addonTotal: number;
  shapeSurcharge: number;
  designSurcharge: number;
  rushFee: number;
  subtotal: number;
  total: number;
  advance: number;
  remaining: number;
  pricePerSqft: number;
  minOrderPrice: number;
}
