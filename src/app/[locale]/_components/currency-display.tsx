"use client";

import { useLocale } from "next-intl";
import useCurrencyStore from "@/stores/use-currency-store";
import { formatCurrency } from "@/lib/currency";

const SAMPLE_AMOUNT = 12345.67;

export function CurrencyDisplay() {
  const { activeCurrency } = useCurrencyStore();
  const locale = useLocale();
  return (
    <span className="font-mono font-semibold tabular-nums">
      {formatCurrency(SAMPLE_AMOUNT, activeCurrency, locale)}
    </span>
  );
}
