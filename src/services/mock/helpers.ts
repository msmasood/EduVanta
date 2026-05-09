import type {
  PaginatedResponse,
  ApiResponse,
  PaginationParams,
  SortParams,
  FilterParams,
  QueryParams,
  SortDirection,
} from "@/types/common";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

// ─── Pagination ───────────────────────────────────────────────────────────────

export function paginate<T>(items: T[], params?: PaginationParams): PaginatedResponse<T> {
  const page = Math.max(1, params?.page ?? 1);
  const pageSize = Math.max(1, params?.pageSize ?? DEFAULT_PAGE_SIZE);
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);
  return {
    data,
    total,
    page,
    pageSize,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

// ─── Search ───────────────────────────────────────────────────────────────────

export function searchItems<T>(items: T[], search: string, fields: (keyof T)[]): T[] {
  const term = search.trim().toLowerCase();
  if (!term) return items;
  return items.filter((item) =>
    fields.some((field) => {
      const val = item[field];
      return typeof val === "string" && val.toLowerCase().includes(term);
    })
  );
}

// ─── Sort ─────────────────────────────────────────────────────────────────────

export function sortItems<T>(items: T[], sort?: SortParams): T[] {
  if (!sort?.sortField) return items;
  const field = sort.sortField as keyof T;
  const direction: SortDirection = sort.sortDirection ?? "asc";
  return [...items].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    if (aVal === bVal) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true, sensitivity: "base" });
    return direction === "asc" ? cmp : -cmp;
  });
}

// ─── Filter ───────────────────────────────────────────────────────────────────

export function filterByStatus<T extends { status: string }>(items: T[], status?: string): T[] {
  if (!status) return items;
  return items.filter((item) => item.status === status);
}

export function filterByDateRange<T extends object>(
  items: T[],
  dateField: keyof T,
  from?: string,
  to?: string
): T[] {
  if (!from && !to) return items;
  return items.filter((item) => {
    const val = (item as Record<string, unknown>)[dateField as string] as string;
    if (!val) return false;
    if (from && val < from) return false;
    if (to && val > to) return false;
    return true;
  });
}

// ─── By ID ────────────────────────────────────────────────────────────────────

export function getById<T extends { id: string }>(items: T[], id: string): T | null {
  return items.find((item) => item.id === id) ?? null;
}

// ─── Response wrappers ────────────────────────────────────────────────────────

export function createMockResponse<T>(data: T, message?: string): ApiResponse<T> {
  return { data, success: true, message };
}

export function createErrorResponse<T>(error: string): ApiResponse<T> {
  return { data: null as unknown as T, success: false, error };
}

export function createPaginatedResponse<T>(
  items: T[],
  params?: PaginationParams
): PaginatedResponse<T> {
  return paginate(items, params);
}

// ─── Combined query params ────────────────────────────────────────────────────

export function applyQueryParams<T extends object>(
  items: T[],
  params?: QueryParams,
  searchFields?: (keyof T)[]
): T[] {
  let result = [...items];

  // Status filter
  if (params?.status) {
    result = result.filter((item) => ((item as Record<string, unknown>).status as string) === params.status);
  }

  // Date range filter
  if (params?.dateFrom || params?.dateTo) {
    result = filterByDateRange(result, "date" as keyof T, params.dateFrom, params.dateTo);
  }

  // Search
  if (params?.search && searchFields?.length) {
    result = searchItems(result, params.search, searchFields);
  }

  // Sort
  if (params?.sortField) {
    result = sortItems(result, params);
  }

  return result;
}
