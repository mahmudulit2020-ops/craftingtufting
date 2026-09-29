import { supabase } from './supabase';
import type {
  Addon,
  CustomDesign,
  PricingConfig,
  Product,
  ProductSize,
  CustomOrder,
  Order,
  OrderTrackingStatus,
} from './types';

export const FALLBACK_PRICING: PricingConfig[] = [
  {
    id: 'cfg-tufting',
    rug_type: 'tufting',
    label: 'Custom Tufted Rug',
    price_per_sqft: 28, // USD per sqft base
    min_order_price: 150,
    shape_surcharge: 35,
    currency: 'USD',
    currency_symbol: '$',
  },
  {
    id: 'cfg-jute',
    rug_type: 'jute',
    label: 'Custom Jute Craft Rug',
    price_per_sqft: 18, // USD per sqft base
    min_order_price: 90,
    shape_surcharge: 25,
    currency: 'USD',
    currency_symbol: '$',
  },
];

export const FALLBACK_ADDONS: Addon[] = [
  {
    id: 'addon-anti-slip',
    code: 'anti_slip',
    label: 'Non-Slip Latex Backing',
    description: 'Heavy natural rubberized backing for hardwood & tiled floors',
    price: 25,
    active: true,
    sort_order: 1,
  },
  {
    id: 'addon-hand-carved',
    code: '3d_carving',
    label: 'Artisan 3D Hand-Carving',
    description: 'Master tufter hand-bevels each color boundary for sculptured tactile relief',
    price: 45,
    active: true,
    sort_order: 2,
  },
  {
    id: 'addon-tassel-fringe',
    code: 'tasseled_border',
    label: 'Braided Jute & Wool Tassel Fringe',
    description: 'Traditional Bangladeshi edge fringe tied by hand',
    price: 30,
    active: true,
    sort_order: 3,
  },
  {
    id: 'addon-extra-thick',
    code: 'extra_thick',
    label: 'Extra-Deep 22mm Cloud Pile',
    description: 'Triple-density yarn tufting for ultra-luxe footstep sink',
    price: 40,
    active: true,
    sort_order: 4,
  },
  {
    id: 'addon-gift-packaging',
    code: 'gift_packaging',
    label: 'Luxury Keepsake Wooden Trunk & Gift Wrap',
    description: 'Handmade wooden packaging box with custom calligraphy tag',
    price: 35,
    active: true,
    sort_order: 5,
  },
  {
    id: 'addon-rush-production',
    code: 'rush_production',
    label: 'Expedited Atelier Priority (14-day Crafting)',
    description: 'Dedicated artisan bench to fast-track hand-tufting and curing',
    price: 75,
    active: true,
    sort_order: 6,
  },
];

