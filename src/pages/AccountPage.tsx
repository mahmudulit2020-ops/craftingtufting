import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, User, LogOut, MapPin, CreditCard, Heart, Clock, Ruler, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { formatCurrency } from '@/lib/pricing';

interface CustomOrderRow {
  id: string;
  order_number: string;
  rug_type: string;
  shape: string;
  area_sqft: number;
  total_price: number;
  advance_paid: number;
  remaining: number;
  production_status: string;
  payment_status: string;
  created_at: string;
}

interface OrderRow {
  id: string;
  order_number: string;
  total: number;
  advance_paid: number;
  status: string;
  payment_status: string;
  created_at: string;
}

type Tab = 'orders' | 'custom' | 'profile' | 'addresses' | 'payments';

export default function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>('orders');
  const [customOrders, setCustomOrders] = useState<CustomOrderRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    setDataLoading(true);
    Promise.all([
      supabase.from('custom_orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ]).then(([coRes, oRes]) => {
      setCustomOrders((coRes.data as CustomOrderRow[]) ?? []);
      setOrders((oRes.data as OrderRow[]) ?? []);
    }).catch(() => {}).finally(() => setDataLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sand-200 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const fullName = (user.user_metadata?.full_name as string) || 'Customer';
  const email = user.email || '';

  const tabs: { id: Tab; label: string; icon: typeof Package }[] = [
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'custom', label: 'Custom Designs', icon: Ruler },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payments', label: 'Payment History', icon: CreditCard },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <div className="bg-charcoal-900 text-cream py-12">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="kantha-divider w-16 mb-4 opacity-50" />
          <p className="text-xs tracking-[0.25em] uppercase text-sand-300 mb-2">My Account</p>
          <h1 className="text-3xl font-bold mb-1">Welcome, {fullName}</h1>
          <p className="text-cream/50 text-sm">{email}</p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-10">
        <div className="grid lg:grid-cols-[240px_1fr] gap-8 lg:gap-12">
          {/* Sidebar */}
          <aside>
            <nav className="space-y-1 mb-6">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors text-left ${
                    tab === t.id
                      ? 'bg-charcoal-800 text-cream'
                      : 'text-charcoal-600 hover:bg-sand-50'
                  }`}
                >
                  <t.icon size={18} /> {t.label}
                </button>
              ))}
            </nav>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} /> Sign Out
            </button>

            <Link to="/custom-rug" className="btn-primary w-full mt-6 !py-3 !text-[11px]">
              Create New Rug <ArrowRight size={14} />
            </Link>
          </aside>

          {/* Content */}
          <div>
            {/* Orders tab */}
            {tab === 'orders' && (
              <div>
                <h2 className="text-xl font-bold text-charcoal-900 mb-6">Ready-Made Orders</h2>
                {dataLoading ? (
                  <div className="w-8 h-8 border-2 border-sand-200 border-t-accent rounded-full animate-spin" />
                ) : orders.length === 0 ? (
                  <EmptyState icon={Package} title="No orders yet" desc="Your ready-made orders will appear here." cta="/shop" ctaLabel="Shop Now" />
                ) : (
                  <div className="space-y-4">
                    {orders.map((o) => (
                      <OrderCard key={o.id} order={o} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Custom Designs tab */}
            {tab === 'custom' && (
              <div>
                <h2 className="text-xl font-bold text-charcoal-900 mb-6">Custom Rug Orders</h2>
                {dataLoading ? (
                  <div className="w-8 h-8 border-2 border-sand-200 border-t-accent rounded-full animate-spin" />
                ) : customOrders.length === 0 ? (
                  <EmptyState icon={Ruler} title="No custom rugs yet" desc="Design your own custom rug — choose shape, size, colors, and get an instant price." cta="/custom-rug" ctaLabel="Start Custom Design" />
                ) : (
                  <div className="space-y-4">
                    {customOrders.map((o) => (
                      <CustomOrderCard key={o.id} order={o} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile tab */}
            {tab === 'profile' && (
              <div className="max-w-lg">
                <h2 className="text-xl font-bold text-charcoal-900 mb-6">Profile Information</h2>
                <div className="bg-white border border-sand-100 p-6 lg:p-8 space-y-5">
                  <div>
                    <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-2">Full Name</label>
                    <input type="text" defaultValue={fullName} className="input-field" readOnly />
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-2">Email</label>
                    <input type="email" defaultValue={email} className="input-field" readOnly />
                  </div>
                  <p className="text-xs text-charcoal-400">Profile editing will be available in a future update.</p>
                </div>
              </div>
            )}

            {/* Addresses tab */}
            {tab === 'addresses' && (
              <div className="max-w-lg">
                <h2 className="text-xl font-bold text-charcoal-900 mb-6">Saved Addresses</h2>
                <EmptyState icon={MapPin} title="No saved addresses" desc="Your shipping addresses will be saved here after your first order." cta="/shop" ctaLabel="Shop Now" />
              </div>
            )}

            {/* Payments tab */}
            {tab === 'payments' && (
              <div>
                <h2 className="text-xl font-bold text-charcoal-900 mb-6">Payment History</h2>
                {dataLoading ? (
                  <div className="w-8 h-8 border-2 border-sand-200 border-t-accent rounded-full animate-spin" />
                ) : customOrders.length + orders.length === 0 ? (
                  <EmptyState icon={CreditCard} title="No payments yet" desc="Your payment history will appear here after you place an order." cta="/custom-rug" ctaLabel="Create Your Rug" />
                ) : (
                  <div className="bg-white border border-sand-100 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-sand-50 text-left text-xs tracking-[0.1em] uppercase text-charcoal-500">
                          <th className="p-4">Order</th>
                          <th className="p-4">Type</th>
                          <th className="p-4">Total</th>
                          <th className="p-4">Advance Paid</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customOrders.map((o) => (
                          <tr key={o.id} className="border-t border-sand-50">
                            <td className="p-4 font-mono text-xs">{o.order_number}</td>
                            <td className="p-4 text-charcoal-600">Custom Rug</td>
                            <td className="p-4 text-charcoal-800">{formatCurrency(Number(o.total_price))}</td>
                            <td className="p-4 text-accent font-medium">{formatCurrency(Number(o.advance_paid))}</td>
                            <td className="p-4"><span className="text-xs px-2 py-1 bg-sand-100 text-charcoal-600">{o.payment_status}</span></td>
                          </tr>
                        ))}
                        {orders.map((o) => (
                          <tr key={o.id} className="border-t border-sand-50">
                            <td className="p-4 font-mono text-xs">{o.order_number}</td>
                            <td className="p-4 text-charcoal-600">Ready-Made</td>
                            <td className="p-4 text-charcoal-800">{formatCurrency(Number(o.total))}</td>
                            <td className="p-4 text-accent font-medium">{formatCurrency(Number(o.advance_paid))}</td>
                            <td className="p-4"><span className="text-xs px-2 py-1 bg-sand-100 text-charcoal-600">{o.payment_status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc, cta, ctaLabel }: { icon: typeof Package; title: string; desc: string; cta: string; ctaLabel: string }) {
  return (
    <div className="bg-white border border-sand-100 p-12 text-center">
      <Icon size={40} className="text-sand-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-charcoal-800 mb-2">{title}</h3>
      <p className="text-sm text-charcoal-500 mb-6 max-w-sm mx-auto">{desc}</p>
      <Link to={cta} className="btn-primary">{ctaLabel} <ArrowRight size={16} /></Link>
    </div>
  );
}

function OrderCard({ order }: { order: OrderRow }) {
  return (
    <div className="bg-white border border-sand-100 p-5 lg:p-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-charcoal-500 mb-1">{order.order_number}</p>
          <p className="text-sm text-charcoal-400">
            {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-charcoal-500">Total</p>
            <p className="font-semibold text-charcoal-900">{formatCurrency(Number(order.total))}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-charcoal-500">Advance</p>
            <p className="font-medium text-accent">{formatCurrency(Number(order.advance_paid))}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-sand-50">
        <span className="text-xs px-2.5 py-1 bg-sand-100 text-charcoal-600">{order.status}</span>
        <span className={`text-xs px-2.5 py-1 ${order.payment_status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-sand-100 text-charcoal-600'}`}>{order.payment_status}</span>
      </div>
    </div>
  );
}

function CustomOrderCard({ order }: { order: CustomOrderRow }) {
  const statusColors: Record<string, string> = {
    'Order Received': 'bg-sand-100 text-charcoal-600',
    'Design Review': 'bg-yellow-100 text-yellow-700',
    'Design Approved': 'bg-blue-100 text-blue-700',
    'Production Started': 'bg-blue-100 text-blue-700',
    'Quality Check': 'bg-purple-100 text-purple-700',
    'Ready for Delivery': 'bg-teal-100 text-teal-700',
    'Shipped': 'bg-indigo-100 text-indigo-700',
    'Delivered': 'bg-green-100 text-green-700',
  };

  return (
    <div className="bg-white border border-sand-100 p-5 lg:p-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-charcoal-500 mb-1">{order.order_number}</p>
          <p className="text-sm text-charcoal-700 font-medium">
            {order.rug_type === 'tufting' ? 'Tufting Rug' : 'Jute Handcraft'} — {order.shape}
          </p>
          <p className="text-sm text-charcoal-400">
            {Number(order.area_sqft).toFixed(1)} sq ft · {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-charcoal-500">Total</p>
            <p className="font-semibold text-charcoal-900">{formatCurrency(Number(order.total_price))}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-charcoal-500">Advance</p>
            <p className="font-medium text-accent">{formatCurrency(Number(order.advance_paid))}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-sand-50 flex-wrap">
        <span className={`text-xs px-2.5 py-1 ${statusColors[order.production_status] || 'bg-sand-100 text-charcoal-600'}`}>
          {order.production_status}
        </span>
        <span className={`text-xs px-2.5 py-1 ${order.payment_status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-sand-100 text-charcoal-600'}`}>
          {order.payment_status}
        </span>
        <span className="text-xs text-charcoal-400 ml-auto flex items-center gap-1">
          <Clock size={12} /> Remaining: {formatCurrency(Number(order.remaining))}
        </span>
      </div>
    </div>
  );
}
