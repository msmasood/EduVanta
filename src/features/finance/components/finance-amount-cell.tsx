"use client";

import { formatCurrency, type CurrencyCode } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface FinanceAmountCellProps {
  amount: number;
  currency: string;
  locale?: string;
  className?: string;
  /** Show in negative/red (for expenses) */
  negative?: boolean;
  /** Dim with muted foreground */
  muted?: boolean;
}

/**
 * FinanceAmountCell — renders a monetary amount using formatCurrency.
 * Never hardcodes a currency symbol.
 */
export function FinanceAmountCell({
  amount,
  currency,
  locale = "en",
  className,
  negative = false,
  muted = false,
}: FinanceAmountCellProps) {
  const formatted = formatCurrency(amount, currency as CurrencyCode, locale);
  return (
    <span
      className={cn(
        "font-medium tabular-nums",
        negative && "text-destructive",
        muted && "text-muted-foreground",
        className
      )}
    >
      {negative ? `−${formatted}` : formatted}
    </span>
  );
}
