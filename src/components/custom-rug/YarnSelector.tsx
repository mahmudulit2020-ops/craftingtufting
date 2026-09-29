import React from 'react';
import { Sparkles, Check, Info } from 'lucide-react';
import type { YarnOption } from '@/lib/types';
import { YARN_SURCHARGE_RATE } from '@/lib/pricing';
import { useCurrency } from '@/context/CurrencyContext';

export interface YarnSelectorProps {
  selectedYarn: YarnOption;
  onSelectYarn: (yarn: YarnOption) => void;
  areaSqft?: number;
  className?: string;
}

interface YarnCardData {
  value: YarnOption;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  surchargePerSqft: number;
  description: string;
  swatchGradient: string;
  accentBorder: string;
  stats: {
    softness: number; // 1-5
    durability: number; // 1-5
    sheen: 'Matte' | 'Subtle' | 'High-Luster' | 'Organic';
  };
  features: string[];
}

const YARN_ITEMS: YarnCardData[] = [
  {
    value: '100% New Zealand Wool',
    title: 'New Zealand Wool',
    subtitle: '100% Pure Virgin Mountain Fleece',
    badge: 'Artisan Heritage',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    surchargePerSqft: YARN_SURCHARGE_RATE['100% New Zealand Wool'],
    description:
      'Lanolin-rich virgin fleece renowned for natural resilience, sound absorption, springy bounce-back, and natural fire-retardance.',
    swatchGradient: 'from-[#EFE7DC] via-[#E2D6C5] to-[#D5C5B0]',
    accentBorder: 'border-amber-700',
    stats: {
      softness: 4,
      durability: 5,
      sheen: 'Subtle',
    },
    features: ['Natural Lanolin Rebound', 'Hypoallergenic & Fire Safe', 'High-Traffic Certified'],
  },
  {
    value: 'Acrylic Blend',
    title: 'Acrylic Blend',
    subtitle: 'Resilient Microfiber Colorfast Staple',
    badge: 'Popular • Included',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    surchargePerSqft: YARN_SURCHARGE_RATE['Acrylic Blend'],
    description:
      'Engineered high-tenacity yarn offering crisp color saturation, zero shedding, tight knot definition, and ultra-easy spot maintenance.',
    swatchGradient: 'from-[#F0ECE1] via-[#E5DFD3] to-[#DCD5C5]',
    accentBorder: 'border-charcoal-800',
    stats: {
      softness: 3,
      durability: 4,
      sheen: 'Matte',
    },
    features: ['Ultra-Vivid Color Depth', 'Zero Shedding Pile', 'Easy-Clean Maintenance'],
  },
  {
    value: 'Bamboo Silk',
    title: 'Bamboo Silk',
    subtitle: 'Regenerated Plant Cellulose Filament',
    badge: 'Luxury Sheen',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    surchargePerSqft: YARN_SURCHARGE_RATE['Bamboo Silk'],
    description:
      'Ultra-fine plant-derived filaments with dynamic ambient light reflectivity, liquid-velvet drape, and a butter-soft cool hand feel.',
    swatchGradient: 'from-[#FAF5EC] via-[#EFE6D6] to-[#E4D5BE]',
    accentBorder: 'border-purple-800',
    stats: {
      softness: 5,
      durability: 3,
      sheen: 'High-Luster',
    },
    features: ['Luminous Light Shimmer', 'Butter-Soft Velvet Hand', 'Eco-Renewable Botanical Fiber'],
  },
];

