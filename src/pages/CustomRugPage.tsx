import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft, Upload, ShoppingBag } from 'lucide-react';
import RugPreview from '@/components/RugPreview';
import PriceDisplay from '@/components/PriceDisplay';
import OrderSummary from '@/components/OrderSummary';
import { fetchPricingConfig, fetchAddons, fetchCustomDesigns, generateOrderNumber, createCustomOrder } from '@/lib/api';
import { calculateAreaSqft, calculatePrice, formatCurrency, buildCustomConfig } from '@/lib/pricing';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import type { Addon, CustomDesign, PricingConfig, RugShape, RugType, Unit } from '@/lib/types';

const STEPS = ['Rug Type', 'Shape', 'Measurements', 'Design & Colors', 'Add-ons', 'Order'];

const shapes: { value: RugShape; label: string; icon: string }[] = [
  { value: 'rectangle', label: 'Rectangle', icon: '▭' },
  { value: 'square', label: 'Square', icon: '◻' },
  { value: 'circle', label: 'Circle', icon: '◯' },
  { value: 'oval', label: 'Oval', icon: '⬭' },
  { value: 'custom', label: 'Custom Shape', icon: '⬗' },
];

const units: { value: Unit; label: string }[] = [
  { value: 'ft', label: 'ft' },
  { value: 'in', label: 'in' },
  { value: 'cm', label: 'cm' },
  { value: 'm', label: 'm' },
];

const designCategories = [
  'All', 'Abstract', 'Floral', 'Geometric', 'Minimal', 'Nature',
  'Modern', 'Kids', 'Custom Art', 'Logo / Branding', 'Photo / Portrait',
  'Traditional', 'Islamic / Geometric',
];

