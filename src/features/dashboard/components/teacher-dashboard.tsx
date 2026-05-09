"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  CalendarClock,
  BarChart2,
  MessageSquare,
  ClipboardList,
  BookOpen,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { DashboardWidgetSkeleton } from "@/components/dashboard/dashboard-widget-skeleton";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { ChartCard } from "@/components/cards/chart-card";
import { QuickActionGrid } from "@/components/cards/quick-action-grid";
import { BarChartWidget } from "@/components/charts/bar-chart";
import { LineChartWidget } from "@/components/charts/line-chart";
import { useDashboardSummary } from "@/hooks/queries/use-dashboard";
import { mapTeacherDashboard } from "@/features/dashboard/utils/dashboard-mappers";

const DEMO_SCHOOL_ID = "school-001";

export function TeacherDashboard() {
  const locale = useLocale();
  const t = useTranslations("dashboard");

  const { data, isLoading, isError } = useDashboardSummary("teacher", DEMO_SCHOOL_ID);

  if (isError) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title={t("pages.teacher.title")} description={t("pages.teacher.description")} />
        <DashboardEmptyState title={t("states.error")} description={t("states.empty")} />
      </div>
    );
  }

  if (isLoading || !data?.data) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title={t("pages.teacher.title")} description={t("pages.teacher.description")} />
        <DashboardWidgetSkeleton variant="metric" />
        <div className="grid gap-4 lg:grid-cols-2">
          <DashboardWidgetSkeleton variant="chart" />
          <DashboardWidgetSkeleton variant="chart" />
        </div>
      </div>
    );
  }

  const mapped = mapTeacherDashboard(data.data);

  const quickActions = [
    {
      label: t("actions.markAttendance"),
      icon: <ClipboardList className="size-5" />,
      href: `/${locale}/attendance`,
    },
    {
      label: t("actions.viewTimetable"),
      icon: <CalendarClock className="size-5" />,
      href: `/${locale}/timetable`,
    },
    {
      label: t("actions.viewResults"),
      icon: <BarChart2 className="size-5" />,
      href: `/${locale}/exams/results`,
    },
    {
      label: t("actions.messageParents"),
      icon: <MessageSquare className="size-5" />,
      href: `/${locale}/communication/messages`,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("pages.teacher.title")}
        description={t("pages.teacher.description")}
      />

      {/* Stats */}
      <DashboardSection title={t("sections.overview")}>
        <StatsGrid metrics={mapped.metrics} locale={locale} columns={4} />
      </DashboardSection>

      {/* Charts */}
      <DashboardSection title={t("sections.analytics")}>
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Class Attendance"
            description="Attendance % per class"
            height={240}
          >
            <BarChartWidget
              data={mapped.classwiseAttendance}
              seriesLabel="Attendance %"
              height={240}
              showGrid
              multiColor
            />
          </ChartCard>
          <ChartCard
            title={t("sections.performance")}
            description="Average score per class"
            height={240}
          >
            <LineChartWidget
              data={mapped.subjectPerformance}
              seriesLabel="Score %"
              height={240}
              showGrid
            />
          </ChartCard>
        </div>
      </DashboardSection>

      {/* Timetable + Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardSection title={t("sections.timetable")}>
            <div className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border">
              {mapped.timetableToday.map((row) => (
                <div
                  key={`${row.period}-${row.subject}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
                    {row.period}
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{row.subject}</p>
                      <p className="text-xs text-muted-foreground">{row.class}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <BookOpen className="size-3.5" />
                      {row.room}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardSection>
        </div>
        <DashboardSection title={t("sections.quickActions")}>
          <QuickActionGrid actions={quickActions} columns={2} />
        </DashboardSection>
      </div>
    </div>
  );
}
