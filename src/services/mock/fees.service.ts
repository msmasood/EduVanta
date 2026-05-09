import type { PaginatedResponse, ApiResponse, QueryParams } from "@/types/common";
import type { FeeGroup, FeeType, FeeDiscount, FeeInvoice, FeePayment } from "@/types/fees";
import { feeGroups, feeTypes, feeDiscounts, feeInvoices, feePayments } from "@/data/mock/fees";
import { withMockDelay } from "./delay";
import { createMockResponse, createPaginatedResponse, getById, createErrorResponse, applyQueryParams } from "./helpers";

export async function getFeeGroups(ms = 250): Promise<ApiResponse<FeeGroup[]>> {
  return withMockDelay(createMockResponse(feeGroups), ms);
}

export async function getFeeTypes(feeGroupId?: string, ms = 250): Promise<ApiResponse<FeeType[]>> {
  const filtered = feeGroupId ? feeTypes.filter((t) => t.feeGroupId === feeGroupId) : feeTypes;
  return withMockDelay(createMockResponse(filtered), ms);
}

export async function getFeeDiscounts(ms = 250): Promise<ApiResponse<FeeDiscount[]>> {
  return withMockDelay(createMockResponse(feeDiscounts), ms);
}

export async function getFeeInvoices(params?: QueryParams, ms = 250): Promise<PaginatedResponse<FeeInvoice>> {
  const filtered = applyQueryParams(feeInvoices, params, ["invoiceNumber"]);
  return withMockDelay(createPaginatedResponse(filtered, params), ms);
}

export async function getStudentInvoices(studentId: string, ms = 250): Promise<ApiResponse<FeeInvoice[]>> {
  const invoices = feeInvoices.filter((inv) => inv.studentId === studentId);
  return withMockDelay(createMockResponse(invoices), ms);
}

export async function getFeeInvoiceById(id: string, ms = 250): Promise<ApiResponse<FeeInvoice>> {
  const inv = getById(feeInvoices, id);
  if (!inv) return withMockDelay(createErrorResponse<FeeInvoice>(`Invoice '${id}' not found`), ms);
  return withMockDelay(createMockResponse(inv), ms);
}

export async function getFeePayments(invoiceId?: string, ms = 250): Promise<ApiResponse<FeePayment[]>> {
  const filtered = invoiceId ? feePayments.filter((p) => p.invoiceId === invoiceId) : feePayments;
  return withMockDelay(createMockResponse(filtered), ms);
}
