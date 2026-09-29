import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload,
  Calculator,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import WeaveReveal from '@/components/motion/WeaveReveal';
import { useCurrency } from '@/context/CurrencyContext';

export default function InteractiveStudioBanner() {
  const { formatPrice } = useCurrency();

  const [unit, setUnit] = useState<'ft' | 'cm'>('ft');
  const [width, setWidth] = useState<number>(6);
  const [length, setLength] = useState<number>(8);
  const [yarn, setYarn] = useState<'wool' | 'silk'>('wool');

  // Instant Area Math
  const areaSqFt = useMemo(() => {
    if (unit === 'cm') {
      const wFt = width / 30.48;
      const lFt = length / 30.48;
      return Math.round(wFt * lFt * 10) / 10;
    }
    return Math.round(width * length * 10) / 10;
  }, [width, length, unit]);

  const baseRate = yarn === 'wool' ? 28 : 42; // USD / sq ft
  const totalEst = Math.round(areaSqFt * baseRate);
  const advance50 = Math.round(totalEst * 0.5);
  const balance50 = totalEst - advance50;

  return (
    <section className="bg-ecru border-y border-warm-border py-20 lg:py-28 relative overflow-hidden">
      {/* Decorative Loom Grid Texture */}
      <div className="absolute inset-0 opacity-25 pointer-events-none jamdani-bg" />

      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: 4-Step Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <WeaveReveal direction="up" delay={0.1}>
              <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-ochre font-semibold">
                <Sparkles size={13} />
                <span>Interactive Bespoke Loom</span>
              </div>
            </WeaveReveal>

            <WeaveReveal direction="up" delay={0.2}>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-bark font-bold leading-tight">
                YOUR DESIGN.<br />
                YOUR SIZE.<br />
                <span className="text-ochre">YOUR RUG.</span>
              </h2>
            </WeaveReveal>

            <WeaveReveal direction="up" delay={0.3}>
              <p className="text-charcoal-600 text-base sm:text-lg leading-relaxed">
                Bring your interior vision to life. Experience our 4-step bespoke workflow—upload your artwork, enter exact dimensions, receive dynamic pricing, and secure master tufters with a 50% advance deposit.
              </p>
            </WeaveReveal>

            {/* 4-Step Workflow Badges */}
            <WeaveReveal direction="up" delay={0.4}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="p-3 bg-white border border-warm-border text-center space-y-1">
                  <span className="font-mono text-xs text-ochre font-bold block">STEP 01</span>
                  <span className="font-medium text-bark">Upload Art</span>
                </div>
                <div className="p-3 bg-white border border-warm-border text-center space-y-1">
                  <span className="font-mono text-xs text-ochre font-bold block">STEP 02</span>
                  <span className="font-medium text-bark">Dimensions</span>
                </div>
                <div className="p-3 bg-white border border-warm-border text-center space-y-1">
                  <span className="font-mono text-xs text-ochre font-bold block">STEP 03</span>
                  <span className="font-medium text-bark">Live Quote</span>
                </div>
                <div className="p-3 bg-white border border-warm-border text-center space-y-1">
                  <span className="font-mono text-xs text-ochre font-bold block">STEP 04</span>
                  <span className="font-medium text-bark">50% Advance</span>
                </div>
              </div>
            </WeaveReveal>

            <WeaveReveal direction="up" delay={0.5}>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/custom-rug"
                  className="btn-primary !py-4 !px-8 flex items-center gap-2 tracking-[0.2em] uppercase font-bold"
                >
                  <Upload size={15} />
                  <span>Launch Custom Rug Studio</span>
                </Link>
                <Link
                  to="/track-order"
                  className="btn-secondary !py-4 tracking-[0.18em] uppercase"
                >
                  Track Existing Order
                </Link>
              </div>
            </WeaveReveal>
          </div>

          {/* Right Column: Live Interactive Calculator Widget on Homepage */}
          <div className="lg:col-span-6">
            <WeaveReveal direction="left" delay={0.3}>
              <div className="bg-white border border-warm-border p-6 sm:p-8 shadow-xl relative">
                {/* Header */}
                <div className="flex justify-between items-center pb-4 mb-6 border-b border-warm-border">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-bark">
                    <Calculator size={14} className="text-ochre" />
                    <span>Live Dimension & Price Estimator</span>
                  </div>
                  {/* Unit Toggle */}
                  <div className="flex items-center border border-warm-border p-0.5 bg-linen text-xs">
                    <button
                      onClick={() => {
                        setUnit('ft');
                        setWidth(6);
                        setLength(8);
                      }}
                      className={`px-3 py-1 text-[11px] font-bold uppercase transition-all ${
                        unit === 'ft' ? 'bg-bark text-cream' : 'text-charcoal-500'
                      }`}
                    >
                      Feet (ft)
                    </button>
                    <button
                      onClick={() => {
                        setUnit('cm');
                        setWidth(180);
                        setLength(240);
                      }}
                      className={`px-3 py-1 text-[11px] font-bold uppercase transition-all ${
                        unit === 'cm' ? 'bg-bark text-cream' : 'text-charcoal-500'
                      }`}
                    >
                      Meters (cm)
                    </button>
                  </div>
                </div>

                {/* Dimension Sliders */}
                <div className="space-y-5 text-xs">
                  <div>
                    <div className="flex justify-between mb-1.5 font-medium">
                      <span className="text-charcoal-600">Rug Width:</span>
                      <span className="font-mono font-bold text-bark">
                        {width} {unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={unit === 'ft' ? 3 : 90}
                      max={unit === 'ft' ? 12 : 360}
                      step={unit === 'ft' ? 0.5 : 10}
                      value={width}
                      onChange={(e) => setWidth(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1.5 font-medium">
                      <span className="text-charcoal-600">Rug Length:</span>
                      <span className="font-mono font-bold text-bark">
                        {length} {unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={unit === 'ft' ? 4 : 120}
                      max={unit === 'ft' ? 16 : 480}
                      step={unit === 'ft' ? 0.5 : 10}
                      value={length}
                      onChange={(e) => setLength(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Fiber Selector */}
                  <div className="pt-2">
                    <span className="text-charcoal-600 block mb-2 font-medium">Loom Fiber:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setYarn('wool')}
                        className={`p-2.5 text-left border transition-all text-xs ${
                          yarn === 'wool'
                            ? 'border-bark bg-linen font-bold text-bark'
                            : 'border-warm-border text-charcoal-600'
                        }`}
                      >
                        <div>100% New Zealand Wool</div>
                        <div className="text-[10px] text-charcoal-400 font-normal">Plush natural lanolin</div>
                      </button>
                      <button
                        onClick={() => setYarn('silk')}
                        className={`p-2.5 text-left border transition-all text-xs ${
                          yarn === 'silk'
                            ? 'border-bark bg-linen font-bold text-bark'
                            : 'border-warm-border text-charcoal-600'
                        }`}
                      >
                        <div>Mulberry Silk & Wool</div>
                        <div className="text-[10px] text-charcoal-400 font-normal">Lustrous museum sheen</div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Instant Calculation Box */}
                <div className="mt-6 pt-5 border-t border-warm-border bg-linen p-4 space-y-3">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="text-charcoal-500 uppercase tracking-wider">Calculated Surface:</span>
                    <span className="font-mono font-bold text-bark text-sm">
                      {areaSqFt} sq ft ({Math.round(areaSqFt * 0.0929 * 10) / 10} m²)
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-xs uppercase tracking-wider font-semibold text-bark">Estimated Total:</span>
                    <span className="font-display text-2xl font-bold text-bark">
                      {formatPrice(totalEst)}
                    </span>
                  </div>

                  {/* 50% Advance Model Indicator */}
                  <div className="p-3 bg-white border border-warm-border space-y-1 text-xs">
                    <div className="flex justify-between items-center text-ochre font-bold">
                      <span>50% Advance Due Today:</span>
                      <span className="font-display text-lg">{formatPrice(advance50)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-charcoal-500">
                      <span>Remaining balance due at shipment:</span>
                      <span>{formatPrice(balance50)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <Link
                    to="/custom-rug"
                    className="w-full btn-accent !py-3.5 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] font-bold"
                  >
                    <span>Proceed with Dimensions</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </WeaveReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
