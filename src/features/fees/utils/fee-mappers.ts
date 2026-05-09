// fee-mappers.ts — data transformation utilities for the fees module

import type { FeeInvoice, FeeGroup, FeeType, FeeDiscount } from "@/types/fees";
import type { Student } from "@/types/student";
import type { StatusVariant } from "@/components/data-table/status-badge";
import type { CurrencyCode } from "@/lib/currency";
import { calcBalance } from "./fee-calculations";

// ─── Status mappings ───────────────────────────────────────────────────────────

export function invoiceStatusToVariant(status: string): StatusVariant {
  const map: Record<string, StatusVariant> = {
    paid: "paid",
    partial: "partial",
    overdue: "overdue",
    due: "due",
    waived: "neutral",
    cancelled: "inactive",
    pending: "pending",
  };
  return map[status] ?? "neutral";
}

export function invoiceStatusLabel(status: string): string {
  const map: Record<string, string> = {
    paid: "Paid",
    partial: "Partial",
    overdue: "Overdue",
    due: "Due",
    waived: "Waived",
    cancelled: "Cancelled",
    pending: "Pending",
  };
  return map[status] ?? status;
}

// ─── Fee Invoice Row ───────────────────────────────────────────────────────────

export interface FeeInvoiceRow {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  feeTypeId: string;
  feeTypeName: string;
  feeGroupId: string;
  feeGroupName: string;
  amount: number;
  currency: string;
  discountAmount: number;
  netAmount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  paidDate?: string;
  status: string;
  statusVariant: StatusVariant;
  statusLabel: string;
}

export function mapInvoicesToRows(
  invoices: FeeInvoice[],
  students: Student[],
  feeTypes: FeeType[],
  feeGroups: FeeGroup[]
): FeeInvoiceRow[] {
  const studentMap = new Map(students.map((s) => [s.id, s]));
  const feeTypeMap = new Map(feeTypes.map((t) => [t.id, t]));
  const feeGroupMap = new Map(feeGroups.map((g) => [g.id, g]));

  return invoices.map((inv) => {
    const student = studentMap.get(inv.studentId);
    const feeType = feeTypeMap.get(inv.feeTypeId);
    const feeGroup = feeType ? feeGroupMap.get(feeType.feeGroupId) : undefined;

    const studentName = student
      ? `${student.firstName} ${student.lastName}`
      : inv.studentId;
    const admissionNumber = student?.admissionNumber ?? "";
    const feeTypeName = feeType?.name ?? inv.feeTypeId;
    const feeGroupId = feeType?.feeGroupId ?? "";
    const feeGroupName = feeGroup?.name ?? "";

    const balance = calcBalance(inv.netAmount, inv.paidAmount);

    return {
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      studentId: inv.studentId,
      studentName,
      admissionNumber,
      feeTypeId: inv.feeTypeId,
      feeTypeName,
      feeGroupId,
      feeGroupName,
      amount: inv.amount.amount,
      currency: inv.amount.currency,
      discountAmount: inv.discountAmount.amount,
      netAmount: inv.netAmount.amount,
      paidAmount: inv.paidAmount.amount,
      balance,
      dueDate: inv.dueDate,
      paidDate: inv.paidDate,
      status: inv.status,
      statusVariant: invoiceStatusToVariant(inv.status),
      statusLabel: invoiceStatusLabel(inv.status),
    };
  });
}

export interface FeeSummary {
  totalInvoiced: number;
  collected: number;
  pending: number;
  overdue: number;
  currency: string;
}

export function computeInvoiceSummary(invoices: FeeInvoice[]): FeeSummary {
  let totalInvoiced = 0;
  let collected = 0;
  let pending = 0;
  let overdue = 0;
  let currency = "PKR";

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

// ─── Fee Group Row ─────────────────────────────────────────────────────────────

export interface FeeGroupRow {
  id: string;
  name: string;
  description: string;
  feeTypesCount: number;
}

export function mapFeeGroupsToRows(
  groups: FeeGroup[],
  feeTypes: FeeType[]
): FeeGroupRow[] {
  return groups.map((g) => ({
    id: g.id,
    name: g.name,
    description: g.description ?? "",
    feeTypesCount: feeTypes.filter((t) => t.feeGroupId === g.id).length,
  }));
}

// ─── Fee Type Row ──────────────────────────────────────────────────────────────

export interface FeeTypeRow {
  id: string;
  name: string;
  feeGroupId: string;
  groupName: string;
  amount: number;
  currency: CurrencyCode;
  frequency: string;
  isRecurring: boolean;
}

export function mapFeeTypesToRows(
  types: FeeType[],
  groups: FeeGroup[]
): FeeTypeRow[] {
  const groupMap = new Map(groups.map((g) => [g.id, g]));
  return types.map((t) => ({
    id: t.id,
    name: t.name,
    feeGroupId: t.feeGroupId,
    groupName: groupMap.get(t.feeGroupId)?.name ?? "",
    amount: t.amount.amount,
    currency: t.amount.currency as CurrencyCode,
    frequency: t.frequency ?? "one-time",
    isRecurring: t.isRecurring,
  }));
}

// ─── Fee Discount Row ──────────────────────────────────────────────────────────

export interface FeeDiscountRow {
  id: string;
  name: string;
  discountType: "percentage" | "fixed";
  value: number;
  valueDisplay: string;
  applicableCount: number;
}

export function mapFeeDiscountsToRows(
  discounts: FeeDiscount[],
  feeTypes: FeeType[]
): FeeDiscountRow[] {
  const feeTypeSet = new Set(feeTypes.map((t) => t.id));
  return discounts.map((d) => {
    const applicable = d.applicableTo ?? [];
    const validApplicable = applicable.filter((id) => feeTypeSet.has(id));
    const valueDisplay =
      d.discountType === "percentage" ? `${d.value}%` : `${d.value}`;
    return {
      id: d.id,
      name: d.name,
      discountType: d.discountType,
      value: d.value,
      valueDisplay,
      applicableCount: validApplicable.length,
    };
  });
}
