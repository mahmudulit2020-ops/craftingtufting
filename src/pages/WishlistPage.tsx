import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();

  const handleMoveToCart = (product: typeof wishlistItems[0]) => {
    addItem({
      id: `${product.id}-wl`,
      type: 'product',
      productId: product.id,
      name: product.name,
      image: product.image_url,
      size: '4 × 6 ft',
      quantity: 1,
      price: product.base_price,
    });
    removeFromWishlist(product.id);
  };

  return (
    <div className="bg-cream min-h-screen py-12 lg:py-20">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-8 mb-10 border-b border-sand-200">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-accent font-medium mb-1">
              <Heart size={14} className="fill-accent text-accent" />
              <span>Personal Curation</span>
            </div>
            <h1 className="font-display text-3xl lg:text-4xl text-charcoal-900">
              My Saved Rugs & Crafts
            </h1>
          </div>

          {wishlistItems.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs tracking-[0.15em] uppercase text-charcoal-500 hover:text-red-600 transition-colors"
            >
              Clear All ({wishlistItems.length})
            </button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-24 bg-white/60 border border-sand-200 p-8 max-w-xl mx-auto">
            <Heart size={44} className="mx-auto text-sand-300 mb-4 stroke-1" />
            <h2 className="font-display text-2xl text-charcoal-900 mb-2">
              Your wishlist is currently empty
            </h2>
            <p className="text-xs text-charcoal-500 mb-8 max-w-sm mx-auto leading-relaxed">
              Explore our handmade tufted rugs, natural golden jute crafts, or create a custom bespoke piece for your room.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link to="/shop" className="btn-primary">
                Shop Rugs <ArrowRight size={15} />
              </Link>
              <Link to="/custom-rug" className="btn-secondary">
                Custom Rug Studio
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {wishlistItems.map((product) => (
              <div key={product.id} className="bg-white border border-sand-200 p-4 space-y-4">
                <Link to={`/product/${product.slug}`} className="block aspect-[4/5] overflow-hidden bg-sand-100 relative group">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFromWishlist(product.id);
                      }}
                      className="p-2 bg-white/90 text-charcoal-700 hover:text-red-600 transition-colors rounded-full"
                      aria-label="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </Link>

                <div className="space-y-1.5">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-accent">
                    {product.category}
                  </p>
                  <Link to={`/product/${product.slug}`}>
                    <h3 className="font-display text-lg text-charcoal-900 hover:text-accent transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-charcoal-500 line-clamp-1">{product.material}</p>
                  <p className="font-display text-lg font-semibold text-charcoal-900 pt-1">
                    {formatPrice(product.base_price)}
                  </p>
                </div>

                <div className="pt-2 border-t border-sand-100 flex gap-2">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="flex-1 btn-primary !py-2.5 !text-xs"
                  >
                    <ShoppingBag size={14} /> Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
