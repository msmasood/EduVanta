/**
 * Library component tests — Phase 19
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { BookSummaryCards, IssueSummaryCards, MemberSummaryCards } from "@/features/library/components/library-summary-cards";
import { BookStatusBadge, IssueStatusBadge, MemberStatusBadge } from "@/features/library/components/library-status-badges";
import { MemberBorrowingHistory } from "@/features/library/components/member-borrowing-history";
import { MemberCurrentIssuesCard } from "@/features/library/components/member-current-issues-card";
import { MemberInfoCard } from "@/features/library/components/member-info-card";
import type { LibraryBookStats, LibraryIssueStats, LibraryMemberStats } from "@/features/library/utils/library-calculations";
import type { MemberDetailCurrentIssue, MemberDetailHistoryEntry } from "@/features/library/utils/library-mappers";

// ─── BookSummaryCards ─────────────────────────────────────────────────────────

describe("BookSummaryCards", () => {
  const stats: LibraryBookStats = {
    totalBooks: 25,
    availableCopies: 60,
    issuedCopies: 15,
    categories: 5,
  };

  it("renders the book-summary-cards testid container", () => {
    render(<BookSummaryCards stats={stats} />);
    expect(screen.getByTestId("book-summary-cards")).toBeDefined();
  });

  it("shows total book count", () => {
    render(<BookSummaryCards stats={stats} />);
    expect(screen.getByText("25")).toBeDefined();
  });
});

// ─── IssueSummaryCards ────────────────────────────────────────────────────────

describe("IssueSummaryCards", () => {
  const stats: LibraryIssueStats = {
    activeIssues: 20,
    returnedBooks: 10,
    overdueBooks: 3,
    dueToday: 2,
  };

  it("renders the issue-summary-cards testid container", () => {
    render(<IssueSummaryCards stats={stats} />);
    expect(screen.getByTestId("issue-summary-cards")).toBeDefined();
  });

  it("shows overdue count", () => {
    render(<IssueSummaryCards stats={stats} />);
    expect(screen.getAllByText("3")[0]).toBeDefined();
  });
});

// ─── MemberSummaryCards ───────────────────────────────────────────────────────

describe("MemberSummaryCards", () => {
  const stats: LibraryMemberStats = {
    totalMembers: 10,
    activeMembers: 8,
    studentMembers: 6,
    staffMembers: 2,
  };

  it("renders the member-summary-cards testid container", () => {
    render(<MemberSummaryCards stats={stats} />);
    expect(screen.getByTestId("member-summary-cards")).toBeDefined();
  });

  it("shows active members count", () => {
    render(<MemberSummaryCards stats={stats} />);
    expect(screen.getAllByText("8")[0]).toBeDefined();
  });
});

// ─── Status badges ────────────────────────────────────────────────────────────

describe("BookStatusBadge", () => {
  it("renders 'Available' for active status", () => {
    render(<BookStatusBadge status="active" />);
    expect(screen.getAllByText("Available")[0]).toBeDefined();
  });

  it("renders 'Unavailable' for inactive status", () => {
    render(<BookStatusBadge status="inactive" />);
    expect(screen.getAllByText("Unavailable")[0]).toBeDefined();
  });
});

describe("IssueStatusBadge", () => {
  it("renders 'Issued' badge", () => {
    render(<IssueStatusBadge status="issued" />);
    expect(screen.getAllByText("Issued")[0]).toBeDefined();
  });

  it("renders 'Overdue' badge", () => {
    render(<IssueStatusBadge status="overdue" />);
    expect(screen.getAllByText("Overdue")[0]).toBeDefined();
  });

  it("renders 'Returned' badge", () => {
    render(<IssueStatusBadge status="returned" />);
    expect(screen.getAllByText("Returned")[0]).toBeDefined();
  });
});

describe("MemberStatusBadge", () => {
  it("renders 'Active' for active member", () => {
    render(<MemberStatusBadge status="active" />);
    expect(screen.getAllByText("Active")[0]).toBeDefined();
  });
});

// ─── MemberBorrowingHistory ───────────────────────────────────────────────────

describe("MemberBorrowingHistory", () => {
  it("renders testid", () => {
    render(<MemberBorrowingHistory history={[]} />);
    expect(screen.getByTestId("member-borrowing-history")).toBeDefined();
  });

  it("shows empty message when no history", () => {
    render(<MemberBorrowingHistory history={[]} />);
    expect(screen.getByText(/no borrowing history/i)).toBeDefined();
  });

  it("renders history rows", () => {
    const history: MemberDetailHistoryEntry[] = [
      {
        id: "bi-001",
        bookTitle: "Clean Code",
        bookIsbn: "978-0132350884",
        issueDate: "Jan 1, 2025",
        dueDate: "Jan 15, 2025",
        returnDate: "Jan 14, 2025",
        status: "returned",
        statusVariant: "active",
        fine: 0,
        fineFormatted: "$0.00",
      },
    ];
    render(<MemberBorrowingHistory history={history} />);
    expect(screen.getByText("Clean Code")).toBeDefined();
    expect(screen.getAllByText("Returned")[0]).toBeDefined();
  });
});

// ─── MemberCurrentIssuesCard ──────────────────────────────────────────────────

describe("MemberCurrentIssuesCard", () => {
  it("shows empty state when no current issues", () => {
    render(<MemberCurrentIssuesCard issues={[]} />);
    expect(screen.getByText(/no books currently issued/i)).toBeDefined();
  });

  it("renders current issue entries", () => {
    const issues: MemberDetailCurrentIssue[] = [
      {
        id: "bi-002",
        bookTitle: "The Pragmatic Programmer",
        bookIsbn: "978-0201616224",
        issueDate: "Jan 5, 2025",
        dueDate: "Jan 20, 2025",
        status: "issued",
        statusVariant: "info",
        isOverdue: false,
      },
    ];
    render(<MemberCurrentIssuesCard issues={issues} />);
    expect(screen.getByText("The Pragmatic Programmer")).toBeDefined();
  });
});

// ─── MemberInfoCard ───────────────────────────────────────────────────────────

describe("MemberInfoCard", () => {
  it("renders correctly with stats", () => {
    render(<MemberInfoCard activeIssues={2} totalBorrowed={8} maxBooksAllowed={5} overdueCount={0} />);
    expect(screen.getByText("2 / 5")).toBeDefined();
    expect(screen.getByText("8")).toBeDefined();
    expect(screen.getByText("0")).toBeDefined();
  });
});
