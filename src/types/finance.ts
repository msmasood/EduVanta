import type { ID, AuditMeta, MoneyAmount } from "./common";
import type { PaymentMethod } from "./fees";

// ─── Finance status types ─────────────────────────────────────────────────────

export type FinanceHeadStatus = "active" | "inactive";
export type IncomeStatus = "received" | "pending" | "cancelled";
export type ExpenseStatus = "paid" | "pending" | "cancelled";

// ─── Income ───────────────────────────────────────────────────────────────────

export interface IncomeHead {
  id: ID;
  schoolId: ID;
  name: string;
  code?: string;
  description?: string;
  status?: FinanceHeadStatus;
  audit: AuditMeta;
}

export interface IncomeRecord {
  id: ID;
  schoolId: ID;
  incomeHeadId: ID;
  invoiceNumber: string;
  title?: string;
  amount: MoneyAmount;
  date: string;
  paymentMethod: PaymentMethod;
  receivedFrom?: string;
  referenceNumber?: string;
  description?: string;
  notes?: string;
  status?: IncomeStatus;
  collectedBy: ID;
  audit: AuditMeta;
}

// ─── Expense ──────────────────────────────────────────────────────────────────

export interface ExpenseHead {
  id: ID;
  schoolId: ID;
  name: string;
  code?: string;
  description?: string;
  status?: FinanceHeadStatus;
  audit: AuditMeta;
}

export interface ExpenseRecord {
  id: ID;
  schoolId: ID;
  expenseHeadId: ID;
  invoiceNumber: string;
  title?: string;
  amount: MoneyAmount;
  date: string;
  paymentMethod: PaymentMethod;
  paidTo?: string;
  referenceNumber?: string;
  description?: string;
  notes?: string;
  status?: ExpenseStatus;
  approvedBy?: ID;
  audit: AuditMeta;
}

// ─── Transaction ──────────────────────────────────────────────────────────────

export type TransactionType = "income" | "expense" | "fee-payment" | "salary" | "refund";
export type TransactionStatus = "completed" | "pending" | "failed" | "cancelled";

export interface Transaction {
  id: ID;
  schoolId: ID;
  type: TransactionType;
  referenceId: ID;
  referenceType: string;
  amount: MoneyAmount;
  description: string;
  date: string;
  paymentMethod?: PaymentMethod;
  referenceNumber?: string;
  status?: TransactionStatus;
  audit: AuditMeta;
}
