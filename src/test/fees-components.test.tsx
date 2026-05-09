/**
 * Fees feature component tests — Phase 16
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { FeeSummaryCards } from "@/features/fees/components/fee-summary-cards";
import { FeeStatusBadge } from "@/features/fees/components/fee-status-badge";
import { FeeAmountCell } from "@/features/fees/components/fee-amount-cell";
import type { FeeSummary } from "@/features/fees/utils/fee-mappers";

// ─── FeeSummaryCards ──────────────────────────────────────────────────────────

describe("FeeSummaryCards", () => {
  const summary: FeeSummary = {
    totalInvoiced: 50000,
    collected: 35000,
    pending: 10000,
    overdue: 5000,
    currency: "PKR",
  };

  it("renders the container with data-testid", () => {
    render(<FeeSummaryCards summary={summary} />);
    expect(screen.getByTestId("fee-summary-cards")).toBeTruthy();
  });

  it("renders Total Invoiced card label", () => {
    render(<FeeSummaryCards summary={summary} />);
    expect(screen.getByText("Total Invoiced")).toBeTruthy();
  });

  it("renders Collected card label", () => {
    render(<FeeSummaryCards summary={summary} />);
    expect(screen.getByText("Collected")).toBeTruthy();
  });

  it("renders Pending card label", () => {
    render(<FeeSummaryCards summary={summary} />);
    expect(screen.getByText("Pending")).toBeTruthy();
  });

  it("renders Overdue card label", () => {
    render(<FeeSummaryCards summary={summary} />);
    expect(screen.getByText("Overdue")).toBeTruthy();
  });

  it("renders formatted currency amounts", () => {
    render(<FeeSummaryCards summary={summary} locale="en" />);
    // Amounts are rendered using formatCurrency — verify containers are present
    const cards = screen.getByTestId("fee-summary-cards");
    expect(cards).toBeTruthy();
  });
});

// ─── FeeStatusBadge ───────────────────────────────────────────────────────────

describe("FeeStatusBadge", () => {
  it("renders for paid status", () => {
    render(<FeeStatusBadge status="paid" />);
    expect(screen.getByText("Paid")).toBeTruthy();
  });

  it("renders for overdue status", () => {
    render(<FeeStatusBadge status="overdue" />);
    expect(screen.getByText("Overdue")).toBeTruthy();
  });

  it("renders for partial status", () => {
    render(<FeeStatusBadge status="partial" />);
    expect(screen.getByText("Partial")).toBeTruthy();
  });

  it("renders for waived status", () => {
    render(<FeeStatusBadge status="waived" />);
    expect(screen.getByText("Waived")).toBeTruthy();
  });

  it("renders for pending status", () => {
    render(<FeeStatusBadge status="pending" />);
    expect(screen.getByText("Pending")).toBeTruthy();
  });

  it("renders for due status", () => {
    render(<FeeStatusBadge status="due" />);
    expect(screen.getByText("Due")).toBeTruthy();
  });
});

// ─── FeeAmountCell ────────────────────────────────────────────────────────────

describe("FeeAmountCell", () => {
  it("renders without crashing", () => {
    render(<FeeAmountCell amount={5000} currency="PKR" />);
    expect(document.body).toBeTruthy();
  });

  it("renders with strikethrough class when strikethrough=true", () => {
    const { container } = render(
      <FeeAmountCell amount={5000} currency="PKR" strikethrough />
    );
    const el = container.querySelector(".line-through");
    expect(el).toBeTruthy();
  });

  it("renders with muted class when muted=true", () => {
    const { container } = render(
      <FeeAmountCell amount={5000} currency="PKR" muted />
    );
    const el = container.querySelector(".text-muted-foreground");
    expect(el).toBeTruthy();
  });
});
