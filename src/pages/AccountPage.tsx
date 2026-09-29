import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  User,
  LogOut,
  Heart,
  Ruler,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import { getLocalCustomOrders, getLocalStandardOrders } from '@/lib/api';
import type { CustomOrder, Order } from '@/lib/types';

type Tab = 'custom' | 'orders' | 'profile' | 'addresses' | 'payments';

export default function AccountPage() {
  const { user, signOut } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>('custom');
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const co = getLocalCustomOrders();
    const st = getLocalStandardOrders();
    setCustomOrders(co);
    setOrders(st);
  }, []);

  const fullName = (user?.user_metadata?.full_name as string) || 'Valued Client';
  const email = user?.email || 'client@craftingtufting.com';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <div className="bg-charcoal-900 text-cream py-14">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="kantha-divider w-16 mb-4 opacity-50" />
          <p className="text-xs tracking-[0.25em] uppercase text-sand-300 mb-2">
            Client Atelier Portal
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-1">
            Welcome, {fullName}
          </h1>
          <p className="text-cream/60 text-xs">{email}</p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar */}
          <div className="lg:col-span-3 bg-white border border-sand-200 p-2 shadow-sm space-y-1 text-xs">
            <button
              onClick={() => setTab('custom')}
              className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                tab === 'custom'
                  ? 'bg-charcoal-900 text-cream font-semibold'
                  : 'text-charcoal-700 hover:bg-sand-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Ruler size={15} />
                <span>Custom Rugs</span>
              </div>
              <span className="font-mono text-[10px]">{customOrders.length}</span>
            </button>

            <button
              onClick={() => setTab('orders')}
              className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                tab === 'orders'
                  ? 'bg-charcoal-900 text-cream font-semibold'
                  : 'text-charcoal-700 hover:bg-sand-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package size={15} />
                <span>Store Purchases</span>
              </div>
              <span className="font-mono text-[10px]">{orders.length}</span>
            </button>

            <Link
              to="/wishlist"
              className="w-full text-left px-4 py-3 flex items-center gap-2.5 text-charcoal-700 hover:bg-sand-50 transition-colors"
            >
              <Heart size={15} />
              <span>Saved Wishlist</span>
            </Link>

            <button
              onClick={() => setTab('profile')}
              className={`w-full text-left px-4 py-3 flex items-center gap-2.5 transition-colors ${
                tab === 'profile'
                  ? 'bg-charcoal-900 text-cream font-semibold'
                  : 'text-charcoal-700 hover:bg-sand-50'
              }`}
            >
              <User size={15} />
              <span>Profile & Delivery</span>
            </button>

            <div className="border-t border-sand-100 my-1" />

            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-3 flex items-center gap-2.5 text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 bg-white border border-sand-200 p-6 sm:p-8 shadow-sm">
            {tab === 'custom' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-sand-200">
                  <h2 className="font-display text-xl text-charcoal-900">
                    Bespoke Custom Rug Commissions
                  </h2>
                  <Link
                    to="/custom-rug"
                    className="text-xs text-accent hover:underline font-semibold flex items-center gap-1"
                  >
                    + Create New Custom Rug <ArrowRight size={13} />
                  </Link>
                </div>

                {customOrders.length === 0 ? (
                  <p className="text-xs text-charcoal-500 py-10 text-center">
                    No custom commissions created yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {customOrders.map((co) => (
                      <div
                        key={co.id}
                        className="p-5 bg-sand-50 border border-sand-200 space-y-3 text-xs"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-sand-200">
                          <div>
                            <span className="font-mono font-bold text-charcoal-900 text-sm">
                              {co.order_number}
                            </span>
                            <span className="text-sand-300 mx-2">·</span>
                            <span className="text-charcoal-600 uppercase tracking-wider text-[10px]">
                              {co.design_name || 'Custom Artwork'} ({co.design_category})
                            </span>
                          </div>
                          <span className="px-2.5 py-1 bg-sand-200 text-charcoal-900 font-semibold text-[10px] uppercase tracking-wider">
                            Status: {co.production_status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                          <div>
                            <span className="text-charcoal-400 block text-[10px] uppercase">Dimensions:</span>
                            <span className="font-medium text-charcoal-800">
                              {co.shape === 'circle' ? `⌀ ${co.diameter} ${co.unit}` : `${co.width} × ${co.length} ${co.unit}`} ({co.area_sqft} sq ft)
                            </span>
                          </div>
                          <div>
                            <span className="text-charcoal-400 block text-[10px] uppercase">Fiber & Pile:</span>
                            <span className="font-medium text-charcoal-800">{co.yarn_type}</span>
                          </div>
                          <div>
                            <span className="text-charcoal-400 block text-[10px] uppercase">50% Advance Paid:</span>
                            <span className="font-bold text-emerald-700">{formatPrice(co.advance_paid)}</span>
                          </div>
                          <div>
                            <span className="text-charcoal-400 block text-[10px] uppercase">Remaining Balance:</span>
                            <span className="font-medium text-charcoal-700">{formatPrice(co.remaining)}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-sand-200 flex justify-between items-center">
                          <span className="text-[11px] text-charcoal-500">
                            Est. Delivery: {co.estimated_delivery || '4–6 weeks'}
                          </span>
                          <Link
                            to={`/track-order?code=${co.order_number}`}
                            className="text-accent hover:underline font-semibold flex items-center gap-1 text-[11px]"
                          >
                            Open 8-Stage Timeline <ExternalLink size={12} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'orders' && (
              <div className="space-y-6">
                <h2 className="font-display text-xl text-charcoal-900 pb-4 border-b border-sand-200">
                  Ready-Made Purchases
                </h2>
                {orders.length === 0 ? (
                  <p className="text-xs text-charcoal-500 py-10 text-center">
                    No ready-made orders placed yet.
                  </p>
                ) : (
                  <div className="divide-y divide-sand-100">
                    {orders.map((o) => (
                      <div key={o.id} className="py-4 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-mono font-bold text-charcoal-900">{o.order_number}</p>
                          <p className="text-charcoal-500">Items: {o.items.length} · Status: {o.status}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-charcoal-900 text-sm">{formatPrice(o.total)}</p>
                          <Link
                            to={`/track-order?code=${o.order_number}`}
                            className="text-accent hover:underline text-[11px]"
                          >
                            Track Order
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'profile' && (
              <div className="space-y-5 text-xs">
                <h2 className="font-display text-xl text-charcoal-900 pb-3 border-b border-sand-200">
                  Client Profile & Preferences
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-charcoal-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      defaultValue={fullName}
                      className="input-field !py-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-charcoal-600 mb-1">Email</label>
                    <input
                      type="email"
                      defaultValue={email}
                      className="input-field !py-2.5 text-xs"
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-charcoal-600 mb-1">Default International Delivery Address</label>
                  <textarea
                    rows={3}
                    defaultValue="14 Rue de Rivoli, Paris, 75001 France"
                    className="input-field !py-2.5 text-xs"
                  />
                </div>
                <button type="button" className="btn-primary !py-2.5 !text-xs">
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
