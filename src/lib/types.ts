export type RugType = 'tufting' | 'jute';
export type RugShape = 'rectangle' | 'square' | 'circle' | 'oval' | 'custom';
export type Unit = 'ft' | 'in' | 'cm' | 'm';

export type ProductCategory =
  | 'JUTE HANDCRAFT'
  | 'TUFTING RUGS'
  | 'READY-MADE'
  | 'CUSTOM';

export type TuftingSubCategory =
  | 'Islamic Designs'
  | 'Abstract'
  | 'Logo Rugs'
  | 'Papos / Floor Rugs'
  | 'Traditional Bangladesh'
  | 'Geometric'
  | 'Floral'
  | 'Kids'
  | 'Modern'
  | 'Custom Artwork'
  | 'New Arrivals'
  | 'Best Sellers';

export type JuteSubCategory =
  | 'Jute Baskets'
  | 'Jute Bags'
  | 'Wall Décor'
  | 'Mats'
  | 'Storage Products'
  | 'Home Décor'
  | 'Table Décor'
  | 'Traditional Crafts'
  | 'Gift Items'
  | 'Handmade Accessories';

export type CustomDesignCategory =
  | 'Islamic'
  | 'Abstract'
  | 'Logo'
  | 'Papos / Floor Rug'
  | 'Bangladeshi Traditional'
  | 'Geometric'
  | 'Floral'
  | 'Kids'
  | 'Modern'
  | 'Custom Artwork'
  | 'Other';

export type YarnOption =
  | '100% New Zealand Wool'
  | 'Acrylic Blend'
  | 'Bamboo Silk'
  | 'Premium Resilient Acrylic'
  | 'Mulberry Silk & Wool Blend'
  | 'Golden Organic Bengal Jute';

export type PileHeightOption =
  | '12mm Standard Low Pile'
  | '16mm Plush Medium Pile'
  | '22mm Luxury Deep Pile'
  | '3D Sculpted Carved Relief';

export type BackingOption =
  | 'Non-slip Cotton Twill'
  | 'Natural Latex & Jute Webbing'
  | 'Premium Acoustic Felt';

export type FinishingOption =
  | 'Hand-sheared Beveled Edge'
  | 'Tasseled Artisanal Fringe'
  | 'Dense Whipped Stitch'
  | 'Seamless Flush Edge';

export const ORDER_TRACKING_STAGES = [
  { id: 'created', label: 'Order Created', desc: 'Custom specifications registered' },
  { id: 'payment_received', label: '50% Payment Received', desc: 'Advance payment confirmed & verified' },
  { id: 'design_review', label: 'Design Review', desc: 'Artisans reviewing vector mapping & color yarn batch' },
  { id: 'production', label: 'Production', desc: 'Hand-tufting and frame weaving in progress' },
  { id: 'quality_check', label: 'Quality Check', desc: 'Pile inspection, shearing & backing cure' },
  { id: 'ready_to_ship', label: 'Ready to Ship', desc: 'Hand-packed in climate-safe protective wrapping' },
  { id: 'shipped', label: 'Shipped', desc: 'In transit via courier with tracking number' },
  { id: 'delivered', label: 'Delivered', desc: 'Hand delivered to customer doorstep' },
] as const;

export type OrderTrackingStatus = typeof ORDER_TRACKING_STAGES[number]['label'];

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
  category: 'TUFTING RUGS' | 'JUTE HANDCRAFT';
  subCategory?: string;
  material: string;
  description: string;
  image_url: string;
  gallery: string[];
  base_price: number; // in USD base
  stock_status: 'In Stock' | 'Made to Order' | 'Limited Edition';
  care_info: string;
  production_info: string;
  shipping_info: string;
  is_featured: boolean;
  is_best_seller?: boolean;
  is_new_arrival?: boolean;
  sort_order: number;
  created_at: string;
}

export interface ProductSize {
  id: string;
  product_id: string;
  label: string;
  width_ft: number;
  length_ft: number;
  price: number; // in USD base
}

export interface CustomDesign {
  id: string;
  name: string;
  category: CustomDesignCategory;
  image_url: string;
  complexity: 'simple' | 'standard' | 'complex';
  sort_order: number;
}

export interface CustomOrder {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  country: string;
  address?: string;
  city?: string;
  rug_type: RugType;
  shape: RugShape;
  width: number | null;
  length: number | null;
  diameter: number | null;
  unit: Unit;
  area_sqft: number;
  design_category: CustomDesignCategory;
  design_id: string | null;
  design_name: string | null;
  uploaded_artwork_url: string | null;
  uploaded_file_name?: string | null;
  uploaded_file_size?: number | null;
  yarn_type?: YarnOption;
  pile_height?: PileHeightOption;
  backing?: BackingOption;
  finishing?: FinishingOption;
  colors: Record<string, string>;
  addon_codes: string[];
  base_price: number;
  addon_total: number;
  total_price: number;
  advance_paid: number;
  remaining: number;
  payment_method: string;
  payment_status: 'Advance Paid (50%)' | 'Fully Paid' | 'Pending Verification';
  production_status: OrderTrackingStatus;
  tracking_number?: string;
  estimated_delivery?: string;
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
  is_advance_payment?: boolean;
  payment_method: string;
  payment_status: string;
  status: OrderTrackingStatus;
  tracking_number?: string;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string | null;
  author: string;
  location?: string;
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
  price: number; // in USD base
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
  areaSqm: number;
  designCategory: CustomDesignCategory;
  designId: string | null;
  designName: string | null;
  uploadedArtworkUrl: string | null;
  uploadedFileName?: string | null;
  uploadedFileSize?: number | null;
  yarnType: YarnOption;
  pileHeight: PileHeightOption;
  backing: BackingOption;
  finishing: FinishingOption;
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
  areaSqm: number;
  basePrice: number;
  addonTotal: number;
  shapeSurcharge: number;
  designSurcharge: number;
  yarnSurcharge: number;
  pileSurcharge: number;
  rushFee: number;
  subtotal: number;
  total: number;
  advance: number;
  remaining: number;
  pricePerSqft: number;
  minOrderPrice: number;
}
