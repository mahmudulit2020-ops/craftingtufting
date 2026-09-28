import type { CustomRugConfig, PricingResult } from '@/lib/types';

interface OrderSummaryProps {
  config: {
    rugType: string;
    shape: string;
    width: number;
    length: number;
    diameter: number;
    unit: string;
    areaSqft: number;
    designName: string | null;
    addonCodes: string[];
    colors: { primary: string; secondary: string; accent: string; background: string };
  };
  pricing: PricingResult;
  currencySymbol: string;
  addonLabels: Record<string, string>;
}

const shapeLabels: Record<string, string> = {
  rectangle: 'Rectangle',
  square: 'Square',
  circle: 'Circle',
  oval: 'Oval',
  custom: 'Custom Shape',
};

const rugTypeLabels: Record<string, string> = {
  tufting: 'Tufting Rug',
  jute: 'Jute Handcraft',
};

export default function OrderSummary({ config, pricing, currencySymbol, addonLabels }: OrderSummaryProps) {
  const sizeLabel = config.shape === 'circle'
    ? `Ø ${config.diameter} ${config.unit}`
    : config.shape === 'square'
    ? `${config.width} ${config.unit}`
    : `${config.width} × ${config.length} ${config.unit}`;

  return (
    <div className="bg-white border border-sand-100 p-6 lg:p-8 sticky top-24">
      <h3 className="font-display text-2xl text-charcoal-900 mb-6">Order Summary</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-charcoal-500">Type</span>
          <span className="text-charcoal-800 font-medium">{rugTypeLabels[config.rugType] || config.rugType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-charcoal-500">Shape</span>
          <span className="text-charcoal-800 font-medium">{shapeLabels[config.shape] || config.shape}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-charcoal-500">Size</span>
          <span className="text-charcoal-800 font-medium">{sizeLabel}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-charcoal-500">Area</span>
          <span className="text-charcoal-800 font-medium">{config.areaSqft} sq ft</span>
        </div>
        {config.designName && (
          <div className="flex justify-between">
            <span className="text-charcoal-500">Design</span>
            <span className="text-charcoal-800 font-medium text-right max-w-[60%]">{config.designName}</span>
          </div>
        )}
        {config.addonCodes.length > 0 && (
          <div>
            <span className="text-charcoal-500 block mb-2">Add-ons</span>
            <div className="flex flex-wrap gap-1.5">
              {config.addonCodes.map((code) => (
                <span key={code} className="text-[11px] bg-sand-50 text-charcoal-700 px-2.5 py-1 border border-sand-100">
                  {addonLabels[code] || code}
                </span>
              ))}
            </div>
          </div>
        )}
        {(config.colors.primary || config.colors.background) && (
          <div className="flex items-center justify-between">
            <span className="text-charcoal-500">Colors</span>
            <div className="flex gap-1.5">
              {[config.colors.primary, config.colors.secondary, config.colors.accent, config.colors.background].filter(Boolean).map((c, i) => (
                <div key={i} className="w-5 h-5 rounded-full border border-sand-200" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-sand-100 mt-6 pt-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-charcoal-500">Base price</span>
          <span className="text-charcoal-800">{currencySymbol}{Math.round(pricing.basePrice + pricing.shapeSurcharge).toLocaleString()}</span>
        </div>
        {pricing.addonTotal > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-charcoal-500">Add-ons</span>
            <span className="text-charcoal-800">{currencySymbol}{Math.round(pricing.addonTotal).toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between items-baseline pt-3 border-t border-sand-100">
          <span className="text-sm tracking-[0.15em] uppercase text-charcoal-800">Total</span>
          <span className="font-display text-2xl text-charcoal-900">{currencySymbol}{Math.round(pricing.total).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-accent font-medium">50% Advance</span>
          <span className="text-charcoal-900 font-semibold">{currencySymbol}{Math.round(pricing.advance).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-charcoal-500">Remaining</span>
          <span className="text-charcoal-700">{currencySymbol}{Math.round(pricing.remaining).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export type { CustomRugConfig };
