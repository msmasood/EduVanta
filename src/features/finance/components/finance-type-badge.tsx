"use client";

import { StatusBadge } from "@/components/data-table";
import { transactionTypeLabel, transactionTypeVariant } from "../utils/finance-mappers";

interface FinanceTypeBadgeProps {
  type: string;
  label?: string;
}

/**
 * FinanceTypeBadge — renders a coloured pill for transaction type.
 */
export function FinanceTypeBadge({ type, label }: FinanceTypeBadgeProps) {
  const variant = transactionTypeVariant(type);
  const displayLabel = label ?? transactionTypeLabel(type);
  return <StatusBadge status={variant} label={displayLabel} />;
}
