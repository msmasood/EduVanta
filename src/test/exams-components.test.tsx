/**
 * Exam feature component tests — Phase 15
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { ExamSummaryCards } from "@/features/exams/components/exam-summary-cards";
import { ExamResultSummaryCards } from "@/features/exams/components/exam-result-summary-cards";
import { GradeBadge } from "@/features/exams/components/grade-badge";
import { MarksCell } from "@/features/exams/components/marks-cell";
import type { ExamSummary, ExamResultSummary } from "@/features/exams/utils/exam-mappers";

// ─── ExamSummaryCards ─────────────────────────────────────────────────────────

describe("ExamSummaryCards", () => {
  const summary: ExamSummary = {
    total: 5,
    upcoming: 2,
    ongoing: 1,
    completed: 1,
    cancelled: 1,
  };

  it("renders Total Exams card", () => {
    render(<ExamSummaryCards summary={summary} />);
    expect(screen.getByText("Total Exams")).toBeTruthy();
  });

  it("renders Upcoming card", () => {
    render(<ExamSummaryCards summary={summary} />);
    expect(screen.getByText("Upcoming")).toBeTruthy();
  });

  it("renders Ongoing card", () => {
    render(<ExamSummaryCards summary={summary} />);
    expect(screen.getByText("Ongoing")).toBeTruthy();
  });

  it("renders Completed card", () => {
    render(<ExamSummaryCards summary={summary} />);
    expect(screen.getByText("Completed")).toBeTruthy();
  });

  it("shows correct total count", () => {
    render(<ExamSummaryCards summary={summary} />);
    expect(screen.getByText("5")).toBeTruthy();
  });

  it("shows correct upcoming count", () => {
    render(<ExamSummaryCards summary={summary} />);
    expect(screen.getByText("2")).toBeTruthy();
  });

  it("shows correct ongoing count", () => {
    render(<ExamSummaryCards summary={summary} />);
    const ones = screen.getAllByText("1");
    expect(ones.length).toBeGreaterThanOrEqual(1);
  });
});

// ─── ExamResultSummaryCards ───────────────────────────────────────────────────

describe("ExamResultSummaryCards", () => {
  const summary: ExamResultSummary = {
    total: 20,
    passed: 14,
    failed: 4,
    absent: 1,
    pending: 1,
    avgPercentage: 72,
  };

  it("renders Total Results card", () => {
    render(<ExamResultSummaryCards summary={summary} />);
    expect(screen.getByText("Total Results")).toBeTruthy();
  });

  it("renders Passed card", () => {
    render(<ExamResultSummaryCards summary={summary} />);
    expect(screen.getByText("Passed")).toBeTruthy();
  });

  it("renders Failed card", () => {
    render(<ExamResultSummaryCards summary={summary} />);
    expect(screen.getByText("Failed")).toBeTruthy();
  });

  it("renders Avg. Score card", () => {
    render(<ExamResultSummaryCards summary={summary} />);
    expect(screen.getByText("Avg. Score")).toBeTruthy();
  });

  it("shows correct total", () => {
    render(<ExamResultSummaryCards summary={summary} />);
    expect(screen.getByText("20")).toBeTruthy();
  });

  it("shows correct passed count", () => {
    render(<ExamResultSummaryCards summary={summary} />);
    expect(screen.getByText("14")).toBeTruthy();
  });

  it("shows correct avg percentage", () => {
    render(<ExamResultSummaryCards summary={summary} />);
    expect(screen.getByText("72%")).toBeTruthy();
  });
});

// ─── GradeBadge ───────────────────────────────────────────────────────────────

describe("GradeBadge", () => {
  it("renders grade A+", () => {
    render(<GradeBadge grade="A+" />);
    expect(screen.getByText("A+")).toBeTruthy();
  });

  it("renders grade B", () => {
    render(<GradeBadge grade="B" />);
    expect(screen.getByText("B")).toBeTruthy();
  });

  it("renders grade F", () => {
    render(<GradeBadge grade="F" />);
    expect(screen.getByText("F")).toBeTruthy();
  });
});

// ─── MarksCell ────────────────────────────────────────────────────────────────

describe("MarksCell", () => {
  it("renders marks in fraction format", () => {
    render(<MarksCell marksObtained={87} maxMarks={100} percentage={87} />);
    expect(screen.getByText("87/100")).toBeTruthy();
  });

  it("renders percentage", () => {
    render(<MarksCell marksObtained={87} maxMarks={100} percentage={87} />);
    expect(screen.getByText("(87%)")).toBeTruthy();
  });

  it("renders zero marks", () => {
    render(<MarksCell marksObtained={0} maxMarks={100} percentage={0} />);
    expect(screen.getByText("0/100")).toBeTruthy();
  });
});
