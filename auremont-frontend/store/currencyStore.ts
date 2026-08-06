import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // Rate relative to INR base
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', rate: 1.0 },
  USD: { code: 'USD', symbol: '$', rate: 0.012 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.011 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.0095 },
};

interface CurrencyStore {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (priceInINR: number | string) => string;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      currency: 'INR',
      setCurrency: (code) => set({ currency: code }),
      formatPrice: (priceInINR) => {
        const numericINR = Number(priceInINR) || 0;
        const currentCurrency = get().currency;
        const config = CURRENCIES[currentCurrency] || CURRENCIES.INR;
        const converted = numericINR * config.rate;

        if (config.code === 'INR') {
          return `${config.symbol}${converted.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        return `${config.symbol}${converted.toFixed(2)}`;
      },
    }),
    {
      name: 'auremont-currency-storage',
    }
  )
);
