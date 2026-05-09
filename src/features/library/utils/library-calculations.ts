// library-calculations.ts — summary stats for the Library module

import type { Book, LibraryMember, BookIssue } from "@/types/library";

// ─── Books summary ────────────────────────────────────────────────────────────

export interface LibraryBookStats {
  totalBooks: number;
  availableCopies: number;
  issuedCopies: number;
  categories: number;
}

export function computeBookStats(books: Book[]): LibraryBookStats {
  const totalCopies = books.reduce((sum, b) => sum + b.totalCopies, 0);
  const availableCopies = books.reduce((sum, b) => sum + b.availableCopies, 0);
  const categoriesSet = new Set(books.map((b) => b.subject ?? "Other"));

  return {
    totalBooks: books.length,
    availableCopies,
    issuedCopies: totalCopies - availableCopies,
    categories: categoriesSet.size,
  };
}

// ─── Issue/Return summary ─────────────────────────────────────────────────────

export interface LibraryIssueStats {
  activeIssues: number;
  returnedBooks: number;
  overdueBooks: number;
  dueToday: number;
}

export function computeIssueStats(issues: BookIssue[]): LibraryIssueStats {
  const today = new Date().toISOString().slice(0, 10);
  return {
    activeIssues: issues.filter((i) => i.status === "issued").length,
    returnedBooks: issues.filter((i) => i.status === "returned").length,
    overdueBooks: issues.filter((i) => i.status === "overdue").length,
    dueToday: issues.filter(
      (i) => i.status === "issued" && i.dueDate === today
    ).length,
  };
}

// ─── Members summary ──────────────────────────────────────────────────────────

export interface LibraryMemberStats {
  totalMembers: number;
  activeMembers: number;
  studentMembers: number;
  staffMembers: number;
}

export function computeMemberStats(members: LibraryMember[]): LibraryMemberStats {
  return {
    totalMembers: members.length,
    activeMembers: members.filter((m) => m.status === "active").length,
    studentMembers: members.filter((m) => m.memberType === "student").length,
    staffMembers: members.filter(
      (m) => m.memberType === "teacher" || m.memberType === "employee"
    ).length,
  };
}
