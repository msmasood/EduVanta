// ─── Primitives ───────────────────────────────────────────────────────────────

export type ID = string;
export type Maybe<T> = T | null | undefined;
export type LocaleCode = "en" | "ar" | "ur";

/** Re-export from currency lib for convenience */
export type { CurrencyCode } from "@/lib/currency";

// ─── Generic API shapes ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ─── Query params ─────────────────────────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export type SortDirection = "asc" | "desc";

export interface SortParams {
  sortField?: string;
  sortDirection?: SortDirection;
}

export interface FilterParams {
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface QueryParams extends PaginationParams, SortParams, FilterParams {}

// ─── Shared value objects ─────────────────────────────────────────────────────

export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface DateRange {
  from: string;
  to: string;
}

export interface MoneyAmount {
  amount: number;
  currency: import("@/lib/currency").CurrencyCode;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  alternatePhone?: string;
}

export interface AuditMeta {
  createdAt: string;
  updatedAt: string;
  createdBy?: ID;
  updatedBy?: ID;
}

// ─── Common status types ──────────────────────────────────────────────────────

export type ActiveStatus = "active" | "inactive";
export type FullStatus = "active" | "inactive" | "suspended" | "archived";
export type ProcessStatus = "pending" | "approved" | "rejected" | "cancelled";
export type PaymentStatus = "paid" | "partial" | "due" | "overdue" | "waived";
export type AttendanceStatus = "present" | "absent" | "late" | "half-day" | "holiday" | "leave";
export type Gender = "male" | "female" | "other";
