import { useState, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '@/lib/api';
import type { Product } from '@/lib/types';
import { useCurrency } from '@/context/CurrencyContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { formatPrice } = useCurrency();
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchProducts().then(setAllProducts).catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? allProducts.filter((p) => {
        const text = `${p.name} ${p.category} ${p.subCategory || ''} ${p.material} ${p.description}`.toLowerCase();
        return text.includes(query.toLowerCase());
      })
    : allProducts.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-charcoal-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-cream w-full max-w-2xl border border-sand-300 shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 border-b border-sand-200 flex items-center gap-3">
          <Search size={20} className="text-charcoal-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search rugs, jute baskets, Islamic designs, wall décor..."
            className="flex-1 bg-transparent text-charcoal-900 placeholder:text-charcoal-400 outline-none text-base font-sans"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1.5 text-charcoal-400 hover:text-charcoal-800 transition-colors"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between text-xs tracking-[0.15em] uppercase text-charcoal-500 pb-2 border-b border-sand-100">
            <span>{query ? `Search Results (${filtered.length})` : 'Popular Atelier Creations'}</span>
            <Link
              to="/custom-rug"
              onClick={onClose}
              className="text-accent hover:underline flex items-center gap-1 font-medium"
            >
              Need a bespoke custom size? <ArrowRight size={12} />
            </Link>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-charcoal-700 font-display text-lg mb-2">No exact matches found</p>
              <p className="text-xs text-charcoal-500 mb-6">
                You can create any custom design or dimension in our bespoke studio.
              </p>
              <Link to="/custom-rug" onClick={onClose} className="btn-primary text-xs !py-2.5">
                Open Custom Studio
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-sand-100">
              {filtered.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 py-3 group hover:bg-sand-50 px-2 transition-colors"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 object-cover border border-sand-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] tracking-[0.15em] uppercase text-accent">
                      {item.category} {item.subCategory ? `· ${item.subCategory}` : ''}
                    </p>
                    <h4 className="font-display text-sm text-charcoal-900 group-hover:text-accent transition-colors truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-charcoal-500 truncate">{item.material}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-sm font-semibold text-charcoal-900">
                      {formatPrice(item.base_price)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
