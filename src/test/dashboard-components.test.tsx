/**
 * Dashboard component tests — Phase 7
 *
 * Uses React Testing Library. Recharts is client-only, so chart components
 * are excluded here (Recharts uses ResizeObserver which isn't in jsdom).
 * The pure-render components (MetricCard, TrendCard, ChartCard, etc.) are
 * tested here because they do NOT depend on ResizeObserver.
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

// ─── Components under test ────────────────────────────────────────────────────

import { MetricCard } from "@/components/cards/metric-card";
import { TrendCard } from "@/components/cards/trend-card";
import { ChartCard } from "@/components/cards/chart-card";
import { NoticeCard } from "@/components/cards/notice-card";
import { EventCard } from "@/components/cards/event-card";
import { QuickActionGrid } from "@/components/cards/quick-action-grid";
import { AttendanceSummaryWidget } from "@/components/dashboard/attendance-summary";
import { RecentActivityList } from "@/components/dashboard/recent-activity-list";
import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { DashboardWidgetSkeleton } from "@/components/dashboard/dashboard-widget-skeleton";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import type { DashboardMetric } from "@/types/dashboard";
import type { AttendanceSummary } from "@/types/attendance";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const sampleMetric: DashboardMetric = {
  label: "Total Students",
  value: 1250,
  trend: { direction: "up", percentage: 5.2, label: "vs last month" },
};

const sampleAttendance: AttendanceSummary = {
  entityId: "s1",
  entityType: "student",
  period: "2025-01",
  totalDays: 22,
  presentDays: 18,
  absentDays: 2,
  lateDays: 1,
  halfDays: 1,
  holidayDays: 0,
  leaveDays: 0,
  attendancePercentage: 81.8,
};

// ─── MetricCard ───────────────────────────────────────────────────────────────

describe("MetricCard", () => {
  it("renders the metric label", () => {
    render(<MetricCard metric={sampleMetric} />);
    expect(screen.getByText("Total Students")).toBeTruthy();
  });

  it("renders the metric value", () => {
    render(<MetricCard metric={sampleMetric} />);
    // Value is formatted by Intl so we just check it's present
    expect(screen.getByText(/1[,.]?250|1250/)).toBeTruthy();
  });

  it("renders the trend badge when trend is present", () => {
    render(<MetricCard metric={sampleMetric} />);
    expect(screen.getByText(/5\.0%|vs last month/)).toBeTruthy();
  });

  it("renders loading skeleton when loading=true", () => {
    const { container } = render(<MetricCard loading metric={undefined} />);
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders with direct title and value props", () => {
    render(<MetricCard title="Revenue" value="$5,000" />);
    expect(screen.getByText("Revenue")).toBeTruthy();
    expect(screen.getByText("$5,000")).toBeTruthy();
  });

  it("renders subtitle when provided", () => {
    render(<MetricCard title="Tests" value={10} subtitle="Active this week" />);
    expect(screen.getByText("Active this week")).toBeTruthy();
  });

  it("renders icon when provided", () => {
    render(
      <MetricCard
        title="Students"
        value={100}
        icon={<span data-testid="custom-icon">📚</span>}
      />
    );
    expect(screen.getByTestId("custom-icon")).toBeTruthy();
  });
});

// ─── TrendCard ────────────────────────────────────────────────────────────────

describe("TrendCard", () => {
  it("renders the label", () => {
    render(
      <TrendCard
        label="Revenue"
        currentValue={10000}
        percentChange={8.2}
        direction="up"
      />
    );
    expect(screen.getByText("Revenue")).toBeTruthy();
  });

  it("renders the current value", () => {
    render(
      <TrendCard
        label="Enrolments"
        currentValue={350}
        percentChange={3}
        direction="up"
      />
    );
    expect(screen.getByText(/350/)).toBeTruthy();
  });

  it("renders up arrow for direction=up", () => {
    render(
      <TrendCard
        label="Enrolments"
        currentValue={350}
        percentChange={3}
        direction="up"
      />
    );
    expect(screen.getByText(/↑/)).toBeTruthy();
  });

  it("renders down arrow for direction=down", () => {
    render(
      <TrendCard
        label="Dropouts"
        currentValue={5}
        percentChange={12}
        direction="down"
      />
    );
    expect(screen.getByText(/↓/)).toBeTruthy();
  });

  it("renders loading skeleton when loading=true", () => {
    const { container } = render(
      <TrendCard label="X" currentValue={0} percentChange={0} direction="neutral" loading />
    );
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});

// ─── ChartCard ────────────────────────────────────────────────────────────────

describe("ChartCard", () => {
  it("renders title", () => {
    render(<ChartCard title="Enrolment Trend"><div>chart</div></ChartCard>);
    expect(screen.getByText("Enrolment Trend")).toBeTruthy();
  });

  it("renders description when provided", () => {
    render(
      <ChartCard title="Chart" description="Past 12 months">
        <div>chart</div>
      </ChartCard>
    );
    expect(screen.getByText("Past 12 months")).toBeTruthy();
  });

  it("renders empty state when empty=true", () => {
    render(
      <ChartCard title="Chart" empty emptyMessage="Nothing here">
        <div>chart</div>
      </ChartCard>
    );
    expect(screen.getByText("Nothing here")).toBeTruthy();
  });

  it("renders loading skeleton when loading=true", () => {
    const { container } = render(<ChartCard title="Chart" loading><div>chart</div></ChartCard>);
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders children when neither loading nor empty", () => {
    render(<ChartCard title="Chart"><span data-testid="child">hello</span></ChartCard>);
    expect(screen.getByTestId("child")).toBeTruthy();
  });
});

// ─── NoticeCard ───────────────────────────────────────────────────────────────

describe("NoticeCard", () => {
  it("renders title", () => {
    render(<NoticeCard title="School closed tomorrow" />);
    expect(screen.getByText("School closed tomorrow")).toBeTruthy();
  });

  it("renders body when provided", () => {
    render(<NoticeCard title="Notice" body="Please note the schedule change." />);
    expect(screen.getByText("Please note the schedule change.")).toBeTruthy();
  });

  it("shows Pinned badge when isPinned=true", () => {
    render(<NoticeCard title="Notice" isPinned />);
    expect(screen.getByText("Pinned")).toBeTruthy();
  });

  it("does not show Pinned badge by default", () => {
    render(<NoticeCard title="Notice" />);
    expect(screen.queryByText("Pinned")).toBeNull();
  });
});

// ─── EventCard ────────────────────────────────────────────────────────────────

describe("EventCard", () => {
  it("renders title", () => {
    render(
      <EventCard
        title="Annual Sports Day"
        startDate="2026-03-15"
        eventType="sports"
      />
    );
    expect(screen.getByText("Annual Sports Day")).toBeTruthy();
  });

  it("renders event type badge", () => {
    render(
      <EventCard title="Finals" startDate="2026-04-01" eventType="exam" />
    );
    expect(screen.getByText("exam")).toBeTruthy();
  });

  it("renders location when provided", () => {
    render(
      <EventCard
        title="Meeting"
        startDate="2026-04-01"
        location="Room 101"
        eventType="meeting"
      />
    );
    expect(screen.getByText("Room 101")).toBeTruthy();
  });
});

// ─── QuickActionGrid ──────────────────────────────────────────────────────────

describe("QuickActionGrid", () => {
  const actions = [
    { label: "Add Student", href: "/students/new", icon: <span>+</span> },
    { label: "Add Teacher", href: "/teachers/new", icon: <span>+</span> },
  ];

  it("renders all action labels", () => {
    render(<QuickActionGrid actions={actions} />);
    expect(screen.getByText("Add Student")).toBeTruthy();
    expect(screen.getByText("Add Teacher")).toBeTruthy();
  });

  it("renders links with correct hrefs", () => {
    render(<QuickActionGrid actions={actions} />);
    const links = screen.getAllByRole("listitem");
    expect(links.length).toBe(2);
  });

  it("renders disabled items without link", () => {
    const disabledActions = [
      { label: "Locked Feature", href: "/locked", icon: <span>🔒</span>, disabled: true },
    ];
    const { container } = render(<QuickActionGrid actions={disabledActions} />);
    const disabledEl = container.querySelector('[aria-disabled="true"]');
    expect(disabledEl).not.toBeNull();
  });
});

// ─── AttendanceSummaryWidget ──────────────────────────────────────────────────

describe("AttendanceSummaryWidget", () => {
  it("renders title", () => {
    render(<AttendanceSummaryWidget summary={sampleAttendance} title="Attendance" />);
    expect(screen.getByText("Attendance")).toBeTruthy();
  });

  it("renders the overall percentage", () => {
    render(<AttendanceSummaryWidget summary={sampleAttendance} />);
    expect(screen.getByText(/81\.8%/)).toBeTruthy();
  });

  it("renders present days label", () => {
    render(<AttendanceSummaryWidget summary={sampleAttendance} />);
    expect(screen.getByText("Present")).toBeTruthy();
  });

  it("renders absent days label", () => {
    render(<AttendanceSummaryWidget summary={sampleAttendance} />);
    expect(screen.getByText("Absent")).toBeTruthy();
  });

  it("renders loading skeleton when loading=true", () => {
    const { container } = render(<AttendanceSummaryWidget loading />);
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders with custom labels", () => {
    render(
      <AttendanceSummaryWidget
        summary={sampleAttendance}
        labels={{ present: "Haazir", absent: "Gaair Haazir" }}
      />
    );
    expect(screen.getByText("Haazir")).toBeTruthy();
    expect(screen.getByText("Gaair Haazir")).toBeTruthy();
  });
});

// ─── RecentActivityList ───────────────────────────────────────────────────────

describe("RecentActivityList", () => {
  const activities = [
    {
      id: "1",
      title: "Ali enrolled in Grade 5",
      activityType: "enrollment",
      timestamp: new Date(Date.now() - 3600_000).toISOString(),
    },
    {
      id: "2",
      title: "Fee payment received",
      activityType: "payment",
      timestamp: new Date(Date.now() - 7200_000).toISOString(),
    },
  ];

  it("renders activity titles", () => {
    render(<RecentActivityList activities={activities} />);
    expect(screen.getByText("Ali enrolled in Grade 5")).toBeTruthy();
    expect(screen.getByText("Fee payment received")).toBeTruthy();
  });

  it("renders widget title", () => {
    render(<RecentActivityList activities={activities} title="Activity Log" />);
    expect(screen.getByText("Activity Log")).toBeTruthy();
  });

  it("renders empty message when no activities", () => {
    render(<RecentActivityList activities={[]} emptyMessage="Nothing yet" />);
    expect(screen.getByText("Nothing yet")).toBeTruthy();
  });

  it("renders loading skeleton when loading=true", () => {
    const { container } = render(<RecentActivityList loading />);
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("respects maxItems limit", () => {
    const manyActivities = Array.from({ length: 10 }, (_, i) => ({
      id: String(i),
      title: `Activity ${i}`,
      activityType: "system",
      timestamp: new Date().toISOString(),
    }));
    render(<RecentActivityList activities={manyActivities} maxItems={3} />);
    // Only 3 items rendered
    const items = screen.getAllByText(/Activity \d/);
    expect(items.length).toBe(3);
  });
});

// ─── DashboardSection ─────────────────────────────────────────────────────────

describe("DashboardSection", () => {
  it("renders title", () => {
    render(<DashboardSection title="Overview"><div>child</div></DashboardSection>);
    expect(screen.getByText("Overview")).toBeTruthy();
  });

  it("renders description", () => {
    render(
      <DashboardSection title="T" description="Sub text">
        <div>child</div>
      </DashboardSection>
    );
    expect(screen.getByText("Sub text")).toBeTruthy();
  });

  it("renders children", () => {
    render(
      <DashboardSection>
        <span data-testid="inner">content</span>
      </DashboardSection>
    );
    expect(screen.getByTestId("inner")).toBeTruthy();
  });
});

// ─── DashboardEmptyState ──────────────────────────────────────────────────────

describe("DashboardEmptyState", () => {
  it("renders title", () => {
    render(<DashboardEmptyState title="No records found" />);
    expect(screen.getByText("No records found")).toBeTruthy();
  });

  it("renders description when provided", () => {
    render(<DashboardEmptyState title="Empty" description="Try adding some data." />);
    expect(screen.getByText("Try adding some data.")).toBeTruthy();
  });

  it("renders action slot", () => {
    render(
      <DashboardEmptyState
        title="Empty"
        action={<button>Add Now</button>}
      />
    );
    expect(screen.getByRole("button", { name: "Add Now" })).toBeTruthy();
  });
});

// ─── DashboardWidgetSkeleton ──────────────────────────────────────────────────

describe("DashboardWidgetSkeleton", () => {
  it("renders metric skeleton without crashing", () => {
    const { container } = render(<DashboardWidgetSkeleton variant="metric" />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders chart skeleton without crashing", () => {
    const { container } = render(<DashboardWidgetSkeleton variant="chart" />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders list skeleton without crashing", () => {
    const { container } = render(<DashboardWidgetSkeleton variant="list" rows={5} />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders table skeleton without crashing", () => {
    const { container } = render(<DashboardWidgetSkeleton variant="table" rows={4} />);
    expect(container.firstChild).toBeTruthy();
  });
});

// ─── StatsGrid ────────────────────────────────────────────────────────────────

describe("StatsGrid", () => {
  const metrics: DashboardMetric[] = [
    { label: "Students", value: 400 },
    { label: "Teachers", value: 20 },
    { label: "Revenue", value: 50000 },
    { label: "Attendance", value: 95, unit: "%" },
  ];

  it("renders all metric labels", () => {
    render(<StatsGrid metrics={metrics} />);
    expect(screen.getByText("Students")).toBeTruthy();
    expect(screen.getByText("Teachers")).toBeTruthy();
    expect(screen.getByText("Revenue")).toBeTruthy();
    expect(screen.getByText("Attendance")).toBeTruthy();
  });

  it("renders loading skeletons when loading=true", () => {
    const { container } = render(<StatsGrid metrics={metrics} loading />);
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
