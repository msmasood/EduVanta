"use client";

import { Users, UserCheck, Plane, UserX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { EmployeeStatusSummary } from "../utils/employee-mappers";

interface Props {
  summary: EmployeeStatusSummary;
}

export function EmployeeStatusCards({ summary }: Props) {
  const cards = [
    {
      label: "Total Employees",
      value: summary.total,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Active",
      value: summary.active,
      icon: UserCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "On Leave",
      value: summary.onLeave,
      icon: Plane,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      label: "Terminated",
      value: summary.terminated,
      icon: UserX,
      color: "text-rose-600",
      bg: "bg-rose-50 dark:bg-rose-950/30",
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
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
