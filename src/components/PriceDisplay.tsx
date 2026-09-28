import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { formatCurrency } from '@/lib/pricing';
import type { PricingResult } from '@/lib/types';

interface PriceDisplayProps {
  pricing: PricingResult;
  currencySymbol: string;
}

export default function PriceDisplay({ pricing, currencySymbol }: PriceDisplayProps) {
  const total = useAnimatedNumber(pricing.total);
  const advance = useAnimatedNumber(pricing.advance);
  const remaining = useAnimatedNumber(pricing.remaining);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-baseline pb-4 border-b border-sand-100">
        <span className="text-xs tracking-[0.15em] uppercase text-charcoal-500">Price / sq ft</span>
        <span className="text-sm font-medium text-charcoal-700">
          {formatCurrency(pricing.pricePerSqft, currencySymbol)}
        </span>
      </div>

      <div className="flex justify-between items-baseline">
        <span className="text-xs tracking-[0.15em] uppercase text-charcoal-500">Area</span>
        <span className="text-sm font-medium text-charcoal-700">
          {pricing.areaSqft} sq ft
        </span>
      </div>

      {pricing.shapeSurcharge > 0 && (
        <div className="flex justify-between items-baseline">
          <span className="text-xs tracking-[0.15em] uppercase text-charcoal-500">Shape surcharge</span>
          <span className="text-sm text-charcoal-700">
            {formatCurrency(pricing.shapeSurcharge, currencySymbol)}
          </span>
        </div>
      )}

      {pricing.addonTotal > 0 && (
        <div className="flex justify-between items-baseline">
          <span className="text-xs tracking-[0.15em] uppercase text-charcoal-500">Add-ons</span>
          <span className="text-sm text-charcoal-700">
            {formatCurrency(pricing.addonTotal, currencySymbol)}
          </span>
        </div>
      )}

      <div className="flex justify-between items-baseline pt-4 border-t border-sand-200">
        <span className="text-sm tracking-[0.15em] uppercase text-charcoal-800">Estimated Total</span>
        <span className="font-display text-3xl text-charcoal-900 num-animate">
          {formatCurrency(total, currencySymbol)}
        </span>
      </div>

      <div className="bg-sand-50 p-5 space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="text-xs tracking-[0.15em] uppercase text-accent">50% Advance Required</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-charcoal-600">Advance (50%)</span>
          <span className="text-lg font-semibold text-charcoal-900 num-animate">
            {formatCurrency(advance, currencySymbol)}
          </span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-charcoal-600">Remaining</span>
          <span className="text-lg text-charcoal-700 num-animate">
            {formatCurrency(remaining, currencySymbol)}
          </span>
        </div>
      </div>
    </div>
  );
}
