// hrm-form-options.ts — select options for HRM forms

export const PAYROLL_STATUS_OPTIONS = [
  { label: "Draft", value: "draft" },
  { label: "Processed", value: "processed" },
  { label: "Paid", value: "paid" },
] as const;

export const DEPARTMENT_STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
] as const;

export const MONTHS = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
] as const;
