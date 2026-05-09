// ─── Types ────────────────────────────────────────────────────────────────────

export type CurrencyCode =
  | "USD"
  | "AED"
  | "SAR"
  | "PKR"
  | "GBP"
  | "EUR"
  | "QAR"
  | "KWD"
  | "OMR"
  | "BHD"
  | "INR";

export interface CurrencyMetadata {
  code: CurrencyCode;
  name: string;
  symbol: string;
  /** BCP 47 locale tag used for Intl.NumberFormat */
  formattingLocale: string;
  /** Number of decimal digits standard for this currency */
  decimalDigits: number;
}

// ─── Currency registry ────────────────────────────────────────────────────────

export const CURRENCIES: Record<CurrencyCode, CurrencyMetadata> = {
  USD: { code: "USD", name: "US Dollar", symbol: "$", formattingLocale: "en-US", decimalDigits: 2 },
  AED: { code: "AED", name: "UAE Dirham", symbol: "AED", formattingLocale: "ar-AE", decimalDigits: 2 },
  SAR: { code: "SAR", name: "Saudi Riyal", symbol: "SAR", formattingLocale: "ar-SA", decimalDigits: 2 },
  PKR: { code: "PKR", name: "Pakistani Rupee", symbol: "₨", formattingLocale: "ur-PK", decimalDigits: 0 },
  GBP: { code: "GBP", name: "British Pound", symbol: "£", formattingLocale: "en-GB", decimalDigits: 2 },
  EUR: { code: "EUR", name: "Euro", symbol: "€", formattingLocale: "de-DE", decimalDigits: 2 },
  QAR: { code: "QAR", name: "Qatari Riyal", symbol: "QAR", formattingLocale: "ar-QA", decimalDigits: 2 },
  KWD: { code: "KWD", name: "Kuwaiti Dinar", symbol: "KWD", formattingLocale: "ar-KW", decimalDigits: 3 },
  OMR: { code: "OMR", name: "Omani Rial", symbol: "OMR", formattingLocale: "ar-OM", decimalDigits: 3 },
  BHD: { code: "BHD", name: "Bahraini Dinar", symbol: "BHD", formattingLocale: "ar-BH", decimalDigits: 3 },
  INR: { code: "INR", name: "Indian Rupee", symbol: "₹", formattingLocale: "en-IN", decimalDigits: 2 },
};

export const CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[];

// ─── Locale → default currency mapping ───────────────────────────────────────

export const DEFAULT_CURRENCY_BY_LOCALE: Record<string, CurrencyCode> = {
  en: "USD",
  ar: "AED",
  ur: "PKR",
};

export const DEFAULT_CURRENCY: CurrencyCode = "USD";

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function isCurrencyCode(value: unknown): value is CurrencyCode {
  return typeof value === "string" && value in CURRENCIES;
}

export function getDefaultCurrencyForLocale(locale: string): CurrencyCode {
  return DEFAULT_CURRENCY_BY_LOCALE[locale] ?? DEFAULT_CURRENCY;
}

export function getCurrencyMetadata(currency: CurrencyCode): CurrencyMetadata {
  return CURRENCIES[currency];
}

/**
 * Format a monetary amount using Intl.NumberFormat.
 *
 * @param amount   - The numeric amount to format
 * @param currency - ISO 4217 currency code
 * @param locale   - App locale ("en" | "ar" | "ur"); used to pick the display locale
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode,
  locale = "en",
): string {
  const meta = CURRENCIES[currency];
  const bcp47 = getBcp47Locale(locale);

  return new Intl.NumberFormat(bcp47, {
    style: "currency",
    currency,
    minimumFractionDigits: meta.decimalDigits,
    maximumFractionDigits: meta.decimalDigits,
  }).format(amount);
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function getBcp47Locale(appLocale: string): string {
  const map: Record<string, string> = {
    en: "en-US",
    ar: "ar-AE",
    ur: "ur-PK",
  };
  return map[appLocale] ?? "en-US";
}
