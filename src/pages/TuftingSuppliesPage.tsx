import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ShoppingCart,
  Star,
  ShieldCheck,
  Check,
  Eye,
  Sparkles,
  Search,
  Package,
  SlidersHorizontal,
} from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { TUFTING_CATEGORIES } from '@/components/home/TuftingEssentialsSection';
import QuickViewModal from '@/components/QuickViewModal';
import type { Product } from '@/lib/types';

interface SupplyProduct {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  priceUSD: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  badge?: string;
  description: string;
  inStock: boolean;
  bulkDiscountEligible?: boolean;
  specs: string[];
}

const SUPPLIES_CATALOG: SupplyProduct[] = [
  // Tufting Guns
  {
    id: 'gun-ak1-duo',
    name: 'AK-I Pro Duo Tufting Gun (Cut & Loop Pile)',
    category: 'Tufting guns',
    categorySlug: 'guns',
    priceUSD: 249,
    rating: 4.9,
    reviewsCount: 842,
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    badge: '2-Year Warranty',
    description: 'The industry-standard dual cut & loop pile machine. Japanese ball bearings, speed dial (5-45 stitches/sec), and 2-year warranty.',
    inStock: true,
    specs: ['Pile height: 7-19mm adjustable', 'Speed: 5-45 stitches/sec', 'Input voltage: 100-240V global adapter', 'Weight: 1.4kg ergonomic balance'],
  },
  {
    id: 'gun-pneumatic-hd',
    name: 'Pneumatic Industrial High-Pile Tufting Gun',
    category: 'Tufting guns',
    categorySlug: 'guns',
    priceUSD: 395,
    rating: 5.0,
    reviewsCount: 118,
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    badge: 'Pro Workshop',
    description: 'Air-powered industrial tufting machine for extra-deep 20-50mm luxury piles and commercial production studios.',
    inStock: true,
    specs: ['Requires 6-8 bar air compressor', 'Pile depth: 20-50mm', 'Continuous 12-hour duty cycle'],
  },

  // Tufting Yarn (Wool of New Zealand)
  {
    id: 'yarn-nz-wool-cone-forest',
    name: '100% New Zealand Wool Cone — Emerald Cypress (500g)',
    category: 'Tufting Yarn (Wool of New Zealand)',
    categorySlug: 'yarn',
    priceUSD: 24,
    rating: 4.9,
    reviewsCount: 654,
    imageUrl: 'https://images.pexels.com/photos/6850444/pexels-photo-6850444.jpeg?auto=compress&cs=tinysrgb&w=800',
    badge: 'Bulk Eligible',
    description: 'Pure spun virgin New Zealand fleece dyed with certified eco-friendly azo-free Swiss pigments. Perfect lanolin twist and zero tangling.',
    inStock: true,
    bulkDiscountEligible: true,
    specs: ['100% Virgin New Zealand Wool', '500g cone (~450 meters)', 'Count: 2/60s triple ply', 'Lanolin-conditioned for tufting needles'],
  },
  {
    id: 'yarn-nz-wool-cone-terracotta',
    name: '100% New Zealand Wool Cone — Bengal Terracotta (500g)',
    category: 'Tufting Yarn (Wool of New Zealand)',
    categorySlug: 'yarn',
    priceUSD: 24,
    rating: 4.8,
    reviewsCount: 420,
    imageUrl: 'https://images.pexels.com/photos/6850445/pexels-photo-6850445.jpeg?auto=compress&cs=tinysrgb&w=800',
    badge: 'Bulk Eligible',
    description: 'Deep warm ochre-terracotta spun fleece. Unmatched springiness and cloud-cushion density.',
    inStock: true,
    bulkDiscountEligible: true,
    specs: ['500g cone', 'Azo-free dyed', 'High abrasion resistance'],
  },
  {
    id: 'yarn-nz-wool-cone-linen',
    name: '100% New Zealand Wool Cone — Raw Linen Ecru (500g)',
    category: 'Tufting Yarn (Wool of New Zealand)',
    categorySlug: 'yarn',
    priceUSD: 24,
    rating: 5.0,
    reviewsCount: 712,
    imageUrl: 'https://images.pexels.com/photos/3771807/pexels-photo-3771807.jpeg?auto=compress&cs=tinysrgb&w=800',
    badge: 'Bestseller',
    description: 'Natural undyed virgin mountain fleece. Clean warm white for modern minimalist rugs and canvas framing.',
    inStock: true,
    bulkDiscountEligible: true,
    specs: ['500g cone', 'Natural undyed fiber', 'Hypoallergenic virgin lanolin'],
  },

  // Primary Backing Canvas
  {
    id: 'canvas-primary-monks-cloth',
    name: 'Premium Primary Tufting Cloth with Yellow Guide Lines (2m x 2m)',
    category: 'Primary Backing Canvas',
    categorySlug: 'canvas',
    priceUSD: 36,
    rating: 4.9,
    reviewsCount: 530,
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    badge: 'Woven Grid Lines',
    description: 'High-density woven polyester/cotton blend engineered with yellow reference lines every 50cm for perfect symmetry.',
    inStock: true,
    specs: ['Dimensions: 2m x 2m (4 sq m)', '60% Polyester, 40% Cotton', 'Tear-resistant edge selvage', 'Optimal grip on tufting needle'],
  },
  {
    id: 'canvas-primary-roll-10m',
    name: 'Master Studio Primary Monks Cloth Roll (2m x 10m)',
    category: 'Primary Backing Canvas',
    categorySlug: 'canvas',
    priceUSD: 145,
    rating: 5.0,
    reviewsCount: 194,
    imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80',
    badge: 'Studio Roll',
    description: '20 square meter bulk master bolt for active professional rug studios and large-scale carpet installations.',
    inStock: true,
    specs: ['2m width x 10m length continuous roll', 'Pre-marked alignment grid', 'Heavy-duty 260g/m² density'],
  },

  // Secondary Backing Canvas & Glue
  {
    id: 'backing-mesh-cotton-twill',
    name: 'Secondary Anti-Slip Cotton Backing Twill (2m x 2m)',
    category: 'Secondary Backing Canvas and Glue',
    categorySlug: 'backing',
    priceUSD: 28,
    rating: 4.8,
    reviewsCount: 312,
    imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
    description: 'Breathable grey woven cotton twill with microscopic rubberized traction dots to keep rugs firmly anchored on slick floors.',
    inStock: true,
    specs: ['2m x 2m sheet', 'Rubberized silicone micro-dots', 'Safe on hardwood & marble'],
  },
  {
    id: 'backing-latex-adhesive-5kg',
    name: 'Artisan Natural Botanical Latex Adhesive (5kg Bucket)',
    category: 'Secondary Backing Canvas and Glue',
    categorySlug: 'backing',
    priceUSD: 58,
    rating: 4.9,
    reviewsCount: 284,
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    badge: 'Low Odor',
    description: 'Water-based flexible natural latex glue. Locks tuft knots permanently with zero toxic fumes and flexible rebound.',
    inStock: true,
    specs: ['5kg hermetic bucket', 'Coverage: ~6-8 sq meters', 'Fast dry 24-hr cure', 'VOC-free eco formula'],
  },

  // Starter Kits
  {
    id: 'kit-complete-atelier',
    name: 'Complete Artisan Tufting Studio Starter Kit',
    category: 'Starter kits',
    categorySlug: 'starter-kits',
    priceUSD: 389,
    rating: 5.0,
    reviewsCount: 920,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    badge: 'Complete Studio',
    description: 'Everything you need to make your first 5 rugs: AK-I Pro Gun, 90x90cm Wood Frame, 8x New Zealand Wool Cones, Canvas & Trimmer.',
    inStock: true,
    specs: ['AK-I Pro Gun + 2-Yr Warranty', '90x90cm Hardwood Frame with Grippers', '8x 500g Wool Cones in assorted shades', '2x2m Monks Cloth + Trimmer'],
  },

  // Frames & Grippers
  {
    id: 'frame-hardwood-modular',
    name: 'Heavy-Duty Beechwood Tufting Frame with Gripper Strips (100x100cm)',
    category: 'Frames and grippers',
    categorySlug: 'frames',
    priceUSD: 110,
    rating: 4.9,
    reviewsCount: 385,
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    badge: 'Table Clamps Incl.',
    description: 'Solid European beechwood frame with pre-mounted stainless steel carpet gripper strips and heavy C-clamps for tabletop securing.',
    inStock: true,
    specs: ['100cm x 100cm inner working area', 'Pre-nailed stainless gripper teeth', 'Includes 2x heavy table clamps'],
  },

  // XXL Cones
  {
    id: 'xxl-cone-charcoal',
    name: 'XXL Jumbo Wool Cone — Midnight Charcoal (1.5kg)',
    category: 'XXL cones',
    categorySlug: 'xxl-cones',
    priceUSD: 62,
    rating: 4.9,
    reviewsCount: 178,
    imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
    badge: '1.5kg Giant Cone',
    description: 'Triple-weight 1,500g yarn cone designed for continuous non-stop tufting without re-threading or changing spools.',
    inStock: true,
    bulkDiscountEligible: true,
    specs: ['1,500g net weight (~1,350m)', 'Seamless feed from floor or cone stand', 'Zero knot breaks'],
  },

  // Shearing & Trimming
  {
    id: 'shearing-electric-trimmer',
    name: 'Speed-Adjustable Electric Rug Carving Shearer with Shearing Guide',
    category: 'Shearing, Trimming & Rug carving tools',
    categorySlug: 'shearing',
    priceUSD: 78,
    rating: 4.9,
    reviewsCount: 512,
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    badge: 'Includes Acrylic Base',
    description: '200W electric sheep shearing motor with clear acrylic shearing guide base to shave perfectly flat, velvety smooth surfaces.',
    inStock: true,
    specs: ['200W motor (2000-6000 RPM)', 'Clear acrylic leveling base', '2x titanium ceramic replacement blades', 'Lubricating oil & brush included'],
  },
  {
    id: 'shearing-duckbill-scissors',
    name: 'Artisan Forged Duckbill Rug Carving Scissors (7-inch)',
    category: 'Shearing, Trimming & Rug carving tools',
    categorySlug: 'shearing',
    priceUSD: 26,
    rating: 4.8,
    reviewsCount: 290,
    imageUrl: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=80',
    description: 'Hand-forged stainless steel scissors with paddle-shaped duckbill blade that rests flat against rug backing while trimming edges.',
    inStock: true,
    specs: ['German stainless steel', 'Ergonomic rubberized grip', 'Duckbill blade protects backing cloth'],
  },

  // Other Essential Tools
  {
    id: 'tool-yarn-threader-set',
    name: 'Flexible Steel Wire Yarn Threaders (Pack of 5) + Lubricant Oil',
    category: 'Other Essential tools',
    categorySlug: 'tools',
    priceUSD: 14,
    rating: 4.7,
    reviewsCount: 340,
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    description: 'Extra-long stainless steel threader loops and mechanical mineral oil formulated specifically for high-speed tufting gun gears.',
    inStock: true,
    specs: ['5x long-reach wire threaders', '1x 50ml mechanical oil dropper bottle', 'Hex keys for pile adjustments'],
  },

  // Outlet Sale
  {
    id: 'outlet-wool-cone-bundle',
    name: 'Studio Remnant Wool Cones Bundle (3x Assorted Shades)',
    category: 'Outlet sale',
    categorySlug: 'outlet',
    priceUSD: 39,
    rating: 4.8,
    reviewsCount: 95,
    imageUrl: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80',
    badge: '35% OFF',
    description: 'Surplus batch runs of pure New Zealand wool cones from custom order runs. Perfect for testing and accent details.',
    inStock: true,
    specs: ['3x 400g-500g assorted color cones', 'Full New Zealand wool quality', 'Final sale clearance'],
  },
];

