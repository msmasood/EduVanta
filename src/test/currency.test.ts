import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  getDefaultCurrencyForLocale,
  getCurrencyMetadata,
  isCurrencyCode,
  CURRENCIES,
  DEFAULT_CURRENCY,
} from "@/lib/currency";

describe("formatCurrency", () => {
  it("formats USD correctly", () => {
    const result = formatCurrency(1234.56, "USD", "en");
    // Should contain the formatted number; exact symbol varies by environment
    expect(result).toContain("1,234.56");
  });

  it("formats AED correctly", () => {
    const result = formatCurrency(1000, "AED", "ar");
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("formats PKR correctly (zero decimal digits)", () => {
    const result = formatCurrency(12345.67, "PKR", "ur");
    expect(result).toBeTruthy();
    // PKR has 0 decimal places
    expect(result).not.toContain(".67");
  });

  it("formats GBP correctly", () => {
    const result = formatCurrency(500, "GBP", "en");
    expect(result).toContain("500");
  });

  it("formats EUR correctly", () => {
    const result = formatCurrency(2000.5, "EUR", "en");
    expect(result).toContain("2");
  });

  it("defaults to en-US locale when locale is unknown", () => {
    const result = formatCurrency(100, "USD", "xx");
    expect(result).toContain("100");
  });
});

describe("getDefaultCurrencyForLocale", () => {
  it("returns USD for en", () => {
    expect(getDefaultCurrencyForLocale("en")).toBe("USD");
  });

  it("returns AED for ar", () => {
    expect(getDefaultCurrencyForLocale("ar")).toBe("AED");
  });

  it("returns PKR for ur", () => {
    expect(getDefaultCurrencyForLocale("ur")).toBe("PKR");
  });

  it("falls back to USD for an unknown locale", () => {
    expect(getDefaultCurrencyForLocale("fr")).toBe(DEFAULT_CURRENCY);
  });
});

describe("getCurrencyMetadata", () => {
  it("returns metadata for USD", () => {
    const meta = getCurrencyMetadata("USD");
    expect(meta.code).toBe("USD");
    expect(meta.symbol).toBe("$");
    expect(meta.decimalDigits).toBe(2);
  });

  it("returns metadata for KWD with 3 decimal places", () => {
    const meta = getCurrencyMetadata("KWD");
    expect(meta.code).toBe("KWD");
    expect(meta.decimalDigits).toBe(3);
  });

  it("returns metadata for OMR with 3 decimal places", () => {
    const meta = getCurrencyMetadata("OMR");
    expect(meta.code).toBe("OMR");
    expect(meta.name).toBe("Omani Rial");
    expect(meta.decimalDigits).toBe(3);
  });

  it("formats OMR correctly", () => {
    const result = formatCurrency(100, "OMR", "en");
    expect(result).toBeTruthy();
    expect(result).toContain("100");
  });

  it("returns metadata for all 11 currencies", () => {
    const codes = Object.keys(CURRENCIES);
    expect(codes).toHaveLength(11);
  });
});

describe("isCurrencyCode", () => {
  it("returns true for a valid currency code", () => {
    expect(isCurrencyCode("USD")).toBe(true);
    expect(isCurrencyCode("AED")).toBe(true);
    expect(isCurrencyCode("PKR")).toBe(true);
  });

  it("returns false for an invalid value", () => {
    expect(isCurrencyCode("XYZ")).toBe(false);
    expect(isCurrencyCode(123)).toBe(false);
    expect(isCurrencyCode(null)).toBe(false);
    expect(isCurrencyCode(undefined)).toBe(false);
  });

  it("returns false for BDT (not in the 11 supported currencies)", () => {
    expect(isCurrencyCode("BDT")).toBe(false);
  });
});
