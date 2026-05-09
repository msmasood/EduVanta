"use client";

import { Users, UserCheck, UserX, UserPlus } from "lucide-react";
import type { StudentStatusSummary } from "../utils/student-mappers";

interface StudentStatusCardsProps {
  summary: StudentStatusSummary;
}

export function StudentStatusCards({ summary }: StudentStatusCardsProps) {
  const cards = [
    {
      label: "Total Students",
      value: summary.total,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Active",
      value: summary.active,
      icon: UserCheck,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-950/30",
    },
    {
      label: "Suspended",
      value: summary.suspended,
      icon: UserX,
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-950/30",
    },
    {
      label: "New Admissions",
      value: summary.newAdmissions,
      icon: UserPlus,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="rounded-xl border bg-card p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${card.bg}`}>
                <Icon className={`size-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
