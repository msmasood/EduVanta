import { z } from "zod";

const SUPPORTED_CURRENCIES = [
  "USD", "AED", "SAR", "PKR", "GBP", "EUR", "QAR", "KWD", "OMR", "BHD", "INR",
] as const;

const PAYMENT_METHODS = ["cash", "bank-transfer", "online", "cheque"] as const;

// ─── Income Head Schema ────────────────────────────────────────────────────────

export const incomeHeadFormSchema = z.object({
  name: z.string().min(2, { error: "Name must be at least 2 characters." }),
  code: z.string().min(1, { error: "Code is required." }),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"] as const, { error: "Status is required." }),
});

export type IncomeHeadFormValues = z.infer<typeof incomeHeadFormSchema>;

// ─── Income Schema ─────────────────────────────────────────────────────────────

export const incomeFormSchema = z.object({
  incomeHeadId: z.string().min(1, { error: "Income head is required." }),
  title: z.string().min(2, { error: "Title must be at least 2 characters." }),
  amount: z.number().min(0, { error: "Amount must be 0 or more." }),
  currency: z.enum(SUPPORTED_CURRENCIES, { error: "Unsupported currency." }),
  receivedFrom: z.string().optional(),
  paymentMethod: z.enum(PAYMENT_METHODS, { error: "Payment method is required." }),
  incomeDate: z.string().min(1, { error: "Income date is required." }),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["received", "pending", "cancelled"] as const, {
    error: "Status is required.",
  }),
});

export type IncomeFormValues = z.infer<typeof incomeFormSchema>;

// ─── Expense Head Schema ──────────────────────────────────────────────────────

export const expenseHeadFormSchema = z.object({
  name: z.string().min(2, { error: "Name must be at least 2 characters." }),
  code: z.string().min(1, { error: "Code is required." }),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"] as const, { error: "Status is required." }),
});

export type ExpenseHeadFormValues = z.infer<typeof expenseHeadFormSchema>;

// ─── Expense Schema ───────────────────────────────────────────────────────────

export const expenseFormSchema = z.object({
  expenseHeadId: z.string().min(1, { error: "Expense head is required." }),
  title: z.string().min(2, { error: "Title must be at least 2 characters." }),
  amount: z.number().min(0, { error: "Amount must be 0 or more." }),
  currency: z.enum(SUPPORTED_CURRENCIES, { error: "Unsupported currency." }),
  paidTo: z.string().optional(),
  paymentMethod: z.enum(PAYMENT_METHODS, { error: "Payment method is required." }),
  expenseDate: z.string().min(1, { error: "Expense date is required." }),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["paid", "pending", "cancelled"] as const, {
    error: "Status is required.",
  }),
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

// ─── Transaction Filter Schema ────────────────────────────────────────────────

export const transactionFilterSchema = z
  .object({
    type: z.string().optional(),
    status: z.string().optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    minAmount: z.number().min(0, { error: "Min amount must be 0 or more." }).optional(),
    maxAmount: z.number().min(0, { error: "Max amount must be 0 or more." }).optional(),
  })
  .refine(
    (data) => {
      if (data.dateFrom && data.dateTo) {
        return data.dateTo >= data.dateFrom;
      }
      return true;
    },
    { message: "End date cannot be before start date." }
  );

export type TransactionFilterValues = z.infer<typeof transactionFilterSchema>;
