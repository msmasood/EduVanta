"use client";

import { Users, CheckCircle2, XCircle, BarChart2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ExamResultSummary } from "../utils/exam-mappers";

interface Props {
  summary: ExamResultSummary;
}

export function ExamResultSummaryCards({ summary }: Props) {
  const cards = [
    {
      label: "Total Results",
      value: String(summary.total),
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Passed",
      value: String(summary.passed),
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "Failed",
      value: String(summary.failed),
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-950/30",
    },
    {
      label: "Avg. Score",
      value: `${summary.avgPercentage}%`,
      icon: BarChart2,
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
