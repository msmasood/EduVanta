"use client";

import { CheckCircle2, XCircle, Clock, MinusCircle, Plane } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AttendanceStatusCounts } from "../utils/employee-mappers";

interface Props {
  counts: AttendanceStatusCounts;
  totalDays?: number;
}

export function EmployeeAttendanceSummary({ counts, totalDays }: Props) {
  const cards = [
    { label: "Present", value: counts.present, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
    { label: "Absent", value: counts.absent, icon: XCircle, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-950/30" },
    { label: "Late", value: counts.late, icon: Clock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30" },
    { label: "Half Day", value: counts.halfDay, icon: MinusCircle, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "On Leave", value: counts.leave, icon: Plane, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950/30" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map(({ label, value, icon: Icon, color, bg }) => (
        <Card key={label} className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className={`rounded-lg p-2 ${bg}`}>
              <Icon className={`size-4 ${color}`} aria-hidden />
            </div>
            <div>
              <p className="text-xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
