/**
 * HRM component tests — Phase 13
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { PayrollSummaryCards } from "@/features/hrm/components/payroll-summary-cards";
import type { PayrollSummary } from "@/features/hrm/utils/hrm-mappers";

// ─── PayrollSummaryCards ──────────────────────────────────────────────────────

describe("PayrollSummaryCards", () => {
  const summary: PayrollSummary = {
    totalFormatted: "PKR 265,000",
    paidCount: 4,
    pendingCount: 1,
    avgFormatted: "PKR 53,000",
    currency: "PKR",
  };

  it("renders Total Payroll card", () => {
    render(<PayrollSummaryCards summary={summary} />);
    expect(screen.getByText("Total Payroll")).toBeTruthy();
  });

  it("renders Paid Records card", () => {
    render(<PayrollSummaryCards summary={summary} />);
    expect(screen.getByText("Paid Records")).toBeTruthy();
  });

  it("renders Pending card", () => {
    render(<PayrollSummaryCards summary={summary} />);
    expect(screen.getByText("Pending")).toBeTruthy();
  });

  it("renders Avg. Salary card", () => {
    render(<PayrollSummaryCards summary={summary} />);
    expect(screen.getByText("Avg. Salary")).toBeTruthy();
  });

  it("shows total payroll formatted value", () => {
    render(<PayrollSummaryCards summary={summary} />);
    expect(screen.getByText("PKR 265,000")).toBeTruthy();
  });

  it("shows paid count", () => {
    render(<PayrollSummaryCards summary={summary} />);
    expect(screen.getByText("4")).toBeTruthy();
  });

  it("shows pending count", () => {
    render(<PayrollSummaryCards summary={summary} />);
    expect(screen.getByText("1")).toBeTruthy();
  });

  it("shows average salary formatted value", () => {
    render(<PayrollSummaryCards summary={summary} />);
    expect(screen.getByText("PKR 53,000")).toBeTruthy();
  });
});
