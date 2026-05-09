// fee-form-options.ts — select option constants for fees forms

export const FEE_STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export const FEE_FREQUENCY_OPTIONS = [
  { label: "Monthly", value: "monthly" },
  { label: "Term", value: "term" },
  { label: "Annual", value: "annual" },
  { label: "One-Time", value: "one-time" },
];

export const FEE_PAYMENT_METHOD_OPTIONS = [
  { label: "Cash", value: "cash" },
  { label: "Bank Transfer", value: "bank-transfer" },
  { label: "Online", value: "online" },
  { label: "Cheque", value: "cheque" },
];

export const FEE_DISCOUNT_TYPE_OPTIONS = [
  { label: "Percentage (%)", value: "percentage" },
  { label: "Fixed Amount", value: "fixed" },
];

export const FEE_INVOICE_STATUS_OPTIONS = [
  { label: "Paid", value: "paid" },
  { label: "Partial", value: "partial" },
  { label: "Overdue", value: "overdue" },
  { label: "Waived", value: "waived" },
];
