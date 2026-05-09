import type { ID, AuditMeta, MoneyAmount } from "./common";
import type { PaymentStatus } from "./common";

// ─── Fee group ────────────────────────────────────────────────────────────────

export interface FeeGroup {
  id: ID;
  schoolId: ID;
  name: string;
  description?: string;
  audit: AuditMeta;
}

// ─── Fee type ─────────────────────────────────────────────────────────────────

export interface FeeType {
  id: ID;
  schoolId: ID;
  feeGroupId: ID;
  name: string;
  amount: MoneyAmount;
  isRecurring: boolean;
  frequency?: "monthly" | "quarterly" | "annual" | "one-time";
  audit: AuditMeta;
}

// ─── Fee discount ─────────────────────────────────────────────────────────────

export type DiscountType = "percentage" | "fixed";

export interface FeeDiscount {
  id: ID;
  schoolId: ID;
  name: string;
  discountType: DiscountType;
  value: number;
  applicableTo?: ID[];
  audit: AuditMeta;
}

// ─── Fee invoice ──────────────────────────────────────────────────────────────

export interface FeeInvoice {
  id: ID;
  schoolId: ID;
  studentId: ID;
  feeTypeId: ID;
  invoiceNumber: string;
  amount: MoneyAmount;
  discountAmount: MoneyAmount;
  netAmount: MoneyAmount;
  dueDate: string;
  paidDate?: string;
  paidAmount: MoneyAmount;
  status: PaymentStatus;
  academicYearId: ID;
  month?: number;
  audit: AuditMeta;
}

// ─── Fee payment ──────────────────────────────────────────────────────────────

export type PaymentMethod = "cash" | "bank-transfer" | "online" | "cheque";

export interface FeePayment {
  id: ID;
  invoiceId: ID;
  studentId: ID;
  amount: MoneyAmount;
  paymentMethod: PaymentMethod;
  transactionReference?: string;
  paidAt: string;
  collectedBy: ID;
  audit: AuditMeta;
}