export const FALLBACK_PRODUCTS: Product[] = [
  // Ready-Made Tufted Rugs
  {
    id: 'prod-t1',
    name: 'Mihrab Sacred Arch Tufted Rug',
    slug: 'mihrab-sacred-arch-tufted-rug',
    category: 'TUFTING RUGS',
    subCategory: 'Islamic Designs',
    material: '100% Fine New Zealand Wool & Cotton Twill',
    description: 'A serene architectural composition inspired by historic Bengali mosques and Islamic geometric symmetry. Hand-tufted with hand-beveled arches and high-density wool pile.',
    image_url: 'https://images.pexels.com/photos/28379849/pexels-photo-28379849.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    gallery: [
      'https://images.pexels.com/photos/28379849/pexels-photo-28379849.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
      'https://images.pexels.com/photos/30670363/pexels-photo-30670363.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    ],
    base_price: 380,
    stock_status: 'In Stock',
    care_info: 'Vacuum on gentle suction without beater brush. Spot clean with mild wool shampoo.',
    production_info: 'Handcrafted in Dhaka atelier over 3 weeks. 16mm plush pile.',
    shipping_info: 'International insured air express in 5–8 business days.',
    is_featured: true,
    is_best_seller: true,
    is_new_arrival: false,
    sort_order: 1,
    created_at: '2026-09-01T00:00:00Z',
  },
  {
    id: 'prod-t2',
    name: 'Monsoon Terra Abstract Sculpted Rug',
    slug: 'monsoon-terra-abstract-sculpted-rug',
    category: 'TUFTING RUGS',
    subCategory: 'Abstract',
    material: 'Mulberry Silk & Resilient New Zealand Wool Blend',
    description: 'Inspired by the rhythmic river deltas and silt flows of rural Bangladesh during the monsoon. Rich terracotta, oatmeal, and raw umber tones carved with varying pile depths.',
    image_url: 'https://images.pexels.com/photos/17596646/pexels-photo-17596646.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    gallery: [
      'https://images.pexels.com/photos/17596646/pexels-photo-17596646.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    ],
    base_price: 490,
    stock_status: 'Made to Order',
    care_info: 'Professional dry cleaning recommended for silk blends.',
    production_info: 'Handmade to order in 4–5 weeks by our master carvers.',
    shipping_info: 'Worldwide tracked shipping with certificate of authenticity.',
    is_featured: true,
    is_best_seller: false,
    is_new_arrival: true,
    sort_order: 2,
    created_at: '2026-09-10T00:00:00Z',
  },
  {
    id: 'prod-t3',
    name: 'Nakshi Kantha Heritage Tuft',
    slug: 'nakshi-kantha-heritage-tuft',
    category: 'TUFTING RUGS',
    subCategory: 'Traditional Bangladesh',
    material: 'Organic Natural Wool & Dyed Cotton Accent Stitching',
    description: 'An ode to the timeless folk embroidery of rural Bengal. Stylized lotus motifs and rippling river stitch patterns translated into modern, high-pile floor art.',
    image_url: 'https://images.pexels.com/photos/30670363/pexels-photo-30670363.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    gallery: [
      'https://images.pexels.com/photos/30670363/pexels-photo-30670363.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    ],
    base_price: 420,
    stock_status: 'In Stock',
    care_info: 'Rotate rug every 6 months to ensure uniform wear.',
    production_info: 'Hand-tufted and hand-finished by women artisans in Narayanganj.',
    shipping_info: 'Free DHL Express shipping to US, UK, EU, UAE and Bangladesh.',
    is_featured: true,
    is_best_seller: true,
    is_new_arrival: false,
    sort_order: 3,
    created_at: '2026-08-20T00:00:00Z',
  },
  {
    id: 'prod-t4',
    name: 'Dhaka Modernist Isometric Rug',
    slug: 'dhaka-modernist-isometric-rug',
    category: 'TUFTING RUGS',
    subCategory: 'Geometric',
    material: '100% High-Bulk Acrylic & Wool Core',
    description: 'Sharp graphic lines and warm neutral color blocks that harmonize with mid-century modern, Scandinavian, and contemporary penthouse interiors.',
    image_url: 'https://images.pexels.com/photos/6489734/pexels-photo-6489734.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    gallery: [
      'https://images.pexels.com/photos/6489734/pexels-photo-6489734.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    ],
    base_price: 320,
    stock_status: 'In Stock',
    care_info: 'Stain-resistant fiber. Clean with warm water and damp cloth.',
    production_info: 'Tufted on heavy-duty backing with reinforced whipped edge.',
    shipping_info: 'Ships within 48 hours from our central atelier.',
    is_featured: false,
    is_best_seller: false,
    is_new_arrival: true,
    sort_order: 4,
    created_at: '2026-09-15T00:00:00Z',
  },
  {
    id: 'prod-t5',
    name: 'Atelier Crest Papos / Entry Rug',
    slug: 'atelier-crest-papos-entry-rug',
    category: 'TUFTING RUGS',
    subCategory: 'Papos / Floor Rugs',
    material: 'Heavy Coir & Dense Tufted Wool Border',
    description: 'Compact luxury welcome papos designed for entrance foyers, dressing nooks, and bedside steps. Features deep, dirt-trapping fibers and non-slip rubber grip.',
    image_url: 'https://images.pexels.com/photos/36346077/pexels-photo-36346077.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    gallery: [
      'https://images.pexels.com/photos/36346077/pexels-photo-36346077.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    ],
    base_price: 140,
    stock_status: 'In Stock',
    care_info: 'Shake vigorously outside or vacuum lightly.',
    production_info: 'Hand-tufted in compact form factor.',
    shipping_info: 'Ready to ship next business day.',
    is_featured: false,
    is_best_seller: true,
    is_new_arrival: false,
    sort_order: 5,
    created_at: '2026-07-12T00:00:00Z',
  },
  {
    id: 'prod-t6',
    name: 'Padma Lotus Bloom Carved Rug',
    slug: 'padma-lotus-bloom-carved-rug',
    category: 'TUFTING RUGS',
    subCategory: 'Floral',
    material: '100% New Zealand Wool with Silk Highlighting',
    description: 'Botanical poetry underfoot. The national flower of Bangladesh reinterpreted in soft blush, sage, ivory, and cream, carved with deep dimensional contours.',
    image_url: 'https://images.pexels.com/photos/28379849/pexels-photo-28379849.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    gallery: [
      'https://images.pexels.com/photos/28379849/pexels-photo-28379849.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    ],
    base_price: 460,
    stock_status: 'Made to Order',
    care_info: 'Vacuum without beater bar. Avoid prolonged direct moisture.',
    production_info: 'Requires 4 weeks of hand tufting and shearing.',
    shipping_info: 'Custom rolled in air-sealed tube and shipped globally.',
    is_featured: false,
    is_best_seller: false,
    is_new_arrival: true,
    sort_order: 6,
    created_at: '2026-09-18T00:00:00Z',
  },

  // Jute Handicraft Store Products (Natural • Handmade • Sustainable • Bangladeshi)
  {
    id: 'prod-j1',
    name: 'Sundarbans Spiral Braided Jute Rug',
    slug: 'sundarbans-spiral-braided-jute-rug',
    category: 'JUTE HANDCRAFT',
    subCategory: 'Mats',
    material: '100% Golden Bengal Tosha Jute',
    description: 'Harvested from the fertile riverbanks of Faridpur, this pure golden jute rug is braided and stitched spirally by fourth-generation weavers. Biodegradable, durable, and naturally radiant.',
    image_url: 'https://images.pexels.com/photos/36346077/pexels-photo-36346077.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    gallery: [
      'https://images.pexels.com/photos/36346077/pexels-photo-36346077.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    ],
    base_price: 210,
    stock_status: 'In Stock',
    care_info: 'Vacuum periodically. Blot spills with damp cotton cloth. Keep dry.',
    production_info: 'Handwoven in rural Faridpur over 14 days.',
    shipping_info: 'Worldwide standard & express shipping available.',
    is_featured: true,
    is_best_seller: true,
    is_new_arrival: false,
    sort_order: 7,
    created_at: '2026-08-01T00:00:00Z',
  },
  {
    id: 'prod-j2',
    name: 'Jamdani Motif Woven Jute Baskets (Set of 3)',
    slug: 'jamdani-motif-woven-jute-baskets',
    category: 'JUTE HANDCRAFT',
    subCategory: 'Jute Baskets',
    material: 'Natural Jute Rope & Recycled Cotton Ribbon',
    description: 'Artisan nesting storage baskets woven with traditional Jamdani geometric motifs along the rim. Ideal for blankets, books, towels, or indoor botanical planters.',
    image_url: 'https://images.pexels.com/photos/6489734/pexels-photo-6489734.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    gallery: [
      'https://images.pexels.com/photos/6489734/pexels-photo-6489734.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    ],
    base_price: 85,
    stock_status: 'In Stock',
    care_info: 'Wipe clean with a dry or lightly dampened microfiber cloth.',
    production_info: 'Coiled and hand-stitched by fair-trade artisan cooperatives in Jessore.',
    shipping_info: 'Flat-packed or nested securely for worldwide transit.',
    is_featured: true,
    is_best_seller: true,
    is_new_arrival: false,
    sort_order: 8,
    created_at: '2026-08-15T00:00:00Z',
  },
  {
    id: 'prod-j3',
    name: 'Sunburst Mandala Jute Wall Hanging',
    slug: 'sunburst-mandala-jute-wall-hanging',
    category: 'JUTE HANDCRAFT',
    subCategory: 'Wall Décor',
    material: 'Bleached & Raw Unrefined Golden Jute, Teakwood Bar',
    description: 'An impressive architectural statement piece that infuses organic warmth into modern spaces. Features radiating macramé knots, raw frayed tassels, and genuine reclaimed teak mounting rod.',
    image_url: 'https://images.pexels.com/photos/30670363/pexels-photo-30670363.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    gallery: [
      'https://images.pexels.com/photos/30670363/pexels-photo-30670363.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    ],
    base_price: 160,
    stock_status: 'In Stock',
    care_info: 'Gently shake out dust outdoors or comb fringe with wide-tooth comb.',
    production_info: '32 hours of detailed macramé knotting per hanging.',
    shipping_info: 'Ships in custom rigid tube with hanging hardware included.',
    is_featured: true,
    is_best_seller: false,
    is_new_arrival: true,
    sort_order: 9,
    created_at: '2026-09-05T00:00:00Z',
  },
  {
    id: 'prod-j4',
    name: 'Bespoke Golden Jute Market Tote & Beach Bag',
    slug: 'bespoke-golden-jute-market-tote',
    category: 'JUTE HANDCRAFT',
    subCategory: 'Jute Bags',
    material: 'High-Density Waxed Jute & Genuine Vegetable-Tanned Leather Handles',
    description: 'Everyday elegance meets 100% natural sustainability. Lined with organic cotton canvas with inner zipper pocket and reinforced brass rivets.',
    image_url: 'https://images.pexels.com/photos/36346077/pexels-photo-36346077.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    gallery: [
      'https://images.pexels.com/photos/36346077/pexels-photo-36346077.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    ],
    base_price: 65,
    stock_status: 'In Stock',
    care_info: 'Spot clean canvas and treat leather handles with beeswax conditioner.',
    production_info: 'Crafted in Bogra artisan workshop with zero plastic packaging.',
    shipping_info: 'Fast dispatch within 24 hours.',
    is_featured: false,
    is_best_seller: true,
    is_new_arrival: false,
    sort_order: 10,
    created_at: '2026-07-28T00:00:00Z',
  },
  {
    id: 'prod-j5',
    name: 'Heritage Jute Table Runner & Coasters Set',
    slug: 'heritage-jute-table-runner-set',
    category: 'JUTE HANDCRAFT',
    subCategory: 'Table Décor',
    material: 'Natural Braided Jute & Hand-Drawn Kantha Border',
    description: 'Elevate festive dining tables with rustic Bangladeshi artisan charm. Includes 1 full-length table runner (72 × 14 in) and 6 matching circular coasters.',
    image_url: 'https://images.pexels.com/photos/17596646/pexels-photo-17596646.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    gallery: [
      'https://images.pexels.com/photos/17596646/pexels-photo-17596646.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    ],
    base_price: 75,
    stock_status: 'In Stock',
    care_info: 'Heat resistant up to 180°C. Wipe clean after dining.',
    production_info: 'Handwoven flat on traditional pit-looms.',
    shipping_info: 'Gift-ready packaging with artisan story card.',
    is_featured: false,
    is_best_seller: false,
    is_new_arrival: true,
    sort_order: 11,
    created_at: '2026-09-12T00:00:00Z',
  },
  {
    id: 'prod-j6',
    name: 'Artisan Coiled Jute Floor Pillow & Pouf',
    slug: 'artisan-coiled-jute-floor-pouf',
    category: 'JUTE HANDCRAFT',
    subCategory: 'Home Décor',
    material: 'Braided Golden Jute & High-Density Cotton Core',
    description: 'Substantial, ergonomic floor seat for meditation, reading corners, or casual living room gatherings. Sturdy yet comfortably flexible under pressure.',
    image_url: 'https://images.pexels.com/photos/6489734/pexels-photo-6489734.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    gallery: [
      'https://images.pexels.com/photos/6489734/pexels-photo-6489734.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    ],
    base_price: 130,
    stock_status: 'In Stock',
    care_info: 'Shake out outdoors. Spot clean with dry powder or foaming upholstery cleaner.',
    production_info: 'Braided and hand-assembled in Pabna craft hub.',
    shipping_info: 'Dispatched via premium international courier.',
    is_featured: false,
    is_best_seller: true,
    is_new_arrival: false,
    sort_order: 12,
    created_at: '2026-08-10T00:00:00Z',
  },
];

