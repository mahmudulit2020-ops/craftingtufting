import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Ruler } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/pricing';
import type { CartItem } from '@/lib/types';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, total, advance, remaining, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <ShoppingBag size={48} className="text-sand-300 mx-auto mb-6" />
        <h1 className="font-display text-3xl text-charcoal-900 mb-4">Your Cart Is Empty</h1>
        <p className="text-charcoal-500 mb-8">Discover our handcrafted collections or create a custom rug.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/shop" className="btn-secondary">Shop Ready-Made</Link>
          <Link to="/custom-rug" className="btn-primary">Create Custom Rug <ArrowRight size={16} /></Link>
        </div>
      </div>
    );
  }

  const renderCustomConfig = (item: CartItem) => {
    if (!item.customConfig) return null;
    const c = item.customConfig;
    const shapeLabel = c.shape.charAt(0).toUpperCase() + c.shape.slice(1);
    const sizeLabel = c.shape === 'circle' ? `Ø ${c.diameter} ${c.unit}` : c.shape === 'square' ? `${c.width} ${c.unit}` : `${c.width} × ${c.length} ${c.unit}`;
    return (
      <div className="text-xs text-charcoal-500 space-y-1 mt-2 pl-4 border-l border-sand-200">
        <p>Type: {c.rugType === 'tufting' ? 'Tufting Rug' : 'Jute Handcraft'}</p>
        <p>Shape: {shapeLabel}</p>
        <p>Measurements: {sizeLabel}</p>
        <p>Area: {c.areaSqft} sq ft</p>
        {c.designName && <p>Design: {c.designName}</p>}
        {c.addonCodes.length > 0 && <p>Add-ons: {c.addonCodes.length} selected</p>}
      </div>
    );
  };

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-12 lg:py-16">
        <h1 className="font-display text-display-md text-charcoal-900 mb-2">Shopping Cart</h1>
        <p className="text-charcoal-500 mb-10">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">
          {/* Items */}
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white border border-sand-100 p-4 lg:p-6 flex gap-4 lg:gap-6">
                {/* Image */}
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-sand-50 overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : item.type === 'custom' ? (
                    <div className="w-full h-full flex items-center justify-center text-accent">
                      <Ruler size={24} />
                    </div>
                  ) : null}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-[10px] tracking-[0.15em] uppercase text-accent mb-1">
                        {item.type === 'custom' ? 'Custom Rug' : 'Ready-Made'}
                      </p>
                      <h3 className="font-display text-lg lg:text-xl text-charcoal-900">{item.name}</h3>
                      {item.size && <p className="text-sm text-charcoal-500 mt-1">Size: {item.size}</p>}
                      {renderCustomConfig(item)}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-charcoal-300 hover:text-red-600 transition-colors flex-shrink-0"
                      aria-label="Remove"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex justify-between items-end mt-4">
                    {/* Quantity */}
                    {item.type === 'product' ? (
                      <div className="flex items-center border border-sand-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-2 text-charcoal-500 hover:text-charcoal-900 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-4 text-sm text-charcoal-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-2 text-charcoal-500 hover:text-charcoal-900 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-charcoal-400">Custom made — qty 1</span>
                    )}
                    <p className="font-display text-xl text-charcoal-900">
                      {formatCurrency(item.type === 'custom' ? item.customConfig?.totalPrice ?? 0 : item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-4">
              <button onClick={clearCart} className="text-sm text-charcoal-400 hover:text-red-600 transition-colors">
                Clear cart
              </button>
              <Link to="/shop" className="text-sm tracking-[0.15em] uppercase text-charcoal-600 hover:text-accent transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="bg-white border border-sand-100 p-6 lg:p-8">
              <h2 className="font-display text-2xl text-charcoal-900 mb-6">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-charcoal-500">Subtotal</span>
                  <span className="text-charcoal-800">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-500">Shipping</span>
                  <span className="text-green-700">Free</span>
                </div>
              </div>

              <div className="border-t border-sand-100 mt-4 pt-4 space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm tracking-[0.15em] uppercase text-charcoal-800">Total</span>
                  <span className="font-display text-2xl text-charcoal-900">{formatCurrency(total)}</span>
                </div>
                <div className="bg-sand-50 p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs tracking-[0.1em] uppercase text-accent">50% Advance</span>
                    <span className="text-sm font-semibold text-charcoal-900">{formatCurrency(advance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-charcoal-500">Remaining</span>
                    <span className="text-sm text-charcoal-700">{formatCurrency(remaining)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full mt-6"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
