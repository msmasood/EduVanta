"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  BookOpen,
  Users,
  ClipboardList,
  BarChart2,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { DashboardWidgetSkeleton } from "@/components/dashboard/dashboard-widget-skeleton";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { ChartCard } from "@/components/cards/chart-card";
import { QuickActionGrid } from "@/components/cards/quick-action-grid";
import { AreaChartWidget } from "@/components/charts/area-chart";
import { BarChartWidget } from "@/components/charts/bar-chart";
import { useDashboardSummary } from "@/hooks/queries/use-dashboard";
import { mapLmsDashboard } from "@/features/dashboard/utils/dashboard-mappers";

const DEMO_SCHOOL_ID = "school-001";

export function LmsDashboard() {
  const locale = useLocale();
  const t = useTranslations("dashboard");

  const { data, isLoading, isError } = useDashboardSummary("lms", DEMO_SCHOOL_ID);

  if (isError) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title={t("pages.lms.title")} description={t("pages.lms.description")} />
        <DashboardEmptyState title={t("states.error")} description={t("states.empty")} />
      </div>
    );
  }

  if (isLoading || !data?.data) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title={t("pages.lms.title")} description={t("pages.lms.description")} />
        <DashboardWidgetSkeleton variant="metric" />
        <div className="grid gap-4 lg:grid-cols-2">
          <DashboardWidgetSkeleton variant="chart" />
          <DashboardWidgetSkeleton variant="chart" />
        </div>
      </div>
    );
  }

  const mapped = mapLmsDashboard(data.data);

  const quickActions = [
    {
      label: t("actions.viewCourses"),
      icon: <BookOpen className="size-5" />,
      href: `/${locale}/courses`,
    },
    {
      label: t("actions.viewStudents"),
      icon: <Users className="size-5" />,
      href: `/${locale}/students`,
    },
    {
      label: t("actions.viewAssignments"),
      icon: <ClipboardList className="size-5" />,
      href: `/${locale}/assignments`,
    },
    {
      label: t("actions.viewResults"),
      icon: <BarChart2 className="size-5" />,
      href: `/${locale}/exams/results`,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("pages.lms.title")}
        description={t("pages.lms.description")}
      />

      {/* Stats */}
      <DashboardSection title={t("sections.overview")}>
        <StatsGrid metrics={mapped.metrics} locale={locale} columns={4} />
      </DashboardSection>

      {/* Charts */}
      <DashboardSection title={t("sections.analytics")}>
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title={t("sections.learning")}
            description="Completion rate trend"
            height={240}
          >
            <AreaChartWidget
              data={mapped.courseCompletionTrend}
              seriesLabel="Completion %"
              height={240}
              showGrid
            />
          </ChartCard>
          <ChartCard
            title="Course Enrollment"
            description="Top courses by learners"
            height={240}
          >
            <BarChartWidget
              data={mapped.courseDistribution}
              seriesLabel="Enrolled"
              height={240}
              showGrid
              multiColor
              orientation="horizontal"
            />
          </ChartCard>
        </div>
      </DashboardSection>

      {/* Top courses + Quick actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardSection title="Top Courses">
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-2.5 text-start font-medium text-muted-foreground">Course</th>
                    <th className="px-4 py-2.5 text-start font-medium text-muted-foreground">Enrolled</th>
                    <th className="px-4 py-2.5 text-start font-medium text-muted-foreground">Completion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mapped.topCourses.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/30">
                      <td className="px-4 py-2.5 font-medium">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="size-3.5 text-muted-foreground" />
                          {c.title}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">{c.enrolled.toLocaleString()}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-[var(--success)]"
                              style={{ width: `${c.completion}%` }}
                            />
                          </div>
                          <span className="text-muted-foreground">{c.completion}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