export const FALLBACK_DESIGNS: CustomDesign[] = [
  {
    id: 'des-islamic-1',
    name: 'Andalusia Sacred Rosette',
    category: 'Islamic',
    image_url: 'https://images.pexels.com/photos/28379849/pexels-photo-28379849.jpeg?auto=compress&cs=tinysrgb&h=600&w=600',
    complexity: 'complex',
    sort_order: 1,
  },
  {
    id: 'des-abstract-1',
    name: 'Monsoon Rhythm Delta',
    category: 'Abstract',
    image_url: 'https://images.pexels.com/photos/17596646/pexels-photo-17596646.jpeg?auto=compress&cs=tinysrgb&h=600&w=600',
    complexity: 'standard',
    sort_order: 2,
  },
  {
    id: 'des-logo-1',
    name: 'Atelier Crest Monogram',
    category: 'Logo',
    image_url: 'https://images.pexels.com/photos/6489734/pexels-photo-6489734.jpeg?auto=compress&cs=tinysrgb&h=600&w=600',
    complexity: 'standard',
    sort_order: 3,
  },
  {
    id: 'des-papos-1',
    name: 'Traditional Welcome Papos',
    category: 'Papos / Floor Rug',
    image_url: 'https://images.pexels.com/photos/36346077/pexels-photo-36346077.jpeg?auto=compress&cs=tinysrgb&h=600&w=600',
    complexity: 'simple',
    sort_order: 4,
  },
  {
    id: 'des-trad-1',
    name: 'Sonargaon Nakshi Folk Weave',
    category: 'Bangladeshi Traditional',
    image_url: 'https://images.pexels.com/photos/30670363/pexels-photo-30670363.jpeg?auto=compress&cs=tinysrgb&h=600&w=600',
    complexity: 'complex',
    sort_order: 5,
  },
  {
    id: 'des-geo-1',
    name: 'Nordic Bauhaus Minimal Line',
    category: 'Geometric',
    image_url: 'https://images.pexels.com/photos/17596646/pexels-photo-17596646.jpeg?auto=compress&cs=tinysrgb&h=600&w=600',
    complexity: 'simple',
    sort_order: 6,
  },
  {
    id: 'des-floral-1',
    name: 'Padma River Blossom',
    category: 'Floral',
    image_url: 'https://images.pexels.com/photos/28379849/pexels-photo-28379849.jpeg?auto=compress&cs=tinysrgb&h=600&w=600',
    complexity: 'standard',
    sort_order: 7,
  },
  {
    id: 'des-kids-1',
    name: 'Sleepy Moon & Cloud Safari',
    category: 'Kids',
    image_url: 'https://images.pexels.com/photos/6489734/pexels-photo-6489734.jpeg?auto=compress&cs=tinysrgb&h=600&w=600',
    complexity: 'simple',
    sort_order: 8,
  },
  {
    id: 'des-modern-1',
    name: 'Continuum Wave Contour',
    category: 'Modern',
    image_url: 'https://images.pexels.com/photos/30670363/pexels-photo-30670363.jpeg?auto=compress&cs=tinysrgb&h=600&w=600',
    complexity: 'standard',
    sort_order: 9,
  },
  {
    id: 'des-art-1',
    name: 'Bespoke Artisan Portrait Rug',
    category: 'Custom Artwork',
    image_url: 'https://images.pexels.com/photos/36346077/pexels-photo-36346077.jpeg?auto=compress&cs=tinysrgb&h=600&w=600',
    complexity: 'complex',
    sort_order: 10,
  },
];

