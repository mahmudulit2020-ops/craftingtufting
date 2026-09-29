import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { useCurrency } from '@/context/CurrencyContext';
import { useLanguage } from '@/context/LanguageContext';
import type { PricingResult } from '@/lib/types';

interface PriceDisplayProps {
  pricing: PricingResult;
}

export default function PriceDisplay({ pricing }: PriceDisplayProps) {
  const { formatPrice, currentCurrencyConfig } = useCurrency();
  const { t } = useLanguage();

  const total = useAnimatedNumber(pricing.total);
  const advance = useAnimatedNumber(pricing.advance);
  const remaining = useAnimatedNumber(pricing.remaining);

  return (
    <div className="space-y-4">
      {/* Rate and Area Breakdown */}
      <div className="flex justify-between items-baseline pb-3 border-b border-sand-200">
        <span className="text-xs tracking-[0.18em] uppercase text-charcoal-500">{t('baseRate', 'Base Rate')}</span>
        <span className="text-sm font-medium text-charcoal-800">
          {formatPrice(pricing.pricePerSqft)} / sq ft
        </span>
      </div>

      <div className="flex justify-between items-baseline pb-3 border-b border-sand-200">
        <span className="text-xs tracking-[0.18em] uppercase text-charcoal-500">{t('totalArea', 'Total Rug Area')}</span>
        <div className="text-right">
          <span className="text-sm font-semibold text-charcoal-900">
            {pricing.areaSqft} sq ft
          </span>
          <span className="block text-[11px] text-charcoal-400">
            ({pricing.areaSqm} sq m)
          </span>
        </div>
      </div>

      {pricing.yarnSurcharge > 0 && (
        <div className="flex justify-between items-baseline text-xs">
          <span className="tracking-[0.15em] uppercase text-charcoal-500">{t('yarnUpgrade', 'Yarn Upgrade')}</span>
          <span className="font-medium text-charcoal-800">+{formatPrice(pricing.yarnSurcharge)}</span>
        </div>
      )}

      {pricing.pileSurcharge > 0 && (
        <div className="flex justify-between items-baseline text-xs">
          <span className="tracking-[0.15em] uppercase text-charcoal-500">{t('pileDepth', 'Pile Depth / Relief')}</span>
          <span className="font-medium text-charcoal-800">+{formatPrice(pricing.pileSurcharge)}</span>
        </div>
      )}

      {pricing.shapeSurcharge > 0 && (
        <div className="flex justify-between items-baseline text-xs">
          <span className="tracking-[0.15em] uppercase text-charcoal-500">{t('shapeContour', 'Custom Shape Contour')}</span>
          <span className="font-medium text-charcoal-800">+{formatPrice(pricing.shapeSurcharge)}</span>
        </div>
      )}

      {pricing.addonTotal > 0 && (
        <div className="flex justify-between items-baseline text-xs">
          <span className="tracking-[0.15em] uppercase text-charcoal-500">{t('selectedAddons', 'Selected Add-ons')}</span>
          <span className="font-medium text-charcoal-800">+{formatPrice(pricing.addonTotal)}</span>
        </div>
      )}

      {/* Estimated Total */}
      <div className="flex justify-between items-baseline pt-4 border-t border-sand-300">
        <div>
          <span className="text-xs tracking-[0.2em] uppercase font-semibold text-charcoal-900 block">
            {t('estimatedTotal', 'Estimated Total')}
          </span>
          <span className="text-[11px] text-charcoal-400">
            {t('currency', 'Currency')}: {currentCurrencyConfig.code} ({currentCurrencyConfig.name})
          </span>
        </div>
        <span className="font-display text-3xl font-bold text-charcoal-900 num-animate">
          {formatPrice(total)}
        </span>
      </div>

      {/* 50% Advance Payment Callout */}
      <div className="bg-sand-100/80 border border-sand-200 p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-sand-200">
          <span className="text-[11px] tracking-[0.2em] uppercase font-bold text-terracotta">
            {t('advanceModel', '50% Advance Payment Model')}
          </span>
          <span className="text-[10px] tracking-wider uppercase text-charcoal-500">
            {t('securesLoom', 'Secures Artisan Loom')}
          </span>
        </div>

        <div className="flex justify-between items-baseline">
          <div>
            <span className="text-sm font-semibold text-charcoal-900 block">{t('payNowAdvance', 'Pay Now (50% Advance)')}</span>
            <span className="text-[11px] text-charcoal-500">{t('toStartTufting', 'To start hand-tufting')}</span>
          </div>
          <span className="font-display text-xl font-bold text-terracotta num-animate">
            {formatPrice(advance)}
          </span>
        </div>

        <div className="flex justify-between items-baseline pt-1">
          <div>
            <span className="text-xs text-charcoal-600 block">{t('remainingBalance', 'Remaining Balance (50%)')}</span>
            <span className="text-[11px] text-charcoal-400">{t('dueOnDelivery', 'Due prior to dispatch & delivery')}</span>
          </div>
          <span className="text-sm font-medium text-charcoal-700 num-animate">
            {formatPrice(remaining)}
          </span>
        </div>
      </div>
    </div>
  );
}
