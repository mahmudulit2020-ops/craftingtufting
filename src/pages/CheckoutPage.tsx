import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Lock,
  CheckCircle2,
  Printer,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import { createOrder, generateOrderNumber } from '@/lib/api';

export default function CheckoutPage() {
  const { items, subtotal, total, advance, remaining, clearCart } = useCart();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();

  const [paymentChoice, setPaymentChoice] = useState<'advance' | 'full'>('advance');
  const [paymentProvider, setPaymentProvider] = useState<'card' | 'paypal' | 'wire' | 'bkash'>('card');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string | null>(null);

  // Form details
  const [form, setForm] = useState({
    customer_name: user?.user_metadata?.full_name || '',
    customer_email: user?.email || '',
    customer_phone: '',
    country: 'United States',
    address: '',
    city: '',
    postal_code: '',
  });

  // Mock card inputs
  const [cardDetails, setCardDetails] = useState({
    number: '•••• •••• •••• 4242',
    expiry: '12/28',
    cvc: '888',
  });

  const payAmountNow = paymentChoice === 'advance' ? advance : total;
  const balanceRemaining = paymentChoice === 'advance' ? remaining : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const orderNumber = generateOrderNumber('CT');

      await createOrder({
        order_number: orderNumber,
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        customer_phone: form.customer_phone,
        country: form.country,
        address: form.address,
        city: form.city,
        postal_code: form.postal_code,
        items,
        subtotal,
        total,
        advance_paid: payAmountNow,
        remaining: balanceRemaining,
        is_advance_payment: paymentChoice === 'advance',
        payment_method:
          paymentProvider === 'card'
            ? 'Stripe Credit Card'
            : paymentProvider === 'paypal'
            ? 'PayPal Express'
            : paymentProvider === 'wire'
            ? 'SWIFT Bank Wire'
            : 'bKash / Nagad Mobile',
      });

      setConfirmedOrderNumber(orderNumber);
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmedOrderNumber) {
    return (
      <div className="bg-cream min-h-screen py-16 lg:py-24">
        <div className="max-w-2xl mx-auto px-6 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-sand-200 text-terracotta flex items-center justify-center">
            <CheckCircle2 size={36} />
          </div>

          <p className="text-xs tracking-[0.25em] uppercase text-accent font-semibold">
            {paymentChoice === 'advance' ? '50% Advance Deposit Confirmed' : 'Full Payment Received'}
          </p>

          <h1 className="font-display text-3xl sm:text-4xl text-charcoal-900">
            Thank You for Your Artisan Commission
          </h1>

          <div className="bg-white border border-sand-200 p-8 text-left shadow-sm space-y-4">
            <div className="flex justify-between items-baseline pb-3 border-b border-sand-200">
              <span className="text-xs tracking-wider uppercase text-charcoal-500">Order ID</span>
              <span className="font-mono text-lg font-bold text-charcoal-900">
                {confirmedOrderNumber}
              </span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-charcoal-500">Amount Paid Today:</span>
              <span className="font-bold text-emerald-700 text-sm">
                {formatPrice(payAmountNow)}
              </span>
            </div>

            {paymentChoice === 'advance' && (
              <div className="flex justify-between text-xs">
                <span className="text-charcoal-500">Remaining Balance (due at courier dispatch):</span>
                <span className="font-semibold text-charcoal-800">
                  {formatPrice(balanceRemaining)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-xs pt-2 border-t border-sand-100">
              <span className="text-charcoal-500">Shipping To:</span>
              <span className="font-medium text-charcoal-900">
                {form.customer_name}, {form.city}, {form.country}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
            <Link
              to={`/track-order?code=${confirmedOrderNumber}`}
              className="btn-primary"
            >
              Track Live Production Timeline <ArrowRight size={15} />
            </Link>
            <button
              onClick={() => window.print()}
              className="btn-secondary !text-xs"
            >
              <Printer size={14} /> Print Receipt
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <h1 className="font-display text-3xl text-charcoal-900 mb-4">Your Cart Is Empty</h1>
        <p className="text-xs text-charcoal-500 mb-6">Explore our handcrafted tufted rugs or create a bespoke piece.</p>
        <Link to="/shop" className="btn-primary">Browse Collections</Link>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-10 lg:py-16">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-charcoal-500 hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to Bag
        </Link>

        <h1 className="font-display text-3xl sm:text-4xl text-charcoal-900 mb-10">
          International Checkout
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Customer Info & Payment */}
          <div className="lg:col-span-7 space-y-8">
            {/* Payment Model Choice: 50% Advance vs 100% Full */}
            <div className="bg-white border border-sand-200 p-6 shadow-sm space-y-4">
              <h2 className="font-display text-xl text-charcoal-900">
                Payment Schedule
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentChoice('advance')}
                  className={`p-4 text-left border transition-all ${
                    paymentChoice === 'advance'
                      ? 'border-charcoal-900 bg-sand-50 ring-1 ring-charcoal-900'
                      : 'border-sand-200 hover:border-sand-400'
                  }`}
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-xs uppercase tracking-wider text-charcoal-900">
                      50% Advance Deposit
                    </span>
                    <span className="text-terracotta font-bold text-sm">
                      {formatPrice(advance)}
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal-500 leading-relaxed">
                    Pay 50% now to initiate artisan loom weaving. Balance ({formatPrice(remaining)}) billed prior to dispatch.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentChoice('full')}
                  className={`p-4 text-left border transition-all ${
                    paymentChoice === 'full'
                      ? 'border-charcoal-900 bg-sand-50 ring-1 ring-charcoal-900'
                      : 'border-sand-200 hover:border-sand-400'
                  }`}
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-xs uppercase tracking-wider text-charcoal-900">
                      Full Payment
                    </span>
                    <span className="font-bold text-charcoal-900 text-sm">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal-500 leading-relaxed">
                    Pay 100% upfront for expedited production scheduling and zero balance due later.
                  </p>
                </button>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white border border-sand-200 p-6 sm:p-8 shadow-sm space-y-5">
              <h2 className="font-display text-xl text-charcoal-900">
                Customer & International Delivery
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-charcoal-600 mb-1">
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.customer_name}
                    onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                    className="input-field !py-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-charcoal-600 mb-1">
                    Phone / Mobile *
                  </label>
                  <input
                    required
                    type="tel"
                    value={form.customer_phone}
                    onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                    className="input-field !py-2.5 text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-charcoal-600 mb-1">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    value={form.customer_email}
                    onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                    className="input-field !py-2.5 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-charcoal-600 mb-1">
                    Country *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="input-field !py-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-charcoal-600 mb-1">
                    City *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="input-field !py-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-charcoal-600 mb-1">
                    Street Address *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="input-field !py-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-charcoal-600 mb-1">
                    Postal / Zip Code
                  </label>
                  <input
                    type="text"
                    value={form.postal_code}
                    onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
                    className="input-field !py-2.5 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Providers */}
            <div className="bg-white border border-sand-200 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex justify-between items-center">
                <h2 className="font-display text-xl text-charcoal-900">
                  Payment Method
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-charcoal-500">
                  <Lock size={13} className="text-emerald-700" />
                  <span>256-Bit SSL Encrypted</span>
                </div>
              </div>

              {/* Tabs for payment providers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'card' as const, label: 'Credit Card (Stripe)' },
                  { id: 'paypal' as const, label: 'PayPal' },
                  { id: 'wire' as const, label: 'SWIFT Wire' },
                  { id: 'bkash' as const, label: 'bKash / Nagad' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPaymentProvider(p.id)}
                    className={`p-3 text-xs text-center border transition-all ${
                      paymentProvider === p.id
                        ? 'border-charcoal-900 bg-charcoal-900 text-cream font-medium'
                        : 'border-sand-200 bg-white text-charcoal-700 hover:border-sand-400'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Card Inputs */}
              {paymentProvider === 'card' && (
                <div className="p-4 bg-sand-50 border border-sand-200 space-y-3 animate-fade-in text-xs">
                  <div>
                    <label className="block text-charcoal-600 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="input-field !py-2 text-xs font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-charcoal-600 mb-1">Expires (MM/YY)</label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="input-field !py-2 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-charcoal-600 mb-1">CVC Security Code</label>
                      <input
                        type="text"
                        value={cardDetails.cvc}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                        className="input-field !py-2 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentProvider === 'paypal' && (
                <div className="p-5 bg-sand-50 border border-sand-200 text-xs text-charcoal-600 animate-fade-in">
                  You will be directed to PayPal’s secure authorization screen to complete your advance payment of {formatPrice(payAmountNow)}.
                </div>
              )}

              {paymentProvider === 'wire' && (
                <div className="p-5 bg-sand-50 border border-sand-200 text-xs text-charcoal-600 space-y-1.5 font-mono animate-fade-in">
                  <p className="font-bold text-charcoal-900">SWIFT / International IBAN Details:</p>
                  <p>Bank: Standard Chartered Bank, Dhaka Branch</p>
                  <p>Account: Crafting & Tufting Atelier Ltd</p>
                  <p>IBAN: BD12SCBL0000019284759</p>
                  <p>SWIFT Code: SCBLBDDX</p>
                </div>
              )}

              {paymentProvider === 'bkash' && (
                <div className="p-5 bg-sand-50 border border-sand-200 text-xs text-charcoal-600 space-y-1.5 animate-fade-in">
                  <p className="font-bold text-charcoal-900">bKash / Nagad Merchant Payment:</p>
                  <p>Merchant Number: <span className="font-mono font-bold">+880 1888 123456</span></p>
                  <p>Select "Make Payment" from the bKash app with your order reference.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Confirm Button */}
          <div className="lg:col-span-5 bg-white border border-sand-200 p-6 sm:p-8 shadow-sm space-y-6 lg:sticky lg:top-24">
            <h2 className="font-display text-xl text-charcoal-900 pb-3 border-b border-sand-200">
              Order Summary ({items.length} Items)
            </h2>

            <div className="divide-y divide-sand-100 max-h-72 overflow-y-auto pr-2">
              {items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover border border-sand-200" />
                    )}
                    <div>
                      <p className="font-medium text-charcoal-900 line-clamp-1">{item.name}</p>
                      <p className="text-[11px] text-charcoal-400">
                        {item.size || 'Custom Size'} · Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-charcoal-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-sand-200 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-charcoal-500">Subtotal:</span>
                <span className="font-medium text-charcoal-900">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-500">International Express Carriage:</span>
                <span className="font-medium text-emerald-700">Complimentary (Free)</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-sand-200 text-sm font-bold">
                <span className="text-charcoal-900 uppercase tracking-wider">Total Value:</span>
                <span className="font-display text-xl text-charcoal-900">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Advance Payment Breakdown */}
            <div className="bg-sand-100 p-4 space-y-2 border border-sand-200 text-xs">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-charcoal-900">Due Today ({paymentChoice === 'advance' ? '50% Advance' : 'Full Payment'}):</span>
                <span className="font-display text-xl font-bold text-terracotta">
                  {formatPrice(payAmountNow)}
                </span>
              </div>
              {paymentChoice === 'advance' && (
                <div className="flex justify-between text-[11px] text-charcoal-500">
                  <span>Balance due prior to courier dispatch:</span>
                  <span>{formatPrice(balanceRemaining)}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-accent !py-4 text-xs tracking-[0.2em] uppercase font-bold"
            >
              {submitting ? 'Processing Payment...' : `Confirm & Pay ${formatPrice(payAmountNow)}`}
            </button>

            <div className="text-[11px] text-center text-charcoal-400">
              By confirming, you secure master artisan loom space at our Dhaka studio.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}