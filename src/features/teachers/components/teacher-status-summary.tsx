"use client";

import { Users, UserCheck, Clock, Building2 } from "lucide-react";
import type { TeacherStatusSummary } from "../utils/teacher-mappers";

interface TeacherStatusCardsProps {
  summary: TeacherStatusSummary;
}

export function TeacherStatusCards({ summary }: TeacherStatusCardsProps) {
  const cards = [
    {
      label: "Total Teachers",
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
      label: "On Leave",
      value: summary.onLeave,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      label: "Departments",
      value: summary.departments,
      icon: Building2,
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