// Persistent Local Store for Orders & Custom Orders
const CUSTOM_ORDERS_KEY = 'ct_custom_orders_v2';
const STANDARD_ORDERS_KEY = 'ct_standard_orders_v2';
const PRICING_CONFIG_KEY = 'ct_pricing_config_v2';

const SEED_CUSTOM_ORDERS: CustomOrder[] = [
  {
    id: 'seed-co-1',
    order_number: 'CT-84920',
    user_id: null,
    customer_name: 'Sophia Laurent',
    customer_email: 'sophia.laurent@paris-interiors.com',
    customer_phone: '+33 6 49 20 11 02',
    country: 'France',
    address: '14 Rue de Rivoli',
    city: 'Paris',
    rug_type: 'tufting',
    shape: 'rectangle',
    width: 6,
    length: 9,
    diameter: null,
    unit: 'ft',
    area_sqft: 54,
    design_category: 'Abstract',
    design_id: 'des-abstract-1',
    design_name: 'Monsoon Rhythm Delta',
    uploaded_artwork_url: 'https://images.pexels.com/photos/17596646/pexels-photo-17596646.jpeg?auto=compress&cs=tinysrgb&h=600&w=600',
    uploaded_file_name: 'delta_monsoon_art.png',
    uploaded_file_size: 2450000,
    yarn_type: '100% New Zealand Wool',
    pile_height: '3D Sculpted Carved Relief',
    backing: 'Non-slip Cotton Twill',
    finishing: 'Hand-sheared Beveled Edge',
    colors: { primary: '#4A4A46', secondary: '#8B6F47', accent: '#B5532A', background: '#FAF7F2' },
    addon_codes: ['3d_carving', 'anti_slip'],
    base_price: 1512,
    addon_total: 70,
    total_price: 1582,
    advance_paid: 791,
    remaining: 791,
    payment_method: 'International Credit Card',
    payment_status: 'Advance Paid (50%)',
    production_status: 'Production',
    tracking_number: 'DHL-EX-9921448',
    estimated_delivery: 'Oct 24, 2026',
    notes: 'Please ensure high contrast between terracotta and cream yarn.',
    created_at: '2026-09-18T14:30:00Z',
  },
  {
    id: 'seed-co-2',
    order_number: 'CT-51203',
    user_id: null,
    customer_name: 'Tariq Al-Mansoor',
    customer_email: 'tariq.mansoor@dubai-design.ae',
    customer_phone: '+971 50 234 5678',
    country: 'United Arab Emirates',
    address: 'Downtown Opera District, Tower B',
    city: 'Dubai',
    rug_type: 'tufting',
    shape: 'circle',
    width: null,
    length: null,
    diameter: 7,
    unit: 'ft',
    area_sqft: 38.48,
    design_category: 'Islamic',
    design_id: 'des-islamic-1',
    design_name: 'Andalusia Sacred Rosette',
    uploaded_artwork_url: 'https://images.pexels.com/photos/28379849/pexels-photo-28379849.jpeg?auto=compress&cs=tinysrgb&h=600&w=600',
    uploaded_file_name: 'sacred_rosette_vector.svg',
    uploaded_file_size: 1820000,
    yarn_type: 'Mulberry Silk & Wool Blend',
    pile_height: '22mm Luxury Deep Pile',
    backing: 'Premium Acoustic Felt',
    finishing: 'Tasseled Artisanal Fringe',
    colors: { primary: '#242421', secondary: '#8B6F47', accent: '#C9B291', background: '#FBFAF6' },
    addon_codes: ['tasseled_border', 'extra_thick'],
    base_price: 1250,
    addon_total: 70,
    total_price: 1320,
    advance_paid: 660,
    remaining: 660,
    payment_method: 'International Card (Stripe)',
    payment_status: 'Advance Paid (50%)',
    production_status: '50% Payment Received',
    tracking_number: 'EM-AE-348201',
    estimated_delivery: 'Nov 02, 2026',
    notes: 'Client requested gold silk thread woven into center rosette medallion.',
    created_at: '2026-09-24T09:15:00Z',
  },
  {
    id: 'seed-co-3',
    order_number: 'CT-30419',
    user_id: null,
    customer_name: 'Dr. Nusrat Jahan',
    customer_email: 'nusrat.jahan@dhk-med.org',
    customer_phone: '+880 1711 234567',
    country: 'Bangladesh',
    address: 'House 42, Road 11, Banani',
    city: 'Dhaka',
    rug_type: 'jute',
    shape: 'rectangle',
    width: 5,
    length: 7,
    diameter: null,
    unit: 'ft',
    area_sqft: 35,
    design_category: 'Bangladeshi Traditional',
    design_id: 'des-trad-1',
    design_name: 'Sonargaon Nakshi Folk Weave',
    uploaded_artwork_url: 'https://images.pexels.com/photos/30670363/pexels-photo-30670363.jpeg?auto=compress&cs=tinysrgb&h=600&w=600',
    uploaded_file_name: 'folk_weave.png',
    uploaded_file_size: 980000,
    yarn_type: 'Golden Organic Bengal Jute',
    pile_height: '12mm Standard Low Pile',
    backing: 'Natural Latex & Jute Webbing',
    finishing: 'Hand-sheared Beveled Edge',
    colors: { primary: '#4A4A46', secondary: '#8B6F47', accent: '#B5532A', background: '#EBE0D0' },
    addon_codes: ['anti_slip'],
    base_price: 630,
    addon_total: 25,
    total_price: 655,
    advance_paid: 655,
    remaining: 0,
    payment_method: 'bKash Merchant Pay',
    payment_status: 'Fully Paid',
    production_status: 'Delivered',
    tracking_number: 'REDX-BD-88910',
    estimated_delivery: 'Sep 26, 2026',
    notes: 'Delivered safely and received by customer with praise.',
    created_at: '2026-08-28T11:00:00Z',
  },
];

