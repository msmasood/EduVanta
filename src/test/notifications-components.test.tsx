/**
 * Notifications component tests — Phase 20
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { NotificationSummaryCards } from "@/features/notifications/components/notification-summary-cards";
import { NotificationStatusBadge, NotificationCategoryBadge } from "@/features/notifications/components/notification-status-badge";
import { NotificationCardList } from "@/features/notifications/components/notification-card-list";
import { NotificationChannelToggle } from "@/features/notifications/components/notification-channel-toggle";
import { NotificationPreferenceCard } from "@/features/notifications/components/notification-preference-card";
import type { NotificationRow, NotificationPreferenceRow } from "@/features/notifications/utils/notification-mappers";

// ─── NotificationSummaryCards ─────────────────────────────────────────────────

describe("NotificationSummaryCards", () => {
  it("renders notification-summary-cards testid", () => {
    render(
      <NotificationSummaryCards total={10} unread={3} read={7} urgent={1} />
    );
    expect(screen.getByTestId("notification-summary-cards")).toBeDefined();
  });

  it("shows total count", () => {
    render(
      <NotificationSummaryCards total={10} unread={3} read={7} urgent={1} />
    );
    expect(screen.getByText("10")).toBeDefined();
  });

  it("shows unread count", () => {
    render(
      <NotificationSummaryCards total={10} unread={3} read={7} urgent={1} />
    );
    expect(screen.getByText("3")).toBeDefined();
  });
});

// ─── NotificationStatusBadge ──────────────────────────────────────────────────

describe("NotificationStatusBadge", () => {
  it('renders "Unread" for unread notification', () => {
    render(<NotificationStatusBadge isRead={false} />);
    expect(screen.getByText("Unread")).toBeDefined();
  });

  it('renders "Read" for read notification', () => {
    render(<NotificationStatusBadge isRead={true} />);
    expect(screen.getByText("Read")).toBeDefined();
  });

  it("renders notification-status-badge testid", () => {
    render(<NotificationStatusBadge isRead={false} />);
    expect(screen.getByTestId("notification-status-badge")).toBeDefined();
  });
});

// ─── NotificationCategoryBadge ────────────────────────────────────────────────

describe("NotificationCategoryBadge", () => {
  it("renders Fees for fees category", () => {
    render(<NotificationCategoryBadge category="fees" />);
    expect(screen.getByText("Fees")).toBeDefined();
  });

  it("renders Attendance for attendance category", () => {
    render(<NotificationCategoryBadge category="attendance" />);
    expect(screen.getByText("Attendance")).toBeDefined();
  });

  it("renders System for system category", () => {
    render(<NotificationCategoryBadge category="system" />);
    expect(screen.getByText("System")).toBeDefined();
  });

  it("renders notification-category-badge testid", () => {
    render(<NotificationCategoryBadge category="fees" />);
    expect(screen.getByTestId("notification-category-badge")).toBeDefined();
  });
});

// ─── NotificationCardList ─────────────────────────────────────────────────────

describe("NotificationCardList", () => {
  const notifications: NotificationRow[] = [
    {
      id: "notif-001",
      category: "fees",
      title: "Fee Overdue",
      body: "October 2024 fee is overdue.",
      isRead: false,
      createdAt: "Oct 11, 2024",
      createdAtRaw: "2024-10-11T08:00:00.000Z",
    },
  ];

  it("renders notification-card-list testid", () => {
    render(
      <NotificationCardList
        notifications={notifications}
        onMarkRead={() => {}}
        onDismiss={() => {}}
      />
    );
    expect(screen.getByTestId("notification-card-list")).toBeDefined();
  });

  it("renders notification title", () => {
    render(
      <NotificationCardList
        notifications={notifications}
        onMarkRead={() => {}}
        onDismiss={() => {}}
      />
    );
    expect(screen.getByText("Fee Overdue")).toBeDefined();
  });

  it("renders mark-read button for unread", () => {
    render(
      <NotificationCardList
        notifications={notifications}
        onMarkRead={() => {}}
        onDismiss={() => {}}
      />
    );
    expect(screen.getByTestId("mark-read-btn")).toBeDefined();
  });

  it("renders dismiss button", () => {
    render(
      <NotificationCardList
        notifications={notifications}
        onMarkRead={() => {}}
        onDismiss={() => {}}
      />
    );
    expect(screen.getByTestId("dismiss-btn")).toBeDefined();
  });

  it("renders empty state when no notifications", () => {
    render(
      <NotificationCardList
        notifications={[]}
        onMarkRead={() => {}}
        onDismiss={() => {}}
      />
    );
    expect(screen.getByTestId("notification-card-list-empty")).toBeDefined();
  });
});

// ─── NotificationChannelToggle ────────────────────────────────────────────────

describe("NotificationChannelToggle", () => {
  it("renders channel-toggle testid", () => {
    render(<NotificationChannelToggle label="Email" checked={true} onChange={() => {}} />);
    expect(screen.getByTestId("channel-toggle")).toBeDefined();
  });

  it("renders label", () => {
    render(<NotificationChannelToggle label="SMS" checked={false} onChange={() => {}} />);
    expect(screen.getByText("SMS")).toBeDefined();
  });
});

// ─── NotificationPreferenceCard ───────────────────────────────────────────────

describe("NotificationPreferenceCard", () => {
  const pref: NotificationPreferenceRow = {
    id: "email",
    channel: "email",
    channelLabel: "Email",
    categoryToggles: { fees: true, attendance: false },
    audienceToggles: { admin: true, teacher: true },
  };

  it("renders preference-card testid", () => {
    render(<NotificationPreferenceCard preference={pref} onChange={() => {}} />);
    expect(screen.getByTestId("preference-card")).toBeDefined();
  });

  it("renders channel label", () => {
    render(<NotificationPreferenceCard preference={pref} onChange={() => {}} />);
    expect(screen.getByText("Email")).toBeDefined();
  });

  it("renders Fees category toggle", () => {
    render(<NotificationPreferenceCard preference={pref} onChange={() => {}} />);
    expect(screen.getByText("Fees")).toBeDefined();
  });
});
