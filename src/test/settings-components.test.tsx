/**
 * Settings component unit tests — Phase 22
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { SubscriptionPlanCard } from "@/features/settings/components/subscription-plan-card";
import { SubscriptionUsageCard } from "@/features/settings/components/subscription-usage-card";
import { SubscriptionBillingHistory } from "@/features/settings/components/subscription-billing-history";
import { RolePermissionMatrix } from "@/features/settings/components/role-permission-matrix";
import type { SubscriptionPlan, SubscriptionUsage } from "@/types/settings";
import type { BillingRow } from "@/features/settings/utils/settings-mappers";
import type { ModulePermission } from "@/types/settings";

// ─── SubscriptionPlanCard ─────────────────────────────────────────────────────

const MOCK_PLAN: SubscriptionPlan = {
  id: "plan-standard",
  name: "Standard",
  tier: "standard",
  isPopular: true,
  price: { monthly: 99, annual: 990, currency: "USD" },
  maxStudents: 1000,
  maxTeachers: 100,
  maxAdmins: 10,
  features: ["Student Management", "Teacher Portal", "Attendance Tracking"],
  isActive: true,
  audit: { createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z" },
};

describe("SubscriptionPlanCard", () => {
  it("renders plan card testid", () => {
    render(
      <SubscriptionPlanCard
        plan={MOCK_PLAN}
        billingCycle="monthly"
        isCurrentPlan={false}
        onSelect={() => {}}
      />
    );
    expect(screen.getByTestId("subscription-plan-card")).toBeDefined();
  });

  it("shows plan name", () => {
    render(
      <SubscriptionPlanCard
        plan={MOCK_PLAN}
        billingCycle="monthly"
        isCurrentPlan={false}
        onSelect={() => {}}
      />
    );
    expect(screen.getByText("Standard")).toBeDefined();
  }, 15000);

  it("shows Most Popular badge for popular plan", () => {
    render(
      <SubscriptionPlanCard
        plan={MOCK_PLAN}
        billingCycle="monthly"
        isCurrentPlan={false}
        onSelect={() => {}}
      />
    );
    expect(screen.getByText("Most Popular")).toBeDefined();
  });

  it("shows Current Plan label when isCurrentPlan=true", () => {
    render(
      <SubscriptionPlanCard
        plan={MOCK_PLAN}
        billingCycle="monthly"
        isCurrentPlan={true}
        onSelect={() => {}}
      />
    );
    const labels = screen.getAllByText("Current Plan");
    expect(labels.length).toBeGreaterThan(0);
  });
});

// ─── SubscriptionUsageCard ────────────────────────────────────────────────────

const MOCK_USAGE: SubscriptionUsage = {
  currentPlanId: "plan-standard",
  currentPlanName: "Standard",
  tier: "standard",
  billingCycle: "annual",
  renewalDate: "2026-01-01T00:00:00.000Z",
  studentsUsed: 847,
  studentsMax: 1000,
  teachersUsed: 62,
  teachersMax: 100,
  adminsUsed: 4,
  adminsMax: 10,
  storageUsedMb: 3200,
  storageMaxMb: 51200,
};

describe("SubscriptionUsageCard", () => {
  it("renders usage card testid", () => {
    render(<SubscriptionUsageCard usage={MOCK_USAGE} />);
    expect(screen.getByTestId("subscription-usage-card")).toBeDefined();
  });

  it("shows plan name", () => {
    render(<SubscriptionUsageCard usage={MOCK_USAGE} />);
    expect(screen.getByText("Standard")).toBeDefined();
  });
});

// ─── SubscriptionBillingHistory ───────────────────────────────────────────────

const MOCK_BILLING_ROWS: BillingRow[] = [
  {
    id: "bill-001",
    invoiceNumber: "INV-2025-0001",
    planName: "Standard",
    amount: 1200,
    currency: "USD",
    billingCycle: "Annual",
    billingDate: "2025-01-15T00:00:00.000Z",
    status: "paid",
    invoiceUrl: "https://example.com/inv/001",
    formattedDate: "Jan 15, 2025",
  },
];

describe("SubscriptionBillingHistory", () => {
  it("renders billing history testid", () => {
    render(<SubscriptionBillingHistory rows={MOCK_BILLING_ROWS} />);
    expect(screen.getByTestId("subscription-billing-history")).toBeDefined();
  });

  it("shows invoice number", () => {
    render(<SubscriptionBillingHistory rows={MOCK_BILLING_ROWS} />);
    expect(screen.getByText("INV-2025-0001")).toBeDefined();
  });

  it("shows empty message when no rows", () => {
    render(<SubscriptionBillingHistory rows={[]} />);
    expect(screen.getByText("No billing history available.")).toBeDefined();
  });
});

// ─── RolePermissionMatrix ─────────────────────────────────────────────────────

const MOCK_PERMISSIONS: ModulePermission[] = [
  { module: "students", actions: ["view", "create", "edit", "delete"] },
  { module: "teachers", actions: ["view"] },
];

describe("RolePermissionMatrix", () => {
  it("renders permission matrix testid", () => {
    render(<RolePermissionMatrix permissions={MOCK_PERMISSIONS} readOnly />);
    expect(screen.getByTestId("role-permission-matrix")).toBeDefined();
  });

  it("shows module labels", () => {
    render(<RolePermissionMatrix permissions={MOCK_PERMISSIONS} readOnly />);
    expect(screen.getByText("Students")).toBeDefined();
    expect(screen.getByText("Teachers")).toBeDefined();
  });

  it("shows action column headers", () => {
    render(<RolePermissionMatrix permissions={MOCK_PERMISSIONS} readOnly />);
    expect(screen.getByText("view")).toBeDefined();
    expect(screen.getByText("create")).toBeDefined();
  });
});
