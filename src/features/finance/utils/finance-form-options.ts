// finance-form-options.ts — select option constants for finance module

export const FINANCE_STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export const FINANCE_INCOME_STATUS_OPTIONS = [
  { label: "Received", value: "received" },
  { label: "Pending", value: "pending" },
  { label: "Cancelled", value: "cancelled" },
];

export const FINANCE_EXPENSE_STATUS_OPTIONS = [
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Cancelled", value: "cancelled" },
];

export const FINANCE_PAYMENT_METHOD_OPTIONS = [
  { label: "Cash", value: "cash" },
  { label: "Bank Transfer", value: "bank-transfer" },
  { label: "Online", value: "online" },
  { label: "Cheque", value: "cheque" },
];

export const FINANCE_TRANSACTION_TYPE_OPTIONS = [
  { label: "Income", value: "income" },
  { label: "Expense", value: "expense" },
  { label: "Fee Payment", value: "fee-payment" },
  { label: "Salary", value: "salary" },
  { label: "Refund", value: "refund" },
];

export const FINANCE_TRANSACTION_STATUS_OPTIONS = [
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
  { label: "Cancelled", value: "cancelled" },
];

export const FINANCE_CURRENCY_OPTIONS = [
  { label: "PKR — Pakistani Rupee", value: "PKR" },
  { label: "USD — US Dollar", value: "USD" },
  { label: "AED — UAE Dirham", value: "AED" },
  { label: "SAR — Saudi Riyal", value: "SAR" },
  { label: "GBP — British Pound", value: "GBP" },
  { label: "EUR — Euro", value: "EUR" },
  { label: "QAR — Qatari Riyal", value: "QAR" },
  { label: "KWD — Kuwaiti Dinar", value: "KWD" },
  { label: "OMR — Omani Rial", value: "OMR" },
  { label: "BHD — Bahraini Dinar", value: "BHD" },
  { label: "INR — Indian Rupee", value: "INR" },
];