export function getLocalCustomOrders(): CustomOrder[] {
  try {
    const raw = localStorage.getItem(CUSTOM_ORDERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return SEED_CUSTOM_ORDERS;
}

export function saveLocalCustomOrders(orders: CustomOrder[]) {
  try {
    localStorage.setItem(CUSTOM_ORDERS_KEY, JSON.stringify(orders));
  } catch {
    // ignore
  }
}

export function getLocalStandardOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STANDARD_ORDERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return [];
}

export function saveLocalStandardOrders(orders: Order[]) {
  try {
    localStorage.setItem(STANDARD_ORDERS_KEY, JSON.stringify(orders));
  } catch {
    // ignore
  }
}

export async function fetchPricingConfig(): Promise<PricingConfig[]> {
  try {
    const local = localStorage.getItem(PRICING_CONFIG_KEY);
    if (local) return JSON.parse(local);
  } catch {
    // ignore
  }

  try {
    const { data, error } = await supabase.from('pricing_config').select('*');
    if (!error && data && data.length > 0) return data;
  } catch {
    // fallback
  }
  return FALLBACK_PRICING;
}

export async function updatePricingConfig(
  rugType: string,
  pricePerSqft: number,
  minOrderPrice: number,
  shapeSurcharge: number
) {
  try {
    const current = await fetchPricingConfig();
    const updated = current.map((c) =>
      c.rug_type === rugType
        ? {
            ...c,
            price_per_sqft: pricePerSqft,
            min_order_price: minOrderPrice,
            shape_surcharge: shapeSurcharge,
          }
        : c
    );
    localStorage.setItem(PRICING_CONFIG_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  try {
    await supabase
      .from('pricing_config')
      .update({
        price_per_sqft: pricePerSqft,
        min_order_price: minOrderPrice,
        shape_surcharge: shapeSurcharge,
        updated_at: new Date().toISOString(),
      })
      .eq('rug_type', rugType);
  } catch {
    // ignore
  }
}

export async function fetchAddons(): Promise<Addon[]> {
  try {
    const { data, error } = await supabase
      .from('addons')
      .select('*')
      .eq('active', true)
      .order('sort_order');
    if (!error && data && data.length > 0) return data;
  } catch {
    // fallback
  }
  return FALLBACK_ADDONS;
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order');
    if (!error && data && data.length > 0) return data;
  } catch {
    // fallback
  }
  return FALLBACK_PRODUCTS;
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
    // fallback
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
    // fallback
  }
  const prod = FALLBACK_PRODUCTS.find((p) => p.id === productId);
  const base = prod?.base_price ?? 320;
  return [
    { id: `${productId}-s1`, product_id: productId, label: '3 × 5 ft (Accent / Papos)', width_ft: 3, length_ft: 5, price: Math.round(base * 0.65) },
    { id: `${productId}-s2`, product_id: productId, label: '4 × 6 ft (Standard Area)', width_ft: 4, length_ft: 6, price: base },
    { id: `${productId}-s3`, product_id: productId, label: '5 × 8 ft (Living Room Area)', width_ft: 5, length_ft: 8, price: Math.round(base * 1.55) },
    { id: `${productId}-s4`, product_id: productId, label: '6 × 9 ft (Grand Statement)', width_ft: 6, length_ft: 9, price: Math.round(base * 2.15) },
    { id: `${productId}-s5`, product_id: productId, label: '8 × 10 ft (Penthouse Suite)', width_ft: 8, length_ft: 10, price: Math.round(base * 3.4) },
  ];
}

export async function fetchCustomDesigns(): Promise<CustomDesign[]> {
  try {
    const { data, error } = await supabase
      .from('custom_designs')
      .select('*')
      .order('sort_order');
    if (!error && data && data.length > 0) return data;
  } catch {
    // fallback
  }
  return FALLBACK_DESIGNS;
}

export function generateOrderNumber(prefix = 'CT'): string {
  const ts = Date.now().toString(36).toUpperCase().slice(-4);
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${rand}${ts}`;
}

export async function createCustomOrder(orderData: Partial<CustomOrder>): Promise<CustomOrder> {
  const newOrder: CustomOrder = {
    id: `co-${Date.now()}`,
    order_number: orderData.order_number || generateOrderNumber('CT'),
    user_id: orderData.user_id ?? null,
    customer_name: orderData.customer_name || 'Anonymous Customer',
    customer_email: orderData.customer_email || 'client@craftingtufting.com',
    customer_phone: orderData.customer_phone || '',
    country: orderData.country || 'International',
    address: orderData.address || '',
    city: orderData.city || '',
    rug_type: orderData.rug_type || 'tufting',
    shape: orderData.shape || 'rectangle',
    width: orderData.width ?? 6,
    length: orderData.length ?? 8,
    diameter: orderData.diameter ?? null,
    unit: orderData.unit || 'ft',
    area_sqft: orderData.area_sqft || 48,
    design_category: orderData.design_category || 'Abstract',
    design_id: orderData.design_id || null,
    design_name: orderData.design_name || 'Custom Bespoke Artwork',
    uploaded_artwork_url: orderData.uploaded_artwork_url || null,
    uploaded_file_name: orderData.uploaded_file_name || null,
    uploaded_file_size: orderData.uploaded_file_size || null,
    yarn_type: orderData.yarn_type || '100% New Zealand Wool',
    pile_height: orderData.pile_height || '16mm Plush Medium Pile',
    backing: orderData.backing || 'Non-slip Cotton Twill',
    finishing: orderData.finishing || 'Hand-sheared Beveled Edge',
    colors: orderData.colors || { primary: '#4A4A46', secondary: '#8B6F47', accent: '#242421', background: '#FAF7F2' },
    addon_codes: orderData.addon_codes || [],
    base_price: orderData.base_price || 400,
    addon_total: orderData.addon_total || 0,
    total_price: orderData.total_price || 400,
    advance_paid: orderData.advance_paid || 200,
    remaining: orderData.remaining || 200,
    payment_method: orderData.payment_method || 'Credit Card',
    payment_status: 'Advance Paid (50%)',
    production_status: '50% Payment Received',
    tracking_number: `CT-INT-${Math.floor(100000 + Math.random() * 900000)}`,
    estimated_delivery: new Date(Date.now() + 35 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    notes: orderData.notes || '',
    created_at: new Date().toISOString(),
  };

  // Persist locally
  const currentOrders = getLocalCustomOrders();
  const updatedOrders = [newOrder, ...currentOrders];
  saveLocalCustomOrders(updatedOrders);

  // Attempt Supabase insert if available
  try {
    await supabase.from('custom_orders').insert(newOrder);
  } catch {
    // ignore
  }

  return newOrder;
}

export async function createOrder(orderData: Partial<Order>): Promise<Order> {
  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    order_number: orderData.order_number || generateOrderNumber('CT'),
    user_id: orderData.user_id ?? null,
    customer_name: orderData.customer_name || 'Valued Customer',
    customer_email: orderData.customer_email || 'client@craftingtufting.com',
    customer_phone: orderData.customer_phone || '',
    country: orderData.country || 'International',
    address: orderData.address || '',
    city: orderData.city || '',
    postal_code: orderData.postal_code || '',
    items: orderData.items || [],
    subtotal: orderData.subtotal || 0,
    total: orderData.total || 0,
    advance_paid: orderData.advance_paid || 0,
    remaining: orderData.remaining || 0,
    is_advance_payment: orderData.is_advance_payment ?? false,
    payment_method: orderData.payment_method || 'Credit Card',
    payment_status: 'Confirmed',
    status: 'Order Created',
    tracking_number: `CT-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
    created_at: new Date().toISOString(),
  };

  const current = getLocalStandardOrders();
  saveLocalStandardOrders([newOrder, ...current]);

  try {
    await supabase.from('orders').insert(newOrder);
  } catch {
    // ignore
  }

  return newOrder;
}

