"use client";

import {
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, type CurrencyCode } from "@/lib/currency";
import type { FeeSummary } from "../utils/fee-mappers";

interface FeeSummaryCardsProps {
  summary: FeeSummary;
  locale?: string;
}

/**
 * FeeSummaryCards — 4 stat cards for the Fees Collection page.
 * All monetary values use formatCurrency — no hardcoded symbols.
 */
export function FeeSummaryCards({ summary, locale = "en" }: FeeSummaryCardsProps) {
  const fmt = (amount: number) =>
    formatCurrency(amount, summary.currency as CurrencyCode, locale);

  const cards = [
    {
      label: "Total Invoiced",
      value: fmt(summary.totalInvoiced),
      icon: DollarSign,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Collected",
      value: fmt(summary.collected),
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "Pending",
      value: fmt(summary.pending),
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      label: "Overdue",
      value: fmt(summary.overdue),
      icon: AlertCircle,
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-950/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4" data-testid="fee-summary-cards">
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
