"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Building2,
  Users,
  DollarSign,
  BarChart2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { DashboardWidgetSkeleton } from "@/components/dashboard/dashboard-widget-skeleton";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { ChartCard } from "@/components/cards/chart-card";
import { EventCard } from "@/components/cards/event-card";
import { QuickActionGrid } from "@/components/cards/quick-action-grid";
import { LineChartWidget } from "@/components/charts/line-chart";
import { DonutChartWidget } from "@/components/charts/donut-chart";
import { useDashboardSummary } from "@/hooks/queries/use-dashboard";
import { mapUniversityDashboard } from "@/features/dashboard/utils/dashboard-mappers";
import type { EventType } from "@/components/cards/event-card";

const DEMO_SCHOOL_ID = "school-001";

const EVENT_TYPE_MAP: Record<string, EventType> = {
  academic: "academic",
  sport: "sports",
  sports: "sports",
  meeting: "meeting",
  cultural: "cultural",
  holiday: "holiday",
};

export function UniversityDashboard() {
  const locale = useLocale();
  const t = useTranslations("dashboard");

  const { data, isLoading, isError } = useDashboardSummary("university", DEMO_SCHOOL_ID);

  if (isError) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title={t("pages.university.title")} description={t("pages.university.description")} />
        <DashboardEmptyState title={t("states.error")} description={t("states.empty")} />
      </div>
    );
  }

  if (isLoading || !data?.data) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title={t("pages.university.title")} description={t("pages.university.description")} />
        <DashboardWidgetSkeleton variant="metric" />
        <div className="grid gap-4 lg:grid-cols-2">
          <DashboardWidgetSkeleton variant="chart" />
          <DashboardWidgetSkeleton variant="chart" />
        </div>
      </div>
    );
  }

  const mapped = mapUniversityDashboard(data.data);

  const quickActions = [
    {
      label: t("actions.viewDepartments"),
      icon: <Building2 className="size-5" />,
      href: `/${locale}/academic/departments`,
    },
    {
      label: t("actions.viewTeachers"),
      icon: <Users className="size-5" />,
      href: `/${locale}/teachers`,
    },
    {
      label: t("actions.viewStudents"),
      icon: <Users className="size-5" />,
      href: `/${locale}/students`,
    },
    {
      label: t("actions.viewFinance"),
      icon: <DollarSign className="size-5" />,
      href: `/${locale}/finance`,
    },
  ];

  const icons: Record<string, React.ReactNode> = {
    Students: <Users className="size-4" />,
    Faculty: <Users className="size-4" />,
    Departments: <Building2 className="size-4" />,
    "Active Research Projects": <BarChart2 className="size-4" />,
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("pages.university.title")}
        description={t("pages.university.description")}
      />

      {/* Stats */}
      <DashboardSection title={t("sections.overview")}>
        <StatsGrid metrics={mapped.metrics} icons={icons} locale={locale} columns={4} />
      </DashboardSection>

      {/* Charts */}
      <DashboardSection title={t("sections.analytics")}>
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Enrollment Trend"
            description="Year-over-year student enrollment"
            height={240}
          >
            <LineChartWidget
              data={mapped.enrollmentTrend}
              seriesLabel="Students"
              height={240}
              showGrid
            />
          </ChartCard>
          <ChartCard
            title="Department Distribution"
            description="Students by department"
            height={240}
          >
            <DonutChartWidget
              data={mapped.departmentDistribution}
              height={240}
              showLegend
            />
          </ChartCard>
        </div>
      </DashboardSection>

      {/* Events + Quick actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardSection title={t("sections.events")}>
            <div className="grid gap-2 sm:grid-cols-2">
              {mapped.upcomingEvents.map((e) => (
                <EventCard
                  key={e.id}
                  title={e.title}
                  startDate={e.date}
                  eventType={EVENT_TYPE_MAP[e.type] ?? "other"}
                  locale={locale}
                />
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
