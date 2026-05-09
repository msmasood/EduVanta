"use client";

import type { AttendanceSummary } from "@/types/attendance";

interface StudentAttendanceGridProps {
  summary: AttendanceSummary | null | undefined;
}

interface StatCard {
  label: string;
  value: number;
  color: string;
}

export function StudentAttendanceGrid({ summary }: StudentAttendanceGridProps) {
  if (!summary) {
    return (
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-base font-semibold">Attendance Summary</h3>
        <p className="text-sm text-muted-foreground">No attendance records.</p>
      </div>
    );
  }

  const cards: StatCard[] = [
    { label: "Present", value: summary.presentDays, color: "text-green-600" },
    { label: "Absent", value: summary.absentDays, color: "text-red-600" },
    { label: "Late", value: summary.lateDays, color: "text-amber-600" },
    { label: "Half Day", value: summary.halfDays, color: "text-orange-600" },
  ];

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold">Attendance Summary</h3>
        <span className="text-sm font-medium text-muted-foreground">
          {summary.attendancePercentage}% present
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border bg-muted/30 p-3 text-center"
          >
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
