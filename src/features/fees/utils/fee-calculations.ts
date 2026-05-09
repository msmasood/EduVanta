// fee-calculations.ts — monetary calculation utilities for the fees module

import type { CurrencyCode } from "@/lib/currency";

export interface MoneyLike {
  amount: number;
  currency: string;
}

/**
 * Calculate the outstanding balance for an invoice.
 * Clamps to 0 so we never return a negative balance.
 */
export function calcBalance(netAmount: MoneyLike, paidAmount: MoneyLike): number {
  return Math.max(0, netAmount.amount - paidAmount.amount);
}

export interface FeeSummaryTotals {
  totalInvoiced: number;
  collected: number;
  pending: number;
  overdue: number;
  currency: string;
}

/**
 * Aggregate fee invoice data into summary totals.
 * - collected  = sum of paidAmount across all invoices
 * - pending    = outstanding balance on non-overdue, non-paid invoices
 * - overdue    = outstanding balance on overdue invoices
 */
export function computeFeeSummaryTotals(
  invoices: Array<{
    netAmount: MoneyLike;
    paidAmount: MoneyLike;
    status: string;
  }>
): FeeSummaryTotals {
  let totalInvoiced = 0;
  let collected = 0;
  let pending = 0;
  let overdue = 0;
  let currency: string = "PKR";

  for (const inv of invoices) {
    currency = inv.netAmount.currency;
    totalInvoiced += inv.netAmount.amount;
    collected += inv.paidAmount.amount;
    const balance = Math.max(0, inv.netAmount.amount - inv.paidAmount.amount);
    if (inv.status === "overdue") {
      overdue += balance;
    } else if (inv.status !== "paid" && inv.status !== "waived") {
      pending += balance;
    }
  }

  return { totalInvoiced, collected, pending, overdue, currency };
}

export interface FeeGroupSummary {
  total: number;
  active: number;
}

export interface FeeTypeSummary {
  total: number;
  monthly: number;
  oneTime: number;
}

export interface FeeDiscountSummary {
  total: number;
  percentage: number;
  fixed: number;
}

export function computeFeeGroupSummary(groups: { id: string }[]): FeeGroupSummary {
  return { total: groups.length, active: groups.length };
}

export function computeFeeTypeSummary(
  types: { frequency?: string; isRecurring: boolean }[]
): FeeTypeSummary {
  return {
    total: types.length,
    monthly: types.filter((t) => t.frequency === "monthly").length,
    oneTime: types.filter((t) => !t.isRecurring || t.frequency === "one-time").length,
  };
}

export function computeFeeDiscountSummary(
  discounts: { discountType: string }[]
): FeeDiscountSummary {
  return {
    total: discounts.length,
    percentage: discounts.filter((d) => d.discountType === "percentage").length,
    fixed: discounts.filter((d) => d.discountType === "fixed").length,
  };
}
