import type {
  Addon,
  PricingConfig,
  PricingResult,
  RugShape,
  RugType,
  Unit,
  CustomRugConfig,
  CustomDesignCategory,
  YarnOption,
  PileHeightOption,
  BackingOption,
  FinishingOption,
} from './types';

export function convertToFeet(value: number, unit: Unit): number {
  const factors: Record<Unit, number> = {
    ft: 1,
    in: 1 / 12,
    cm: 1 / 30.48,
    m: 3.28084,
  };
  return value * factors[unit];
}

export function convertToMeters(value: number, unit: Unit): number {
  const factors: Record<Unit, number> = {
    m: 1,
    cm: 1 / 100,
    in: 0.0254,
    ft: 0.3048,
  };
  return value * factors[unit];
}

export function calculateArea(
  shape: RugShape,
  width: number,
  length: number,
  diameter: number,
  unit: Unit
): { sqft: number; sqm: number } {
  const wFt = convertToFeet(width, unit);
  const lFt = convertToFeet(length, unit);
  const dFt = convertToFeet(diameter, unit);

  let sqft = 0;
  switch (shape) {
    case 'rectangle':
    case 'custom':
      sqft = wFt * lFt;
      break;
    case 'square':
      sqft = wFt * wFt;
      break;
    case 'circle': {
      const r = dFt / 2;
      sqft = Math.PI * r * r;
      break;
    }
    case 'oval': {
      const a = wFt / 2;
      const b = lFt / 2;
      sqft = Math.PI * a * b;
      break;
    }
    default:
      sqft = 0;
  }

  const sqm = sqft * 0.092903;
  return {
    sqft: Math.round(sqft * 100) / 100,
    sqm: Math.round(sqm * 100) / 100,
  };
}

export function calculateAreaSqft(
  shape: RugShape,
  width: number,
  length: number,
  diameter: number,
  unit: Unit
): number {
  return calculateArea(shape, width, length, diameter, unit).sqft;
}

export const YARN_SURCHARGE_RATE: Record<YarnOption, number> = {
  '100% New Zealand Wool': 6, // +$6 / sqft
  'Acrylic Blend': 0, // Included in base price
  'Bamboo Silk': 12, // +$12 / sqft
  'Premium Resilient Acrylic': 0,
  'Mulberry Silk & Wool Blend': 14, // +$14 / sqft
  'Golden Organic Bengal Jute': 0,
};

const PILE_SURCHARGE_RATE: Record<PileHeightOption, number> = {
  '12mm Standard Low Pile': 0,
  '16mm Plush Medium Pile': 2.5, // +$2.5 / sqft
  '22mm Luxury Deep Pile': 5, // +$5 / sqft
  '3D Sculpted Carved Relief': 7, // +$7 / sqft
};

const COMPLEXITY_MULTIPLIER: Record<string, number> = {
  simple: 1.0,
  standard: 1.0,
  complex: 1.2,
};

export function calculatePrice(params: {
  pricing: PricingConfig | undefined;
  addons: Addon[];
  shape: RugShape;
  areaSqft: number;
  designComplexity?: string;
  yarnType?: YarnOption;
  pileHeight?: PileHeightOption;
  selectedAddonCodes: string[];
}): PricingResult {
  const {
    pricing,
    addons,
    shape,
    areaSqft,
    designComplexity = 'standard',
    yarnType = '100% New Zealand Wool',
    pileHeight = '16mm Plush Medium Pile',
    selectedAddonCodes,
  } = params;

  const pricePerSqft = pricing?.price_per_sqft ?? 28;
  const minOrderPrice = pricing?.min_order_price ?? 120;
  const shapeSurchargeBase = pricing?.shape_surcharge ?? 35;

  const shapeSurcharge =
    shape === 'circle' || shape === 'oval' || shape === 'custom'
      ? shapeSurchargeBase
      : 0;

  const complexityMultiplier = COMPLEXITY_MULTIPLIER[designComplexity] ?? 1;
  const yarnSurcharge = (YARN_SURCHARGE_RATE[yarnType] ?? 0) * areaSqft;
  const pileSurcharge = (PILE_SURCHARGE_RATE[pileHeight] ?? 0) * areaSqft;

  let basePrice = areaSqft * pricePerSqft * complexityMultiplier;
  if (basePrice < minOrderPrice) {
    basePrice = minOrderPrice;
  }

  const addonTotal = addons
    .filter((a) => selectedAddonCodes.includes(a.code))
    .reduce((sum, a) => sum + a.price, 0);

  const rushFee = selectedAddonCodes.includes('rush_production') ? 50 : 0;
  const designSurcharge =
    complexityMultiplier > 1 ? basePrice - areaSqft * pricePerSqft : 0;

  const subtotal =
    basePrice + shapeSurcharge + yarnSurcharge + pileSurcharge;
  const total = subtotal + addonTotal;
  const advance = Math.round(total * 0.5);
  const remaining = total - advance;

  const areaSqm = Math.round(areaSqft * 0.092903 * 100) / 100;

  return {
    areaSqft: Math.round(areaSqft * 100) / 100,
    areaSqm,
    basePrice: Math.round(basePrice),
    addonTotal: Math.round(addonTotal),
    shapeSurcharge: Math.round(shapeSurcharge),
    designSurcharge: Math.round(designSurcharge),
    yarnSurcharge: Math.round(yarnSurcharge),
    pileSurcharge: Math.round(pileSurcharge),
    rushFee,
    subtotal: Math.round(subtotal),
    total: Math.round(total),
    advance,
    remaining,
    pricePerSqft,
    minOrderPrice,
  };
}

export function buildCustomConfig(params: {
  rugType: RugType;
  shape: RugShape;
  width: number;
  length: number;
  diameter: number;
  unit: Unit;
  designCategory: CustomDesignCategory;
  designId: string | null;
  designName: string | null;
  uploadedArtworkUrl: string | null;
  uploadedFileName?: string | null;
  uploadedFileSize?: number | null;
  yarnType: YarnOption;
  pileHeight: PileHeightOption;
  backing: BackingOption;
  finishing: FinishingOption;
  colors: { primary: string; secondary: string; accent: string; background: string };
  addonCodes: string[];
  pricingResult: PricingResult;
}): CustomRugConfig {
  return {
    rugType: params.rugType,
    shape: params.shape,
    width: params.width,
    length: params.length,
    diameter: params.diameter,
    unit: params.unit,
    areaSqft: params.pricingResult.areaSqft,
    areaSqm: params.pricingResult.areaSqm,
    designCategory: params.designCategory,
    designId: params.designId,
    designName: params.designName,
    uploadedArtworkUrl: params.uploadedArtworkUrl,
    uploadedFileName: params.uploadedFileName,
    uploadedFileSize: params.uploadedFileSize,
    yarnType: params.yarnType,
    pileHeight: params.pileHeight,
    backing: params.backing,
    finishing: params.finishing,
    colors: params.colors,
    addonCodes: params.addonCodes,
    basePrice: params.pricingResult.basePrice,
    addonTotal: params.pricingResult.addonTotal,
    totalPrice: params.pricingResult.total,
    advance: params.pricingResult.advance,
    remaining: params.pricingResult.remaining,
  };
}

export function formatCurrency(amount: number, symbol = '$'): string {
  return `${symbol}${Math.round(amount).toLocaleString('en-US')}`;
}
