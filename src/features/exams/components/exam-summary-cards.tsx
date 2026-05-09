"use client";

import { ClipboardList, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ExamSummary } from "../utils/exam-mappers";

interface Props {
  summary: ExamSummary;
}

export function ExamSummaryCards({ summary }: Props) {
  const cards = [
    {
      label: "Total Exams",
      value: String(summary.total),
      icon: ClipboardList,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Upcoming",
      value: String(summary.upcoming),
      icon: Clock,
      color: "text-sky-600",
      bg: "bg-sky-50 dark:bg-sky-950/30",
    },
    {
      label: "Ongoing",
      value: String(summary.ongoing),
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "Completed",
      value: String(summary.completed),
      icon: XCircle,
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
