import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import Reveal from '@/components/Reveal';
import { fetchProducts } from '@/lib/api';
import type { Product } from '@/lib/types';

const categories = ['ALL', 'JUTE HANDCRAFT', 'TUFTING RUGS', 'READY-MADE', 'CUSTOM'];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'ALL';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'READY-MADE') return p.stock_status === 'In Stock';
    if (activeCategory === 'CUSTOM') return p.stock_status === 'Made to Order';
    return p.category === activeCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-low') return a.base_price - b.base_price;
    if (sortBy === 'price-high') return b.base_price - a.base_price;
    return a.sort_order - b.sort_order;
  });

  const setCategory = (cat: string) => {
    if (cat === 'ALL') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <div className="bg-sand-50 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 text-center">
          <p className="section-label mb-4">Collection</p>
          <h1 className="font-display text-display-lg text-charcoal-900 mb-4">Shop All Rugs</h1>
          <p className="text-charcoal-500 max-w-xl mx-auto">
            Explore our handcrafted jute and tufted rug collections, or create your own custom design.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-[65px] z-30 bg-cream/95 backdrop-blur-md border-b border-sand-100">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-1 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 text-xs tracking-[0.12em] uppercase whitespace-nowrap transition-colors ${
                  activeCategory === cat || (cat === 'ALL' && !searchParams.get('category'))
                    ? 'bg-charcoal-800 text-cream'
                    : 'text-charcoal-600 hover:text-accent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-charcoal-400">{sorted.length} products</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs text-charcoal-600 bg-transparent border border-sand-200 px-3 py-2 outline-none focus:border-accent cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-12 lg:py-16">
        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="w-8 h-8 border-2 border-sand-200 border-t-accent rounded-full animate-spin" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-charcoal-400 text-lg">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {sorted.map((product, i) => (
              <Reveal key={product.id} delay={(i % 4) * 80}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
