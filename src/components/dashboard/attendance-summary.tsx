import * as React from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AttendanceSummary } from "@/types/attendance";

// ─── Props ───────────────────────────────────────────────────────────────────

export interface AttendanceSummaryWidgetProps {
  summary?: AttendanceSummary;
  /** Title for the widget. Defaults to "Attendance Summary". */
  title?: string;
  loading?: boolean;
  className?: string;
  /** Labels for each status row. Caller provides i18n strings. */
  labels?: {
    present?: string;
    absent?: string;
    late?: string;
    halfDay?: string;
    overall?: string;
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const defaultLabels = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  halfDay: "Half Day",
  overall: "Overall",
};

interface RowData {
  key: string;
  label: string;
  days: number;
  percentage: number;
  colorClass: string;
  indicatorClass: string;
}

function buildRows(s: AttendanceSummary, labels: typeof defaultLabels): RowData[] {
  const total = s.totalDays || 1;
  return [
    {
      key: "present",
      label: labels.present,
      days: s.presentDays,
      percentage: Math.round((s.presentDays / total) * 100),
      colorClass: "text-[var(--success)]",
      indicatorClass: "[&>div]:bg-[var(--success)]",
    },
    {
      key: "absent",
      label: labels.absent,
      days: s.absentDays,
      percentage: Math.round((s.absentDays / total) * 100),
      colorClass: "text-destructive",
      indicatorClass: "[&>div]:bg-destructive",
    },
    {
      key: "late",
      label: labels.late,
      days: s.lateDays,
      percentage: Math.round((s.lateDays / total) * 100),
      colorClass: "text-[var(--warning-foreground)]",
      indicatorClass: "[&>div]:bg-[var(--warning)]",
    },
    {
      key: "halfDay",
      label: labels.halfDay,
      days: s.halfDays,
      percentage: Math.round((s.halfDays / total) * 100),
      colorClass: "text-[var(--info)]",
      indicatorClass: "[&>div]:bg-[var(--info)]",
    },
  ];
}

// ─── Component ───────────────────────────────────────────────────────────────

export function AttendanceSummaryWidget({
  summary,
  title = "Attendance Summary",
  loading = false,
  className,
  labels,
}: AttendanceSummaryWidgetProps) {
  const resolvedLabels = { ...defaultLabels, ...labels };

  if (loading || !summary) {
    return (
      <Card className={cn("gap-3", className)} aria-busy="true">
        <CardHeader>
          <Skeleton className="h-4 w-1/2 rounded" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-1/3 rounded" />
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const rows = buildRows(summary, resolvedLabels);

  return (
    <Card className={cn("gap-3", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <span
            className="text-lg font-semibold tabular-nums text-[var(--success)]"
            aria-label={`${resolvedLabels.overall}: ${summary.attendancePercentage}%`}
          >
            {summary.attendancePercentage.toFixed(1)}%
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pb-4">
        {rows.map((row) => (
          <div key={row.key} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{row.label}</span>
              <span className={cn("font-medium tabular-nums", row.colorClass)}>
                {row.days}d &nbsp;{row.percentage}%
              </span>
            </div>
            <Progress
              value={row.percentage}
              className={cn("h-1.5", row.indicatorClass)}
              aria-label={`${row.label}: ${row.percentage}%`}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
