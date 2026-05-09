"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CalendarClock,
  UserCheck,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { AttendanceSummaryWidget } from "@/components/dashboard/attendance-summary";
import { RecentActivityList } from "@/components/dashboard/recent-activity-list";
import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { DashboardWidgetSkeleton } from "@/components/dashboard/dashboard-widget-skeleton";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { ChartCard } from "@/components/cards/chart-card";
import { NoticeCard } from "@/components/cards/notice-card";
import { QuickActionGrid } from "@/components/cards/quick-action-grid";
import { LineChartWidget } from "@/components/charts/line-chart";
import { BarChartWidget } from "@/components/charts/bar-chart";
import { DonutChartWidget } from "@/components/charts/donut-chart";
import { useDashboardSummary } from "@/hooks/queries/use-dashboard";
import { mapSchoolDashboard } from "@/features/dashboard/utils/dashboard-mappers";
import type { AttendanceSummary } from "@/types/attendance";

const DEMO_SCHOOL_ID = "school-001";

const MOCK_ATTENDANCE: AttendanceSummary = {
  entityId: DEMO_SCHOOL_ID,
  entityType: "student",
  period: "Oct 2024",
  totalDays: 22,
  presentDays: 20,
  absentDays: 1,
  lateDays: 1,
  halfDays: 0,
  holidayDays: 0,
  leaveDays: 0,
  attendancePercentage: 91.5,
};

export function SchoolDashboard() {
  const locale = useLocale();
  const t = useTranslations("dashboard");

  const { data, isLoading, isError } = useDashboardSummary("school", DEMO_SCHOOL_ID);

  if (isError) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title={t("pages.school.title")} description={t("pages.school.description")} />
        <DashboardEmptyState
          title={t("states.error")}
          description={t("states.empty")}
        />
      </div>
    );
  }

  if (isLoading || !data?.data) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title={t("pages.school.title")} description={t("pages.school.description")} />
        <DashboardWidgetSkeleton variant="metric" />
        <div className="grid gap-4 lg:grid-cols-2">
          <DashboardWidgetSkeleton variant="chart" />
          <DashboardWidgetSkeleton variant="chart" />
        </div>
      </div>
    );
  }

  const mapped = mapSchoolDashboard(data.data, "PKR", locale);

  const quickActions = [
    {
      label: t("actions.addStudent"),
      icon: <GraduationCap className="size-5" />,
      href: `/${locale}/students/new`,
    },
    {
      label: t("actions.collectFees"),
      icon: <DollarSign className="size-5" />,
      href: `/${locale}/fees/collect`,
    },
    {
      label: t("actions.viewExams"),
      icon: <CalendarClock className="size-5" />,
      href: `/${locale}/exams`,
    },
    {
      label: t("actions.noticeBoard"),
      icon: <AlertCircle className="size-5" />,
      href: `/${locale}/communication/notices`,
    },
  ];

  const icons: Record<string, React.ReactNode> = {
    "Total Students": <Users className="size-4" />,
    Teachers: <UserCheck className="size-4" />,
    "Today's Attendance": <TrendingUp className="size-4" />,
    "Monthly Revenue": <DollarSign className="size-4" />,
    "Pending Fees": <AlertCircle className="size-4" />,
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("pages.school.title")}
        description={t("pages.school.description")}
      />

      {/* Stats */}
      <DashboardSection title={t("sections.overview")}>
        <StatsGrid
          metrics={mapped.metrics}
          icons={icons}
          locale={locale}
          columns={3}
        />
      </DashboardSection>

      {/* Charts row */}
      <DashboardSection title={t("sections.analytics")}>
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title={t("attendance")}
            description="Monthly trend"
            height={240}
          >
            <LineChartWidget
              data={mapped.attendanceTrend}
              seriesLabel="Attendance %"
              height={240}
              showGrid
            />
          </ChartCard>
          <ChartCard
            title="Fee Collection"
            description="Monthly trend (PKR)"
            height={240}
          >
            <BarChartWidget
              data={mapped.feeCollectionTrend}
              seriesLabel="Revenue"
              height={240}
              showGrid
            />
          </ChartCard>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <ChartCard title="Student Distribution" height={240}>
            <DonutChartWidget
              data={mapped.genderDistribution}
              height={240}
              showLegend
              centerLabel={String(
                mapped.genderDistribution.reduce((s, d) => s + d.value, 0)
              )}
              centerSubLabel="students"
            />
          </ChartCard>
          <div className="lg:col-span-2">
            <AttendanceSummaryWidget
              summary={MOCK_ATTENDANCE}
              title={t("sections.attendance")}
            />
          </div>
        </div>
      </DashboardSection>

      {/* Bottom row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Quick actions */}
        <DashboardSection title={t("sections.quickActions")}>
          <QuickActionGrid actions={quickActions} columns={2} />
        </DashboardSection>

        {/* Notices */}
        <div className="lg:col-span-2">
          <DashboardSection
            title={t("sections.notices")}
            action={
              <Link
                href={`/${locale}/communication/notices`}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {t("widgets.viewAll")}
              </Link>
            }
          >
            <div className="flex flex-col gap-2">
              {mapped.recentNotices.map((n) => (
                <NoticeCard
                  key={n.id}
                  title={n.title}
                  date={n.date}
                  locale={locale}
                />
              ))}
            </div>
          </DashboardSection>
        </div>
      </div>

      {/* Recent activity */}
      <DashboardSection title={t("sections.recentActivity")}>
        <RecentActivityList
          activities={mapped.activities}
          title={t("sections.recentActivity")}
          locale={locale}
          maxItems={6}
        />
      </DashboardSection>
    </div>
  );
}
