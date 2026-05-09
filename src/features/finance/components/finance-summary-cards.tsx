"use client";

import {
  TrendingUp,
  TrendingDown,
  Scale,
  Clock,
  Calendar,
  Users,
  Activity,
  ArrowUpDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, type CurrencyCode } from "@/lib/currency";
import type { FinanceSummaryTotals } from "../utils/finance-calculations";

interface FinanceSummaryCardsProps {
  summary: FinanceSummaryTotals;
  locale?: string;
}

/**
 * FinanceSummaryCards — overview stat cards for the finance module.
 * All monetary values use formatCurrency — no hardcoded symbols.
 */
export function FinanceSummaryCards({ summary, locale = "en" }: FinanceSummaryCardsProps) {
  const fmt = (amount: number) =>
    formatCurrency(amount, summary.currency as CurrencyCode, locale);

  const isPositiveBalance = summary.netBalance >= 0;

  const cards = [
    {
      label: "Total Income",
      value: fmt(summary.totalIncome),
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "Total Expenses",
      value: fmt(summary.totalExpenses),
      icon: TrendingDown,
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-950/30",
    },
    {
      label: "Net Balance",
      value: fmt(Math.abs(summary.netBalance)),
      icon: Scale,
      color: isPositiveBalance ? "text-blue-600" : "text-destructive",
      bg: isPositiveBalance
        ? "bg-blue-50 dark:bg-blue-950/30"
        : "bg-red-50 dark:bg-red-950/30",
    },
    {
      label: "Pending",
      value: String(summary.pendingTransactions),
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      label: "This Month Income",
      value: fmt(summary.thisMonthIncome),
      icon: Calendar,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "This Month Expenses",
      value: fmt(summary.thisMonthExpenses),
      icon: Activity,
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-950/30",
    },
  ];

  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6"
      data-testid="finance-summary-cards"
    >
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="flex items-center gap-3 p-4">
            <div className={`shrink-0 rounded-lg p-2 ${card.bg}`}>
              <card.icon className={`size-5 ${card.color}`} aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs text-muted-foreground">{card.label}</p>
              <p className="truncate text-sm font-semibold tabular-nums">{card.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Compact head summary cards ────────────────────────────────────────────────

interface HeadSummaryCardsProps {
  totalHeads: number;
  activeHeads: number;
  recordsCount: number;
  headLabel?: string;
}

export function HeadSummaryCards({
  totalHeads,
  activeHeads,
  recordsCount,
  headLabel = "Heads",
}: HeadSummaryCardsProps) {
  const cards = [
    {
      label: `Total ${headLabel}`,
      value: String(totalHeads),
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: `Active ${headLabel}`,
      value: String(activeHeads),
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "Records",
      value: String(recordsCount),
      icon: ArrowUpDown,
      color: "text-violet-600",
      bg: "bg-violet-50 dark:bg-violet-950/30",
    },
  ];

  return (
    <div
      className="grid grid-cols-3 gap-4"
      data-testid="head-summary-cards"
    >
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="flex items-center gap-3 p-4">
            <div className={`shrink-0 rounded-lg p-2 ${card.bg}`}>
              <card.icon className={`size-5 ${card.color}`} aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs text-muted-foreground">{card.label}</p>
              <p className="truncate text-base font-semibold tabular-nums">{card.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Transaction summary cards ─────────────────────────────────────────────────

import type { TransactionSummaryTotals } from "../utils/finance-calculations";

interface TransactionSummaryCardsProps {
  summary: TransactionSummaryTotals;
  locale?: string;
}

export function TransactionSummaryCards({
  summary,
  locale = "en",
}: TransactionSummaryCardsProps) {
  const fmt = (amount: number) =>
    formatCurrency(Math.abs(amount), summary.currency as CurrencyCode, locale);

  const isPositive = summary.netBalance >= 0;

  const cards = [
    {
      label: "Total Transactions",
      value: String(summary.totalTransactions),
      icon: ArrowUpDown,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Income Transactions",
      value: String(summary.incomeTransactions),
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "Expense Transactions",
      value: String(summary.expenseTransactions),
      icon: TrendingDown,
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-950/30",
    },
    {
      label: "Net Balance",
      value: fmt(summary.netBalance),
      icon: Scale,
      color: isPositive ? "text-blue-600" : "text-destructive",
      bg: isPositive
        ? "bg-blue-50 dark:bg-blue-950/30"
        : "bg-red-50 dark:bg-red-950/30",
    },
  ];

  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-4"
      data-testid="transaction-summary-cards"
    >
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="flex items-center gap-3 p-4">
            <div className={`shrink-0 rounded-lg p-2 ${card.bg}`}>
              <card.icon className={`size-5 ${card.color}`} aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs text-muted-foreground">{card.label}</p>
              <p className="truncate text-base font-semibold tabular-nums">{card.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
