"use client";

import { BookOpen, BookMarked, RefreshCw, Tag, Users, UserCheck, GraduationCap, Briefcase, AlertCircle, Calendar } from "lucide-react";
import type { LibraryBookStats, LibraryIssueStats, LibraryMemberStats } from "../utils/library-calculations";

// ─── Generic summary card ─────────────────────────────────────────────────────

interface SummaryCardItem {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bg: string;
}

function SummaryCard({ label, value, icon: Icon, color, bg }: SummaryCardItem) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2 ${bg}`}>
          <Icon className={`size-5 ${color}`} />
        </div>
        <div>
          <p className="text-2xl font-bold tabular-nums">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Books summary cards ──────────────────────────────────────────────────────

interface BookSummaryCardsProps {
  stats: LibraryBookStats;
}

export function BookSummaryCards({ stats }: BookSummaryCardsProps) {
  const cards: SummaryCardItem[] = [
    { label: "Total Books", value: stats.totalBooks, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "Available Copies", value: stats.availableCopies, icon: BookMarked, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/30" },
    { label: "Issued Copies", value: stats.issuedCopies, icon: RefreshCw, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950/30" },
    { label: "Categories", value: stats.categories, icon: Tag, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950/30" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4" data-testid="book-summary-cards">
      {cards.map((c) => <SummaryCard key={c.label} {...c} />)}
    </div>
  );
}

// ─── Issue/Return summary cards ───────────────────────────────────────────────

interface IssueSummaryCardsProps {
  stats: LibraryIssueStats;
}

export function IssueSummaryCards({ stats }: IssueSummaryCardsProps) {
  const cards: SummaryCardItem[] = [
    { label: "Active Issues", value: stats.activeIssues, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "Returned Books", value: stats.returnedBooks, icon: BookMarked, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/30" },
    { label: "Overdue Books", value: stats.overdueBooks, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/30" },
    { label: "Due Today", value: stats.dueToday, icon: Calendar, color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-950/30" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4" data-testid="issue-summary-cards">
      {cards.map((c) => <SummaryCard key={c.label} {...c} />)}
    </div>
  );
}

// ─── Members summary cards ────────────────────────────────────────────────────

interface MemberSummaryCardsProps {
  stats: LibraryMemberStats;
}

export function MemberSummaryCards({ stats }: MemberSummaryCardsProps) {
  const cards: SummaryCardItem[] = [
    { label: "Total Members", value: stats.totalMembers, icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "Active Members", value: stats.activeMembers, icon: UserCheck, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/30" },
    { label: "Student Members", value: stats.studentMembers, icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950/30" },
    { label: "Staff Members", value: stats.staffMembers, icon: Briefcase, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950/30" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4" data-testid="member-summary-cards">
      {cards.map((c) => <SummaryCard key={c.label} {...c} />)}
    </div>
  );
}
