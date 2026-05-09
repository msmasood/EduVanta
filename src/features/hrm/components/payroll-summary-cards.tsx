"use client";

import { DollarSign, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { PayrollSummary } from "../utils/hrm-mappers";

interface Props {
  summary: PayrollSummary;
}

export function PayrollSummaryCards({ summary }: Props) {
  const cards = [
    {
      label: "Total Payroll",
      value: summary.totalFormatted,
      icon: DollarSign,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Paid Records",
      value: String(summary.paidCount),
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "Pending",
      value: String(summary.pendingCount),
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      label: "Avg. Salary",
      value: summary.avgFormatted,
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, color, bg }) => (
        <Card key={label} className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className={`rounded-lg p-2 ${bg}`}>
              <Icon className={`size-5 ${color}`} aria-hidden />
            </div>
            <div>
              <p className="truncate text-lg font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
