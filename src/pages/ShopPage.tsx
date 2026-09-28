import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Reveal from '@/components/Reveal';
import { fetchProducts } from '@/lib/api';
import type { Product } from '@/lib/types';

const CATEGORIES = ['ALL', 'JUTE HANDCRAFT', 'TUFTING RUGS'];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || 'ALL';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(
    CATEGORIES.includes(initialCat) ? initialCat : 'ALL'
  );
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  useEffect(() => {
    const paramCat = searchParams.get('category');
    if (paramCat && CATEGORIES.includes(paramCat)) {
      setCategory(paramCat);
    } else if (!paramCat) {
      setCategory('ALL');
    }
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetchProducts()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    if (cat === 'ALL') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  const filteredProducts = useMemo(() => {
    const list =
      category === 'ALL'
        ? [...products]
        : products.filter((p) => p.category.toUpperCase() === category);

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.base_price - b.base_price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.base_price - a.base_price);
    } else {
      list.sort((a, b) => a.sort_order - b.sort_order);
    }
    return list;
  }, [products, category, sortBy]);

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <div className="bg-charcoal-900 text-cream py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
          <p className="text-xs tracking-[0.3em] uppercase text-sand-300 mb-3">
            Our Collection
          </p>
          <h1 className="font-display text-display-md mb-4">
            {category === 'ALL'
              ? 'Handcrafted Rugs'
              : category === 'JUTE HANDCRAFT'
              ? 'Jute Handcraft Collection'
              : 'Tufting Rugs Collection'}
          </h1>
          <p className="text-cream/60 max-w-2xl">
            Every piece is handcrafted by skilled artisans in Bangladesh using natural jute fibers and premium wool yarn.
          </p>
        </div>
      </div>

      {/* Filters & Grid */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-12 lg:py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-8 mb-10 border-b border-sand-200">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-5 py-2.5 text-xs tracking-[0.15em] uppercase transition-colors ${
                  category === cat
                    ? 'bg-charcoal-800 text-cream'
                    : 'bg-white border border-sand-200 text-charcoal-700 hover:border-sand-400'
                }`}
              >
                {cat === 'ALL' ? 'All Rugs' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <SlidersHorizontal size={16} className="text-charcoal-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-white border border-sand-200 px-4 py-2.5 text-xs tracking-[0.1em] uppercase text-charcoal-700 outline-none focus:border-accent"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-sand-200 border-t-accent rounded-full animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-charcoal-800 mb-3">
              No rugs found in this category
            </p>
            <p className="text-sm text-charcoal-500 mb-8">
              Try viewing all collections or design a custom piece tailored to your space.
            </p>
            <Link to="/custom-rug" className="btn-primary">
              Create Custom Rug <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {filteredProducts.map((product, i) => (
              <Reveal key={product.id} delay={i * 60}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}

        {/* Custom Rug Banner */}
        <div className="mt-20 bg-sand-100 p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <p className="section-label mb-2">Bespoke Studio</p>
            <h2 className="font-display text-3xl text-charcoal-900 mb-2">
              Looking for a specific size or custom artwork?
            </h2>
            <p className="text-sm text-charcoal-600 max-w-xl">
              Use our interactive Custom Rug Studio to enter exact dimensions, upload your own artwork, and get an instant price estimate.
            </p>
          </div>
          <Link to="/custom-rug" className="btn-primary whitespace-nowrap">
            Design Custom Rug <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