export async function fetchAllCustomOrders(): Promise<CustomOrder[]> {
  try {
    const { data, error } = await supabase
      .from('custom_orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data && data.length > 0) return data;
  } catch {
    // fallback
  }
  return getLocalCustomOrders();
}

export async function fetchAllOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data && data.length > 0) return data;
  } catch {
    // fallback
  }
  return getLocalStandardOrders();
}

export async function updateCustomOrderStatus(
  orderId: string,
  productionStatus: OrderTrackingStatus
) {
  const localOrders = getLocalCustomOrders();
  const updated = localOrders.map((o) =>
    o.id === orderId || o.order_number === orderId
      ? { ...o, production_status: productionStatus }
      : o
  );
  saveLocalCustomOrders(updated);

  try {
    await supabase
      .from('custom_orders')
      .update({ production_status: productionStatus })
      .or(`id.eq.${orderId},order_number.eq.${orderId}`);
  } catch {
    // ignore
  }
}

export async function findOrderByTrackingCode(
  code: string
): Promise<{ customOrder?: CustomOrder; standardOrder?: Order } | null> {
  const cleanCode = code.trim().toUpperCase();

  const customOrders = getLocalCustomOrders();
  const matchedCustom = customOrders.find(
    (o) =>
      o.order_number.toUpperCase() === cleanCode ||
      (o.tracking_number && o.tracking_number.toUpperCase() === cleanCode)
  );

  if (matchedCustom) {
    return { customOrder: matchedCustom };
  }

  const standardOrders = getLocalStandardOrders();
  const matchedStandard = standardOrders.find(
    (o) =>
      o.order_number.toUpperCase() === cleanCode ||
      (o.tracking_number && o.tracking_number.toUpperCase() === cleanCode)
  );

  if (matchedStandard) {
    return { standardOrder: matchedStandard };
  }

  return null;
}