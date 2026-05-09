// finance-mappers.ts — data transformation utilities for the finance module

import type { IncomeHead, IncomeRecord, ExpenseHead, ExpenseRecord, Transaction } from "@/types/finance";
import type { StatusVariant } from "@/components/data-table/status-badge";

// ─── Status mappings ───────────────────────────────────────────────────────────

export function headStatusToVariant(status?: string): StatusVariant {
  if (status === "inactive") return "inactive";
  return "active";
}

export function headStatusLabel(status?: string): string {
  if (status === "inactive") return "Inactive";
  return "Active";
}

export function incomeStatusToVariant(status?: string): StatusVariant {
  const map: Record<string, StatusVariant> = {
    received: "paid",
    pending: "pending",
    cancelled: "inactive",
  };
  return map[status ?? ""] ?? "neutral";
}

export function incomeStatusLabel(status?: string): string {
  const map: Record<string, string> = {
    received: "Received",
    pending: "Pending",
    cancelled: "Cancelled",
  };
  return map[status ?? ""] ?? (status ?? "—");
}

export function expenseStatusToVariant(status?: string): StatusVariant {
  const map: Record<string, StatusVariant> = {
    paid: "paid",
    pending: "pending",
    cancelled: "inactive",
  };
  return map[status ?? ""] ?? "neutral";
}

export function expenseStatusLabel(status?: string): string {
  const map: Record<string, string> = {
    paid: "Paid",
    pending: "Pending",
    cancelled: "Cancelled",
  };
  return map[status ?? ""] ?? (status ?? "—");
}

export function transactionStatusToVariant(status?: string): StatusVariant {
  const map: Record<string, StatusVariant> = {
    completed: "paid",
    pending: "pending",
    failed: "destructive",
    cancelled: "inactive",
  };
  return map[status ?? ""] ?? "neutral";
}

export function transactionStatusLabel(status?: string): string {
  const map: Record<string, string> = {
    completed: "Completed",
    pending: "Pending",
    failed: "Failed",
    cancelled: "Cancelled",
  };
  return map[status ?? ""] ?? (status ?? "—");
}

export function transactionTypeLabel(type: string): string {
  const map: Record<string, string> = {
    income: "Income",
    expense: "Expense",
    "fee-payment": "Fee Payment",
    salary: "Salary",
    refund: "Refund",
  };
  return map[type] ?? type;
}

export function transactionTypeVariant(type: string): StatusVariant {
  const map: Record<string, StatusVariant> = {
    income: "success",
    "fee-payment": "paid",
    refund: "info",
    expense: "destructive",
    salary: "warning",
  };
  return map[type] ?? "neutral";
}

export function paymentMethodLabel(method?: string): string {
  const map: Record<string, string> = {
    cash: "Cash",
    "bank-transfer": "Bank Transfer",
    online: "Online",
    cheque: "Cheque",
  };
  return map[method ?? ""] ?? (method ?? "—");
}

// ─── Income Head Row ───────────────────────────────────────────────────────────

export interface IncomeHeadRow {
  id: string;
  name: string;
  code: string;
  description: string;
  incomeRecordsCount: number;
  status: string;
  statusVariant: StatusVariant;
  statusLabel: string;
}

export function mapIncomeHeadsToRows(
  heads: IncomeHead[],
  records: IncomeRecord[]
): IncomeHeadRow[] {
  const countMap = new Map<string, number>();
  for (const r of records) {
    countMap.set(r.incomeHeadId, (countMap.get(r.incomeHeadId) ?? 0) + 1);
  }
  return heads.map((h) => ({
    id: h.id,
    name: h.name,
    code: h.code ?? "",
    description: h.description ?? "",
    incomeRecordsCount: countMap.get(h.id) ?? 0,
    status: h.status ?? "active",
    statusVariant: headStatusToVariant(h.status),
    statusLabel: headStatusLabel(h.status),
  }));
}

// ─── Income Record Row ─────────────────────────────────────────────────────────

export interface IncomeRecordRow {
  id: string;
  invoiceNumber: string;
  title: string;
  incomeHeadId: string;
  incomeHeadName: string;
  amount: number;
  currency: string;
  receivedFrom: string;
  paymentMethod: string;
  paymentMethodLabel: string;
  date: string;
  referenceNumber: string;
  status: string;
  statusVariant: StatusVariant;
  statusLabel: string;
}

