"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";
import {
  getFeeGroups,
  getFeeTypes,
  getFeeDiscounts,
  getFeeInvoices,
  getFeeInvoiceById,
  getStudentInvoices,
  getFeePayments,
} from "@/services/mock/fees.service";
import type { QueryParams } from "@/types/common";

export function useFeeGroups() {
  return useQuery({ queryKey: queryKeys.fees.groups(), queryFn: () => getFeeGroups() });
}

export function useFeeTypes(feeGroupId?: string) {
  return useQuery({
    queryKey: queryKeys.fees.types(feeGroupId),
    queryFn: () => getFeeTypes(feeGroupId),
  });
}

export function useFeeDiscounts() {
  return useQuery({ queryKey: queryKeys.fees.discounts(), queryFn: () => getFeeDiscounts() });
}

export function useFeeInvoices(params?: QueryParams) {
  return useQuery({
    queryKey: queryKeys.fees.invoices(params),
    queryFn: () => getFeeInvoices(params),
  });
}

export function useFeeInvoice(id: string) {
  return useQuery({
    queryKey: queryKeys.fees.invoice(id),
    queryFn: () => getFeeInvoiceById(id),
    enabled: !!id,
  });
}

export function useStudentInvoices(studentId: string) {
  return useQuery({
    queryKey: queryKeys.fees.studentInvoices(studentId),
    queryFn: () => getStudentInvoices(studentId),
    enabled: !!studentId,
  });
}

export function useFeePayments(invoiceId?: string) {
  return useQuery({
    queryKey: queryKeys.fees.payments(invoiceId),
    queryFn: () => getFeePayments(invoiceId),
  });
}
