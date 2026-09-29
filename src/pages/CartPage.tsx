import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Ruler, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import type { CartItem } from '@/lib/types';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, advance, remaining, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <ShoppingBag size={48} className="text-sand-300 mx-auto mb-6 stroke-1" />
        <h1 className="font-display text-3xl text-charcoal-900 mb-4">Your Shopping Bag Is Empty</h1>
        <p className="text-xs text-charcoal-500 mb-8 max-w-sm mx-auto leading-relaxed">
          Discover our handcrafted tufted rugs, natural golden jute crafts, or configure a custom rug for your living room.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/shop" className="btn-secondary">Shop Ready-Made Collections</Link>
          <Link to="/custom-rug" className="btn-primary">
            Create Custom Rug <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  const renderCustomConfig = (item: CartItem) => {
    if (!item.customConfig) return null;
    const c = item.customConfig;
    const shapeLabel = c.shape.charAt(0).toUpperCase() + c.shape.slice(1);
    const sizeLabel =
      c.shape === 'circle'
        ? `Ø ${c.diameter} ${c.unit}`
        : c.shape === 'square'
        ? `${c.width} ${c.unit}`
        : `${c.width} × ${c.length} ${c.unit}`;

    return (
      <div className="text-[11px] text-charcoal-500 space-y-1 mt-2 pl-3 border-l-2 border-accent">
        <p>Type: {c.rugType === 'tufting' ? 'Hand-Tufted Wool Rug' : 'Organic Jute Craft'}</p>
        <p>Shape: {shapeLabel} ({sizeLabel}) · {c.areaSqft} sq ft</p>
        {c.yarnType && <p>Yarn: {c.yarnType}</p>}
        {c.designName && <p>Design: {c.designName}</p>}
      </div>
    );
  };

  return (
    <div className="bg-cream min-h-screen py-10 lg:py-16">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <h1 className="font-display text-3xl sm:text-4xl text-charcoal-900 mb-2">
          Your Shopping Bag
        </h1>
        <p className="text-xs text-charcoal-500 mb-10 tracking-wider uppercase">
          {items.length} Commission{items.length !== 1 ? 's' : ''} in your cart
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-sand-200 p-4 sm:p-6 flex gap-4 sm:gap-6 shadow-sm"
              >
                {/* Image */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-sand-100 overflow-hidden flex-shrink-0 border border-sand-200">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : item.type === 'custom' ? (
                    <div className="w-full h-full flex items-center justify-center text-accent">
                      <Ruler size={24} />
                    </div>
                  ) : null}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-accent font-semibold mb-0.5">
                        {item.type === 'custom' ? 'Bespoke Custom Rug' : 'Ready-Made Rug'}
                      </p>
                      <h3 className="font-display text-lg text-charcoal-900 line-clamp-1">
                        {item.name}
                      </h3>
                      {item.size && (
                        <p className="text-xs text-charcoal-500 mt-0.5">Dimensions: {item.size}</p>
                      )}
                      {renderCustomConfig(item)}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-charcoal-400 hover:text-red-600 transition-colors p-1"
                      aria-label="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex justify-between items-end mt-4 pt-3 border-t border-sand-100">
                    {/* Quantity controls */}
                    {item.type === 'product' ? (
                      <div className="flex items-center border border-sand-300 bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-charcoal-600 hover:text-charcoal-900"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 text-xs font-semibold text-charcoal-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-charcoal-600 hover:text-charcoal-900"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-charcoal-500">1 Bespoke Unit</span>
                    )}

                    <span className="font-display text-base font-semibold text-charcoal-900">
                      {formatPrice(
                        (item.type === 'custom'
                          ? item.customConfig?.totalPrice ?? item.price
                          : item.price) * item.quantity
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={clearCart}
                className="text-xs text-charcoal-400 hover:text-red-600 tracking-wider uppercase transition-colors"
              >
                Clear Entire Bag
              </button>
              <Link to="/shop" className="text-xs text-accent hover:underline font-medium">
                Continue Shopping Collections
              </Link>
            </div>
          </div>

          {/* Right Column: 50% Advance Breakdown & Checkout */}
          <div className="lg:col-span-4 bg-white border border-sand-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="font-display text-xl text-charcoal-900 pb-3 border-b border-sand-200">
              Payment Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-charcoal-500">Total Order Value:</span>
                <span className="font-medium text-charcoal-900">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-500">Insured International Freight:</span>
                <span className="font-medium text-emerald-700">Complimentary</span>
              </div>
            </div>

            {/* Advance Deposit Section */}
            <div className="bg-sand-100 p-4 border border-sand-200 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-wider font-bold text-terracotta">
                  50% Advance Deposit Due:
                </span>
                <span className="font-display text-2xl font-bold text-terracotta">
                  {formatPrice(advance)}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-charcoal-500 pt-1 border-t border-sand-200">
                <span>Remaining 50% Balance:</span>
                <span className="font-medium text-charcoal-700">{formatPrice(remaining)}</span>
              </div>
              <p className="text-[10px] text-charcoal-400 pt-1">
                Advance confirms artisan loom weaving. Balance is billed prior to international delivery.
              </p>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full btn-primary !py-4 text-xs tracking-[0.2em] uppercase font-bold"
            >
              Proceed to Checkout <ArrowRight size={15} />
            </button>

            <div className="pt-2 flex items-center justify-center gap-2 text-xs text-charcoal-500">
              <ShieldCheck size={14} className="text-accent" />
              <span>Insured International Courier Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
