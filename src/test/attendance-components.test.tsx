/**
 * Attendance component tests — Phase 18
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { AttendanceSummaryCards } from "@/features/attendance/components/attendance-summary-cards";
import { AttendanceStatusBadge } from "@/features/attendance/components/attendance-status-badge";
import { AttendanceFilterBar } from "@/features/attendance/components/attendance-filter-bar";
import type { AttendanceSummaryStats } from "@/features/attendance/utils/attendance-calculations";
import type { AttendanceFilters } from "@/features/attendance/components/attendance-filter-bar";

const EMPTY_FILTERS: AttendanceFilters = {
  search: "",
  status: "",
  date: "",
  departmentId: "",
  classId: "",
};

const SUMMARY: AttendanceSummaryStats = {
  total: 20,
  present: 14,
  absent: 3,
  late: 2,
  halfDay: 1,
  leave: 0,
  excused: 0,
  holiday: 0,
  attendanceRate: 80,
};

// ─── AttendanceSummaryCards ───────────────────────────────────────────────────

describe("AttendanceSummaryCards", () => {
  it("renders all six summary cards", () => {
    render(<AttendanceSummaryCards summary={SUMMARY} />);
    expect(screen.getByText("Present")).toBeTruthy();
    expect(screen.getByText("Absent")).toBeTruthy();
    expect(screen.getByText("Late")).toBeTruthy();
    expect(screen.getByText("Half Day")).toBeTruthy();
    expect(screen.getByText("On Leave")).toBeTruthy();
    expect(screen.getByText("Attendance Rate")).toBeTruthy();
  });

  it("displays present count", () => {
    render(<AttendanceSummaryCards summary={SUMMARY} />);
    expect(screen.getByText("14")).toBeTruthy();
  });

  it("displays attendance rate with percent", () => {
    render(<AttendanceSummaryCards summary={SUMMARY} />);
    expect(screen.getByText("80%")).toBeTruthy();
  });

  it("renders skeleton loading state", () => {
    const { container } = render(<AttendanceSummaryCards summary={SUMMARY} isLoading />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});

// ─── AttendanceStatusBadge ────────────────────────────────────────────────────

describe("AttendanceStatusBadge", () => {
  it("renders present badge", () => {
    render(<AttendanceStatusBadge status="present" />);
    expect(screen.getByText("Present")).toBeTruthy();
  });

  it("renders absent badge", () => {
    render(<AttendanceStatusBadge status="absent" />);
    expect(screen.getByText("Absent")).toBeTruthy();
  });

  it("renders late badge", () => {
    render(<AttendanceStatusBadge status="late" />);
    expect(screen.getByText("Late")).toBeTruthy();
  });

  it("uses custom label when provided", () => {
    render(<AttendanceStatusBadge status="present" label="In Class" />);
    expect(screen.getByText("In Class")).toBeTruthy();
  });
});

// ─── AttendanceFilterBar ──────────────────────────────────────────────────────

describe("AttendanceFilterBar", () => {
  it("renders student search placeholder", () => {
    render(
      <AttendanceFilterBar
        entityType="student"
        filters={EMPTY_FILTERS}
        onFiltersChange={() => undefined}
      />
    );
    const input = screen.getByPlaceholderText("Search student…");
    expect(input).toBeTruthy();
  });

  it("renders teacher search placeholder", () => {
    render(
      <AttendanceFilterBar
        entityType="teacher"
        filters={EMPTY_FILTERS}
        onFiltersChange={() => undefined}
      />
    );
    expect(screen.getByPlaceholderText("Search teacher…")).toBeTruthy();
  });

  it("renders employee search placeholder", () => {
    render(
      <AttendanceFilterBar
        entityType="employee"
        filters={EMPTY_FILTERS}
        onFiltersChange={() => undefined}
      />
    );
    expect(screen.getByPlaceholderText("Search employee…")).toBeTruthy();
  });

  it("renders department filter for teachers", () => {
    render(
      <AttendanceFilterBar
        entityType="teacher"
        filters={EMPTY_FILTERS}
        onFiltersChange={() => undefined}
        departmentOptions={[{ label: "Mathematics", value: "dept-001" }]}
      />
    );
    expect(screen.getByTestId("attendance-dept-filter")).toBeTruthy();
  });

  it("renders class filter for students", () => {
    render(
      <AttendanceFilterBar
        entityType="student"
        filters={EMPTY_FILTERS}
        onFiltersChange={() => undefined}
        classOptions={[{ label: "Class 1", value: "class-001" }]}
      />
    );
    expect(screen.getByTestId("attendance-class-filter")).toBeTruthy();
  });
});
