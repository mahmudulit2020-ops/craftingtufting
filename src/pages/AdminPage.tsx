import { useEffect, useState } from 'react';
import { Package, Settings, DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { fetchAllCustomOrders, fetchAllOrders, updateCustomOrderProductionStatus, updatePricingConfig, fetchPricingConfig, PRODUCTION_STATUSES } from '@/lib/api';
import { formatCurrency } from '@/lib/pricing';
import type { PricingConfig } from '@/lib/types';

interface CustomOrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  rug_type: string;
  shape: string;
  width: number | null;
  length: number | null;
  diameter: number | null;
  unit: string;
  area_sqft: number;
  design_name: string | null;
  colors: Record<string, string>;
  addon_codes: string[];
  total_price: number;
  advance_paid: number;
  remaining: number;
  payment_status: string;
  production_status: string;
  created_at: string;
}

interface OrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total: number;
  advance_paid: number;
  remaining: number;
  payment_status: string;
  status: string;
  created_at: string;
  items: unknown[];
}

type Tab = 'overview' | 'custom-orders' | 'orders' | 'pricing';

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('overview');
  const [customOrders, setCustomOrders] = useState<CustomOrderRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [pricing, setPricing] = useState<PricingConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPricing, setEditingPricing] = useState<Record<string, { price: string; min: string; surcharge: string }>>({});
  const [savingPricing, setSavingPricing] = useState(false);

  useEffect(() => {
    Promise.all([fetchPricingConfig(), fetchAllCustomOrders(), fetchAllOrders()])
      .then(([p, co, o]) => {
        setPricing(p);
        setCustomOrders(co as CustomOrderRow[]);
        setOrders(o as OrderRow[]);
        const editMap: Record<string, { price: string; min: string; surcharge: string }> = {};
        p.forEach((pc) => {
          editMap[pc.rug_type] = {
            price: String(pc.price_per_sqft),
            min: String(pc.min_order_price),
            surcharge: String(pc.shape_surcharge),
          };
        });
        setEditingPricing(editMap);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateCustomOrderProductionStatus(id, status);
      setCustomOrders((prev) => prev.map((o) => o.id === id ? { ...o, production_status: status } : o));
    } catch {
      alert('Failed to update status.');
    }
  };

  const handleSavePricing = async () => {
    setSavingPricing(true);
    try {
      for (const pc of pricing) {
        const edit = editingPricing[pc.rug_type];
        if (edit) {
          await updatePricingConfig(
            pc.rug_type,
            parseFloat(edit.price) || 0,
            parseFloat(edit.min) || 0,
            parseFloat(edit.surcharge) || 0
          );
        }
      }
      alert('Pricing updated successfully.');
    } catch {
      alert('Failed to update pricing.');
    } finally {
      setSavingPricing(false);
    }
  };

  const totalRevenue = customOrders.reduce((s, o) => s + Number(o.total_price), 0) + orders.reduce((s, o) => s + Number(o.total), 0);
  const totalAdvance = customOrders.reduce((s, o) => s + Number(o.advance_paid), 0) + orders.reduce((s, o) => s + Number(o.advance_paid), 0);
  const pendingProduction = customOrders.filter((o) => !['Delivered', 'Shipped'].includes(o.production_status)).length;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sand-200 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof Package }[] = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'custom-orders', label: 'Custom Orders', icon: Package },
    { id: 'orders', label: 'Ready-Made Orders', icon: Package },
    { id: 'pricing', label: 'Pricing Config', icon: DollarSign },
  ];

  return (
    <div className="bg-sand-50 min-h-screen">
      <div className="bg-charcoal-900 text-cream py-10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
          <p className="text-xs tracking-[0.3em] uppercase text-sand-300 mb-2">Admin Dashboard</p>
          <h1 className="font-display text-display-md">Crafting & Tufting Admin</h1>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-10">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto bg-white border border-sand-100 p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-xs tracking-[0.12em] uppercase whitespace-nowrap transition-colors ${tab === t.id ? 'bg-charcoal-800 text-cream' : 'text-charcoal-600 hover:text-accent'}`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign },
                { label: 'Advance Collected', value: formatCurrency(totalAdvance), icon: CheckCircle },
                { label: 'Total Orders', value: customOrders.length + orders.length, icon: Package },
                { label: 'In Production', value: pendingProduction, icon: Clock },
              ].map((stat) => (
                <div key={stat.label} className="bg-white border border-sand-100 p-6">
                  <stat.icon size={20} className="text-accent mb-3" />
                  <p className="text-xs tracking-[0.12em] uppercase text-charcoal-500 mb-1">{stat.label}</p>
                  <p className="font-display text-2xl lg:text-3xl text-charcoal-900">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white border border-sand-100 p-6">
                <h3 className="font-display text-xl text-charcoal-900 mb-4">Recent Custom Orders</h3>
                <div className="space-y-3">
                  {customOrders.slice(0, 5).map((o) => (
                    <div key={o.id} className="flex justify-between items-center text-sm border-b border-sand-50 pb-3">
                      <div>
                        <p className="text-charcoal-800 font-medium">{o.order_number}</p>
                        <p className="text-xs text-charcoal-400">{o.customer_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-charcoal-800 font-medium">{formatCurrency(Number(o.total_price))}</p>
                        <p className="text-xs text-accent">{o.production_status}</p>
                      </div>
                    </div>
                  ))}
                  {customOrders.length === 0 && <p className="text-sm text-charcoal-400">No custom orders yet.</p>}
                </div>
              </div>

              <div className="bg-white border border-sand-100 p-6">
                <h3 className="font-display text-xl text-charcoal-900 mb-4">Recent Ready-Made Orders</h3>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((o) => (
                    <div key={o.id} className="flex justify-between items-center text-sm border-b border-sand-50 pb-3">
                      <div>
                        <p className="text-charcoal-800 font-medium">{o.order_number}</p>
                        <p className="text-xs text-charcoal-400">{o.customer_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-charcoal-800 font-medium">{formatCurrency(Number(o.total))}</p>
                        <p className="text-xs text-accent">{o.status}</p>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && <p className="text-sm text-charcoal-400">No ready-made orders yet.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Orders */}
        {tab === 'custom-orders' && (
          <div className="bg-white border border-sand-100 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-sand-50 text-left text-xs tracking-[0.1em] uppercase text-charcoal-500">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Rug Type</th>
                  <th className="p-4">Shape</th>
                  <th className="p-4">Size</th>
                  <th className="p-4">Area</th>
                  <th className="p-4">Design</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Advance</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Production Status</th>
                </tr>
              </thead>
              <tbody>
                {customOrders.map((o) => (
                  <tr key={o.id} className="border-t border-sand-50 hover:bg-sand-50/50">
                    <td className="p-4 font-mono text-xs text-charcoal-700">{o.order_number}</td>
                    <td className="p-4">
                      <p className="text-charcoal-800">{o.customer_name}</p>
                      <p className="text-xs text-charcoal-400">{o.customer_email}</p>
                    </td>
                    <td className="p-4 text-charcoal-700">{o.rug_type === 'tufting' ? 'Tufting' : 'Jute'}</td>
                    <td className="p-4 text-charcoal-700 capitalize">{o.shape}</td>
                    <td className="p-4 text-charcoal-700 text-xs">
                      {o.shape === 'circle' ? `Ø ${o.diameter} ${o.unit}` : o.shape === 'square' ? `${o.width} ${o.unit}` : `${o.width} × ${o.length} ${o.unit}`}
                    </td>
                    <td className="p-4 text-charcoal-700">{Number(o.area_sqft).toFixed(1)} sq ft</td>
                    <td className="p-4 text-charcoal-700 text-xs">{o.design_name || '—'}</td>
                    <td className="p-4 text-charcoal-900 font-medium">{formatCurrency(Number(o.total_price))}</td>
                    <td className="p-4 text-accent font-medium">{formatCurrency(Number(o.advance_paid))}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 ${o.payment_status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-sand-100 text-charcoal-600'}`}>
                        {o.payment_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={o.production_status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className="text-xs bg-cream border border-sand-200 px-2 py-1.5 outline-none focus:border-accent cursor-pointer"
                      >
                        {PRODUCTION_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {customOrders.length === 0 && (
                  <tr><td colSpan={11} className="p-8 text-center text-charcoal-400">No custom orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Ready-Made Orders */}
        {tab === 'orders' && (
          <div className="bg-white border border-sand-100 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-sand-50 text-left text-xs tracking-[0.1em] uppercase text-charcoal-500">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Advance</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-sand-50 hover:bg-sand-50/50">
                    <td className="p-4 font-mono text-xs text-charcoal-700">{o.order_number}</td>
                    <td className="p-4">
                      <p className="text-charcoal-800">{o.customer_name}</p>
                      <p className="text-xs text-charcoal-400">{o.customer_email}</p>
                    </td>
                    <td className="p-4 text-charcoal-700 text-xs">{Array.isArray(o.items) ? o.items.length : 0} items</td>
                    <td className="p-4 text-charcoal-900 font-medium">{formatCurrency(Number(o.total))}</td>
                    <td className="p-4 text-accent font-medium">{formatCurrency(Number(o.advance_paid))}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 ${o.payment_status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-sand-100 text-charcoal-600'}`}>
                        {o.payment_status}
                      </span>
                    </td>
                    <td className="p-4 text-charcoal-700 text-xs">{o.status}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-charcoal-400">No ready-made orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pricing Config */}
        {tab === 'pricing' && (
          <div className="max-w-2xl bg-white border border-sand-100 p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Settings size={20} className="text-accent" />
              <h2 className="font-display text-2xl text-charcoal-900">Pricing Configuration</h2>
            </div>
            <p className="text-sm text-charcoal-500 mb-8">Update the price per square foot for each rug type. Changes take effect immediately on the storefront.</p>

            <div className="space-y-8">
              {pricing.map((pc) => {
                const edit = editingPricing[pc.rug_type];
                if (!edit) return null;
                return (
                  <div key={pc.rug_type} className="border border-sand-100 p-6">
                    <h3 className="font-display text-xl text-charcoal-900 mb-4">{pc.label}</h3>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-2">Price / sq ft ({pc.currency_symbol})</label>
                        <input type="number" value={edit.price} onChange={(e) => setEditingPricing({ ...editingPricing, [pc.rug_type]: { ...edit, price: e.target.value } })} className="input-field" />
                      </div>
                      <div>
                        <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-2">Min Order ({pc.currency_symbol})</label>
                        <input type="number" value={edit.min} onChange={(e) => setEditingPricing({ ...editingPricing, [pc.rug_type]: { ...edit, min: e.target.value } })} className="input-field" />
                      </div>
                      <div>
                        <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-2">Shape Surcharge ({pc.currency_symbol})</label>
                        <input type="number" value={edit.surcharge} onChange={(e) => setEditingPricing({ ...editingPricing, [pc.rug_type]: { ...edit, surcharge: e.target.value } })} className="input-field" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button onClick={handleSavePricing} disabled={savingPricing} className="btn-primary mt-8 disabled:opacity-50">
              {savingPricing ? 'Saving...' : 'Save Pricing Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
