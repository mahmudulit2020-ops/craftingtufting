import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { Search, CheckCircle2, Truck, Printer } from 'lucide-react';
import { findOrderByTrackingCode, getLocalCustomOrders } from '@/lib/api';
import { ORDER_TRACKING_STAGES, type CustomOrder, type Order } from '@/lib/types';
import { useCurrency } from '@/context/CurrencyContext';

export default function OrderTrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams<{ id: string }>();
  const initialCode = id || searchParams.get('code') || '';

  const { formatPrice } = useCurrency();
  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [customOrder, setCustomOrder] = useState<CustomOrder | null>(null);
  const [standardOrder, setStandardOrder] = useState<Order | null>(null);

  const runSearch = useCallback(async (lookupCode: string) => {
    if (!lookupCode.trim()) return;
    setLoading(true);
    setSearched(true);
    setSearchParams({ code: lookupCode });
    try {
      const result = await findOrderByTrackingCode(lookupCode);
      if (result?.customOrder) {
        setCustomOrder(result.customOrder);
        setStandardOrder(null);
      } else if (result?.standardOrder) {
        setStandardOrder(result.standardOrder);
        setCustomOrder(null);
      } else {
        setCustomOrder(null);
        setStandardOrder(null);
      }
    } finally {
      setLoading(false);
    }
  }, [setSearchParams]);

  useEffect(() => {
    if (initialCode) {
      runSearch(initialCode);
    } else {
      // Default to the first seed order for delightful immediate demonstration
      const existing = getLocalCustomOrders();
      if (existing.length > 0) {
        setCode(existing[0].order_number);
        runSearch(existing[0].order_number);
      }
    }
  }, [initialCode, runSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(code);
  };

  const getStageIndex = (currentStatus: string): number => {
    const idx = ORDER_TRACKING_STAGES.findIndex(
      (s) => s.label.toLowerCase() === currentStatus.toLowerCase()
    );
    return idx >= 0 ? idx : 1;
  };

  const activeStageIdx = customOrder
    ? getStageIndex(customOrder.production_status)
    : standardOrder
    ? getStageIndex(standardOrder.status)
    : 0;

  return (
    <div className="bg-cream min-h-screen py-12 lg:py-20">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs tracking-[0.25em] uppercase text-accent font-semibold mb-3">
            Atelier Transparency
          </p>
          <h1 className="font-display text-3xl lg:text-5xl text-charcoal-900 mb-4">
            Track Your Custom Rug
          </h1>
          <p className="text-sm text-charcoal-600 leading-relaxed">
            Follow your handcrafted creation from vector design review, artisan frame tufting, and pile carving to international courier delivery.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-sand-200 p-4 sm:p-6 shadow-sm mb-12 max-w-2xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400"
              />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter Order # (e.g. CT-84920 or CT-51203)"
                className="w-full pl-10 pr-4 py-3 bg-sand-50 border border-sand-200 text-charcoal-900 text-sm outline-none focus:border-accent focus:bg-white transition-all uppercase tracking-wider font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary !px-6 text-xs whitespace-nowrap"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {/* Quick Demo Links */}
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-charcoal-500">
            <span>Demo tracking codes:</span>
            {['CT-84920', 'CT-51203', 'CT-30419'].map((demoCode) => (
              <button
                key={demoCode}
                type="button"
                onClick={() => {
                  setCode(demoCode);
                  runSearch(demoCode);
                }}
                className="font-mono text-accent hover:underline bg-sand-100 px-2 py-0.5"
              >
                {demoCode}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-2 border-sand-300 border-t-accent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs uppercase tracking-widest text-charcoal-600">
              Retrieving atelier production logs...
            </p>
          </div>
        ) : customOrder ? (
          <div className="space-y-8 animate-fade-in">
            {/* Status Timeline Card */}
            <div className="bg-white border border-sand-200 p-6 lg:p-10 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-sand-200">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-bold text-charcoal-900">
                      {customOrder.order_number}
                    </span>
                    <span className="text-sand-300">·</span>
                    <span className="text-xs tracking-wider uppercase text-accent font-medium">
                      {customOrder.rug_type === 'tufting' ? 'Hand-Tufted Wool Rug' : 'Organic Jute Rug'}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl text-charcoal-900">
                    {customOrder.design_name || 'Bespoke Custom Rug'}
                  </h2>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs text-charcoal-500 tracking-wider uppercase">Current Status</div>
                  <div className="text-base font-semibold text-terracotta">
                    {customOrder.production_status}
                  </div>
                  {customOrder.estimated_delivery && (
                    <div className="text-xs text-charcoal-500 mt-0.5">
                      Est. Delivery: {customOrder.estimated_delivery}
                    </div>
                  )}
                </div>
              </div>

              {/* 8-Stage Timeline */}
              <div className="py-10">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 relative">
                  {ORDER_TRACKING_STAGES.map((stage, idx) => {
                    const isCompleted = idx <= activeStageIdx;
                    const isCurrent = idx === activeStageIdx;

                    return (
                      <div key={stage.id} className="flex flex-col items-center text-center relative group">
                        {/* Connecting Line */}
                        {idx < ORDER_TRACKING_STAGES.length - 1 && (
                          <div
                            className={`hidden lg:block absolute top-4 left-1/2 w-full h-0.5 -z-0 transition-colors ${
                              idx < activeStageIdx ? 'bg-terracotta' : 'bg-sand-200'
                            }`}
                          />
                        )}

                        {/* Node Icon */}
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center relative z-10 transition-all ${
                            isCurrent
                              ? 'bg-terracotta text-cream ring-4 ring-terracotta/20 shadow-md scale-110'
                              : isCompleted
                              ? 'bg-charcoal-900 text-cream'
                              : 'bg-sand-100 text-charcoal-400 border border-sand-300'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            <span className="text-xs font-semibold">{idx + 1}</span>
                          )}
                        </div>

                        {/* Label */}
                        <div className="mt-3 space-y-1">
                          <p
                            className={`text-xs font-medium uppercase tracking-wider ${
                              isCurrent
                                ? 'text-terracotta font-bold'
                                : isCompleted
                                ? 'text-charcoal-900'
                                : 'text-charcoal-400'
                            }`}
                          >
                            {stage.label}
                          </p>
                          <p className="text-[10px] text-charcoal-400 leading-tight hidden sm:block">
                            {stage.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Courier Tracking Callout */}
              {customOrder.tracking_number && (
                <div className="bg-sand-50 border border-sand-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-charcoal-700">
                    <Truck size={16} className="text-accent" />
                    <span>Courier Reference: </span>
                    <span className="font-mono font-bold text-charcoal-900">
                      {customOrder.tracking_number}
                    </span>
                  </div>
                  <div className="text-charcoal-500">
                    Insured international express carriage with climate-sealed wrapping
                  </div>
                </div>
              )}
            </div>

            {/* Order Specification Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Artwork & Visual Preview */}
              <div className="bg-white border border-sand-200 p-6 space-y-4">
                <p className="text-xs tracking-[0.2em] uppercase text-charcoal-500 font-medium">
                  Custom Artwork Reference
                </p>
                <div className="aspect-[4/3] bg-sand-100 overflow-hidden border border-sand-200 flex items-center justify-center">
                  {customOrder.uploaded_artwork_url ? (
                    <img
                      src={customOrder.uploaded_artwork_url}
                      alt={customOrder.design_name || 'Artwork'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4 text-xs text-charcoal-400">
                      Studio Geometric Vector
                    </div>
                  )}
                </div>
                {customOrder.uploaded_file_name && (
                  <p className="text-xs text-charcoal-500 font-mono truncate">
                    File: {customOrder.uploaded_file_name}
                  </p>
                )}
                <div className="pt-2 border-t border-sand-100 flex items-center justify-between text-xs">
                  <span className="text-charcoal-500">Design Category:</span>
                  <span className="font-medium text-charcoal-800">
                    {customOrder.design_category}
                  </span>
                </div>
              </div>

              {/* Crafting Options */}
              <div className="bg-white border border-sand-200 p-6 space-y-3 text-xs">
                <p className="text-xs tracking-[0.2em] uppercase text-charcoal-500 font-medium pb-2 border-b border-sand-100">
                  Crafting Specifications
                </p>
                <div className="flex justify-between py-1">
                  <span className="text-charcoal-500">Dimensions:</span>
                  <span className="font-medium text-charcoal-900">
                    {customOrder.shape === 'circle'
                      ? `${customOrder.diameter} ${customOrder.unit} Diameter`
                      : `${customOrder.width} × ${customOrder.length} ${customOrder.unit}`}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-charcoal-500">Calculated Area:</span>
                  <span className="font-medium text-charcoal-900">
                    {customOrder.area_sqft} sq ft ({Math.round(customOrder.area_sqft * 0.0929 * 10) / 10} m²)
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-charcoal-500">Yarn Material:</span>
                  <span className="font-medium text-charcoal-900">{customOrder.yarn_type || '100% Wool'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-charcoal-500">Pile Thickness:</span>
                  <span className="font-medium text-charcoal-900">{customOrder.pile_height || '16mm Plush'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-charcoal-500">Backing:</span>
                  <span className="font-medium text-charcoal-900">{customOrder.backing || 'Cotton Twill'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-charcoal-500">Finishing:</span>
                  <span className="font-medium text-charcoal-900">{customOrder.finishing || 'Hand-Beveled'}</span>
                </div>
              </div>

              {/* Financial Status & 50% Advance */}
              <div className="bg-white border border-sand-200 p-6 space-y-4">
                <p className="text-xs tracking-[0.2em] uppercase text-charcoal-500 font-medium pb-2 border-b border-sand-100">
                  Payment & Balance
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-charcoal-500">Total Order Value:</span>
                    <span className="font-bold text-charcoal-900 text-sm">
                      {formatPrice(customOrder.total_price)}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>50% Advance Paid:</span>
                    <span>✓ {formatPrice(customOrder.advance_paid)}</span>
                  </div>
                  <div className="flex justify-between text-charcoal-700">
                    <span>Remaining Balance:</span>
                    <span className="font-bold text-charcoal-900">
                      {formatPrice(customOrder.remaining)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-sand-100 text-[11px] text-charcoal-400">
                    <span>Payment Gateway:</span>
                    <span>{customOrder.payment_method}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => window.print()}
                    className="w-full btn-secondary !py-2.5 !text-xs flex items-center justify-center gap-1.5"
                  >
                    <Printer size={13} /> Print Atelier Receipt
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : standardOrder ? (
          <div className="bg-white border border-sand-200 p-6 lg:p-10 shadow-sm animate-fade-in space-y-6">
            <div className="flex justify-between items-baseline pb-6 border-b border-sand-200">
              <div>
                <span className="font-mono text-sm font-bold text-charcoal-900">
                  {standardOrder.order_number}
                </span>
                <h2 className="font-display text-2xl text-charcoal-900 mt-1">
                  Ready-Made Artisan Collection Order
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-charcoal-500 uppercase tracking-widest block">Status</span>
                <span className="text-sm font-semibold text-accent">{standardOrder.status}</span>
              </div>
            </div>

            <div className="divide-y divide-sand-100">
              {standardOrder.items.map((it, i) => (
                <div key={i} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-medium text-charcoal-900 block">{it.name}</span>
                    <span className="text-charcoal-500">{it.size} · Qty: {it.quantity}</span>
                  </div>
                  <span className="font-semibold text-charcoal-900">
                    {formatPrice(it.price * it.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-sand-200 flex justify-between items-baseline">
              <span className="text-xs uppercase tracking-wider text-charcoal-600">Total Paid</span>
              <span className="font-display text-xl font-bold text-charcoal-900">
                {formatPrice(standardOrder.total)}
              </span>
            </div>
          </div>
        ) : searched ? (
          <div className="text-center py-16 bg-white border border-sand-200 max-w-xl mx-auto p-8">
            <p className="font-display text-xl text-charcoal-800 mb-2">No order matching "{code}"</p>
            <p className="text-xs text-charcoal-500 mb-6 leading-relaxed">
              Please verify the order number on your payment receipt or email confirmation. If you recently placed an order, it may take a few minutes to index.
            </p>
            <Link to="/contact" className="btn-secondary !text-xs !py-2.5">
              Contact Artisan Support
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
