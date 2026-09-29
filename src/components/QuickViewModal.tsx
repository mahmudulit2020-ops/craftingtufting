import { useState, useEffect } from 'react';
import { X, Heart, ShoppingBag, Check, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product, ProductSize } from '@/lib/types';
import { useCurrency } from '@/context/CurrencyContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { fetchProductSizes } from '@/lib/api';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { formatPrice } = useCurrency();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addItem } = useCart();

  const [sizes, setSizes] = useState<ProductSize[]>([]);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [added, setAdded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!product) return;
    setAdded(false);
    setActiveImageIndex(0);
    fetchProductSizes(product.id).then((data) => {
      setSizes(data);
      if (data.length > 0) setSelectedSize(data[0]);
    });
  }, [product]);

  if (!product) return null;

  const currentPrice = selectedSize ? selectedSize.price : product.base_price;
  const isFav = isWishlisted(product.id);

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedSize?.label || 'standard'}`,
      type: 'product',
      productId: product.id,
      name: product.name,
      image: product.image_url,
      size: selectedSize?.label || '4 × 6 ft',
      quantity: 1,
      price: currentPrice,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image_url];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-cream w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-sand-200 shadow-2xl relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-charcoal-600 hover:text-charcoal-900 transition-colors bg-cream/80 backdrop-blur-sm"
          aria-label="Close Quick View"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 lg:p-10">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-sand-100 overflow-hidden relative border border-sand-200">
              <img
                src={images[activeImageIndex] || product.image_url}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 p-2.5 rounded-full transition-colors ${
                  isFav
                    ? 'bg-terracotta text-cream'
                    : 'bg-white/80 text-charcoal-800 hover:bg-white'
                }`}
                aria-label="Wishlist"
              >
                <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
              </button>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-16 h-16 border transition-all overflow-hidden ${
                      activeImageIndex === i ? 'border-accent ring-1 ring-accent' : 'border-sand-200 opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-accent tracking-[0.2em] uppercase font-medium">
                <span>{product.category}</span>
                {product.subCategory && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{product.subCategory}</span>
                  </>
                )}
              </div>

              <h2 className="font-display text-2xl lg:text-3xl text-charcoal-900 leading-tight">
                {product.name}
              </h2>

              <p className="font-display text-2xl text-charcoal-900 font-semibold pt-1">
                {formatPrice(currentPrice)}
              </p>

              <p className="text-xs text-charcoal-600 leading-relaxed pt-2 border-t border-sand-200">
                {product.description}
              </p>

              <div className="pt-2 text-xs space-y-1.5 text-charcoal-600">
                <div>
                  <span className="font-medium text-charcoal-800">Material: </span>
                  {product.material}
                </div>
                <div>
                  <span className="font-medium text-charcoal-800">Production: </span>
                  {product.production_info}
                </div>
              </div>

              {/* Sizes Selection */}
              {sizes.length > 0 && (
                <div className="pt-4 border-t border-sand-200">
                  <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-700 font-medium mb-2.5">
                    Available Dimensions
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {sizes.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-2.5 text-xs text-left border transition-all ${
                          selectedSize?.id === s.id
                            ? 'border-charcoal-900 bg-charcoal-900 text-cream font-medium'
                            : 'border-sand-200 bg-white text-charcoal-700 hover:border-sand-400'
                        }`}
                      >
                        <div className="font-medium">{s.label}</div>
                        <div className={selectedSize?.id === s.id ? 'text-cream/80' : 'text-charcoal-500'}>
                          {formatPrice(s.price)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-sand-200">
              <button
                onClick={handleAddToCart}
                className="w-full btn-primary !py-4 flex items-center justify-center gap-2"
              >
                {added ? (
                  <>
                    <Check size={18} /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> Add to Cart — {formatPrice(currentPrice)}
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-charcoal-500 pt-2">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-accent" /> Authentic Bangladeshi Craft
                </span>
                <Link
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="text-accent hover:underline inline-flex items-center gap-1 font-medium"
                >
                  Full Details <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
