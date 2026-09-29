import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload,
  Check,
  ArrowRight,
  ArrowLeft,
  X,
  Maximize2,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import RugPreview from '@/components/RugPreview';
import MaterialPreview from '@/components/custom-rug/MaterialPreview';
import YarnSelector from '@/components/custom-rug/YarnSelector';
import PriceDisplay from '@/components/PriceDisplay';
import {
  fetchPricingConfig,
  fetchAddons,
  fetchCustomDesigns,
  generateOrderNumber,
  createCustomOrder,
} from '@/lib/api';
import {
  calculateArea,
  calculatePrice,
} from '@/lib/pricing';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/context/AuthContext';
import type {
  Addon,
  CustomDesign,
  PricingConfig,
  RugShape,
  RugType,
  Unit,
  CustomDesignCategory,
  YarnOption,
  PileHeightOption,
  BackingOption,
  FinishingOption,
  CustomOrder,
} from '@/lib/types';

const STEPS = [
  '1. Upload Design',
  '2. Category',
  '3. Dimensions',
  '4. Rug Options',
  '5. Preview & 50% Pay',
];

const DESIGN_CATEGORIES: CustomDesignCategory[] = [
  'Islamic',
  'Abstract',
  'Logo',
  'Papos / Floor Rug',
  'Bangladeshi Traditional',
  'Geometric',
  'Floral',
  'Kids',
  'Modern',
  'Custom Artwork',
  'Other',
];

const SHAPES: { value: RugShape; label: string; desc: string }[] = [
  { value: 'rectangle', label: 'Rectangle', desc: 'Standard classic proportions' },
  { value: 'square', label: 'Square', desc: 'Balanced geometric footprint' },
  { value: 'circle', label: 'Circle', desc: 'Radiating focal piece' },
  { value: 'oval', label: 'Oval', desc: 'Graceful elongated contours' },
  { value: 'custom', label: 'Custom / Die-Cut', desc: 'Organic outline matching artwork' },
];

const PILE_OPTIONS: { value: PileHeightOption; label: string; desc: string }[] = [
  {
    value: '12mm Standard Low Pile',
    label: '12mm Standard Low Pile',
    desc: 'Crisp line definition, ideal under dining chairs or low-clearance doors',
  },
  {
    value: '16mm Plush Medium Pile',
    label: '16mm Plush Medium Pile',
    desc: 'Optimal cloud cushion for living rooms and bedrooms',
  },
  {
    value: '22mm Luxury Deep Pile',
    label: '22mm Luxury Deep Pile',
    desc: 'Deep footstep sinking density for barefoot relaxation',
  },
  {
    value: '3D Sculpted Carved Relief',
    label: '3D Sculpted Carved Relief',
    desc: 'Artisan hand-shears individual motif contours for tactile high-low topography',
  },
];

const BACKING_OPTIONS: { value: BackingOption; label: string; desc: string }[] = [
  {
    value: 'Non-slip Cotton Twill',
    label: 'Non-slip Cotton Twill',
    desc: 'Breathable woven twill with rubberized micro-grip for polished wood or marble',
  },
  {
    value: 'Natural Latex & Jute Webbing',
    label: 'Natural Latex & Heavy Jute',
    desc: 'Double-reinforced traditional backing cured with botanical latex',
  },
  {
    value: 'Premium Acoustic Felt',
    label: 'Premium Acoustic Felt',
    desc: 'Thick sound-dampening grey felt backing for high-end acoustic environments',
  },
];

const FINISHING_OPTIONS: { value: FinishingOption; label: string; desc: string }[] = [
  {
    value: 'Hand-sheared Beveled Edge',
    label: 'Hand-sheared Beveled Edge',
    desc: 'Clean 45-degree hand-sheared transition around the outer rim',
  },
  {
    value: 'Tasseled Artisanal Fringe',
    label: 'Tasseled Artisanal Fringe',
    desc: 'Authentic hand-knotted cotton/jute tassels along the shorter borders',
  },
  {
    value: 'Dense Whipped Stitch',
    label: 'Dense Whipped Stitching',
    desc: 'Thick continuous yarn overlocking for maximum edge longevity',
  },
  {
    value: 'Seamless Flush Edge',
    label: 'Seamless Flush Edge',
    desc: 'Modern zero-border foldback for a crisp, frameless silhouette',
  },
];

