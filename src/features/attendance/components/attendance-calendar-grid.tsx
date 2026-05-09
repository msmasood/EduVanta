"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { mapAttendanceStatusToVariant } from "../utils/attendance-mappers";
import type { AttendanceCalendarDay } from "../utils/attendance-mappers";

interface AttendanceCalendarGridProps {
  days: AttendanceCalendarDay[];
  year: number;
  month: number; // 1-based
  onDayClick?: (day: AttendanceCalendarDay) => void;
}

const STATUS_CELL_COLORS: Record<string, string> = {
  present: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  absent: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  late: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
  "half-day": "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  leave: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300",
  excused: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
  holiday: "bg-muted text-muted-foreground",
};

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function AttendanceCalendarGrid({
  days,
  year,
  month,
  onDayClick,
}: AttendanceCalendarGridProps) {
  // Compute leading blanks (weekday of day 1)
  const firstWeekday = new Date(year, month - 1, 1).getDay();

  return (
    <div className="rounded-xl border bg-card" data-testid="attendance-calendar-grid">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b">
        {WEEKDAY_LABELS.map((wd) => (
          <div
            key={wd}
            className="py-2 text-center text-xs font-medium text-muted-foreground"
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {/* Leading empty cells */}
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`blank-${i}`} className="h-16 border-b border-e p-1 last:border-e-0" />
        ))}

        {days.map((day, idx) => {
          const cellColor = day.dominantStatus
            ? (STATUS_CELL_COLORS[day.dominantStatus] ?? "")
            : "";
          const isClickable = day.records.length > 0 && !!onDayClick;

          return (
            <div
              key={day.date}
              className={cn(
                "relative h-16 border-b border-e p-1 transition-colors",
                (firstWeekday + idx + 1) % 7 === 0 && "border-e-0",
                isClickable && "cursor-pointer hover:bg-accent/50",
                day.records.length === 0 && "bg-muted/30"
              )}
              onClick={() => isClickable && onDayClick(day)}
            >
              <span className="text-xs font-medium">{day.dayNumber}</span>
              {day.dominantStatus && (
                <div
                  className={cn(
                    "mt-0.5 rounded px-1 py-0.5 text-[10px] leading-tight truncate",
                    cellColor
                  )}
                >
                  {day.dominantStatus}
                </div>
              )}
              {day.records.length > 1 && (
                <div className="absolute bottom-1 end-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                  {day.records.length}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
