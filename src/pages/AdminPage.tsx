import { useEffect, useState } from 'react';
import {
  Package,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Plus,
  Trash2,
  Eye,
  Layers,
  Sparkles,
  Save,
  X,
} from 'lucide-react';
import {
  fetchAllCustomOrders,
  fetchAllOrders,
  updateCustomOrderStatus,
  updatePricingConfig,
  fetchPricingConfig,
  fetchProducts,
} from '@/lib/api';
import {
  ORDER_TRACKING_STAGES,
  type CustomOrder,
  type Order,
  type Product,
  type PricingConfig,
  type OrderTrackingStatus,
} from '@/lib/types';
import { useCurrency } from '@/context/CurrencyContext';

type Tab = 'overview' | 'custom-orders' | 'ready-orders' | 'products' | 'pricing';

export default function AdminPage() {
  const { formatPrice } = useCurrency();

  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [pricing, setPricing] = useState<PricingConfig[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Pricing edit state
  const [pricingForm, setPricingForm] = useState<Record<string, { price: number; min: number; surcharge: number }>>({});
  const [savingPricing, setSavingPricing] = useState(false);
  const [pricingSavedToast, setPricingSavedToast] = useState(false);

  // Artwork Zoom
  const [activeArtworkModal, setActiveArtworkModal] = useState<string | null>(null);

  // New Product Modal
  const [newProductModalOpen, setNewProductModalOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState<Partial<Product>>({
    name: '',
    category: 'TUFTING RUGS',
    subCategory: 'Islamic Designs',
    material: '100% New Zealand Wool',
    description: '',
    image_url: 'https://images.pexels.com/photos/28379849/pexels-photo-28379849.jpeg?auto=compress&cs=tinysrgb&h=800&w=1000',
    base_price: 350,
    stock_status: 'In Stock',
    care_info: 'Vacuum gently. Blot spills.',
    production_info: 'Handcrafted in 4 weeks.',
    shipping_info: 'Free express worldwide shipping.',
    is_featured: true,
    is_best_seller: false,
    is_new_arrival: true,
  });

  const loadData = () => {
    Promise.all([
      fetchPricingConfig(),
      fetchAllCustomOrders(),
      fetchAllOrders(),
      fetchProducts(),
    ])
      .then(([p, co, o, prods]) => {
        setPricing(p);
        setCustomOrders(co);
        setOrders(o);
        setProducts(prods);

        const formMap: Record<string, { price: number; min: number; surcharge: number }> = {};
        p.forEach((cfg) => {
          formMap[cfg.rug_type] = {
            price: cfg.price_per_sqft,
            min: cfg.min_order_price,
            surcharge: cfg.shape_surcharge,
          };
        });
        setPricingForm(formMap);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderTrackingStatus) => {
    await updateCustomOrderStatus(orderId, newStatus);
    setCustomOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, production_status: newStatus } : o))
    );
  };

  const handleSavePricingConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPricing(true);
    try {
      for (const pc of pricing) {
        const edited = pricingForm[pc.rug_type];
        if (edited) {
          await updatePricingConfig(
            pc.rug_type,
            edited.price,
            edited.min,
            edited.surcharge
          );
        }
      }
      setPricingSavedToast(true);
      setTimeout(() => setPricingSavedToast(false), 3000);
      loadData();
    } finally {
      setSavingPricing(false);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newProductForm.name,
      slug: newProductForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: (newProductForm.category || 'TUFTING RUGS') as 'TUFTING RUGS' | 'JUTE HANDCRAFT',
      subCategory: newProductForm.subCategory,
      material: newProductForm.material || '100% Wool',
      description: newProductForm.description || 'Artisan handcrafted piece.',
      image_url: newProductForm.image_url || 'https://images.pexels.com/photos/28379849/pexels-photo-28379849.jpeg',
      gallery: [newProductForm.image_url || 'https://images.pexels.com/photos/28379849/pexels-photo-28379849.jpeg'],
      base_price: Number(newProductForm.base_price) || 250,
      stock_status: (newProductForm.stock_status || 'In Stock') as 'In Stock' | 'Made to Order' | 'Limited Edition',
      care_info: newProductForm.care_info || '',
      production_info: newProductForm.production_info || '',
      shipping_info: newProductForm.shipping_info || '',
      is_featured: !!newProductForm.is_featured,
      is_best_seller: !!newProductForm.is_best_seller,
      is_new_arrival: !!newProductForm.is_new_arrival,
      sort_order: products.length + 1,
      created_at: new Date().toISOString(),
    };

    setProducts([newProd, ...products]);
    setNewProductModalOpen(false);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to remove this product from the catalog?')) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  // Metrics Calculations
  const customOrdersTotalRevenue = customOrders.reduce((sum, o) => sum + (o.total_price || 0), 0);
  const standardOrdersTotalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalRevenue = customOrdersTotalRevenue + standardOrdersTotalRevenue;

  const totalAdvanceCollected = customOrders.reduce((sum, o) => sum + (o.advance_paid || 0), 0);
  const totalBalancePending = customOrders.reduce((sum, o) => sum + (o.remaining || 0), 0);

  const inProductionCount = customOrders.filter((o) =>
    ['Production', 'Quality Check', 'Design Review'].includes(o.production_status)
  ).length;

  const inShippingCount = customOrders.filter((o) =>
    ['Ready to Ship', 'Shipped'].includes(o.production_status)
  ).length;

  const juteOrdersCount = customOrders.filter((o) => o.rug_type === 'jute').length;

  if (loading) {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-sand-300 border-t-accent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-[0.2em] text-charcoal-500 font-medium">
            Loading Atelier Console...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-10 lg:py-16">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-sand-200 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-accent font-semibold mb-1">
              <Sparkles size={14} />
              <span>Atelier Command Console</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl text-charcoal-900">
              Crafting & Tufting Administration
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setNewProductModalOpen(true)}
              className="btn-primary !py-2.5 !text-xs flex items-center gap-1.5"
            >
              <Plus size={14} /> Add New Catalog Product
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-sand-200 gap-2 mb-8 overflow-x-auto text-xs uppercase tracking-wider font-semibold">
          {[
            { id: 'overview', label: '18. Overview Dashboard', icon: TrendingUp },
            { id: 'custom-orders', label: `Custom Rugs (${customOrders.length})`, icon: Layers },
            { id: 'ready-orders', label: `Store Orders (${orders.length})`, icon: Package },
            { id: 'products', label: `Catalog Products (${products.length})`, icon: Package },
            { id: 'pricing', label: 'Pricing Engine Controls', icon: DollarSign },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id as Tab)}
                className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  tab === t.id
                    ? 'border-charcoal-900 text-charcoal-900 font-bold bg-white'
                    : 'border-transparent text-charcoal-500 hover:text-charcoal-900'
                }`}
              >
                <Icon size={14} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {tab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* 10 Key Metrics requested in Section 18 */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white border border-sand-200 p-5 shadow-sm">
                <p className="text-[11px] tracking-wider uppercase text-charcoal-500 mb-1">Total Sales</p>
                <p className="font-display text-2xl font-bold text-charcoal-900">{formatPrice(totalRevenue)}</p>
                <p className="text-[10px] text-emerald-700 mt-1">Across all commissions</p>
              </div>

              <div className="bg-white border border-sand-200 p-5 shadow-sm">
                <p className="text-[11px] tracking-wider uppercase text-charcoal-500 mb-1">Total Orders</p>
                <p className="font-display text-2xl font-bold text-charcoal-900">{customOrders.length + orders.length}</p>
                <p className="text-[10px] text-charcoal-500 mt-1">Bespoke & Ready-Made</p>
              </div>

              <div className="bg-white border border-sand-200 p-5 shadow-sm">
                <p className="text-[11px] tracking-wider uppercase text-charcoal-500 mb-1">Custom Orders</p>
                <p className="font-display text-2xl font-bold text-terracotta">{customOrders.length}</p>
                <p className="text-[10px] text-charcoal-500 mt-1">Direct from Studio Studio</p>
              </div>

              <div className="bg-white border border-sand-200 p-5 shadow-sm">
                <p className="text-[11px] tracking-wider uppercase text-charcoal-500 mb-1">Ready-Made Orders</p>
                <p className="font-display text-2xl font-bold text-charcoal-900">{orders.length}</p>
                <p className="text-[10px] text-charcoal-500 mt-1">From curated shop</p>
              </div>

              <div className="bg-white border border-sand-200 p-5 shadow-sm">
                <p className="text-[11px] tracking-wider uppercase text-charcoal-500 mb-1">Jute Orders</p>
                <p className="font-display text-2xl font-bold text-accent">{juteOrdersCount}</p>
                <p className="text-[10px] text-charcoal-500 mt-1">Golden Fiber Crafts</p>
              </div>

              <div className="bg-white border border-sand-200 p-5 shadow-sm">
                <p className="text-[11px] tracking-wider uppercase text-charcoal-500 mb-1">50% Advance Paid</p>
                <p className="font-display text-2xl font-bold text-emerald-700">{formatPrice(totalAdvanceCollected)}</p>
                <p className="text-[10px] text-charcoal-500 mt-1">Secured in Atelier Escrow</p>
              </div>

              <div className="bg-white border border-sand-200 p-5 shadow-sm">
                <p className="text-[11px] tracking-wider uppercase text-charcoal-500 mb-1">Pending Balance</p>
                <p className="font-display text-2xl font-bold text-charcoal-900">{formatPrice(totalBalancePending)}</p>
                <p className="text-[10px] text-charcoal-500 mt-1">Due prior to dispatch</p>
              </div>

              <div className="bg-white border border-sand-200 p-5 shadow-sm">
                <p className="text-[11px] tracking-wider uppercase text-charcoal-500 mb-1">In Production</p>
                <p className="font-display text-2xl font-bold text-accent">{inProductionCount}</p>
                <p className="text-[10px] text-charcoal-500 mt-1">Active on frame looms</p>
              </div>

              <div className="bg-white border border-sand-200 p-5 shadow-sm">
                <p className="text-[11px] tracking-wider uppercase text-charcoal-500 mb-1">Shipping Orders</p>
                <p className="font-display text-2xl font-bold text-charcoal-900">{inShippingCount}</p>
                <p className="text-[10px] text-charcoal-500 mt-1">In transit via courier</p>
              </div>

              <div className="bg-white border border-sand-200 p-5 shadow-sm">
                <p className="text-[11px] tracking-wider uppercase text-charcoal-500 mb-1">Gross Revenue</p>
                <p className="font-display text-2xl font-bold text-charcoal-900">{formatPrice(totalRevenue)}</p>
                <p className="text-[10px] text-charcoal-500 mt-1">USD equivalent converted</p>
              </div>
            </div>

            {/* Recent Custom Commissions Table */}
            <div className="bg-white border border-sand-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display text-xl text-charcoal-900">
                  Recent Custom Rug Orders
                </h3>
                <button
                  onClick={() => setTab('custom-orders')}
                  className="text-xs text-accent hover:underline font-semibold"
                >
                  Manage All Custom Rugs →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-sand-50 text-charcoal-600 uppercase tracking-wider text-[10px] border-b border-sand-200">
                    <tr>
                      <th className="p-3">Order #</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Design Category</th>
                      <th className="p-3">Dimensions & Area</th>
                      <th className="p-3">Total Value</th>
                      <th className="p-3">50% Advance</th>
                      <th className="p-3">Production Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-100">
                    {customOrders.slice(0, 5).map((co) => (
                      <tr key={co.id} className="hover:bg-sand-50/50">
                        <td className="p-3 font-mono font-bold text-charcoal-900">{co.order_number}</td>
                        <td className="p-3">
                          <div className="font-medium text-charcoal-900">{co.customer_name}</div>
                          <div className="text-[11px] text-charcoal-400">{co.country}</div>
                        </td>
                        <td className="p-3">
                          <span className="font-medium">{co.design_name}</span>
                          <span className="text-[11px] text-charcoal-400 block">({co.design_category})</span>
                        </td>
                        <td className="p-3 font-mono">
                          {co.shape === 'circle' ? `⌀ ${co.diameter} ${co.unit}` : `${co.width} × ${co.length} ${co.unit}`}
                          <span className="block text-charcoal-400 text-[10px]">{co.area_sqft} sq ft</span>
                        </td>
                        <td className="p-3 font-bold text-charcoal-900">{formatPrice(co.total_price)}</td>
                        <td className="p-3 font-semibold text-emerald-700">{formatPrice(co.advance_paid)}</td>
                        <td className="p-3">
                          <span className="inline-block px-2 py-0.5 bg-sand-100 text-charcoal-800 text-[10px] uppercase font-bold tracking-wider">
                            {co.production_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOM RUG MANAGEMENT */}
        {tab === 'custom-orders' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-2xl text-charcoal-900">
                Custom Rug Production & Loom Allocation
              </h2>
              <p className="text-xs text-charcoal-500">
                Update client production stages to reflect instantly on the 8-stage visual timeline.
              </p>
            </div>

            <div className="space-y-4">
              {customOrders.map((order) => (
                <div key={order.id} className="bg-white border border-sand-200 p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-sand-200">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-bold text-charcoal-900">{order.order_number}</span>
                        <span className="text-sand-300">·</span>
                        <span className="text-xs text-accent uppercase font-medium">{order.rug_type === 'tufting' ? 'Hand-Tufted' : 'Jute Craft'}</span>
                        <span className="text-sand-300">·</span>
                        <span className="text-xs text-charcoal-400">{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-display text-xl text-charcoal-900">
                        {order.design_name || 'Bespoke Commission'}
                      </h3>
                      <p className="text-xs text-charcoal-500">
                        Client: <strong className="text-charcoal-800">{order.customer_name}</strong> ({order.customer_email}) · {order.country}
                      </p>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2">
                      <div className="text-right">
                        <span className="text-xs text-charcoal-500">Total: </span>
                        <span className="font-bold text-charcoal-900">{formatPrice(order.total_price)}</span>
                        <span className="text-xs text-emerald-700 ml-2">({formatPrice(order.advance_paid)} paid)</span>
                      </div>

                      {/* 8-Stage Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-charcoal-600 font-medium">Update Stage:</span>
                        <select
                          value={order.production_status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderTrackingStatus)}
                          className="bg-sand-50 border border-sand-300 px-3 py-1.5 text-xs font-semibold text-charcoal-900 outline-none focus:border-accent"
                        >
                          {ORDER_TRACKING_STAGES.map((st) => (
                            <option key={st.label} value={st.label}>
                              {st.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Artwork & Specs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                    {/* Artwork image thumbnail */}
                    <div>
                      <span className="text-charcoal-500 block mb-1 uppercase tracking-wider text-[10px]">Client Artwork:</span>
                      {order.uploaded_artwork_url ? (
                        <div className="relative group cursor-pointer aspect-video bg-sand-100 overflow-hidden border border-sand-200">
                          <img
                            src={order.uploaded_artwork_url}
                            alt=""
                            className="w-full h-full object-cover"
                            onClick={() => setActiveArtworkModal(order.uploaded_artwork_url || null)}
                          />
                          <div
                            onClick={() => setActiveArtworkModal(order.uploaded_artwork_url || null)}
                            className="absolute inset-0 bg-charcoal-900/40 text-cream opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                          >
                            <Eye size={16} />
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-sand-50 border text-charcoal-400">Library Vector Pattern</div>
                      )}
                    </div>

                    <div>
                      <span className="text-charcoal-500 block mb-1 uppercase tracking-wider text-[10px]">Dimensions & Area:</span>
                      <p className="font-semibold text-charcoal-800">
                        {order.shape === 'circle' ? `⌀ ${order.diameter} ${order.unit}` : `${order.width} × ${order.length} ${order.unit}`}
                      </p>
                      <p className="text-charcoal-500">{order.area_sqft} sq ft ({Math.round(order.area_sqft * 0.0929 * 10) / 10} m²)</p>
                      <p className="text-charcoal-500 capitalize">Shape: {order.shape}</p>
                    </div>

                    <div>
                      <span className="text-charcoal-500 block mb-1 uppercase tracking-wider text-[10px]">Material & Pile:</span>
                      <p className="font-medium text-charcoal-800">{order.yarn_type || '100% Wool'}</p>
                      <p className="text-charcoal-500">{order.pile_height || '16mm Plush'}</p>
                      <p className="text-charcoal-500">{order.finishing || 'Hand-Beveled'}</p>
                    </div>

                    <div>
                      <span className="text-charcoal-500 block mb-1 uppercase tracking-wider text-[10px]">Logistics:</span>
                      <p className="text-charcoal-700">Courier: <span className="font-mono">{order.tracking_number}</span></p>
                      <p className="text-charcoal-500">Est. Date: {order.estimated_delivery}</p>
                      <p className="text-charcoal-500">Gateway: {order.payment_method}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: STORE ORDERS */}
        {tab === 'ready-orders' && (
          <div className="bg-white border border-sand-200 p-6 shadow-sm space-y-4 animate-fade-in">
            <h2 className="font-display text-2xl text-charcoal-900 mb-4">
              Ready-Made Catalog Purchases
            </h2>

            {orders.length === 0 ? (
              <p className="text-xs text-charcoal-500 py-8 text-center">No ready-made orders placed yet.</p>
            ) : (
              <div className="divide-y divide-sand-100">
                {orders.map((o) => (
                  <div key={o.id} className="py-4 flex flex-col sm:flex-row justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-charcoal-900">{o.order_number}</span>
                        <span className="text-sand-300">·</span>
                        <span className="text-charcoal-500">{new Date(o.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="font-medium text-charcoal-800">{o.customer_name} ({o.customer_email})</p>
                      <p className="text-charcoal-500">{o.address}, {o.city}, {o.country}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-charcoal-900 text-sm">{formatPrice(o.total)}</p>
                      <p className="text-emerald-700 font-medium">Status: {o.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PRODUCT MANAGEMENT */}
        {tab === 'products' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-2xl text-charcoal-900">
                Catalog Product Management
              </h2>
              <button
                onClick={() => setNewProductModalOpen(true)}
                className="btn-primary !py-2.5 !text-xs flex items-center gap-1.5"
              >
                <Plus size={14} /> Add Product
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-white border border-sand-200 p-4 shadow-sm space-y-3">
                  <div className="aspect-[4/3] bg-sand-100 overflow-hidden relative border border-sand-200">
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {p.is_best_seller && (
                        <span className="bg-charcoal-900 text-cream text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold">
                          Best Seller
                        </span>
                      )}
                      {p.is_new_arrival && (
                        <span className="bg-accent text-cream text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold">
                          New Arrival
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] text-accent uppercase font-bold tracking-wider">
                      <span>{p.category}</span>
                      {p.subCategory && <span>· {p.subCategory}</span>}
                    </div>
                    <h3 className="font-display text-base text-charcoal-900 font-semibold line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="text-xs text-charcoal-500 line-clamp-1">{p.material}</p>
                    <p className="font-display text-base font-bold text-charcoal-900 pt-1">
                      {formatPrice(p.base_price)}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-sand-100 flex items-center justify-between text-xs">
                    <span className="text-charcoal-500">{p.stock_status}</span>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="text-charcoal-400 hover:text-red-600 transition-colors p-1"
                      aria-label="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PRICING ENGINE CONTROLLER */}
        {tab === 'pricing' && (
          <div className="bg-white border border-sand-200 p-6 sm:p-8 shadow-sm space-y-6 max-w-3xl animate-fade-in">
            <div>
              <h2 className="font-display text-2xl text-charcoal-900 mb-1">
                Dynamic Pricing Engine Controller
              </h2>
              <p className="text-xs text-charcoal-500 leading-relaxed">
                As per specification Section 6 & 18: The pricing system is controlled from this dashboard so the business owner can adjust rates dynamically without code modifications.
              </p>
            </div>

            {pricingSavedToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle size={16} />
                <span>Pricing rates updated successfully! Custom rug calculator now reflects these parameters.</span>
              </div>
            )}

            <form onSubmit={handleSavePricingConfig} className="space-y-6">
              {pricing.map((pc) => {
                const currentEdit = pricingForm[pc.rug_type] || {
                  price: pc.price_per_sqft,
                  min: pc.min_order_price,
                  surcharge: pc.shape_surcharge,
                };

                return (
                  <div key={pc.id} className="p-5 bg-sand-50 border border-sand-200 space-y-4">
                    <div className="flex justify-between items-baseline border-b border-sand-200 pb-2">
                      <span className="font-display text-base text-charcoal-900 font-bold">
                        {pc.label} ({pc.rug_type.toUpperCase()})
                      </span>
                      <span className="text-xs text-charcoal-400 uppercase font-mono">
                        Base Currency: USD ($)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="block text-charcoal-600 mb-1 font-medium">
                          Base Price / sq ft ($)
                        </label>
                        <input
                          type="number"
                          step="1"
                          value={currentEdit.price}
                          onChange={(e) =>
                            setPricingForm({
                              ...pricingForm,
                              [pc.rug_type]: {
                                ...currentEdit,
                                price: parseFloat(e.target.value) || 0,
                              },
                            })
                          }
                          className="input-field !py-2 text-xs font-mono font-bold"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-charcoal-600 mb-1 font-medium">
                          Minimum Order Price ($)
                        </label>
                        <input
                          type="number"
                          step="5"
                          value={currentEdit.min}
                          onChange={(e) =>
                            setPricingForm({
                              ...pricingForm,
                              [pc.rug_type]: {
                                ...currentEdit,
                                min: parseFloat(e.target.value) || 0,
                              },
                            })
                          }
                          className="input-field !py-2 text-xs font-mono font-bold"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-charcoal-600 mb-1 font-medium">
                          Special Shape Surcharge ($)
                        </label>
                        <input
                          type="number"
                          step="5"
                          value={currentEdit.surcharge}
                          onChange={(e) =>
                            setPricingForm({
                              ...pricingForm,
                              [pc.rug_type]: {
                                ...currentEdit,
                                surcharge: parseFloat(e.target.value) || 0,
                              },
                            })
                          }
                          className="input-field !py-2 text-xs font-mono font-bold"
                          required
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                type="submit"
                disabled={savingPricing}
                className="btn-primary !py-3.5 flex items-center justify-center gap-2"
              >
                <Save size={15} />
                <span>{savingPricing ? 'Updating Rates...' : 'Save & Publish Dynamic Pricing'}</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Modal for Zooming Client Artwork */}
      {activeArtworkModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/80 backdrop-blur-sm"
          onClick={() => setActiveArtworkModal(null)}
        >
          <div className="bg-white p-4 max-w-2xl w-full relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveArtworkModal(null)}
              className="absolute top-4 right-4 p-2 text-charcoal-700 hover:text-charcoal-900"
            >
              <X size={20} />
            </button>
            <p className="text-xs uppercase tracking-wider text-charcoal-500 mb-3">High-Resolution Client Artwork</p>
            <img src={activeArtworkModal} alt="" className="w-full max-h-[70vh] object-contain border" />
          </div>
        </div>
      )}

      {/* Add New Product Modal */}
      {newProductModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/70 backdrop-blur-sm"
          onClick={() => setNewProductModalOpen(false)}
        >
          <div
            className="bg-white max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-sand-200">
              <h3 className="font-display text-xl text-charcoal-900">Add New Atelier Product</h3>
              <button onClick={() => setNewProductModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-charcoal-600 mb-1">Product Title *</label>
                <input
                  required
                  type="text"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  className="input-field !py-2 text-xs"
                  placeholder="e.g. Sonargaon Terracotta Tufted Rug"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-charcoal-600 mb-1">Main Category</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value as 'TUFTING RUGS' | 'JUTE HANDCRAFT' })}
                    className="input-field !py-2 text-xs"
                  >
                    <option value="TUFTING RUGS">TUFTING RUGS</option>
                    <option value="JUTE HANDCRAFT">JUTE HANDCRAFT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-charcoal-600 mb-1">Subcategory / Style</label>
                  <input
                    type="text"
                    value={newProductForm.subCategory}
                    onChange={(e) => setNewProductForm({ ...newProductForm, subCategory: e.target.value })}
                    className="input-field !py-2 text-xs"
                    placeholder="e.g. Islamic Designs, Abstract"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-charcoal-600 mb-1">Base Price ($ USD) *</label>
                  <input
                    required
                    type="number"
                    value={newProductForm.base_price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, base_price: Number(e.target.value) })}
                    className="input-field !py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-charcoal-600 mb-1">Stock Status</label>
                  <select
                    value={newProductForm.stock_status}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock_status: e.target.value as 'In Stock' | 'Made to Order' | 'Limited Edition' })}
                    className="input-field !py-2 text-xs"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Made to Order">Made to Order</option>
                    <option value="Limited Edition">Limited Edition</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-charcoal-600 mb-1">Material Composition</label>
                <input
                  type="text"
                  value={newProductForm.material}
                  onChange={(e) => setNewProductForm({ ...newProductForm, material: e.target.value })}
                  className="input-field !py-2 text-xs"
                  placeholder="e.g. 100% New Zealand Wool & Cotton Twill"
                />
              </div>

              <div>
                <label className="block text-charcoal-600 mb-1">Image URL</label>
                <input
                  type="url"
                  value={newProductForm.image_url}
                  onChange={(e) => setNewProductForm({ ...newProductForm, image_url: e.target.value })}
                  className="input-field !py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-charcoal-600 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  className="input-field !py-2 text-xs"
                  placeholder="Artisan story, inspiration, weaving technique..."
                />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProductForm.is_featured}
                    onChange={(e) => setNewProductForm({ ...newProductForm, is_featured: e.target.checked })}
                  />
                  <span>Featured</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProductForm.is_best_seller}
                    onChange={(e) => setNewProductForm({ ...newProductForm, is_best_seller: e.target.checked })}
                  />
                  <span>Best Seller</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProductForm.is_new_arrival}
                    onChange={(e) => setNewProductForm({ ...newProductForm, is_new_arrival: e.target.checked })}
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              <div className="pt-4 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewProductModalOpen(false)}
                  className="btn-secondary !text-xs !py-2"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary !text-xs !py-2">
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
