"use client";

import { StatusBadge } from "@/components/data-table";
import {
  headStatusToVariant,
  headStatusLabel,
  incomeStatusToVariant,
  incomeStatusLabel,
  expenseStatusToVariant,
  expenseStatusLabel,
  transactionStatusToVariant,
  transactionStatusLabel,
} from "../utils/finance-mappers";

interface FinanceStatusBadgeProps {
  status?: string;
  type?: "head" | "income" | "expense" | "transaction";
  label?: string;
}

/**
 * FinanceStatusBadge — maps finance-specific status strings to StatusVariant.
 */
export function FinanceStatusBadge({
  status,
  type = "head",
  label,
}: FinanceStatusBadgeProps) {
  let variant;
  let displayLabel: string;

  switch (type) {
    case "income":
      variant = incomeStatusToVariant(status);
      displayLabel = label ?? incomeStatusLabel(status);
      break;
    case "expense":
      variant = expenseStatusToVariant(status);
      displayLabel = label ?? expenseStatusLabel(status);
      break;
    case "transaction":
      variant = transactionStatusToVariant(status);
      displayLabel = label ?? transactionStatusLabel(status);
      break;
    default:
      variant = headStatusToVariant(status);
      displayLabel = label ?? headStatusLabel(status);
  }

  return <StatusBadge status={variant} label={displayLabel} />;
}
