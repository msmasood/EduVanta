"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  DollarSign,
  CalendarClock,
  BarChart2,
  MessageSquare,
  UserCircle,
  GraduationCap,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { AttendanceSummaryWidget } from "@/components/dashboard/attendance-summary";
import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { DashboardWidgetSkeleton } from "@/components/dashboard/dashboard-widget-skeleton";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { NoticeCard } from "@/components/cards/notice-card";
import { QuickActionGrid } from "@/components/cards/quick-action-grid";
import { useDashboardSummary } from "@/hooks/queries/use-dashboard";
import { mapParentDashboard } from "@/features/dashboard/utils/dashboard-mappers";
import type { AttendanceSummary } from "@/types/attendance";

const DEMO_SCHOOL_ID = "school-001";

export function ParentDashboard() {
  const locale = useLocale();
  const t = useTranslations("dashboard");

  const { data, isLoading, isError } = useDashboardSummary("parent", DEMO_SCHOOL_ID);

  if (isError) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title={t("pages.parent.title")} description={t("pages.parent.description")} />
        <DashboardEmptyState title={t("states.error")} description={t("states.empty")} />
      </div>
    );
  }

  if (isLoading || !data?.data) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title={t("pages.parent.title")} description={t("pages.parent.description")} />
        <DashboardWidgetSkeleton variant="metric" />
        <DashboardWidgetSkeleton variant="list" />
      </div>
    );
  }

  const mapped = mapParentDashboard(data.data, "PKR", locale);

  const quickActions = [
    {
      label: t("actions.viewChildProfile"),
      icon: <UserCircle className="size-5" />,
      href: `/${locale}/students/${mapped.children[0]?.id ?? "profile"}`,
    },
    {
      label: t("actions.payFees"),
      icon: <DollarSign className="size-5" />,
      href: `/${locale}/fees`,
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

  // Build a synthetic attendance summary from metric data
  const mockAttendance: AttendanceSummary = {
    entityId: mapped.children[0]?.id ?? "student-001",
    entityType: "student",
    period: "Oct 2024",
    totalDays: 22,
    presentDays: 20,
    absentDays: 1,
    lateDays: 1,
    halfDays: 0,
    holidayDays: 0,
    leaveDays: 0,
    attendancePercentage: mapped.children[0]?.attendance ?? 90,
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("pages.parent.title")}
        description={t("pages.parent.description")}
      />

      {/* Stats */}
      <DashboardSection title={t("sections.overview")}>
        <StatsGrid metrics={mapped.metrics} locale={locale} columns={4} />
      </DashboardSection>

      {/* Children summary cards */}
      {mapped.children.length > 0 && (
        <DashboardSection title={t("sections.children")}>
          <div className="grid gap-3 sm:grid-cols-2">
            {mapped.children.map((child) => (
              <div
                key={child.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <GraduationCap className="size-6" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{child.name}</p>
                  <p className="text-sm text-muted-foreground">{child.class}</p>
                  <p className="text-sm">
                    <span className="font-medium text-[var(--success)]">{child.attendance}%</span>
                    <span className="text-muted-foreground"> attendance</span>
                  </p>
                </div>
                <div className="ms-auto shrink-0">
                  <CalendarClock className="size-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>
      )}

      {/* Attendance + Quick actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AttendanceSummaryWidget
            summary={mockAttendance}
            title={t("sections.attendance")}
          />
        </div>
        <DashboardSection title={t("sections.quickActions")}>
          <QuickActionGrid actions={quickActions} columns={2} />
        </DashboardSection>
      </div>

      {/* Notices */}
      {mapped.notices.length > 0 && (
        <DashboardSection title={t("sections.notices")}>
          <div className="grid gap-2 sm:grid-cols-2">
            {mapped.notices.map((n) => (
              <NoticeCard
                key={n.id}
                title={n.title}
                date={n.date}
                locale={locale}
              />
            ))}
          </div>
        </DashboardSection>
      )}
    </div>
  );
}