export const TuftingSuppliesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategorySlug = searchParams.get('category') || 'all';

  const { formatPrice } = useCurrency();
  const { addItem } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const activeCategoryTitle = useMemo(() => {
    if (currentCategorySlug === 'all') return 'All Tufting Supplies & Essentials';
    const found = TUFTING_CATEGORIES.find((c) => c.queryParam === currentCategorySlug);
    return found ? found.title : 'Tufting Supplies';
  }, [currentCategorySlug]);

  const filteredProducts = useMemo(() => {
    return SUPPLIES_CATALOG.filter((item) => {
      // Category match
      if (currentCategorySlug !== 'all' && item.categorySlug !== currentCategorySlug) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceUSD - b.priceUSD;
      if (sortBy === 'price-desc') return b.priceUSD - a.priceUSD;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [currentCategorySlug, searchQuery, sortBy]);

  const handleAddToCart = (product: SupplyProduct) => {
    // Adapter to CartItem Product format
    const cartProduct: Product = {
      id: product.id,
      name: product.name,
      slug: product.id,
      category: 'TUFTING RUGS',
      subCategory: product.category,
      material: 'Professional Tufting Supplies',
      description: product.description,
      image_url: product.imageUrl,
      gallery: [product.imageUrl],
      base_price: product.priceUSD,
      stock_status: product.inStock ? 'In Stock' : 'Made to Order',
      care_info: 'Store in dry environment. Lubricate mechanical parts after 10 hours of tufting.',
      production_info: 'Quality-tested at Crafting & Tufting artisan workshop.',
      shipping_info: 'Dispatched within 24-48 hours via DHL Express Worldwide.',
      is_featured: true,
      sort_order: 1,
      created_at: new Date().toISOString(),
    };

    addItem(cartProduct, {
      id: `${product.id}-default`,
      product_id: product.id,
      label: 'Standard Pack',
      width_ft: 1,
      length_ft: 1,
      price: product.priceUSD,
    });

    setAddedToast(product.name);
    setTimeout(() => setAddedToast(null), 3500);
  };

  const handleOpenQuickView = (product: SupplyProduct) => {
    const p: Product = {
      id: product.id,
      name: product.name,
      slug: product.id,
      category: 'TUFTING RUGS',
      subCategory: product.category,
      material: 'Professional Tufting Supplies',
      description: product.description,
      image_url: product.imageUrl,
      gallery: [product.imageUrl],
      base_price: product.priceUSD,
      stock_status: product.inStock ? 'In Stock' : 'Made to Order',
      care_info: 'Store in dry environment. Lubricate mechanical parts after 10 hours of tufting.',
      production_info: 'Quality-tested at Crafting & Tufting artisan workshop.',
      shipping_info: 'Dispatched within 24-48 hours via DHL Express Worldwide.',
      is_featured: true,
      sort_order: 1,
      created_at: new Date().toISOString(),
    };
    setQuickViewProduct(p);
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* 1. TOP HERO BANNER: Bulk Deals on Premium Tufting Yarn */}
      <div className="relative bg-[#F9F7F3] border-b border-sand-200 overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px] lg:min-h-[420px] items-stretch">
            {/* Left Content Column */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center z-10">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.2em] uppercase text-accent mb-3">
                <Sparkles size={13} />
                Artisan Supply Depot
              </span>

              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-charcoal-900 font-bold leading-tight mb-5">
                Bulk Deals on Premium Tufting Yarn
              </h1>

              <ul className="space-y-2 mb-8 text-sm sm:text-base text-charcoal-700">
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-charcoal-900" />
                  <span className="font-medium">Buy 5+ yarns, 10% off</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-charcoal-900" />
                  <span className="font-medium">Buy 10+ yarns, 20% off</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-charcoal-900" />
                  <span className="font-medium">Buy 25+ yarns, 30% off</span>
                </li>
              </ul>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setSearchParams({ category: 'yarn' })}
                  className="inline-flex items-center gap-2.5 bg-[#2B2B28] hover:bg-black text-cream px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]"
                >
                  <ShoppingCart size={16} />
                  <span>Buy tufting Wool</span>
                </button>

                <div className="text-xs text-charcoal-500 font-mono">
                  Applied automatically at checkout
                </div>
              </div>
            </div>

            {/* Right Visual Column — Shelves with vibrant yarn cones */}
            <div className="lg:col-span-6 relative min-h-[260px] lg:min-h-full bg-sand-200 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                style={{
                  backgroundImage:
                    "url('https://images.pexels.com/photos/6850428/pexels-photo-6850428.jpeg?auto=compress&cs=tinysrgb&w=1200')",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#F9F7F3] via-transparent to-transparent lg:w-36" />
                <div className="absolute inset-0 bg-black/10" />
              </div>
            </div>
          </div>
        </div>

        {/* Sub-bar: 2-Year Warranty & Spare parts */}
        <div className="bg-[#EBF3EC] border-t border-b border-[#D4E4D7] py-2.5 px-4 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs sm:text-sm font-semibold text-[#255E31]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-[#255E31]" />
              2-Year Warranty on All Machines
            </span>
            <span className="hidden sm:inline text-sand-400">•</span>
            <span className="flex items-center gap-1.5">
              <Check size={16} className="text-[#255E31]" strokeWidth={3} />
              Spare parts always available
            </span>
            <span className="hidden sm:inline text-sand-400">•</span>
            <span className="flex items-center gap-1.5">
              <Check size={16} className="text-[#255E31]" strokeWidth={3} />
              Free Global Technical Support
            </span>
          </div>
        </div>
      </div>

      {/* 2. TRUST & SOCIAL PROOF STRIP */}
      <div className="bg-white border-b border-sand-200 py-6 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-sand-200">
          <div className="py-4 md:py-0 md:px-8 text-center flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-[#F4B400] mb-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="#F4B400" />
              ))}
            </div>
            <p className="font-bold text-sm text-charcoal-900 leading-tight">
              4.8/5 from 2,300+ reviews
            </p>
            <p className="text-xs text-charcoal-500 mt-0.5">Verified tufting artists & studios</p>
          </div>

          <div className="py-4 md:py-0 md:px-8 text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mb-1.5">
              <Package size={18} />
            </div>
            <p className="font-bold text-sm text-charcoal-900 leading-tight">
              Trusted by artists
            </p>
            <p className="text-xs text-charcoal-500 mt-0.5">Active in 40+ countries</p>
          </div>

          <div className="py-4 md:py-0 md:px-8 text-center flex flex-col items-center justify-center">
            <p className="font-bold text-sm text-charcoal-900 leading-tight">
              Secure checkout
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-sand-100 border border-sand-300 text-blue-900 rounded-xs">
                PayPal
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-pink-100 border border-pink-300 text-pink-900 rounded-xs">
                Klarna
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-xs">
                VISA
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xs">
                Mastercard
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TUFTING ESSENTIALS 12-CATEGORY SELECTOR */}
      <div className="bg-white border-b border-sand-200 py-10 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="font-display text-2xl sm:text-3xl text-charcoal-900 font-bold mb-2">
              Tufting Essentials for Every Artist
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-600">
              Explore our curated selection of tufting tools and materials. From professional-grade machines to luxurious yarns.
            </p>
          </div>

          {/* Category Chips Bar with 'All' + 12 Categories */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-3 scrollbar-thin">
            <button
              onClick={() => setSearchParams({})}
              className={`shrink-0 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all border ${
                currentCategorySlug === 'all'
                  ? 'bg-charcoal-900 text-cream border-charcoal-900'
                  : 'bg-sand-50 text-charcoal-700 border-sand-200 hover:border-sand-400'
              }`}
            >
              All Essentials
            </button>
            {TUFTING_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSearchParams({ category: cat.queryParam })}
                className={`shrink-0 px-4 py-2 text-xs font-semibold transition-all border flex items-center gap-2 ${
                  currentCategorySlug === cat.queryParam
                    ? 'bg-[#2E6B38] text-white border-[#2E6B38] shadow-xs'
                    : 'bg-sand-50 text-charcoal-700 border-sand-200 hover:border-sand-400 hover:bg-white'
                }`}
              >
                <span>{cat.title}</span>
                {cat.badge && (
                  <span className="text-[9px] px-1 py-0.2 bg-black/10 rounded-xs font-mono">
                    {cat.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. MAIN STORE CATALOG */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-sand-200">
          <div>
            <h3 className="font-display text-xl text-charcoal-900 font-bold">
              {activeCategoryTitle}
            </h3>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Showing {filteredProducts.length} certified workshop supplies
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools, yarn, cloth..."
                className="pl-9 pr-3 py-2 bg-white border border-sand-200 text-xs text-charcoal-800 focus:outline-hidden focus:border-charcoal-800 w-48 sm:w-64"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white border border-sand-200 px-3 py-1.5 text-xs">
              <SlidersHorizontal size={13} className="text-charcoal-500" />
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as 'featured' | 'price-asc' | 'price-desc' | 'rating'
                  )
                }
                className="bg-transparent text-charcoal-800 outline-hidden font-medium cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-sand-200 p-8">
            <Package size={40} className="mx-auto text-sand-400 mb-3" />
            <h4 className="font-display text-lg text-charcoal-900 font-bold mb-1">
              No matching tufting supplies found
            </h4>
            <p className="text-xs text-charcoal-500 mb-4">
              Try adjusting your search query or reset the category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchParams({});
              }}
              className="btn-primary !text-xs !py-2.5"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
            {filteredProducts.map((product) => {
              return (
                <div
                  key={product.id}
                  className="group bg-white border border-sand-200 hover:border-charcoal-900 transition-all duration-300 flex flex-col justify-between hover:shadow-md max-w-sm w-full mx-auto sm:mx-0"
                >
                  <div>
                    {/* Compact Standardized Image Area */}
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-sand-100 flex-shrink-0">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Badge */}
                      {product.badge && (
                        <div className="absolute top-2.5 left-2.5 bg-charcoal-900 text-cream text-[9px] uppercase tracking-wider font-bold px-2 py-0.5">
                          {product.badge}
                        </div>
                      )}

                      {/* Quick View Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenQuickView(product)}
                        className="absolute bottom-2.5 right-2.5 w-8 h-8 bg-white/90 hover:bg-white text-charcoal-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm"
                        title="Quick View"
                      >
                        <Eye size={15} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] uppercase tracking-wider text-accent font-semibold">
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold">
                          <Star size={12} fill="currentColor" />
                          <span>{product.rating}</span>
                          <span className="text-charcoal-400 font-normal">({product.reviewsCount})</span>
                        </div>
                      </div>

                      <h4 className="font-display font-bold text-sm text-charcoal-900 leading-snug line-clamp-2 mb-2 group-hover:text-accent transition-colors">
                        {product.name}
                      </h4>

                      <p className="text-[11px] text-charcoal-500 line-clamp-2 mb-3 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Specs micro-list */}
                      <div className="space-y-1 mb-4 pt-2 border-t border-sand-100">
                        {product.specs.slice(0, 2).map((spec, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[10px] text-charcoal-600">
                            <span className="w-1 h-1 rounded-full bg-emerald-700" />
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Price & Add to Cart footer */}
                  <div className="p-4 sm:p-5 pt-0 mt-auto border-t border-sand-100 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-charcoal-400 block font-mono">
                        Price
                      </span>
                      <span className="font-display font-bold text-base text-charcoal-900">
                        {formatPrice(product.priceUSD)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="inline-flex items-center gap-1.5 bg-charcoal-900 hover:bg-black text-cream px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 active:scale-95"
                    >
                      <ShoppingCart size={13} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Added Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-charcoal-900 text-cream px-5 py-3.5 shadow-2xl flex items-center gap-3 border border-sand-300 animate-slide-up">
          <Check size={16} className="text-emerald-400" strokeWidth={3} />
          <div className="text-xs">
            <span className="font-bold">Added to cart:</span> {addedToast}
          </div>
          <Link
            to="/cart"
            className="ml-2 text-xs text-accent font-semibold underline underline-offset-2 hover:text-white"
          >
            View Cart
          </Link>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};

export default TuftingSuppliesPage;