export function mapIncomeRecordsToRows(
  records: IncomeRecord[],
  heads: IncomeHead[]
): IncomeRecordRow[] {
  const headMap = new Map(heads.map((h) => [h.id, h]));
  return records.map((r) => {
    const head = headMap.get(r.incomeHeadId);
    return {
      id: r.id,
      invoiceNumber: r.invoiceNumber,
      title: r.title ?? r.description ?? r.invoiceNumber,
      incomeHeadId: r.incomeHeadId,
      incomeHeadName: head?.name ?? "—",
      amount: r.amount.amount,
      currency: r.amount.currency,
      receivedFrom: r.receivedFrom ?? "—",
      paymentMethod: r.paymentMethod,
      paymentMethodLabel: paymentMethodLabel(r.paymentMethod),
      date: r.date,
      referenceNumber: r.referenceNumber ?? "—",
      status: r.status ?? "pending",
      statusVariant: incomeStatusToVariant(r.status),
      statusLabel: incomeStatusLabel(r.status),
    };
  });
}

// ─── Expense Head Row ──────────────────────────────────────────────────────────

export interface ExpenseHeadRow {
  id: string;
  name: string;
  code: string;
  description: string;
  expenseRecordsCount: number;
  status: string;
  statusVariant: StatusVariant;
  statusLabel: string;
}

export function mapExpenseHeadsToRows(
  heads: ExpenseHead[],
  records: ExpenseRecord[]
): ExpenseHeadRow[] {
  const countMap = new Map<string, number>();
  for (const r of records) {
    countMap.set(r.expenseHeadId, (countMap.get(r.expenseHeadId) ?? 0) + 1);
  }
  return heads.map((h) => ({
    id: h.id,
    name: h.name,
    code: h.code ?? "",
    description: h.description ?? "",
    expenseRecordsCount: countMap.get(h.id) ?? 0,
    status: h.status ?? "active",
    statusVariant: headStatusToVariant(h.status),
    statusLabel: headStatusLabel(h.status),
  }));
}

// ─── Expense Record Row ────────────────────────────────────────────────────────

export interface ExpenseRecordRow {
  id: string;
  invoiceNumber: string;
  title: string;
  expenseHeadId: string;
  expenseHeadName: string;
  amount: number;
  currency: string;
  paidTo: string;
  paymentMethod: string;
  paymentMethodLabel: string;
  date: string;
  referenceNumber: string;
  status: string;
  statusVariant: StatusVariant;
  statusLabel: string;
}

export function mapExpenseRecordsToRows(
  records: ExpenseRecord[],
  heads: ExpenseHead[]
): ExpenseRecordRow[] {
  const headMap = new Map(heads.map((h) => [h.id, h]));
  return records.map((r) => {
    const head = headMap.get(r.expenseHeadId);
    return {
      id: r.id,
      invoiceNumber: r.invoiceNumber,
      title: r.title ?? r.description ?? r.invoiceNumber,
      expenseHeadId: r.expenseHeadId,
      expenseHeadName: head?.name ?? "—",
      amount: r.amount.amount,
      currency: r.amount.currency,
      paidTo: r.paidTo ?? "—",
      paymentMethod: r.paymentMethod,
      paymentMethodLabel: paymentMethodLabel(r.paymentMethod),
      date: r.date,
      referenceNumber: r.referenceNumber ?? "—",
      status: r.status ?? "pending",
      statusVariant: expenseStatusToVariant(r.status),
      statusLabel: expenseStatusLabel(r.status),
    };
  });
}

// ─── Transaction Row ───────────────────────────────────────────────────────────

export interface TransactionRow {
  id: string;
  type: string;
  typeLabel: string;
  typeVariant: StatusVariant;
  description: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentMethodLabel: string;
  date: string;
  referenceNumber: string;
  status: string;
  statusVariant: StatusVariant;
  statusLabel: string;
  referenceId: string;
  referenceType: string;
  notes?: string;
}

export function mapTransactionsToRows(transactions: Transaction[]): TransactionRow[] {
  return transactions.map((txn) => ({
    id: txn.id,
    type: txn.type,
    typeLabel: transactionTypeLabel(txn.type),
    typeVariant: transactionTypeVariant(txn.type),
    description: txn.description,
    amount: txn.amount.amount,
    currency: txn.amount.currency,
    paymentMethod: txn.paymentMethod ?? "",
    paymentMethodLabel: paymentMethodLabel(txn.paymentMethod),
    date: txn.date,
    referenceNumber: txn.referenceNumber ?? "—",
    status: txn.status ?? "completed",
    statusVariant: transactionStatusToVariant(txn.status),
    statusLabel: transactionStatusLabel(txn.status),
    referenceId: txn.referenceId,
    referenceType: txn.referenceType,
  }));
}
