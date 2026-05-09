"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";
import {
  getIncomeHeads,
  getIncomeRecords,
  getExpenseHeads,
  getExpenseRecords,
  getTransactions,
} from "@/services/mock/finance.service";
import type { QueryParams } from "@/types/common";

export function useIncomeHeads() {
  return useQuery({ queryKey: queryKeys.finance.incomeHeads(), queryFn: () => getIncomeHeads() });
}

export function useIncomeRecords(params?: QueryParams) {
  return useQuery({
    queryKey: queryKeys.finance.incomeRecords(params),
    queryFn: () => getIncomeRecords(params),
  });
}

export function useExpenseHeads() {
  return useQuery({ queryKey: queryKeys.finance.expenseHeads(), queryFn: () => getExpenseHeads() });
}

export function useExpenseRecords(params?: QueryParams) {
  return useQuery({
    queryKey: queryKeys.finance.expenseRecords(params),
    queryFn: () => getExpenseRecords(params),
  });
}

export function useTransactions(params?: QueryParams) {
  return useQuery({
    queryKey: queryKeys.finance.transactions(params),
    queryFn: () => getTransactions(params),
  });
}