export const YarnSelector: React.FC<YarnSelectorProps> = ({
  selectedYarn,
  onSelectYarn,
  areaSqft = 24,
  className = '',
}) => {
  const { formatPrice } = useCurrency();

  // Normalize selected value in case of legacy aliases
  const activeValue =
    selectedYarn === 'Premium Resilient Acrylic'
      ? 'Acrylic Blend'
      : selectedYarn === 'Mulberry Silk & Wool Blend'
      ? 'Bamboo Silk'
      : selectedYarn;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with Title and Live Area Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1">
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-charcoal-900 font-bold">
            Select Yarn & Fiber
          </label>
          <p className="text-[11px] text-charcoal-500">
            Each fiber alters the tactile pile density, ambient luster, and durability profile.
          </p>
        </div>
        {areaSqft > 0 && (
          <div className="inline-flex items-center gap-1.5 self-start sm:self-auto px-2.5 py-1 bg-sand-100 border border-sand-200 text-[11px] text-charcoal-700">
            <span className="text-charcoal-500">Current Area:</span>
            <span className="font-mono font-bold text-charcoal-900">{areaSqft.toFixed(1)} sq ft</span>
          </div>
        )}
      </div>

      {/* Main 3 Yarn Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {YARN_ITEMS.map((item) => {
          const isSelected = activeValue === item.value;
          const totalSurchargeUSD = item.surchargePerSqft * areaSqft;

          return (
            <div
              key={item.value}
              onClick={() => onSelectYarn(item.value)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectYarn(item.value);
                }
              }}
              className={`group relative text-left p-4 cursor-pointer transition-all duration-300 border flex flex-col justify-between ${
                isSelected
                  ? `bg-white border-charcoal-900 ring-2 ring-charcoal-900 shadow-md translate-y-[-2px]`
                  : `bg-sand-50/60 border-sand-200 hover:border-sand-400 hover:bg-white hover:shadow-sm`
              }`}
            >
              {/* Top Row: Swatch & Badge */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  {/* Swatch Disc */}
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-full bg-gradient-to-br ${item.swatchGradient} shadow-inner border border-sand-300 flex items-center justify-center relative overflow-hidden`}
                    >
                      {/* Subtle fiber weave texture representation */}
                      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:4px_4px]" />
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-charcoal-900 text-cream flex items-center justify-center shadow-sm">
                          <Check size={11} strokeWidth={3} />
                        </div>
                      ) : (
                        <Sparkles size={13} className="text-charcoal-600 opacity-60 group-hover:opacity-100" />
                      )}
                    </div>

                    <div>
                      <h4 className="font-display font-bold text-sm text-charcoal-900 leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-charcoal-500 font-mono tracking-tight">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Badge */}
                  <span
                    className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                </div>

                {/* Description */}
                <p className="text-[11px] text-charcoal-600 leading-relaxed mb-3">
                  {item.description}
                </p>

                {/* Fiber Key Micro-Specs */}
                <div className="space-y-1.5 py-2.5 my-2 border-y border-sand-200/80 text-[10px] text-charcoal-600">
                  <div className="flex justify-between items-center">
                    <span className="text-charcoal-500">Hand Softness:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <span
                          key={lvl}
                          className={`w-2.5 h-1.5 rounded-xs ${
                            lvl <= item.stats.softness ? 'bg-accent' : 'bg-sand-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-charcoal-500">Spring Resilience:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <span
                          key={lvl}
                          className={`w-2.5 h-1.5 rounded-xs ${
                            lvl <= item.stats.durability ? 'bg-charcoal-800' : 'bg-sand-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-charcoal-500">Surface Sheen:</span>
                    <span className="font-medium text-charcoal-900">{item.stats.sheen}</span>
                  </div>
                </div>

                {/* Micro bullets */}
                <ul className="space-y-1 mb-3">
                  {item.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 text-[10px] text-charcoal-600">
                      <span className="w-1 h-1 rounded-full bg-accent" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom: Dynamic Price Calculation Badge */}
              <div className="pt-3 border-t border-sand-200 flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-wider text-charcoal-500 font-semibold">
                    Live Fiber Rate
                  </span>
                  <div className="flex items-baseline gap-1">
                    {item.surchargePerSqft === 0 ? (
                      <span className="text-xs font-bold text-emerald-800 font-mono">
                        Included in Base
                      </span>
                    ) : (
                      <>
                        <span className="text-xs font-bold text-charcoal-900 font-mono">
                          +{formatPrice(item.surchargePerSqft)}/sq ft
                        </span>
                        {areaSqft > 0 && (
                          <span className="text-[10px] text-accent font-medium font-mono">
                            (+{formatPrice(totalSurchargeUSD)})
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-charcoal-900 text-cream border-charcoal-900'
                      : 'border-sand-300 text-transparent group-hover:border-charcoal-400'
                  }`}
                >
                  <Check size={12} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Summary Note */}
      <div className="bg-sand-100/70 border border-sand-200 p-3 flex items-start gap-2.5 text-xs text-charcoal-700">
        <Info size={15} className="text-accent shrink-0 mt-0.5" />
        <div className="flex-1 text-[11px] leading-relaxed">
          <span className="font-semibold text-charcoal-900">
            Selected Material: {YARN_ITEMS.find((y) => y.value === activeValue)?.title || activeValue}
          </span>
          {' — '}
          {activeValue === '100% New Zealand Wool' && (
            <span>
              Adds +{formatPrice(6)}/sq ft to your custom rug formulation. The live quote
              ticker below and 50% advance have updated automatically.
            </span>
          )}
          {activeValue === 'Acrylic Blend' && (
            <span>
              Zero surcharge added. Standard formulation included in your base custom rug configuration.
            </span>
          )}
          {activeValue === 'Bamboo Silk' && (
            <span>
              Adds +{formatPrice(12)}/sq ft for luxury plant-based shimmering silk filaments.
            </span>
          )}
          {activeValue === 'Golden Organic Bengal Jute' && (
            <span>
              Natural golden plant fiber spun into rustic braided cordage. Zero yarn surcharge.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default YarnSelector;
