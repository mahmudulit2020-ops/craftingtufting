import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Shield } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/pricing';
import { createOrder, generateOrderNumber } from '@/lib/api';

export default function CheckoutPage() {
  const { items, subtotal, total, advance, remaining, clearCart } = useCart();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const [form, setForm] = useState({
    customer_name: user?.user_metadata?.full_name || '',
    customer_email: user?.email || '',
    customer_phone: '',
    country: 'Bangladesh',
    address: '',
    city: '',
    postal_code: '',
    payment_method: 'bKash',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const orderNumber = generateOrderNumber('RM');
      await createOrder({
        order_number: orderNumber,
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        customer_phone: form.customer_phone,
        country: form.country,
        address: form.address,
        city: form.city,
        postal_code: form.postal_code,
        items: items.map((i) => ({
          name: i.name,
          size: i.size,
          quantity: i.quantity,
          price: i.price,
          type: i.type,
        })),
        subtotal,
        total,
        advance_paid: advance,
        remaining,
        payment_method: form.payment_method,
      });
      setConfirmed(orderNumber);
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      alert('There was an error placing your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 lg:py-32 text-center">
        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-accent/10 flex items-center justify-center animate-scale-in">
          <Check size={36} className="text-accent" />
        </div>
        <h1 className="font-display text-display-md text-charcoal-900 mb-4">Order Confirmed</h1>
        <p className="text-charcoal-500 mb-8">Thank you for your order. We'll be in touch shortly.</p>
        <div className="bg-white border border-sand-100 p-8 mb-8 inline-block">
          <p className="text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-1">Order ID</p>
          <p className="font-display text-3xl text-charcoal-900">{confirmed}</p>
        </div>
        <div>
          <Link to="/shop" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <h1 className="font-display text-3xl text-charcoal-900 mb-4">Your Cart Is Empty</h1>
        <Link to="/shop" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  const inputCls = "input-field";
  const labelCls = "block text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-2";

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-12 lg:py-16">
        <Link to="/cart" className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-charcoal-500 hover:text-accent transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Cart
        </Link>

        <h1 className="font-display text-display-md text-charcoal-900 mb-10">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">
          {/* Form */}
          <div className="space-y-8">
            {/* Customer info */}
            <div className="bg-white border border-sand-100 p-6 lg:p-8">
              <h2 className="font-display text-xl text-charcoal-900 mb-6">Customer Information</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>Full Name *</label>
                  <input required type="text" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Phone *</label>
                  <input required type="tel" value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Email *</label>
                  <input required type="email" value={form.customer_email} onChange={(e) => setForm({ ...form, customer_email: e.target.value })} className={inputCls} />
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white border border-sand-100 p-6 lg:p-8">
              <h2 className="font-display text-xl text-charcoal-900 mb-6">Shipping Address</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Country *</label>
                  <select required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={inputCls}>
                    <option>Bangladesh</option>
                    <option>India</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Germany</option>
                    <option>Australia</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Address *</label>
                  <input required type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>City *</label>
                  <input required type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Postal Code</label>
                  <input type="text" value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} className={inputCls} />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white border border-sand-100 p-6 lg:p-8">
              <h2 className="font-display text-xl text-charcoal-900 mb-2">50% Advance Payment</h2>
              <p className="text-sm text-charcoal-500 mb-6">Your order is confirmed after payment of 50% of the total order value.</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                {['bKash', 'Nagad', 'Bank Transfer', 'Card'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setForm({ ...form, payment_method: method })}
                    className={`p-3 text-sm transition-colors ${form.payment_method === method ? 'bg-charcoal-800 text-cream' : 'bg-cream border border-sand-200 text-charcoal-700 hover:border-sand-400'}`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              <div className="bg-sand-50 p-5 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-600">Total Order Value</span>
                  <span className="text-charcoal-900 font-medium">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-accent font-medium">50% Advance</span>
                  <span className="text-charcoal-900 font-semibold">{formatCurrency(advance)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-500">Remaining Balance</span>
                  <span className="text-charcoal-700">{formatCurrency(remaining)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="bg-white border border-sand-100 p-6 lg:p-8">
              <h2 className="font-display text-xl text-charcoal-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-14 h-14 bg-sand-50 overflow-hidden flex-shrink-0">
                      {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="text-charcoal-800 font-medium">{item.name}</p>
                      <p className="text-xs text-charcoal-400">{item.size} {item.type === 'product' && `× ${item.quantity}`}</p>
                    </div>
                    <p className="text-sm text-charcoal-800 font-medium">
                      {formatCurrency(item.type === 'custom' ? item.customConfig?.totalPrice ?? 0 : item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-sand-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-charcoal-500">Subtotal</span>
                  <span className="text-charcoal-800">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-500">Shipping</span>
                  <span className="text-green-700">Free</span>
                </div>
              </div>

              <div className="border-t border-sand-100 mt-4 pt-4">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm tracking-[0.15em] uppercase text-charcoal-800">Total</span>
                  <span className="font-display text-2xl text-charcoal-900">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-accent font-medium">50% Advance</span>
                  <span className="text-charcoal-900 font-semibold">{formatCurrency(advance)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full mt-6 disabled:opacity-50"
              >
                {submitting ? 'Processing...' : `Pay ${formatCurrency(advance)} Advance`}
              </button>

              <p className="flex items-center justify-center gap-2 text-xs text-charcoal-400 mt-4">
                <Shield size={14} /> Secure checkout
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}