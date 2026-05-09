/**
 * Employees component tests — Phase 13
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { EmployeeStatusCards } from "@/features/employees/components/employee-status-summary";
import { EmployeeAttendanceSummary } from "@/features/employees/components/employee-attendance-summary";
import type { AttendanceStatusCounts } from "@/features/employees/utils/employee-mappers";

// ─── EmployeeStatusCards ──────────────────────────────────────────────────────

describe("EmployeeStatusCards", () => {
  const summary = { total: 10, active: 7, onLeave: 2, terminated: 1 };

  it("renders Total Employees card", () => {
    render(<EmployeeStatusCards summary={summary} />);
    expect(screen.getByText("Total Employees")).toBeTruthy();
  });

  it("renders Active card", () => {
    render(<EmployeeStatusCards summary={summary} />);
    expect(screen.getByText("Active")).toBeTruthy();
  });

  it("renders On Leave card", () => {
    render(<EmployeeStatusCards summary={summary} />);
    expect(screen.getByText("On Leave")).toBeTruthy();
  });

  it("renders Terminated card", () => {
    render(<EmployeeStatusCards summary={summary} />);
    expect(screen.getByText("Terminated")).toBeTruthy();
  });

  it("shows correct total count", () => {
    render(<EmployeeStatusCards summary={summary} />);
    expect(screen.getByText("10")).toBeTruthy();
  });

  it("shows correct active count", () => {
    render(<EmployeeStatusCards summary={summary} />);
    expect(screen.getByText("7")).toBeTruthy();
  });
});

// ─── EmployeeAttendanceSummary ─────────────────────────────────────────────────

describe("EmployeeAttendanceSummary", () => {
  const counts: AttendanceStatusCounts = {
    present: 18,
    absent: 2,
    late: 1,
    halfDay: 0,
    leave: 1,
  };

  it("renders Present card", () => {
    render(<EmployeeAttendanceSummary counts={counts} />);
    expect(screen.getByText("Present")).toBeTruthy();
  });

  it("renders Absent card", () => {
    render(<EmployeeAttendanceSummary counts={counts} />);
    expect(screen.getByText("Absent")).toBeTruthy();
  });

  it("renders Late card", () => {
    render(<EmployeeAttendanceSummary counts={counts} />);
    expect(screen.getByText("Late")).toBeTruthy();
  });

  it("shows correct present count", () => {
    render(<EmployeeAttendanceSummary counts={counts} />);
    expect(screen.getByText("18")).toBeTruthy();
  });

  it("shows correct absent count", () => {
    render(<EmployeeAttendanceSummary counts={counts} />);
    expect(screen.getByText("2")).toBeTruthy();
  });
});
