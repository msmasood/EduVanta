"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";

import {
  BookOpen,
  CalendarClock,
  DollarSign,
  BarChart2,
  Library,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { AttendanceSummaryWidget } from "@/components/dashboard/attendance-summary";
import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { DashboardWidgetSkeleton } from "@/components/dashboard/dashboard-widget-skeleton";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { ChartCard } from "@/components/cards/chart-card";
import { QuickActionGrid } from "@/components/cards/quick-action-grid";
import { LineChartWidget } from "@/components/charts/line-chart";
import { BarChartWidget } from "@/components/charts/bar-chart";
import { useDashboardSummary } from "@/hooks/queries/use-dashboard";
import { mapStudentDashboard } from "@/features/dashboard/utils/dashboard-mappers";
import type { AttendanceSummary } from "@/types/attendance";

const DEMO_SCHOOL_ID = "school-001";
const STUDENT_ID = "student-001";

export function StudentDashboard() {
  const locale = useLocale();
  const t = useTranslations("dashboard");

  const { data, isLoading, isError } = useDashboardSummary("student", DEMO_SCHOOL_ID);

  if (isError) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title={t("pages.student.title")} description={t("pages.student.description")} />
        <DashboardEmptyState title={t("states.error")} description={t("states.empty")} />
      </div>
    );
  }

  if (isLoading || !data?.data) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title={t("pages.student.title")} description={t("pages.student.description")} />
        <DashboardWidgetSkeleton variant="metric" />
        <div className="grid gap-4 lg:grid-cols-2">
          <DashboardWidgetSkeleton variant="chart" />
          <DashboardWidgetSkeleton variant="chart" />
        </div>
      </div>
    );
  }

  const mapped = mapStudentDashboard(data.data, "PKR", locale);

  const mockAttendanceSummary: AttendanceSummary = {
    entityId: STUDENT_ID,
    entityType: "student",
    period: "Oct 2024",
    totalDays: 22,
    presentDays: 20,
    absentDays: 1,
    lateDays: 1,
    halfDays: 0,
    holidayDays: 0,
    leaveDays: 0,
    attendancePercentage: 90.9,
  };

  const quickActions = [
    {
      label: t("actions.viewResults"),
      icon: <BarChart2 className="size-5" />,
      href: `/${locale}/exams/results`,
    },
    {
      label: t("actions.viewAttendance"),
      icon: <CalendarClock className="size-5" />,
      href: `/${locale}/attendance`,
    },
    {
      label: t("actions.viewFees"),
      icon: <DollarSign className="size-5" />,
      href: `/${locale}/fees`,
    },
    {
      label: t("actions.viewLibrary"),
      icon: <Library className="size-5" />,
      href: `/${locale}/library`,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("pages.student.title")}
        description={t("pages.student.description")}
      />

      {/* Stats */}
      <DashboardSection title={t("sections.overview")}>
        <StatsGrid metrics={mapped.metrics} locale={locale} columns={3} />
      </DashboardSection>

      {/* Charts */}
      <DashboardSection title={t("sections.analytics")}>
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title={t("sections.attendance")} description="Monthly trend" height={240}>
            <LineChartWidget
              data={mapped.attendanceTrend}
              seriesLabel="Attendance %"
              height={240}
              showGrid
            />
          </ChartCard>
          <ChartCard title={t("sections.performance")} description="Subject scores" height={240}>
            <BarChartWidget
              data={mapped.subjectPerformance}
              seriesLabel="Score %"
              height={240}
              showGrid
              multiColor
            />
          </ChartCard>
        </div>
      </DashboardSection>

      {/* Attendance summary + quick actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AttendanceSummaryWidget
            summary={mockAttendanceSummary}
            title={t("sections.attendance")}
          />
        </div>
        <DashboardSection title={t("sections.quickActions")}>
          <QuickActionGrid actions={quickActions} columns={2} />
        </DashboardSection>
      </div>

      {/* Recent results table */}
      <DashboardSection title={t("sections.performance")}>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-2.5 text-start font-medium text-muted-foreground">Subject</th>
                <th className="px-4 py-2.5 text-start font-medium text-muted-foreground">Grade</th>
                <th className="px-4 py-2.5 text-start font-medium text-muted-foreground">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mapped.recentResults.map((r) => (
                <tr key={r.subject} className="hover:bg-muted/30">
                  <td className="px-4 py-2.5 font-medium">{r.subject}</td>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      {r.grade}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{r.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardSection>

      {/* Upcoming schedule */}
      <DashboardSection title={t("sections.timetable")}>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {mapped.upcomingSchedule.map((s) => (
            <div
              key={`${s.subject}-${s.time}`}
              className="flex items-start gap-3 rounded-xl border border-border p-3"
            >
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{s.subject}</p>
                <p className="text-xs text-muted-foreground">{s.time}</p>
                <p className="text-xs text-muted-foreground">{s.room}</p>
              </div>
            </div>
          ))}
        </div>
      </DashboardSection>
    </div>
  );
}
