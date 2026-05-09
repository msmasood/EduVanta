// finance-calculations.ts — monetary calculation utilities for the finance module

import type { CurrencyCode } from "@/lib/currency";

export interface MoneyLike {
  amount: number;
  currency: string;
}

// ─── Finance Summary ───────────────────────────────────────────────────────────

export interface FinanceSummaryTotals {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  pendingTransactions: number;
  thisMonthIncome: number;
  thisMonthExpenses: number;
  currency: string;
}

/**
 * Compute finance summary from income and expense records.
 */
export function computeFinanceSummary(
  incomeRecords: Array<{ amount: MoneyLike; status?: string; date: string }>,
  expenseRecords: Array<{ amount: MoneyLike; status?: string; date: string }>
): FinanceSummaryTotals {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let totalIncome = 0;
  let totalExpenses = 0;
  let pendingTransactions = 0;
  let thisMonthIncome = 0;
  let thisMonthExpenses = 0;
  let currency = "PKR";

  for (const rec of incomeRecords) {
    currency = rec.amount.currency;
    totalIncome += rec.amount.amount;
    if (rec.status === "pending") pendingTransactions++;
    const d = new Date(rec.date);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      thisMonthIncome += rec.amount.amount;
    }
  }

  for (const rec of expenseRecords) {
    totalExpenses += rec.amount.amount;
    if (rec.status === "pending") pendingTransactions++;
    const d = new Date(rec.date);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      thisMonthExpenses += rec.amount.amount;
    }
  }

  const netBalance = totalIncome - totalExpenses;

  return {
    totalIncome,
    totalExpenses,
    netBalance,
    pendingTransactions,
    thisMonthIncome,
    thisMonthExpenses,
    currency,
  };
}

// ─── Head Summaries ───────────────────────────────────────────────────────────

export interface HeadSummaryTotals {
  totalHeads: number;
  activeHeads: number;
  recordsCount: number;
}

export function computeHeadSummary(
  heads: Array<{ status?: string }>,
  records: Array<unknown>
): HeadSummaryTotals {
  return {
    totalHeads: heads.length,
    activeHeads: heads.filter((h) => h.status !== "inactive").length,
    recordsCount: records.length,
  };
}

// ─── Transaction Summary ──────────────────────────────────────────────────────

export interface TransactionSummaryTotals {
  totalTransactions: number;
  incomeTransactions: number;
  expenseTransactions: number;
  netBalance: number;
  currency: string;
}

export function computeTransactionSummary(
  transactions: Array<{ type: string; amount: MoneyLike; status?: string }>
): TransactionSummaryTotals {
  let incomeTransactions = 0;
  let expenseTransactions = 0;
  let netBalance = 0;
  let currency = "PKR";

  for (const txn of transactions) {
    currency = txn.amount.currency;
    const isIncome = txn.type === "income" || txn.type === "fee-payment";
    const isExpense = txn.type === "expense" || txn.type === "salary";
    if (isIncome) {
      incomeTransactions++;
      netBalance += txn.amount.amount;
    }
    if (isExpense) {
      expenseTransactions++;
      netBalance -= txn.amount.amount;
    }
  }

  return {
    totalTransactions: transactions.length,
    incomeTransactions,
    expenseTransactions,
    netBalance,
    currency,
  };
}
