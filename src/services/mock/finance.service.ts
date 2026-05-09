import type { PaginatedResponse, ApiResponse, QueryParams } from "@/types/common";
import type { IncomeHead, IncomeRecord, ExpenseHead, ExpenseRecord, Transaction } from "@/types/finance";
import { incomeHeads, incomeRecords, expenseHeads, expenseRecords, transactions } from "@/data/mock/finance";
import { withMockDelay } from "./delay";
import { createMockResponse, createPaginatedResponse, applyQueryParams } from "./helpers";

export async function getIncomeHeads(ms = 250): Promise<ApiResponse<IncomeHead[]>> {
  return withMockDelay(createMockResponse(incomeHeads), ms);
}

export async function getIncomeRecords(params?: QueryParams, ms = 250): Promise<PaginatedResponse<IncomeRecord>> {
  const filtered = applyQueryParams(incomeRecords, params, ["invoiceNumber", "description"] as (keyof IncomeRecord)[]);
  return withMockDelay(createPaginatedResponse(filtered, params), ms);
}

export async function getExpenseHeads(ms = 250): Promise<ApiResponse<ExpenseHead[]>> {
  return withMockDelay(createMockResponse(expenseHeads), ms);
}

export async function getExpenseRecords(params?: QueryParams, ms = 250): Promise<PaginatedResponse<ExpenseRecord>> {
  const filtered = applyQueryParams(expenseRecords, params, ["invoiceNumber", "description"] as (keyof ExpenseRecord)[]);
  return withMockDelay(createPaginatedResponse(filtered, params), ms);
}

export async function getTransactions(params?: QueryParams, ms = 250): Promise<PaginatedResponse<Transaction>> {
  const filtered = applyQueryParams(transactions, params, ["description"] as (keyof Transaction)[]);
  return withMockDelay(createPaginatedResponse(filtered, params), ms);
}
