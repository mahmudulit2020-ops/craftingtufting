import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '@/lib/types';
import { Eye, ShoppingBag, Heart, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useLanguage } from '@/context/LanguageContext';
import QuickViewModal from './QuickViewModal';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [added, setAdded] = useState(false);

  const isFav = isWishlisted(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: `${product.id}-default`,
      type: 'product',
      productId: product.id,
      name: product.name,
      image: product.image_url,
      size: '4 × 6 ft',
      quantity: 1,
      price: product.base_price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleOpenQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  return (
    <>
      <div className="group block relative">
        <Link to={`/product/${product.slug}`} className="block">
          <div className="relative overflow-hidden bg-sand-100 aspect-[4/5] mb-4 border border-sand-200/60">
            <img
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/10 transition-colors duration-500" />

            {/* Wishlist button */}
            <button
              onClick={handleWishlistToggle}
              className={`absolute top-3 right-3 z-10 p-2.5 rounded-full transition-all duration-300 ${
                isFav
                  ? 'bg-terracotta text-cream shadow-md'
                  : 'bg-white/80 backdrop-blur-sm text-charcoal-700 hover:bg-white hover:text-charcoal-900'
              }`}
              aria-label={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
            </button>

            {/* Subtle editorial badges (unboxed text style) */}
            {product.is_best_seller && (
              <span className="absolute top-3 left-3 bg-charcoal-900/90 text-cream text-[9px] tracking-[0.2em] uppercase px-2.5 py-1">
                {t('bestSeller', 'Best Seller')}
              </span>
            )}
            {!product.is_best_seller && product.is_new_arrival && (
              <span className="absolute top-3 left-3 bg-sand-200/95 text-charcoal-800 text-[9px] tracking-[0.2em] uppercase px-2.5 py-1">
                {t('newArrival', 'New Arrival')}
              </span>
            )}

            {/* Quick view bar on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleOpenQuickView}
                  className="flex-1 bg-cream/95 backdrop-blur-sm hover:bg-white text-charcoal-800 text-[11px] tracking-[0.15em] uppercase py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors border border-sand-200"
                >
                  <Eye size={13} /> {t('quickView', 'Quick View')}
                </button>
                <button
                  type="button"
                  onClick={handleQuickAdd}
                  className={`px-3 py-2.5 text-cream transition-colors ${
                    added ? 'bg-emerald-700' : 'bg-charcoal-900 hover:bg-charcoal-800'
                  }`}
                  aria-label={t('addToBag', 'Add to Bag')}
                >
                  {added ? <Check size={14} /> : <ShoppingBag size={14} />}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-accent font-medium">
              <span>{product.category}</span>
              {product.subCategory && (
                <>
                  <span aria-hidden="true" className="text-sand-400">·</span>
                  <span className="text-charcoal-500">{product.subCategory}</span>
                </>
              )}
            </div>

            <h3 className="font-display text-lg text-charcoal-900 group-hover:text-accent transition-colors line-clamp-1">
              {product.name}
            </h3>

            <p className="text-xs text-charcoal-500 line-clamp-1">{product.material}</p>

            <div className="flex items-baseline justify-between pt-1">
              <span className="font-display text-base font-semibold text-charcoal-900">
                {formatPrice(product.base_price)}
              </span>
              <span className="text-[11px] text-charcoal-400 tracking-wider uppercase">
                {product.stock_status}
              </span>
            </div>
          </div>
        </Link>
      </div>

      {quickViewOpen && (
        <QuickViewModal
          product={product}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </>
  );
}
