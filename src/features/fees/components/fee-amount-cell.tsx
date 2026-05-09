"use client";

import { formatCurrency, type CurrencyCode } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface FeeAmountCellProps {
  amount: number;
  currency: string;
  locale?: string;
  className?: string;
  /** When true, shows strikethrough (e.g. for discount display) */
  strikethrough?: boolean;
  /** Dim the value with muted foreground */
  muted?: boolean;
}

/**
 * FeeAmountCell — renders a monetary amount using formatCurrency.
 * Never hardcodes a currency symbol; always uses the stored currency code.
 */
export function FeeAmountCell({
  amount,
  currency,
  locale = "en",
  className,
  strikethrough = false,
  muted = false,
}: FeeAmountCellProps) {
  const formatted = formatCurrency(amount, currency as CurrencyCode, locale);
  return (
    <span
      className={cn(
        "font-medium tabular-nums",
        strikethrough && "line-through",
        muted && "text-muted-foreground",
        className
      )}
    >
      {formatted}
    </span>
  );
}
