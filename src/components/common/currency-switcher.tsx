"use client";

import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCurrencyStore from "@/stores/use-currency-store";
import { CURRENCY_CODES, type CurrencyCode } from "@/lib/currency";

export function CurrencySwitcher() {
  const t = useTranslations("currency");
  const { activeCurrency, setCurrency } = useCurrencyStore();

  return (
    <Select
      value={activeCurrency}
      onValueChange={(v) => setCurrency(v as CurrencyCode)}
    >
      <SelectTrigger className="w-36" aria-label={t("label")}>
        <SelectValue placeholder={activeCurrency} />
      </SelectTrigger>
      <SelectContent>
        {CURRENCY_CODES.map((code) => (
          <SelectItem key={code} value={code}>
            {code} — {t(code)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
