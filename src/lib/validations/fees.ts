import { z } from "zod";

const SUPPORTED_CURRENCIES = [
  "USD", "AED", "SAR", "PKR", "GBP", "EUR", "QAR", "KWD", "OMR", "BHD", "INR",
] as const;

// ─── Fee Payment Schema ────────────────────────────────────────────────────────

export const feePaymentSchema = z.object({
  invoiceId: z.string().min(1, { error: "Invoice is required." }),
  studentId: z.string().min(1, { error: "Student is required." }),
  amount: z.number().min(0, { error: "Amount must be 0 or more." }),
  currency: z.enum(SUPPORTED_CURRENCIES, { error: "Unsupported currency." }),
  paymentMethod: z.enum(["cash", "bank-transfer", "online", "cheque"] as const, {
    error: "Payment method is required.",
  }),
  paymentDate: z.string().min(1, { error: "Payment date is required." }),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

export type FeePaymentFormValues = z.infer<typeof feePaymentSchema>;

// ─── Fee Group Schema ─────────────────────────────────────────────────────────

export const feeGroupFormSchema = z.object({
  name: z.string().min(2, { error: "Name must be at least 2 characters." }),
  code: z.string().min(1, { error: "Code is required." }),
  description: z.string().optional(),
  classIds: z.array(z.string()).optional(),
  status: z.enum(["active", "inactive"] as const, { error: "Status is required." }),
});

export type FeeGroupFormValues = z.infer<typeof feeGroupFormSchema>;

// ─── Fee Type Schema ──────────────────────────────────────────────────────────

export const feeTypeFormSchema = z.object({
  name: z.string().min(2, { error: "Name must be at least 2 characters." }),
  code: z.string().min(1, { error: "Code is required." }),
  groupId: z.string().optional(),
  amount: z.number().min(0, { error: "Amount must be 0 or more." }),
  currency: z.enum(SUPPORTED_CURRENCIES, { error: "Unsupported currency." }),
  frequency: z.enum(["monthly", "term", "annual", "one-time"] as const, {
    error: "Frequency is required.",
  }),
  dueDay: z
    .number()
    .min(1, { error: "Day must be between 1 and 31." })
    .max(31, { error: "Day must be between 1 and 31." })
    .optional(),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"] as const, { error: "Status is required." }),
});

export type FeeTypeFormValues = z.infer<typeof feeTypeFormSchema>;

// ─── Fee Discount Schema ──────────────────────────────────────────────────────

export const feeDiscountFormSchema = z.object({
  name: z.string().min(2, { error: "Name must be at least 2 characters." }),
  code: z.string().min(1, { error: "Code is required." }),
  discountType: z.enum(["percentage", "fixed"] as const, {
    error: "Discount type is required.",
  }),
  value: z.number().min(0, { error: "Value must be 0 or more." }),
  applicableFeeTypeIds: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(["active", "inactive"] as const, { error: "Status is required." }),
  description: z.string().optional(),
});

export type FeeDiscountFormValues = z.infer<typeof feeDiscountFormSchema>;

// ─── Fee Invoice Filter Schema ────────────────────────────────────────────────

export const feeInvoiceFilterSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  feeGroupId: z.string().optional(),
});

export type FeeInvoiceFilterValues = z.infer<typeof feeInvoiceFilterSchema>;
