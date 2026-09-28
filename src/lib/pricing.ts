import type {
  Addon,
  PricingConfig,
  PricingResult,
  RugShape,
  RugType,
  Unit,
  CustomRugConfig,
} from './types';

const UNIT_TO_SQFT: Record<Unit, number> = {
  ft: 1,
  in: 1 / 144,
  cm: 1 / 929.03,
  m: 1 / 10.7639,
};

export function convertToFeet(value: number, unit: Unit): number {
  const factors: Record<Unit, number> = {
    ft: 1,
    in: 1 / 12,
    cm: 1 / 30.48,
    m: 1 / 3.28084,
  };
  return value * factors[unit];
}

export function calculateAreaSqft(
  shape: RugShape,
  width: number,
  length: number,
  diameter: number,
  unit: Unit
): number {
  const w = convertToFeet(width, unit);
  const l = convertToFeet(length, unit);
  const d = convertToFeet(diameter, unit);

  switch (shape) {
    case 'rectangle':
    case 'custom':
      return w * l;
    case 'square':
      return w * w;
    case 'circle': {
      const r = d / 2;
      return Math.PI * r * r;
    }
    case 'oval': {
      const a = w / 2;
      const b = l / 2;
      return Math.PI * a * b;
    }
    default:
      return 0;
  }
}

const COMPLEXITY_SURCHARGE: Record<string, number> = {
  simple: 0,
  standard: 0,
  complex: 1.15,
};

export function calculatePrice(params: {
  pricing: PricingConfig | undefined;
  addons: Addon[];
  shape: RugShape;
  areaSqft: number;
  designComplexity: string;
  selectedAddonCodes: string[];
}): PricingResult {
  const { pricing, addons, shape, areaSqft, designComplexity, selectedAddonCodes } = params;

  const pricePerSqft = pricing?.price_per_sqft ?? 0;
  const minOrderPrice = pricing?.min_order_price ?? 0;
  const shapeSurchargeBase = pricing?.shape_surcharge ?? 0;

  const shapeSurcharge =
    shape === 'circle' || shape === 'oval' || shape === 'custom'
      ? shapeSurchargeBase
      : 0;

  const complexityMultiplier = COMPLEXITY_SURCHARGE[designComplexity] ?? 1;

  let basePrice = areaSqft * pricePerSqft * complexityMultiplier;
  if (basePrice < minOrderPrice) basePrice = minOrderPrice;

  const addonTotal = addons
    .filter((a) => selectedAddonCodes.includes(a.code))
    .reduce((sum, a) => sum + a.price, 0);

  const rushFee = selectedAddonCodes.includes('rush_production') ? 2000 : 0;
  const designSurcharge = complexityMultiplier > 1 ? (basePrice - areaSqft * pricePerSqft) : 0;

  const subtotal = basePrice + shapeSurcharge;
  const total = subtotal + addonTotal;
  const advance = total * 0.5;
  const remaining = total - advance;

  return {
    areaSqft: Math.round(areaSqft * 100) / 100,
    basePrice: Math.round(basePrice),
    addonTotal: Math.round(addonTotal),
    shapeSurcharge: Math.round(shapeSurcharge),
    designSurcharge: Math.round(designSurcharge),
    rushFee,
    subtotal: Math.round(subtotal),
    total: Math.round(total),
    advance: Math.round(advance),
    remaining: Math.round(remaining),
    pricePerSqft,
    minOrderPrice,
  };
}

export function buildCustomConfig(
  params: {
    rugType: RugType;
    shape: RugShape;
    width: number;
    length: number;
    diameter: number;
    unit: Unit;
    designId: string | null;
    designName: string | null;
    uploadedArtworkUrl: string | null;
    colors: { primary: string; secondary: string; accent: string; background: string };
    addonCodes: string[];
    pricingResult: PricingResult;
  }
): CustomRugConfig {
  return {
    rugType: params.rugType,
    shape: params.shape,
    width: params.width,
    length: params.length,
    diameter: params.diameter,
    unit: params.unit,
    areaSqft: params.pricingResult.areaSqft,
    designId: params.designId,
    designName: params.designName,
    uploadedArtworkUrl: params.uploadedArtworkUrl,
    colors: params.colors,
    addonCodes: params.addonCodes,
    basePrice: params.pricingResult.basePrice,
    addonTotal: params.pricingResult.addonTotal,
    totalPrice: params.pricingResult.total,
    advance: params.pricingResult.advance,
    remaining: params.pricingResult.remaining,
  };
}

export function formatCurrency(amount: number, symbol = '৳'): string {
  return `${symbol}${Math.round(amount).toLocaleString('en-US')}`;
}
