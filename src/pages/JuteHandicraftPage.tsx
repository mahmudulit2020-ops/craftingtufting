import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, SlidersHorizontal, ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Reveal from '@/components/Reveal';
import { fetchProducts } from '@/lib/api';
import type { Product } from '@/lib/types';

const JUTE_CATEGORIES: string[] = [
  'ALL',
  'Jute Baskets',
  'Jute Bags',
  'Wall Décor',
  'Mats',
  'Home Décor',
  'Table Décor',
  'Traditional Crafts',
  'Storage Products',
];

export default function JuteHandicraftPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data.filter((p) => p.category === 'JUTE HANDCRAFT'));
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const list =
      selectedSubCategory === 'ALL'
        ? [...products]
        : products.filter(
            (p) => p.subCategory?.toLowerCase() === selectedSubCategory.toLowerCase()
          );

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.base_price - b.base_price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.base_price - a.base_price);
    } else {
      list.sort((a, b) => a.sort_order - b.sort_order);
    }

    return list;
  }, [products, selectedSubCategory, sortBy]);

  return (
    <div className="bg-cream min-h-screen">
      {/* Editorial Jute Banner */}
      <div className="relative bg-[#2A231C] text-cream overflow-hidden py-20 lg:py-28">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/36346077/pexels-photo-36346077.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1920)',
          }}
        />
        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-sand-300 mb-4">
              <Leaf size={14} className="text-sand-400" />
              <span>Natural · Handmade · Sustainable · Bangladeshi</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-cream font-bold leading-[1.1] mb-6">
              The Golden Fiber of Bengal
            </h1>

            <p className="text-cream/80 text-base lg:text-lg leading-relaxed max-w-2xl mb-8">
              From the silty riverbanks of the Meghna and Padma rivers comes the world’s finest organic jute. Hand-braided, coiled, and knotted by master rural artisans into enduring homeware.
            </p>

            {/* Ethos highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-cream/20 text-xs text-cream/90">
              <div>
                <span className="font-bold text-sand-200 block text-sm">100% Biodegradable</span>
                <span>Zero synthetic microplastics</span>
              </div>
              <div>
                <span className="font-bold text-sand-200 block text-sm">Fair Trade Co-ops</span>
                <span>Empowering rural women artisans</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-sand-200 block text-sm">Carbon-Negative</span>
                <span>1 hectare absorbs 15 tons of CO₂</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Shop Section */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-12 lg:py-16">
        {/* Subcategory interactive buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 mb-10 border-b border-sand-200">
          <div className="flex flex-wrap gap-2">
            {JUTE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedSubCategory(cat)}
                className={`px-4 py-2 text-xs tracking-[0.15em] uppercase transition-all ${
                  selectedSubCategory === cat
                    ? 'bg-charcoal-900 text-cream font-medium'
                    : 'bg-white border border-sand-200 text-charcoal-700 hover:border-sand-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <SlidersHorizontal size={15} className="text-charcoal-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-white border border-sand-200 px-3 py-2 text-xs tracking-[0.1em] uppercase text-charcoal-700 outline-none focus:border-accent"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-sand-200 border-t-accent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white border border-sand-200 p-8">
            <p className="font-display text-2xl text-charcoal-800 mb-3">
              No items in this subcategory currently
            </p>
            <p className="text-sm text-charcoal-500 mb-6">
              Our jute items are hand-braided in seasonal batches. Select "ALL" to browse the complete catalogue.
            </p>
            <button
              onClick={() => setSelectedSubCategory('ALL')}
              className="btn-primary !text-xs !py-2.5"
            >
              View All Jute Crafts
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {filtered.map((item, i) => (
              <Reveal key={item.id} delay={i * 60}>
                <ProductCard product={item} />
              </Reveal>
            ))}
          </div>
        )}

        {/* Custom Rug Callout */}
        <div className="mt-20 bg-sand-100/90 border border-sand-200 p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-accent font-semibold mb-2">
              Bespoke Dimension Jute Mats
            </p>
            <h3 className="font-display text-2xl lg:text-3xl text-charcoal-900 mb-2">
              Need a custom length runner or circular jute rug?
            </h3>
            <p className="text-sm text-charcoal-600 max-w-xl">
              We weave custom organic jute rugs to fit any corridor, sunroom, or terrace. Calculate instant dimensions and pay 50% advance to initiate loom setup.
            </p>
          </div>
          <Link to="/custom-rug" className="btn-primary whitespace-nowrap">
            Configure Custom Jute Rug <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
