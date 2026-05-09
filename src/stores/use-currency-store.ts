"use client";

import { create } from "zustand";
import {
  type CurrencyCode,
  DEFAULT_CURRENCY,
  getDefaultCurrencyForLocale,
} from "@/lib/currency";

interface CurrencyState {
  activeCurrency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  resetCurrencyForLocale: (locale: string) => void;
}

const useCurrencyStore = create<CurrencyState>()((set) => ({
  activeCurrency: DEFAULT_CURRENCY,
  setCurrency: (currency) => set({ activeCurrency: currency }),
  resetCurrencyForLocale: (locale) =>
    set({ activeCurrency: getDefaultCurrencyForLocale(locale) }),
}));

export default useCurrencyStore;
