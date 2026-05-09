"use client";

import * as React from "react";
import { Users, UserCheck, UserX, Clock, BookOpen, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { AttendanceSummaryStats } from "../utils/attendance-calculations";

interface AttendanceSummaryCardsProps {
  summary: AttendanceSummaryStats;
  isLoading?: boolean;
}

const CARD_CONFIGS: Array<{
  key: keyof AttendanceSummaryStats;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  colorClass: string;
  bgClass: string;
  isRate?: boolean;
}> = [
  {
    key: "present" as const,
    label: "Present",
    icon: UserCheck,
    colorClass: "text-green-600 dark:text-green-400",
    bgClass: "bg-green-50 dark:bg-green-950/40",
  },
  {
    key: "absent" as const,
    label: "Absent",
    icon: UserX,
    colorClass: "text-destructive",
    bgClass: "bg-destructive/5 dark:bg-destructive/10",
  },
  {
    key: "late" as const,
    label: "Late",
    icon: Clock,
    colorClass: "text-warning-foreground",
    bgClass: "bg-warning/5 dark:bg-warning/10",
  },
  {
    key: "halfDay" as const,
    label: "Half Day",
    icon: Users,
    colorClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-50 dark:bg-blue-950/40",
  },
  {
    key: "leave" as const,
    label: "On Leave",
    icon: BookOpen,
    colorClass: "text-info",
    bgClass: "bg-info/5 dark:bg-info/10",
  },
  {
    key: "attendanceRate" as const,
    label: "Attendance Rate",
    icon: TrendingUp,
    colorClass: "text-success",
    bgClass: "bg-success/5 dark:bg-success/10",
    isRate: true,
  },
] as const;

export function AttendanceSummaryCards({
  summary,
  isLoading = false,
}: AttendanceSummaryCardsProps) {
  if (isLoading) {
    return (
      <div
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
        data-testid="attendance-summary-cards"
      >
        {CARD_CONFIGS.map((c) => (
          <div
            key={c.key}
            className="h-24 animate-pulse rounded-xl border bg-muted"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
      data-testid="attendance-summary-cards"
    >
      {CARD_CONFIGS.map(({ key, label, icon: Icon, colorClass, bgClass, isRate }) => (
        <Card key={key} className="overflow-hidden">
          <CardContent className="p-4">
            <div className={`mb-2 inline-flex rounded-lg p-2 ${bgClass}`}>
              <Icon className={`size-4 ${colorClass}`} aria-hidden />
            </div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className={`text-2xl font-bold ${colorClass}`}>
              {isRate ? `${summary[key]}%` : summary[key]}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
