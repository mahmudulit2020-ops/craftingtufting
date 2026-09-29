import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, ArrowRight, Search } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Reveal from '@/components/Reveal';
import { fetchProducts } from '@/lib/api';
import type { Product } from '@/lib/types';

const MAIN_CATEGORIES = ['ALL', 'TUFTING RUGS', 'JUTE HANDCRAFT'];

const SUBCATEGORIES = [
  'All Styles',
  'Islamic Designs',
  'Abstract',
  'Logo Rugs',
  'Papos / Floor Rugs',
  'Traditional Bangladesh',
  'Geometric',
  'Floral',
  'Kids',
  'Modern',
  'Jute Baskets',
  'Jute Bags',
  'Wall Décor',
  'Mats',
  'Table Décor',
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const paramCategory = searchParams.get('category') || 'ALL';
  const paramSubCategory = searchParams.get('subCategory') || 'All Styles';
  const paramFilter = searchParams.get('filter') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>(paramCategory);
  const [subCategory, setSubCategory] = useState<string>(paramSubCategory);
  const [specialFilter, setSpecialFilter] = useState<string>(paramFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const c = searchParams.get('category');
    if (c) setCategory(c);
    const sc = searchParams.get('subCategory');
    if (sc) setSubCategory(sc);
    const f = searchParams.get('filter');
    if (f) setSpecialFilter(f);
  }, [searchParams]);

  const handleMainCategoryChange = (cat: string) => {
    setCategory(cat);
    setSubCategory('All Styles');
    const nextParams: Record<string, string> = {};
    if (cat !== 'ALL') nextParams.category = cat;
    setSearchParams(nextParams);
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter main category
    if (category !== 'ALL') {
      list = list.filter((p) => p.category.toUpperCase() === category.toUpperCase());
    }

    // Filter subcategory
    if (subCategory !== 'All Styles') {
      list = list.filter((p) => p.subCategory?.toLowerCase() === subCategory.toLowerCase());
    }

    // Filter special badges
    if (specialFilter === 'bestsellers') {
      list = list.filter((p) => p.is_best_seller);
    } else if (specialFilter === 'new') {
      list = list.filter((p) => p.is_new_arrival);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.base_price - b.base_price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.base_price - a.base_price);
    } else {
      list.sort((a, b) => a.sort_order - b.sort_order);
    }

    return list;
  }, [products, category, subCategory, specialFilter, searchQuery, sortBy]);

  return (
    <div className="bg-cream min-h-screen">
      {/* Editorial Header */}
      <div className="bg-charcoal-900 text-cream py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
          <p className="text-xs tracking-[0.3em] uppercase text-sand-300 mb-3">
            Handmade in Bangladesh · International Delivery
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-cream font-bold mb-4">
            {category === 'ALL'
              ? 'Complete Atelier Archive'
              : category === 'TUFTING RUGS'
              ? 'Hand-Tufted Wool Rugs'
              : 'Golden Fiber Jute Handicrafts'}
          </h1>
          <p className="text-cream/70 max-w-2xl text-sm sm:text-base leading-relaxed">
            Browse ready-to-ship artisan collections or select any piece as inspiration for a custom dimension measured precisely for your room.
          </p>
        </div>
      </div>

      {/* Main Filter & Products Section */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-10 lg:py-16">
        {/* Main Category Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-sand-200 mb-8">
          <div className="flex flex-wrap gap-2">
            {MAIN_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleMainCategoryChange(cat)}
                className={`px-5 py-2.5 text-xs tracking-[0.15em] uppercase transition-all ${
                  category === cat
                    ? 'bg-charcoal-900 text-cream font-semibold'
                    : 'bg-white border border-sand-200 text-charcoal-700 hover:border-sand-400'
                }`}
              >
                {cat === 'ALL' ? 'All Collections' : cat}
              </button>
            ))}

            <button
              onClick={() => {
                setSpecialFilter(specialFilter === 'bestsellers' ? '' : 'bestsellers');
              }}
              className={`px-4 py-2.5 text-xs tracking-[0.15em] uppercase transition-all ${
                specialFilter === 'bestsellers'
                  ? 'bg-terracotta text-cream font-semibold'
                  : 'bg-white border border-sand-200 text-charcoal-700 hover:border-sand-400'
              }`}
            >
              Best Sellers
            </button>

            <button
              onClick={() => {
                setSpecialFilter(specialFilter === 'new' ? '' : 'new');
              }}
              className={`px-4 py-2.5 text-xs tracking-[0.15em] uppercase transition-all ${
                specialFilter === 'new'
                  ? 'bg-accent text-cream font-semibold'
                  : 'bg-white border border-sand-200 text-charcoal-700 hover:border-sand-400'
              }`}
            >
              New Arrivals
            </button>
          </div>

          {/* Search Input in Bar */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by keyword..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-sand-200 text-xs text-charcoal-800 outline-none focus:border-accent"
              />
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-charcoal-500 hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-white border border-sand-200 px-3 py-2 text-xs tracking-[0.1em] uppercase text-charcoal-700 outline-none focus:border-accent"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Subcategory Pills Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-6 mb-8 scrollbar-none text-xs">
          <span className="text-[11px] uppercase tracking-wider text-charcoal-400 whitespace-nowrap mr-2">
            Style / Category:
          </span>
          {SUBCATEGORIES.map((sub) => (
            <button
              key={sub}
              onClick={() => setSubCategory(sub)}
              className={`px-3.5 py-1.5 whitespace-nowrap text-xs transition-colors rounded-sm ${
                subCategory === sub
                  ? 'bg-sand-300 text-charcoal-900 font-semibold'
                  : 'text-charcoal-600 hover:text-charcoal-950 bg-sand-100/60'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-sand-200 border-t-accent rounded-full animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-sand-200 p-8">
            <p className="font-display text-2xl text-charcoal-800 mb-2">
              No rugs found matching your filters
            </p>
            <p className="text-xs text-charcoal-500 mb-8 max-w-md mx-auto leading-relaxed">
              Looking for a custom size, colorway, or design? You can upload your own artwork in our bespoke studio.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setCategory('ALL');
                  setSubCategory('All Styles');
                  setSpecialFilter('');
                  setSearchQuery('');
                }}
                className="btn-secondary !text-xs !py-2.5"
              >
                Reset Filters
              </button>
              <Link to="/custom-rug" className="btn-primary !text-xs !py-2.5">
                Create Custom Rug <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {filteredProducts.map((product, i) => (
              <Reveal key={product.id} delay={i * 50}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}

        {/* Custom Rug Banner */}
        <div className="mt-20 bg-sand-100 border border-sand-200 p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-accent font-semibold mb-2">
              Bespoke Artisan Studio
            </p>
            <h2 className="font-display text-2xl lg:text-3xl text-charcoal-900 mb-2">
              Require exact measurements for your floor plan?
            </h2>
            <p className="text-xs text-charcoal-600 max-w-xl leading-relaxed">
              Configure width and length in inches, feet, cm, or meters. Pick 100% New Zealand Wool or Golden Jute, get dynamic pricing, and confirm with a 50% advance payment.
            </p>
          </div>
          <Link to="/custom-rug" className="btn-primary whitespace-nowrap">
            Launch Custom Studio <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
