"use client";

import { StatusBadge } from "@/components/data-table";
import { invoiceStatusToVariant, invoiceStatusLabel } from "../utils/fee-mappers";

interface FeeStatusBadgeProps {
  status: string;
  label?: string;
}

/**
 * FeeStatusBadge — maps fee-specific status strings to supported StatusVariant
 * and renders a colour-coded pill via StatusBadge.
 */
export function FeeStatusBadge({ status, label }: FeeStatusBadgeProps) {
  const variant = invoiceStatusToVariant(status);
  const displayLabel = label ?? invoiceStatusLabel(status);
  return <StatusBadge status={variant} label={displayLabel} />;
}