export default function CustomRugPage() {
  const { formatPrice } = useCurrency();
  const { user } = useAuth();

  const [step, setStep] = useState(0);
  const [pricingConfigs, setPricingConfigs] = useState<PricingConfig[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [designs, setDesigns] = useState<CustomDesign[]>([]);

  // Configuration state
  const [rugType, setRugType] = useState<RugType>('tufting');
  const [uploadedArtwork, setUploadedArtwork] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<number | null>(null);
  const [uploadWarning, setUploadWarning] = useState<string | null>(null);
  const [zoomModalOpen, setZoomModalOpen] = useState(false);

  const [selectedDesign, setSelectedDesign] = useState<CustomDesign | null>(null);
  const [designCategory, setDesignCategory] = useState<CustomDesignCategory>('Abstract');
  const [visualizerMode, setVisualizerMode] = useState<'silhouette' | 'material'>('silhouette');

  // Measurements
  const [unit, setUnit] = useState<Unit>('ft');
  const [shape, setShape] = useState<RugShape>('rectangle');
  const [width, setWidth] = useState<number>(6);
  const [length, setLength] = useState<number>(8);
  const [diameter, setDiameter] = useState<number>(6);

  // Specifications
  const [yarnType, setYarnType] = useState<YarnOption>('100% New Zealand Wool');
  const [pileHeight, setPileHeight] = useState<PileHeightOption>('16mm Plush Medium Pile');
  const [backing, setBacking] = useState<BackingOption>('Non-slip Cotton Twill');
  const [finishing, setFinishing] = useState<FinishingOption>('Hand-sheared Beveled Edge');
  const [selectedAddonCodes, setSelectedAddonCodes] = useState<string[]>(['3d_carving']);

  // Colors
  const colors = {
    primary: '#4A4A46',
    secondary: '#8B6F47',
    accent: '#B5532A',
    background: '#FAF7F2',
  };

  // Customer Checkout Info
  const [orderForm, setOrderForm] = useState({
    customer_name: user?.user_metadata?.full_name || '',
    customer_email: user?.email || '',
    customer_phone: '',
    country: 'United States',
    address: '',
    city: '',
    payment_method: 'International Credit Card',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<CustomOrder | null>(null);

  useEffect(() => {
    Promise.all([fetchPricingConfig(), fetchAddons(), fetchCustomDesigns()])
      .then(([cfg, add, des]) => {
        setPricingConfigs(cfg);
        setAddons(add);
        setDesigns(des);
        if (des.length > 0) {
          setSelectedDesign((prev) => prev || des[1]);
        }
      });
  }, []);

  const activePricingConfig = pricingConfigs.find((p) => p.rug_type === rugType) || pricingConfigs[0];

  // Live Area Calculation
  const areaData = useMemo(() => {
    return calculateArea(shape, width, length, diameter, unit);
  }, [shape, width, length, diameter, unit]);

  // Live Dynamic Price
  const pricingResult = useMemo(() => {
    if (!activePricingConfig) return null;
    return calculatePrice({
      pricing: activePricingConfig,
      addons,
      shape,
      areaSqft: areaData.sqft,
      designComplexity: selectedDesign?.complexity || 'standard',
      yarnType,
      pileHeight,
      selectedAddonCodes,
    });
  }, [activePricingConfig, addons, shape, areaData, selectedDesign, yarnType, pileHeight, selectedAddonCodes]);

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'];
    if (!validExtensions.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|svg|pdf)$/i)) {
      setUploadWarning('Supported formats: JPG, JPEG, PNG, WEBP, SVG, PDF (Max 25MB).');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setUploadWarning('File size exceeds 25MB limit. Please upload a compressed artwork file.');
      return;
    }

    setUploadWarning(null);
    setUploadedFileName(file.name);
    setUploadedFileSize(file.size);

    if (file.type === 'application/pdf') {
      setUploadedArtwork('pdf');
      setSelectedDesign(null);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedArtwork(reader.result as string);
        setSelectedDesign(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeUploadedFile = () => {
    setUploadedArtwork(null);
    setUploadedFileName(null);
    setUploadedFileSize(null);
    setUploadWarning(null);
  };

  const toggleAddon = (code: string) => {
    setSelectedAddonCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  // 50% Advance Pay and Confirm Order
  const handlePayAdvanceConfirmOrder = async () => {
    if (!pricingResult) return;
    setSubmitting(true);
    try {
      const orderNumber = generateOrderNumber('CT');

      const newOrder = await createCustomOrder({
        order_number: orderNumber,
        user_id: user?.id ?? null,
        customer_name: orderForm.customer_name || 'Artisan Client',
        customer_email: orderForm.customer_email || 'client@craftingtufting.com',
        customer_phone: orderForm.customer_phone || '',
        country: orderForm.country || 'International',
        address: orderForm.address || '',
        city: orderForm.city || '',
        rug_type: rugType,
        shape,
        width: shape === 'circle' ? null : width,
        length: shape === 'circle' || shape === 'square' ? null : length,
        diameter: shape === 'circle' ? diameter : null,
        unit,
        area_sqft: pricingResult.areaSqft,
        design_category: designCategory,
        design_id: selectedDesign?.id || null,
        design_name: selectedDesign?.name || uploadedFileName || 'Bespoke Client Artwork',
        uploaded_artwork_url: uploadedArtwork,
        uploaded_file_name: uploadedFileName,
        uploaded_file_size: uploadedFileSize,
        yarn_type: yarnType,
        pile_height: pileHeight,
        backing,
        finishing,
        colors,
        addon_codes: selectedAddonCodes,
        base_price: pricingResult.basePrice,
        addon_total: pricingResult.addonTotal,
        total_price: pricingResult.total,
        advance_paid: pricingResult.advance,
        remaining: pricingResult.remaining,
        payment_method: orderForm.payment_method,
        notes: orderForm.notes,
      });

      setConfirmedOrder(newOrder);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  // If order was placed, display celebratory confirmation card
  if (confirmedOrder) {
    return (
      <div className="bg-cream min-h-screen py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white border border-sand-200 p-8 sm:p-12 shadow-sm text-center space-y-6">
            <div className="w-16 h-16 bg-sand-100 rounded-full flex items-center justify-center mx-auto text-terracotta">
              <CheckCircle2 size={36} />
            </div>

            <p className="text-xs tracking-[0.25em] uppercase text-accent font-semibold">
              50% Advance Payment Received · Order Confirmed
            </p>

            <h1 className="font-display text-3xl sm:text-4xl text-charcoal-900">
              Your Custom Rug is Entering Our Atelier
            </h1>

            <div className="bg-sand-50 p-6 border border-sand-200 inline-block text-left w-full max-w-lg mx-auto space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-sand-200">
                <span className="text-charcoal-500 uppercase tracking-wider">Order Number</span>
                <span className="font-mono font-bold text-charcoal-900 text-sm">
                  {confirmedOrder.order_number}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-500">Design Specification:</span>
                <span className="font-semibold text-charcoal-900">{confirmedOrder.design_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-500">Dimensions:</span>
                <span className="text-charcoal-900">
                  {confirmedOrder.shape === 'circle'
                    ? `${confirmedOrder.diameter} ${confirmedOrder.unit} Dia`
                    : `${confirmedOrder.width} × ${confirmedOrder.length} ${confirmedOrder.unit}`}
                  {' '}({confirmedOrder.area_sqft} sq ft)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-500">Yarn Material:</span>
                <span className="text-charcoal-900">{confirmedOrder.yarn_type}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-sand-200">
                <span className="text-charcoal-500">Advance Paid (50%):</span>
                <span className="font-bold text-emerald-700 text-sm">
                  {formatPrice(confirmedOrder.advance_paid)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-500">Remaining Balance (due at dispatch):</span>
                <span className="font-medium text-charcoal-700">
                  {formatPrice(confirmedOrder.remaining)}
                </span>
              </div>
            </div>

            <p className="text-xs text-charcoal-500 max-w-md mx-auto leading-relaxed">
              Our lead tufting artisan in Bangladesh has received your vector files and specifications. You can monitor each stage of weaving on our live order tracker.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
              <Link
                to={`/track-order?code=${confirmedOrder.order_number}`}
                className="btn-primary"
              >
                Track Live Production Timeline <ArrowRight size={15} />
              </Link>
              <Link to="/shop" className="btn-secondary">
                Explore Ready Collections
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-10 lg:py-16">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        {/* Title and Ethos */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-accent font-semibold mb-2">
            Bespoke Tufted Rug Atelier
          </p>
          <h1 className="font-display text-3xl sm:text-5xl text-charcoal-900 font-bold mb-4">
            Your Design. Your Size. Your Rug.
          </h1>
          <p className="text-sm text-charcoal-600 leading-relaxed max-w-2xl mx-auto">
            Upload your artwork, select precise imperial or metric dimensions, configure luxury New Zealand wool or golden jute pile, and secure artisan weaving with a 50% advance deposit.
          </p>
        </div>

        {/* Step Navigation Bar */}
        <div className="mb-10 bg-white border border-sand-200 p-2 sm:p-3 overflow-x-auto shadow-sm">
          <div className="flex items-center justify-between min-w-[620px] gap-2">
            {STEPS.map((st, idx) => (
              <button
                key={st}
                onClick={() => setStep(idx)}
                className={`flex-1 py-2.5 px-3 text-xs tracking-[0.12em] uppercase transition-all flex items-center justify-center gap-2 ${
                  step === idx
                    ? 'bg-charcoal-900 text-cream font-semibold'
                    : idx < step
                    ? 'bg-sand-100 text-charcoal-800 font-medium'
                    : 'text-charcoal-500 hover:text-charcoal-900'
                }`}
              >
                {idx < step && <Check size={13} className="text-accent" />}
                <span>{st}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Configurator Left, Live Preview & Dynamic Price Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Multi-Step Interactive Form */}
          <div className="lg:col-span-7 bg-white border border-sand-200 p-6 sm:p-8 space-y-8 shadow-sm">
            {/* STEP 0: Upload Design / Artwork */}
            {step === 0 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="font-display text-2xl text-charcoal-900 mb-1">
                    Upload Your Design or Artwork
                  </h2>
                  <p className="text-xs text-charcoal-500 leading-relaxed">
                    Upload your vector, logo, illustration, digital artwork, or photo. Supported: JPG, JPEG, PNG, WEBP, SVG, PDF.
                  </p>
                </div>

                {/* File Upload Box */}
                {!uploadedArtwork ? (
                  <label className="border-2 border-dashed border-sand-300 hover:border-accent p-8 sm:p-12 block text-center cursor-pointer transition-colors bg-sand-50/50 hover:bg-sand-50">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.svg,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Upload size={36} className="mx-auto text-accent mb-4 stroke-1" />
                    <p className="text-sm font-semibold text-charcoal-800 mb-1">
                      Click to Browse or Drag & Drop Artwork
                    </p>
                    <p className="text-xs text-charcoal-400">
                      JPG, PNG, SVG, WEBP, or PDF up to 25MB
                    </p>
                  </label>
                ) : (
                  <div className="border border-sand-300 p-4 bg-sand-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {uploadedArtwork === 'pdf' ? (
                          <div className="w-14 h-14 bg-red-100 text-red-700 flex items-center justify-center">
                            <FileText size={24} />
                          </div>
                        ) : (
                          <img
                            src={uploadedArtwork}
                            alt="Uploaded Design"
                            className="w-14 h-14 object-cover border border-sand-300 cursor-pointer"
                            onClick={() => setZoomModalOpen(true)}
                          />
                        )}
                        <div>
                          <p className="text-xs font-semibold text-charcoal-900 truncate max-w-xs">
                            {uploadedFileName || 'Uploaded Design'}
                          </p>
                          <p className="text-[11px] text-charcoal-500">
                            {uploadedFileSize
                              ? `${Math.round(uploadedFileSize / 1024)} KB · Validated Vector/Raster`
                              : 'Vector Artwork Loaded'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {uploadedArtwork !== 'pdf' && (
                          <button
                            type="button"
                            onClick={() => setZoomModalOpen(true)}
                            className="p-2 text-charcoal-600 hover:text-charcoal-900"
                            aria-label="Zoom artwork"
                          >
                            <Maximize2 size={16} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={removeUploadedFile}
                          className="p-2 text-charcoal-400 hover:text-red-600 transition-colors"
                          aria-label="Remove artwork"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {uploadWarning && (
                  <p className="text-xs text-amber-700 bg-amber-50 p-3 border border-amber-200">
                    {uploadWarning}
                  </p>
                )}

                {/* Or Choose from Curated Studio Archive */}
                <div className="pt-4 border-t border-sand-200">
                  <p className="text-xs tracking-[0.15em] uppercase text-charcoal-600 font-medium mb-3">
                    Or select from our atelier signature motif library:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {designs.slice(0, 6).map((des) => (
                      <button
                        key={des.id}
                        type="button"
                        onClick={() => {
                          setSelectedDesign(des);
                          setUploadedArtwork(des.image_url);
                          setUploadedFileName(`${des.name}.png`);
                        }}
                        className={`text-left p-2.5 border transition-all ${
                          selectedDesign?.id === des.id
                            ? 'border-charcoal-900 bg-sand-100 ring-1 ring-charcoal-900'
                            : 'border-sand-200 bg-white hover:border-sand-400'
                        }`}
                      >
                        <img
                          src={des.image_url}
                          alt={des.name}
                          className="w-full aspect-square object-cover mb-2"
                        />
                        <p className="text-xs font-medium text-charcoal-900 truncate">
                          {des.name}
                        </p>
                        <p className="text-[10px] text-accent tracking-wider uppercase">
                          {des.category}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-primary"
                  >
                    Select Design Category <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 1: Select Design Category */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="font-display text-2xl text-charcoal-900 mb-1">
                    Select Design Category
                  </h2>
                  <p className="text-xs text-charcoal-500 leading-relaxed">
                    Classify your design so our artisans can assign the specialized master tufter for your aesthetic.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {DESIGN_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setDesignCategory(cat)}
                      className={`p-3.5 text-xs text-left border transition-all ${
                        designCategory === cat
                          ? 'border-charcoal-900 bg-charcoal-900 text-cream font-medium'
                          : 'border-sand-200 bg-white text-charcoal-700 hover:border-sand-400'
                      }`}
                    >
                      <div className="font-medium">{cat}</div>
                      <div className={`text-[10px] ${designCategory === cat ? 'text-cream/70' : 'text-charcoal-400'}`}>
                        Custom hand-tufted
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-sand-200 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="btn-secondary !text-xs !py-3"
                  >
                    <ArrowLeft size={14} /> Back to Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-primary"
                  >
                    Set Dimensions & Measurements <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Choose Measurement Unit & Dimensions */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="font-display text-2xl text-charcoal-900 mb-1">
                    Measurement System & Dimensions
                  </h2>
                  <p className="text-xs text-charcoal-500 leading-relaxed">
                    Specify exact dimensions in either Imperial or Metric units. Our dynamic engine calculates live surface area instantly.
                  </p>
                </div>

                {/* Unit Switcher */}
                <div className="flex items-center gap-3 p-1.5 bg-sand-100 border border-sand-200 w-fit">
                  {(['ft', 'in', 'cm', 'm'] as Unit[]).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                        unit === u
                          ? 'bg-charcoal-900 text-cream shadow-sm'
                          : 'text-charcoal-600 hover:text-charcoal-900'
                      }`}
                    >
                      {u === 'ft' ? 'Feet (ft)' : u === 'in' ? 'Inches (in)' : u === 'cm' ? 'Centimeters (cm)' : 'Meters (m)'}
                    </button>
                  ))}
                </div>

                {/* Rug Shape Selector */}
                <div>
                  <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-700 font-semibold mb-2">
                    Rug Shape Silhouette
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {SHAPES.map((sh) => (
                      <button
                        key={sh.value}
                        type="button"
                        onClick={() => setShape(sh.value)}
                        className={`p-3 text-left border transition-all ${
                          shape === sh.value
                            ? 'border-charcoal-900 bg-sand-100 ring-1 ring-charcoal-900'
                            : 'border-sand-200 bg-white hover:border-sand-400'
                        }`}
                      >
                        <p className="text-xs font-semibold text-charcoal-900">{sh.label}</p>
                        <p className="text-[10px] text-charcoal-500">{sh.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dimension Inputs */}
                <div className="p-5 bg-sand-50 border border-sand-200 space-y-4">
                  {shape === 'circle' ? (
                    <div>
                      <div className="flex justify-between text-xs mb-1.5 font-medium">
                        <span className="text-charcoal-700">Diameter:</span>
                        <span className="font-mono font-bold text-charcoal-900">{diameter} {unit}</span>
                      </div>
                      <input
                        type="range"
                        min={unit === 'cm' ? 60 : unit === 'in' ? 24 : 2}
                        max={unit === 'cm' ? 450 : unit === 'in' ? 180 : 15}
                        step={unit === 'cm' ? 5 : unit === 'in' ? 2 : 0.5}
                        value={diameter}
                        onChange={(e) => setDiameter(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1.5 font-medium">
                          <span className="text-charcoal-700">Width ({unit}):</span>
                          <span className="font-mono font-bold text-charcoal-900">{width} {unit}</span>
                        </div>
                        <input
                          type="range"
                          min={unit === 'cm' ? 60 : unit === 'in' ? 24 : 2}
                          max={unit === 'cm' ? 450 : unit === 'in' ? 180 : 15}
                          step={unit === 'cm' ? 5 : unit === 'in' ? 2 : 0.5}
                          value={width}
                          onChange={(e) => setWidth(parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      {shape !== 'square' && (
                        <div>
                          <div className="flex justify-between text-xs mb-1.5 font-medium">
                            <span className="text-charcoal-700">Length ({unit}):</span>
                            <span className="font-mono font-bold text-charcoal-900">{length} {unit}</span>
                          </div>
                          <input
                            type="range"
                            min={unit === 'cm' ? 60 : unit === 'in' ? 24 : 2}
                            max={unit === 'cm' ? 600 : unit === 'in' ? 240 : 20}
                            step={unit === 'cm' ? 5 : unit === 'in' ? 2 : 0.5}
                            value={length}
                            onChange={(e) => setLength(parseFloat(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Calculated Area Display */}
                  <div className="flex items-center justify-between pt-3 border-t border-sand-200 text-xs">
                    <span className="text-charcoal-500 uppercase tracking-wider">
                      Automatically Calculated Surface Area:
                    </span>
                    <span className="font-mono font-bold text-charcoal-900 text-sm">
                      {areaData.sqft} sq ft <span className="text-charcoal-500 font-normal">({areaData.sqm} sq m)</span>
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-sand-200 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-secondary !text-xs !py-3"
                  >
                    <ArrowLeft size={14} /> Back to Category
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="btn-primary"
                  >
                    Configure Rug Options <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Rug Options (Yarn, Pile, Backing, Finishing) */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="font-display text-2xl text-charcoal-900 mb-1">
                    Artisan Crafting Options
                  </h2>
                  <p className="text-xs text-charcoal-500 leading-relaxed">
                    Select your yarn material, pile depth, edge finish, and specialty add-ons.
                  </p>
                </div>

                {/* Dynamic Yarn Selector with live price calculation */}
                <YarnSelector
                  selectedYarn={yarnType}
                  onSelectYarn={(selected) => {
                    setYarnType(selected);
                    if (selected === 'Golden Organic Bengal Jute') {
                      setRugType('jute');
                    } else {
                      setRugType('tufting');
                    }
                  }}
                  areaSqft={areaData.sqft}
                />

                {/* Pile Depth */}
                <div>
                  <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-700 font-semibold mb-2">
                    Thickness & Pile Height
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {PILE_OPTIONS.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setPileHeight(p.value)}
                        className={`p-3 text-left border transition-all ${
                          pileHeight === p.value
                            ? 'border-charcoal-900 bg-sand-100 ring-1 ring-charcoal-900'
                            : 'border-sand-200 bg-white hover:border-sand-400'
                        }`}
                      >
                        <span className="text-xs font-semibold text-charcoal-900 block mb-1">
                          {p.label}
                        </span>
                        <p className="text-[10px] text-charcoal-500 leading-relaxed">{p.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Procedural Fiber Pile Texture Simulator */}
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs tracking-[0.15em] uppercase text-charcoal-700 font-semibold">
                      Procedural Pile Density & Fiber Texture
                    </label>
                    <span className="text-[10px] text-accent tracking-wider uppercase font-medium">
                      Simulated in real-time
                    </span>
                  </div>
                  <MaterialPreview
                    yarnType={yarnType}
                    pileHeight={pileHeight}
                    selectedColor={colors.accent}
                  />
                </div>

                {/* Backing & Finishing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-700 font-semibold mb-2">
                      Rug Backing
                    </label>
                    <select
                      value={backing}
                      onChange={(e) => setBacking(e.target.value as BackingOption)}
                      className="input-field !py-2.5 text-xs"
                    >
                      {BACKING_OPTIONS.map((b) => (
                        <option key={b.value} value={b.value}>
                          {b.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-700 font-semibold mb-2">
                      Border & Edge Finishing
                    </label>
                    <select
                      value={finishing}
                      onChange={(e) => setFinishing(e.target.value as FinishingOption)}
                      className="input-field !py-2.5 text-xs"
                    >
                      {FINISHING_OPTIONS.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Add-ons Checklist */}
                <div>
                  <label className="block text-xs tracking-[0.15em] uppercase text-charcoal-700 font-semibold mb-2">
                    Special Atelier Add-ons & Packaging
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {addons.map((ad) => {
                      const selected = selectedAddonCodes.includes(ad.code);
                      return (
                        <button
                          key={ad.id}
                          type="button"
                          onClick={() => toggleAddon(ad.code)}
                          className={`p-3 text-left border flex items-start gap-3 transition-all ${
                            selected
                              ? 'border-charcoal-900 bg-sand-50'
                              : 'border-sand-200 bg-white hover:border-sand-400'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 mt-0.5 rounded-sm flex items-center justify-center border transition-colors ${
                              selected
                                ? 'bg-charcoal-900 border-charcoal-900 text-cream'
                                : 'border-sand-400'
                            }`}
                          >
                            {selected && <Check size={11} />}
                          </div>
                          <div>
                            <div className="flex justify-between items-baseline gap-2">
                              <span className="text-xs font-semibold text-charcoal-900">{ad.label}</span>
                              <span className="text-xs font-bold text-accent">+{formatPrice(ad.price)}</span>
                            </div>
                            <p className="text-[10px] text-charcoal-500">{ad.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-sand-200 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-secondary !text-xs !py-3"
                  >
                    <ArrowLeft size={14} /> Back to Dimensions
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="btn-primary"
                  >
                    Preview Order & Confirm 50% Advance <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Order Preview & 50% Advance Checkout */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="font-display text-2xl text-charcoal-900 mb-1">
                    Your Custom Rug Order Summary
                  </h2>
                  <p className="text-xs text-charcoal-500 leading-relaxed">
                    Review your complete bespoke configuration before initiating the 50% advance artisan deposit.
                  </p>
                </div>

                {/* Complete Summary Box */}
                <div className="bg-sand-50 border border-sand-200 p-5 space-y-3 text-xs">
                  <div className="flex justify-between pb-2 border-b border-sand-200">
                    <span className="text-charcoal-500">Design Specification:</span>
                    <span className="font-bold text-charcoal-900">
                      {uploadedFileName || selectedDesign?.name || 'Custom Artwork'} ({designCategory})
                    </span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-sand-200">
                    <span className="text-charcoal-500">Shape & Dimensions:</span>
                    <span className="font-medium text-charcoal-900">
                      {shape === 'circle'
                        ? `Circle ⌀ ${diameter} ${unit}`
                        : `${shape} ${width} × ${length} ${unit}`}
                      {' '}· {areaData.sqft} sq ft ({areaData.sqm} m²)
                    </span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-sand-200">
                    <span className="text-charcoal-500">Yarn & Pile:</span>
                    <span className="font-medium text-charcoal-900">
                      {yarnType} · {pileHeight}
                    </span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-sand-200">
                    <span className="text-charcoal-500">Backing & Edge:</span>
                    <span className="font-medium text-charcoal-900">
                      {backing} · {finishing}
                    </span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-sand-200">
                    <span className="text-charcoal-500">Production Estimate:</span>
                    <span className="font-medium text-charcoal-900">
                      3–5 weeks hand-tufting & curing
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-500">Shipping:</span>
                    <span className="font-medium text-emerald-700">
                      Free Insured Worldwide Express Included
                    </span>
                  </div>
                </div>

                {/* Customer Information Form */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs tracking-[0.18em] uppercase font-semibold text-charcoal-900">
                    Customer Information & Delivery
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-charcoal-600 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={orderForm.customer_name}
                        onChange={(e) => setOrderForm({ ...orderForm, customer_name: e.target.value })}
                        placeholder="e.g. Eleanor Vance"
                        className="input-field !py-2.5 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-charcoal-600 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={orderForm.customer_email}
                        onChange={(e) => setOrderForm({ ...orderForm, customer_email: e.target.value })}
                        placeholder="eleanor@domain.com"
                        className="input-field !py-2.5 text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-charcoal-600 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        value={orderForm.customer_phone}
                        onChange={(e) => setOrderForm({ ...orderForm, customer_phone: e.target.value })}
                        placeholder="+1 (555) 019-2834"
                        className="input-field !py-2.5 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-charcoal-600 mb-1">
                        Country *
                      </label>
                      <input
                        type="text"
                        value={orderForm.country}
                        onChange={(e) => setOrderForm({ ...orderForm, country: e.target.value })}
                        placeholder="e.g. United States, United Kingdom, France"
                        className="input-field !py-2.5 text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-charcoal-600 mb-1">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      value={orderForm.address}
                      onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                      placeholder="Street address, apartment, suite"
                      className="input-field !py-2.5 text-xs"
                    />
                  </div>

                  {/* Payment Gateway Selection */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-charcoal-600 mb-1">
                      Payment Provider (50% Advance Model)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['International Credit Card', 'PayPal Express', 'SWIFT Bank Wire', 'bKash / Nagad (BD)'].map(
                        (meth) => (
                          <button
                            key={meth}
                            type="button"
                            onClick={() => setOrderForm({ ...orderForm, payment_method: meth })}
                            className={`p-2.5 text-[11px] text-center border transition-all ${
                              orderForm.payment_method === meth
                                ? 'border-charcoal-900 bg-charcoal-900 text-cream font-medium'
                                : 'border-sand-200 bg-white text-charcoal-700 hover:border-sand-400'
                            }`}
                          >
                            {meth}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Final 50% Advance Pay Button */}
                {pricingResult && (
                  <div className="pt-6 border-t border-sand-200 space-y-4">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={handlePayAdvanceConfirmOrder}
                      className="w-full btn-accent !py-4.5 !text-sm flex items-center justify-center gap-2 tracking-[0.2em] uppercase font-bold shadow-lg"
                    >
                      {submitting ? (
                        'Securing Loom & Confirming...'
                      ) : (
                        <>
                          PAY 50% & CONFIRM ORDER ({formatPrice(pricingResult.advance)})
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-center text-charcoal-500">
                      Remaining balance of {formatPrice(pricingResult.remaining)} will be billed prior to international courier dispatch.
                    </p>
                  </div>
                )}

                <div className="flex justify-start">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="btn-secondary !text-xs !py-2.5"
                  >
                    <ArrowLeft size={14} /> Back to Rug Options
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live SVG Rug Visualizer & Dynamic Price Breakdown */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Live Rug Preview */}
            <div className="bg-white border border-sand-200 p-4 shadow-sm">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-sand-200 px-1">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setVisualizerMode('silhouette')}
                    className={`text-[11px] tracking-[0.18em] uppercase font-semibold pb-1 border-b-2 transition-colors ${
                      visualizerMode === 'silhouette'
                        ? 'border-charcoal-900 text-charcoal-900'
                        : 'border-transparent text-charcoal-400 hover:text-charcoal-700'
                    }`}
                  >
                    Silhouette
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisualizerMode('material')}
                    className={`text-[11px] tracking-[0.18em] uppercase font-semibold pb-1 border-b-2 transition-colors ${
                      visualizerMode === 'material'
                        ? 'border-charcoal-900 text-charcoal-900'
                        : 'border-transparent text-charcoal-400 hover:text-charcoal-700'
                    }`}
                  >
                    Fiber Pile Macro
                  </button>
                </div>
                <span className="text-[10px] text-accent tracking-wider uppercase font-medium">
                  {rugType === 'tufting' ? 'Hand-Tufted' : 'Braided Jute'}
                </span>
              </div>

              {visualizerMode === 'silhouette' ? (
                <RugPreview
                  shape={shape}
                  width={width}
                  length={length}
                  diameter={diameter}
                  unit={unit}
                  colors={colors}
                  rugType={rugType}
                  artworkUrl={uploadedArtwork}
                />
              ) : (
                <MaterialPreview
                  yarnType={yarnType}
                  pileHeight={pileHeight}
                  selectedColor={colors.accent}
                />
              )}
            </div>

            {/* Live Dynamic Price Engine Card */}
            {pricingResult && (
              <div className="bg-white border border-sand-200 p-6 shadow-sm">
                <PriceDisplay pricing={pricingResult} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Zoom Artwork Modal */}
      {zoomModalOpen && uploadedArtwork && uploadedArtwork !== 'pdf' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/80 backdrop-blur-md animate-fade-in"
          onClick={() => setZoomModalOpen(false)}
        >
          <div
            className="bg-white max-w-2xl w-full p-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setZoomModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-charcoal-700 hover:text-charcoal-950"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <p className="text-xs uppercase tracking-wider text-charcoal-500 mb-3">
              Uploaded Artwork Inspection ({uploadedFileName})
            </p>
            <img
              src={uploadedArtwork}
              alt="Zoomed Artwork"
              className="w-full max-h-[70vh] object-contain border border-sand-200"
            />
          </div>
        </div>
      )}
    </div>
  );
}