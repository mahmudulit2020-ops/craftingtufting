import { Link } from 'react-router-dom';
import type { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/pricing';
import { Eye, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: `${product.id}-default`,
      type: 'product',
      productId: product.id,
      name: product.name,
      image: product.image_url,
      size: '5 × 7 ft',
      quantity: 1,
      price: product.base_price,
    });
  };

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden bg-sand-50 aspect-[4/5] mb-4">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/10 transition-colors duration-500" />

        {/* Quick view */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
          <div className="flex gap-2">
            <span className="flex-1 bg-cream/95 backdrop-blur-sm text-charcoal-800 text-xs tracking-[0.15em] uppercase py-3 flex items-center justify-center gap-2">
              <Eye size={14} /> Quick View
            </span>
            <button
              onClick={handleQuickAdd}
              className="bg-charcoal-800 text-cream px-4 py-3 hover:bg-charcoal-900 transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingBag size={14} />
            </button>
          </div>
        </div>

        {product.stock_status === 'Made to Order' && (
          <span className="absolute top-4 left-4 bg-cream/90 backdrop-blur-sm text-charcoal-800 text-[10px] tracking-[0.2em] uppercase px-3 py-1.5">
            Made to Order
          </span>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-[10px] tracking-[0.2em] uppercase text-accent">{product.category}</p>
        <h3 className="font-display text-xl text-charcoal-900 group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-charcoal-500">{product.material}</p>
        <p className="text-sm font-medium text-charcoal-800 pt-1">
          {formatCurrency(product.base_price)}
        </p>
      </div>
    </Link>
  );
}
