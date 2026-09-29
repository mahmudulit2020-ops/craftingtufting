import { createContext, useContext, useState, type ReactNode } from 'react';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'AED' | 'BDT';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateFromUSD: number;
  prefix: boolean;
  decimalPlaces: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateFromUSD: 1.0, prefix: true, decimalPlaces: 0 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateFromUSD: 0.92, prefix: true, decimalPlaces: 0 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rateFromUSD: 0.79, prefix: true, decimalPlaces: 0 },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', rateFromUSD: 1.36, prefix: true, decimalPlaces: 0 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rateFromUSD: 1.52, prefix: true, decimalPlaces: 0 },
  AED: { code: 'AED', symbol: 'AED ', name: 'UAE Dirham', rateFromUSD: 3.67, prefix: true, decimalPlaces: 0 },
  BDT: { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', rateFromUSD: 120.0, prefix: true, decimalPlaces: 0 },
};

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (usdAmount: number) => string;
  convertPrice: (usdAmount: number) => number;
  currentCurrencyConfig: CurrencyConfig;
  allCurrencies: CurrencyConfig[];
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const STORAGE_KEY = 'ct_currency_pref';

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
      if (saved && CURRENCIES[saved]) return saved;
    } catch {
      // fallback
    }
    return 'USD';
  });

  const setCurrency = (code: CurrencyCode) => {
    if (CURRENCIES[code]) {
      setCurrencyState(code);
      try {
        localStorage.setItem(STORAGE_KEY, code);
      } catch {
        // ignore
      }
    }
  };

  const currentCurrencyConfig = CURRENCIES[currency];

  const convertPrice = (usdAmount: number): number => {
    const rate = currentCurrencyConfig.rateFromUSD;
    return Math.round(usdAmount * rate);
  };

  const formatPrice = (usdAmount: number): string => {
    const val = convertPrice(usdAmount);
    const formatted = val.toLocaleString('en-US');
    return currentCurrencyConfig.prefix
      ? `${currentCurrencyConfig.symbol}${formatted}`
      : `${formatted} ${currentCurrencyConfig.symbol}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        convertPrice,
        currentCurrencyConfig,
        allCurrencies: Object.values(CURRENCIES),
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
}