export default function CustomRugPage() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState(0);
  const [pricing, setPricing] = useState<PricingConfig[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [designs, setDesigns] = useState<CustomDesign[]>([]);
  const [loading, setLoading] = useState(true);

  // Config state
  const [rugType, setRugType] = useState<RugType | null>(null);
  const [shape, setShape] = useState<RugShape>('rectangle');
  const [width, setWidth] = useState(6);
  const [length, setLength] = useState(8);
  const [diameter, setDiameter] = useState(6);
  const [unit, setUnit] = useState<Unit>('ft');
  const [designCategory, setDesignCategory] = useState('All');
  const [selectedDesign, setSelectedDesign] = useState<CustomDesign | null>(null);
  const [uploadedArtwork, setUploadedArtwork] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadWarning, setUploadWarning] = useState<string | null>(null);
  const [colors, setColors] = useState({
    primary: '#4A4A46',
    secondary: '#8B6F47',
    accent: '#242421',
    background: '#EBE0D0',
  });
  const [selectedAddonCodes, setSelectedAddonCodes] = useState<string[]>([]);
  const [orderForm, setOrderForm] = useState({
    customer_name: user?.user_metadata?.full_name || '',
    customer_email: user?.email || '',
    customer_phone: '',
    payment_method: 'bKash',
    bkash_sender_number: '',
    bkash_trx_id: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{ order_number: string } | null>(null);

  useEffect(() => {
    if (user) {
      setOrderForm((prev) => ({
        ...prev,
        customer_name: prev.customer_name || user.user_metadata?.full_name || '',
        customer_email: prev.customer_email || user.email || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    Promise.all([fetchPricingConfig(), fetchAddons(), fetchCustomDesigns()])
      .then(([p, a, d]) => {
        setPricing(p);
        setAddons(a);
        setDesigns(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const currentPricing = pricing.find((p) => p.rug_type === rugType);
  const currencySymbol = currentPricing?.currency_symbol || '৳';

  const areaSqft = useMemo(() => {
    if (!rugType) return 0;
    return calculateAreaSqft(shape, width, length, diameter, unit);
  }, [rugType, shape, width, length, diameter, unit]);

  const pricingResult = useMemo(() => {
    if (!currentPricing) return null;
    return calculatePrice({
      pricing: currentPricing,
      addons,
      shape,
      areaSqft,
      designComplexity: selectedDesign?.complexity || 'standard',
      selectedAddonCodes,
    });
  }, [currentPricing, addons, shape, areaSqft, selectedDesign, selectedAddonCodes]);

  const filteredDesigns = useMemo(() => {
    if (designCategory === 'All') return designs;
    return designs.filter((d) => d.category === designCategory);
  }, [designs, designCategory]);

  const addonLabels = useMemo(() => {
    const map: Record<string, string> = {};
    addons.forEach((a) => { map[a.code] = a.label; });
    return map;
  }, [addons]);

  const canProceed = (): boolean => {
    if (step === 0) return rugType !== null;
    if (step === 1) return shape !== null;
    if (step === 2) return areaSqft > 0;
    if (step === 3) return selectedDesign !== null || uploadedArtwork !== null;
    if (step === 4) return true;
    return true;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setUploadWarning('Please upload PNG, JPG, WEBP, or PDF files only.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadWarning('File size must be under 10MB.');
      return;
    }
    setUploadWarning(null);
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedArtwork(reader.result as string);
      setSelectedDesign(null);
    };
    if (file.type === 'application/pdf') {
      setUploadedArtwork('pdf');
    } else {
      reader.readAsDataURL(file);
    }
  };

  const removeUpload = () => {
    setUploadedArtwork(null);
    setUploadedFileName(null);
    setUploadWarning(null);
  };

  const toggleAddon = (code: string) => {
    setSelectedAddonCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleSubmitOrder = async () => {
    if (!pricingResult || !rugType) return;
    setSubmitting(true);
    try {
      const orderNumber = generateOrderNumber('CT');
      const config = buildCustomConfig({
        rugType,
        shape,
        width,
        length,
        diameter,
        unit,
        designId: selectedDesign?.id || null,
        designName: selectedDesign?.name || uploadedFileName || 'Custom Upload',
        uploadedArtworkUrl: uploadedArtwork,
        colors,
        addonCodes: selectedAddonCodes,
        pricingResult,
      });

      await createCustomOrder({
        order_number: orderNumber,
        user_id: user?.id ?? null,
        customer_name: orderForm.customer_name,
        customer_email: orderForm.customer_email,
        customer_phone: orderForm.customer_phone,
        rug_type: rugType,
        shape,
        width: shape === 'circle' ? null : width,
        length: shape === 'circle' || shape === 'square' ? null : length,
        diameter: shape === 'circle' ? diameter : null,
        unit,
        area_sqft: areaSqft,
        design_id: selectedDesign?.id || null,
        design_name: config.designName,
        uploaded_artwork_url: uploadedArtwork,
        colors,
        addon_codes: selectedAddonCodes,
        base_price: pricingResult.basePrice,
        addon_total: pricingResult.addonTotal,
        total_price: pricingResult.total,
        advance_paid: pricingResult.advance,
        remaining: pricingResult.remaining,
        payment_method: orderForm.payment_method,
        bkash_sender_number: orderForm.payment_method === 'bKash' ? orderForm.bkash_sender_number : null,
        bkash_trx_id: orderForm.payment_method === 'bKash' ? orderForm.bkash_trx_id : null,
        notes: orderForm.notes,
      });

      setConfirmedOrder({ order_number: orderNumber });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      alert('There was an error placing your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddToCart = () => {
    if (!pricingResult || !rugType) return;
    const config = buildCustomConfig({
      rugType,
      shape,
      width,
      length,
      diameter,
      unit,
      designId: selectedDesign?.id || null,
      designName: selectedDesign?.name || uploadedFileName || 'Custom Upload',
      uploadedArtworkUrl: uploadedArtwork,
      colors,
      addonCodes: selectedAddonCodes,
      pricingResult,
    });

    addItem({
      id: `custom-${Date.now()}`,
      type: 'custom',
      name: `Custom ${rugType === 'tufting' ? 'Tufting' : 'Jute'} Rug`,
      image: selectedDesign?.image_url,
      size: shape === 'circle'
        ? `Ø ${diameter} ${unit}`
        : shape === 'square'
        ? `${width} ${unit}`
        : `${width} × ${length} ${unit}`,
      quantity: 1,
      price: pricingResult.total,
      customConfig: config,
    });
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sand-200 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (confirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-6 lg:px-10 py-20 lg:py-32 text-center">
        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-accent/10 flex items-center justify-center animate-scale-in">
          <Check size={36} className="text-accent" />
        </div>
        <h1 className="font-display text-display-md text-charcoal-900 mb-4">Your Custom Rug Order Is Confirmed</h1>
        <p className="text-charcoal-500 mb-8">Your order has been received. We'll review your design and begin production after confirmation.</p>

        <div className="bg-white border border-sand-100 p-8 text-left mb-8">
          <div className="flex justify-between items-center pb-4 border-b border-sand-100 mb-4">
            <span className="text-xs tracking-[0.15em] uppercase text-charcoal-500">Order ID</span>
            <span className="font-display text-2xl text-charcoal-900">{confirmedOrder.order_number}</span>
          </div>
          {pricingResult && (
            <>
              <div className="flex justify-between py-2">
                <span className="text-charcoal-500 text-sm">Total Order Value</span>
                <span className="text-charcoal-900 font-medium">{formatCurrency(pricingResult.total, currencySymbol)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-accent text-sm font-medium">Advance Paid (50%)</span>
                <span className="text-charcoal-900 font-semibold">{formatCurrency(pricingResult.advance, currencySymbol)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-charcoal-500 text-sm">Remaining Balance</span>
                <span className="text-charcoal-700">{formatCurrency(pricingResult.remaining, currencySymbol)}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={() => navigate('/')} className="btn-secondary">Back to Home</button>
          <button onClick={() => navigate('/shop')} className="btn-primary">Continue Shopping</button>
        </div>
      </div>
    );
  }

  const configForSummary = {
    rugType: rugType || '',
    shape,
    width,
    length,
    diameter,
    unit,
    areaSqft,
    designName: selectedDesign?.name || uploadedFileName,
    addonCodes: selectedAddonCodes,
    colors,
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <div className="bg-charcoal-900 text-cream py-12 lg:py-16">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
          <p className="text-xs tracking-[0.3em] uppercase text-sand-300 mb-3">Custom Rug Studio</p>
          <h1 className="font-display text-display-md mb-4">Design Your Custom Rug</h1>
          <p className="text-cream/60 max-w-2xl">
            Choose your shape, enter your measurements, customize your design and instantly see your estimated price.
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="border-b border-sand-100 bg-cream sticky top-[65px] z-30">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
          <div className="flex items-center overflow-x-auto py-4 gap-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => i < step && setStep(i)}
                  className={`flex items-center gap-2 text-xs tracking-[0.12em] uppercase transition-colors ${
                    i === step ? 'text-accent font-medium' : i < step ? 'text-charcoal-700 cursor-pointer' : 'text-charcoal-300'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border transition-all ${
                    i === step ? 'bg-accent text-cream border-accent' : i < step ? 'bg-charcoal-800 text-cream border-charcoal-800' : 'border-sand-200 text-charcoal-400'
                  }`}>
                    {i < step ? <Check size={12} /> : i + 1}
                  </span>
                  {label}
                </button>
                {i < STEPS.length - 1 && <span className="text-sand-300">—</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-12">
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-12">
          {/* Main content */}
          <div className="order-2 lg:order-1">
            {/* STEP 0 — Rug Type */}
            {step === 0 && (
              <div className="animate-fade-in">
                <h2 className="font-display text-3xl text-charcoal-900 mb-2">Choose Your Rug Type</h2>
                <p className="text-charcoal-500 mb-8">Select the craft tradition for your custom rug.</p>

                <div className="grid md:grid-cols-2 gap-6">
                  {pricing.map((p) => {
                    const isSelected = rugType === p.rug_type;
                    const img = p.rug_type === 'jute'
                      ? 'https://images.pexels.com/photos/36346077/pexels-photo-36346077.jpeg?auto=compress&cs=tinysrgb&h=600&w=800'
                      : 'https://images.pexels.com/photos/28379849/pexels-photo-28379849.jpeg?auto=compress&cs=tinysrgb&h=600&w=800';
                    return (
                      <button
                        key={p.rug_type}
                        onClick={() => setRugType(p.rug_type as RugType)}
                        className={`group relative overflow-hidden text-left transition-all duration-500 ${isSelected ? 'ring-2 ring-accent ring-offset-4 ring-offset-cream' : 'ring-1 ring-sand-100 hover:ring-sand-300'}`}
                      >
                        <div className="aspect-[4/3] overflow-hidden bg-sand-50">
                          <img src={img} alt={p.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <div className="p-6 bg-white">
                          <h3 className="font-display text-2xl text-charcoal-900 mb-2">{p.label}</h3>
                          <p className="text-sm text-charcoal-500 mb-4">
                            {p.rug_type === 'jute'
                              ? 'Natural handmade jute rugs with earthy texture and organic beauty.'
                              : 'Custom artistic tufted rugs with plush pile and carved detail.'}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-charcoal-700">
                              From <span className="font-semibold">{formatCurrency(p.price_per_sqft, p.currency_symbol)}</span>/sq ft
                            </span>
                            <span className={`text-xs tracking-[0.15em] uppercase px-4 py-2 transition-colors ${isSelected ? 'bg-accent text-cream' : 'bg-charcoal-800 text-cream group-hover:bg-charcoal-900'}`}>
                              {isSelected ? 'Selected' : 'Select'}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 1 — Shape */}
            {step === 1 && (
              <div className="animate-fade-in">
                <h2 className="font-display text-3xl text-charcoal-900 mb-2">Choose Your Shape</h2>
                <p className="text-charcoal-500 mb-8">Select the shape that best fits your space.</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {shapes.map((s) => {
                    const isSelected = shape === s.value;
                    return (
                      <button
                        key={s.value}
                        onClick={() => setShape(s.value)}
                        className={`p-8 text-center transition-all duration-300 ${isSelected ? 'bg-charcoal-900 text-cream' : 'bg-white border border-sand-100 hover:border-sand-300 text-charcoal-800'}`}
                      >
                        <div className="text-4xl mb-3 font-display">{s.icon}</div>
                        <p className="text-sm tracking-[0.1em] uppercase">{s.label}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 bg-white border border-sand-100 p-6">
                  <p className="text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-4">Preview</p>
                  <RugPreview shape={shape} width={width} length={length} diameter={diameter} unit={unit} colors={colors} rugType={rugType || 'tufting'} />
                </div>
              </div>
            )}

            {/* STEP 2 — Measurements */}
            {step === 2 && (
              <div className="animate-fade-in">
                <h2 className="font-display text-3xl text-charcoal-900 mb-2">Measure Your Rug</h2>
                <p className="text-charcoal-500 mb-8">How large should your rug be? Enter your dimensions below.</p>

                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xs tracking-[0.15em] uppercase text-charcoal-500 mr-2">Units:</span>
                  {units.map((u) => (
                    <button
                      key={u.value}
                      onClick={() => setUnit(u.value)}
                      className={`px-4 py-2 text-sm transition-colors ${unit === u.value ? 'bg-charcoal-800 text-cream' : 'bg-white border border-sand-200 text-charcoal-600 hover:border-sand-400'}`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>

                <div className="bg-white border border-sand-100 p-6 lg:p-8">
                  <div className="bg-sand-50 mb-8">
                    <RugPreview shape={shape} width={width} length={length} diameter={diameter} unit={unit} colors={colors} rugType={rugType || 'tufting'} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6 max-w-md">
                    {(shape === 'rectangle' || shape === 'oval' || shape === 'custom') && (
                      <div>
                        <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-3">Width</label>
                        <div className="flex items-stretch">
                          <input
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(Math.max(0, parseFloat(e.target.value) || 0))}
                            min="0"
                            step="0.5"
                            className="input-field flex-1 text-lg"
                          />
                          <span className="bg-charcoal-800 text-cream px-4 flex items-center text-sm">{unit}</span>
                        </div>
                      </div>
                    )}
                    {(shape === 'rectangle' || shape === 'oval' || shape === 'custom') && (
                      <div>
                        <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-3">Length</label>
                        <div className="flex items-stretch">
                          <input
                            type="number"
                            value={length}
                            onChange={(e) => setLength(Math.max(0, parseFloat(e.target.value) || 0))}
                            min="0"
                            step="0.5"
                            className="input-field flex-1 text-lg"
                          />
                          <span className="bg-charcoal-800 text-cream px-4 flex items-center text-sm">{unit}</span>
                        </div>
                      </div>
                    )}
                    {shape === 'square' && (
                      <div>
                        <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-3">Size</label>
                        <div className="flex items-stretch">
                          <input
                            type="number"
                            value={width}
                            onChange={(e) => { setWidth(Math.max(0, parseFloat(e.target.value) || 0)); setLength(Math.max(0, parseFloat(e.target.value) || 0)); }}
                            min="0"
                            step="0.5"
                            className="input-field flex-1 text-lg"
                          />
                          <span className="bg-charcoal-800 text-cream px-4 flex items-center text-sm">{unit}</span>
                        </div>
                      </div>
                    )}
                    {shape === 'circle' && (
                      <div>
                        <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-3">Diameter</label>
                        <div className="flex items-stretch">
                          <input
                            type="number"
                            value={diameter}
                            onChange={(e) => setDiameter(Math.max(0, parseFloat(e.target.value) || 0))}
                            min="0"
                            step="0.5"
                            className="input-field flex-1 text-lg"
                          />
                          <span className="bg-charcoal-800 text-cream px-4 flex items-center text-sm">{unit}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-6 border-t border-sand-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm tracking-[0.15em] uppercase text-charcoal-500">Calculated Area</span>
                      <span className="font-display text-4xl text-charcoal-900">
                        {areaSqft.toFixed(1)} <span className="text-lg text-charcoal-500">sq ft</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 — Design & Colors */}
            {step === 3 && (
              <div className="animate-fade-in">
                <h2 className="font-display text-3xl text-charcoal-900 mb-2">Choose Your Design</h2>
                <p className="text-charcoal-500 mb-6">Choose a design from our library or upload your own artwork, then continue to customize and place your order.</p>

                <section className="bg-white border border-sand-100 p-6 lg:p-8 mb-8" aria-labelledby="own-design-heading">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-10 h-10 bg-sand-50 flex items-center justify-center flex-shrink-0">
                      <Upload size={20} className="text-accent" />
                    </div>
                    <div>
                      <h3 id="own-design-heading" className="font-display text-2xl text-charcoal-900 mb-1">Use Your Own Design</h3>
                      <p className="text-sm text-charcoal-500">Upload your artwork to include it with your custom rug order. PNG, JPG, WEBP, or PDF, up to 10MB.</p>
                    </div>
                  </div>

                  {uploadedArtwork ? (
                    <div className="max-w-sm">
                      <div className="relative bg-sand-50 p-4 mb-3">
                        {uploadedArtwork === 'pdf' ? (
                          <div className="h-48 flex items-center justify-center text-charcoal-500 text-sm">{uploadedFileName}</div>
                        ) : (
                          <img src={uploadedArtwork} alt="Your uploaded design preview" className="w-full h-48 object-contain" />
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm text-charcoal-700 truncate">{uploadedFileName}</p>
                        <button type="button" onClick={removeUpload} className="text-xs text-accent hover:underline flex-shrink-0">Remove design</button>
                      </div>
                    </div>
                  ) : (
                    <label className="block cursor-pointer">
                      <div className="border-2 border-dashed border-sand-300 p-8 text-center hover:border-accent transition-colors">
                        <Upload size={24} className="text-charcoal-400 mx-auto mb-3" />
                        <p className="text-sm text-charcoal-700">Choose a file from your device</p>
                        <p className="text-xs text-charcoal-400 mt-1">PNG, JPG, WEBP, or PDF · Max 10MB</p>
                      </div>
                      <input type="file" accept=".png,.jpg,.jpeg,.webp,.pdf" onChange={handleFileUpload} className="sr-only" />
                    </label>
                  )}

                  {uploadWarning && <p role="alert" className="text-sm text-red-600 mt-3">{uploadWarning}</p>}
                </section>

                <div className="flex gap-2 overflow-x-auto pb-4 mb-2">
                  <span className="text-xs tracking-[0.12em] uppercase text-charcoal-500 self-center mr-1">Or choose from the library</span>
                  {designCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setDesignCategory(cat)}
                      className={`px-4 py-2 text-xs tracking-[0.1em] uppercase whitespace-nowrap transition-colors ${designCategory === cat ? 'bg-charcoal-800 text-cream' : 'bg-white border border-sand-200 text-charcoal-600 hover:border-sand-400'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredDesigns.map((design) => {
                      const isSelected = selectedDesign?.id === design.id;
                      return (
                        <button
                          key={design.id}
                          onClick={() => { setSelectedDesign(design); setUploadedArtwork(null); setUploadedFileName(null); }}
                          className={`group text-left transition-all duration-300 ${isSelected ? 'ring-2 ring-accent ring-offset-2 ring-offset-cream' : 'ring-1 ring-sand-100 hover:ring-sand-300'}`}
                        >
                          <div className="aspect-square overflow-hidden bg-sand-50 relative">
                            <img src={design.image_url} alt={design.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            {isSelected && (
                              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-accent text-cream flex items-center justify-center">
                                <Check size={14} />
                              </div>
                            )}
                          </div>
                          <div className="p-3 bg-white">
                            <p className="text-sm text-charcoal-800 font-medium">{design.name}</p>
                            <p className="text-[10px] text-charcoal-400 uppercase tracking-wider">{design.category}</p>
                          </div>
                        </button>
                      );
                    })}
                </div>

                {/* Color customization */}
                <div className="mt-10 bg-white border border-sand-100 p-6 lg:p-8">
                  <h3 className="font-display text-xl text-charcoal-900 mb-2">Customize Colors</h3>
                  <p className="text-sm text-charcoal-500 mb-6">Choose colors for your rug design.</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {([
                      { key: 'primary', label: 'Primary' },
                      { key: 'secondary', label: 'Secondary' },
                      { key: 'accent', label: 'Accent' },
                      { key: 'background', label: 'Background' },
                    ] as const).map((c) => (
                      <div key={c.key}>
                        <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-3">{c.label}</label>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 border border-sand-200 overflow-hidden flex-shrink-0">
                            <input
                              type="color"
                              value={colors[c.key]}
                              onChange={(e) => setColors({ ...colors, [c.key]: e.target.value })}
                            />
                          </div>
                          <span className="text-sm text-charcoal-600 font-mono">{colors[c.key]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 — Add-ons */}
            {step === 4 && (
              <div className="animate-fade-in">
                <h2 className="font-display text-3xl text-charcoal-900 mb-2">Additional Options</h2>
                <p className="text-charcoal-500 mb-8">Enhance your rug with optional add-ons. Prices update instantly.</p>

                <div className="space-y-3">
                  {addons.map((addon) => {
                    const isSelected = selectedAddonCodes.includes(addon.code);
                    return (
                      <button
                        key={addon.code}
                        onClick={() => toggleAddon(addon.code)}
                        className={`w-full text-left p-5 flex items-center justify-between transition-all duration-300 ${isSelected ? 'bg-charcoal-900 text-cream' : 'bg-white border border-sand-100 hover:border-sand-300'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-cream bg-cream' : 'border-sand-300'}`}>
                            {isSelected && <Check size={14} className="text-charcoal-900" />}
                          </div>
                          <div>
                            <p className={`font-medium ${isSelected ? 'text-cream' : 'text-charcoal-900'}`}>{addon.label}</p>
                            <p className={`text-sm ${isSelected ? 'text-cream/60' : 'text-charcoal-500'}`}>{addon.description}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-medium ${isSelected ? 'text-cream' : 'text-charcoal-700'}`}>
                          +{formatCurrency(addon.price, currencySymbol)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5 — Order */}
            {step === 5 && (
              <div className="animate-fade-in">
                <h2 className="font-display text-3xl text-charcoal-900 mb-2">Place Your Order</h2>
                <p className="text-charcoal-500 mb-8">Fill in your details to confirm your custom rug order.</p>

                <div className="bg-white border border-sand-100 p-6 lg:p-8 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-2">Full Name *</label>
                      <input type="text" required value={orderForm.customer_name} onChange={(e) => setOrderForm({ ...orderForm, customer_name: e.target.value })} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-2">Phone *</label>
                      <input type="tel" required value={orderForm.customer_phone} onChange={(e) => setOrderForm({ ...orderForm, customer_phone: e.target.value })} className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-2">Email *</label>
                    <input type="email" required value={orderForm.customer_email} onChange={(e) => setOrderForm({ ...orderForm, customer_email: e.target.value })} className="input-field" />
                  </div>

                  <div>
                    <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-3">Payment Method</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {['bKash', 'Nagad', 'Bank Transfer', 'Card'].map((method) => (
                        <button
                          key={method}
                          onClick={() => setOrderForm({ ...orderForm, payment_method: method })}
                          className={`p-3 text-sm transition-colors ${orderForm.payment_method === method ? 'bg-charcoal-800 text-cream' : 'bg-cream border border-sand-200 text-charcoal-700 hover:border-sand-400'}`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual bKash Payment Details */}
                  {orderForm.payment_method === 'bKash' && (
                    <div className="bg-sand-50 border border-sand-200 p-5 space-y-4 rounded-sm animate-fade-in">
                      <div className="text-sm text-charcoal-800 space-y-1">
                        <p className="font-semibold text-accent">আমাদের বিকাশ নম্বর (Send Money / Payment):</p>
                        <p className="font-mono text-base font-bold text-charcoal-900 tracking-wider">01580678749</p>
                        <p className="text-xs text-charcoal-500">
                          অর্ডারের ৫০% অগ্রিম ({formatCurrency(pricingResult?.advance || 0, currencySymbol)}) টাকা পাঠিয়ে নিচের বক্সে আপনার বিকাশ নম্বর ও ট্রানজেকশন আইডি দিন।
                        </p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 pt-1">
                        <div>
                          <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-2">
                            যে নম্বর থেকে পাঠিয়েছেন (Sender Number) *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="017XXXXXXXX"
                            value={orderForm.bkash_sender_number}
                            onChange={(e) => setOrderForm({ ...orderForm, bkash_sender_number: e.target.value })}
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-2">
                            ট্রানজেকশন আইডি (TrxID) *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="যেমন: BL91XX..."
                            value={orderForm.bkash_trx_id}
                            onChange={(e) => setOrderForm({ ...orderForm, bkash_trx_id: e.target.value })}
                            className="input-field uppercase font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-2">Notes (optional)</label>
                    <textarea value={orderForm.notes} onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })} rows={3} className="input-field resize-none" placeholder="Any special requests or details about your design..." />
                  </div>

                  <div className="bg-sand-50 p-5 border-l-4 border-accent">
                    <p className="text-sm text-charcoal-700 leading-relaxed">
                      <span className="font-semibold">50% Advance Payment Required.</span> Your order is confirmed after payment of 50% of the total order value. Final production begins after design confirmation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-10">
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={16} /> Back
              </button>

              {step < 5 ? (
                <button
                  onClick={() => canProceed() && setStep(step + 1)}
                  disabled={!canProceed()}
                  className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Continue <ArrowRight size={16} />
                </button>
              ) : (
                <div className="flex gap-3">
                  <button onClick={handleAddToCart} className="btn-secondary">
                    <ShoppingBag size={16} /> Add to Cart
                  </button>
                  <button
                    onClick={handleSubmitOrder}
                    disabled={
                      submitting ||
                      !orderForm.customer_name ||
                      !orderForm.customer_email ||
                      !orderForm.customer_phone ||
                      (orderForm.payment_method === 'bKash' && (!orderForm.bkash_sender_number || !orderForm.bkash_trx_id))
                    }
                    className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Processing...' : 'Pay 50% Advance'} <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar — Live preview + price */}
          <div className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-32 space-y-6">
              <div className="bg-white border border-sand-100 p-6">
                <p className="text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-3">Live Preview</p>
                <div className="bg-sand-50">
                  <RugPreview shape={shape} width={width} length={length} diameter={diameter} unit={unit} colors={colors} rugType={rugType || 'tufting'} />
                </div>
              </div>

              {pricingResult && currentPricing && (
                <div className="bg-white border border-sand-100 p-6">
                  <p className="text-xs tracking-[0.15em] uppercase text-charcoal-500 mb-4">Live Price Estimate</p>
                  <PriceDisplay pricing={pricingResult} currencySymbol={currencySymbol} />
                </div>
              )}

              {pricingResult && (
                <OrderSummary
                  config={configForSummary}
                  pricing={pricingResult}
                  currencySymbol={currencySymbol}
                  addonLabels={addonLabels}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bar */}
      {pricingResult && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-charcoal-900 text-cream p-4 z-40 flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-[0.15em] uppercase text-cream/50">50% Advance</p>
            <p className="font-display text-xl">{formatCurrency(pricingResult.advance, currencySymbol)}</p>
          </div>
          <button
            onClick={() => canProceed() && setStep(Math.min(5, step + 1))}
            disabled={!canProceed()}
            className="bg-accent text-cream px-6 py-3 text-sm tracking-[0.15em] uppercase disabled:opacity-30"
          >
            {step < 5 ? 'Continue' : 'Order'}
          </button>
        </div>
      )}
    </div>
  );
}