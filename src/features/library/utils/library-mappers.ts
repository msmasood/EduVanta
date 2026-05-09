// library-mappers.ts — data transformation utilities for the Library module

import type { Book, LibraryMember, BookIssue } from "@/types/library";
import type { Student } from "@/types/student";
import type { Teacher } from "@/types/teacher";
import type { Employee } from "@/types/employee";
import type { StatusVariant } from "@/components/data-table/status-badge";
import { formatShortDate } from "@/lib/dates";
import { formatCurrency } from "@/lib/currency";

// ─── Status mappings ──────────────────────────────────────────────────────────

export function bookStatusToVariant(status?: string): StatusVariant {
  if (status === "inactive") return "inactive";
  return "active";
}

export function issueStatusToVariant(status?: string): StatusVariant {
  const map: Record<string, StatusVariant> = {
    issued: "info",
    returned: "active",
    overdue: "overdue",
    lost: "destructive",
    damaged: "warning",
  };
  return map[status ?? ""] ?? "neutral";
}

export function memberStatusToVariant(status?: string): StatusVariant {
  if (status === "inactive") return "inactive";
  return "active";
}

export function issueStatusLabel(status?: string): string {
  const map: Record<string, string> = {
    issued: "Issued",
    returned: "Returned",
    overdue: "Overdue",
    lost: "Lost",
    damaged: "Damaged",
  };
  return map[status ?? ""] ?? (status ?? "—");
}

export function memberTypeLabel(type?: string): string {
  const map: Record<string, string> = {
    student: "Student",
    teacher: "Teacher",
    employee: "Employee",
  };
  return map[type ?? ""] ?? (type ?? "—");
}

// ─── Book row ─────────────────────────────────────────────────────────────────

export interface BookRow {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  language: string;
  totalCopies: number;
  availableCopies: number;
  issuedCopies: number;
  shelfLocation: string;
  status: string;
  statusVariant: StatusVariant;
  publishYear?: number;
  publisher?: string;
  edition?: string;
}

export function mapBooksToRows(books: Book[]): BookRow[] {
  return books.map((b) => ({
    id: b.id,
    title: b.title,
    author: b.author,
    isbn: b.isbn ?? "—",
    category: b.subject ?? "—",
    language: "English", // default, can be expanded
    totalCopies: b.totalCopies,
    availableCopies: b.availableCopies,
    issuedCopies: b.totalCopies - b.availableCopies,
    shelfLocation: b.rackNumber ?? "—",
    status: b.status,
    statusVariant: bookStatusToVariant(b.status),
    publishYear: b.publishYear,
    publisher: b.publisher,
    edition: b.edition,
  }));
}

// ─── Issue/Return row ─────────────────────────────────────────────────────────

export interface IssueReturnRow {
  id: string;
  bookId: string;
  bookTitle: string;
  bookIsbn: string;
  memberId: string;
  memberName: string;
  memberType: string;
  memberTypeLabel: string;
  issueDate: string;
  dueDate: string;
  returnDate: string;
  status: string;
  statusLabel: string;
  statusVariant: StatusVariant;
  fine: number;
  fineFormatted: string;
}

export function mapIssuesToRows(
  issues: BookIssue[],
  books: Book[],
  members: LibraryMember[],
  students: Student[],
  teachers: Teacher[],
  employees: Employee[],
  locale = "en"
): IssueReturnRow[] {
  const bookMap = new Map(books.map((b) => [b.id, b]));
  const memberMap = new Map(members.map((m) => [m.id, m]));
  const studentMap = new Map(students.map((s) => [s.id, s]));
  const teacherMap = new Map(teachers.map((t) => [t.id, t]));
  const employeeMap = new Map(employees.map((e) => [e.id, e]));

  return issues.map((issue) => {
    const book = bookMap.get(issue.bookId);
    const member = memberMap.get(issue.memberId);
    let memberName = "—";
    if (member) {
      if (member.memberType === "student") {
        const s = studentMap.get(member.entityId);
        if (s) memberName = `${s.firstName} ${s.lastName}`;
      } else if (member.memberType === "teacher") {
        const t = teacherMap.get(member.entityId);
        if (t) memberName = `${t.firstName} ${t.lastName}`;
      } else if (member.memberType === "employee") {
        const e = employeeMap.get(member.entityId);
        if (e) memberName = `${e.firstName} ${e.lastName}`;
      }
    }

    const fine = issue.fine ?? 0;

    return {
      id: issue.id,
      bookId: issue.bookId,
      bookTitle: book?.title ?? "—",
      bookIsbn: book?.isbn ?? "—",
      memberId: issue.memberId,
      memberName,
      memberType: member?.memberType ?? "—",
      memberTypeLabel: memberTypeLabel(member?.memberType),
      issueDate: formatShortDate(issue.issueDate, locale),
      dueDate: formatShortDate(issue.dueDate, locale),
      returnDate: issue.returnDate ? formatShortDate(issue.returnDate, locale) : "—",
      status: issue.status,
      statusLabel: issueStatusLabel(issue.status),
      statusVariant: issueStatusToVariant(issue.status),
      fine,
      fineFormatted: fine > 0 ? `${fine}` : "—",
    };
  });
}

// ─── Member row ───────────────────────────────────────────────────────────────

export interface MemberRow {
  id: string;
  entityId: string;
  memberName: string;
  memberInitials: string;
  membershipNumber: string;
  memberType: string;
  memberTypeLabel: string;
  booksIssued: number;
  activeIssues: number;
  totalBorrowed: number;
  maxBooksAllowed: number;
  joinedDate: string;
  joinedDateRaw: string;
  status: string;
  statusVariant: StatusVariant;
}

export function mapMembersToRows(
  members: LibraryMember[],
  issues: BookIssue[],
  students: Student[],
  teachers: Teacher[],
  employees: Employee[],
  locale = "en"
): MemberRow[] {
  const studentMap = new Map(students.map((s) => [s.id, s]));
  const teacherMap = new Map(teachers.map((t) => [t.id, t]));
  const employeeMap = new Map(employees.map((e) => [e.id, e]));

  // Count active issues and total borrowed per member
  const activeIssueCount = new Map<string, number>();
  const totalBorrowedCount = new Map<string, number>();
  for (const issue of issues) {
    totalBorrowedCount.set(issue.memberId, (totalBorrowedCount.get(issue.memberId) ?? 0) + 1);
    if (issue.status === "issued" || issue.status === "overdue") {
      activeIssueCount.set(issue.memberId, (activeIssueCount.get(issue.memberId) ?? 0) + 1);
    }
  }

  return members.map((m) => {
    let memberName = "—";
    let memberInitials = "?";
    if (m.memberType === "student") {
      const s = studentMap.get(m.entityId);
      if (s) {
        memberName = `${s.firstName} ${s.lastName}`;
        memberInitials = `${s.firstName[0]}${s.lastName[0]}`.toUpperCase();
      }
    } else if (m.memberType === "teacher") {
      const t = teacherMap.get(m.entityId);
      if (t) {
        memberName = `${t.firstName} ${t.lastName}`;
        memberInitials = `${t.firstName[0]}${t.lastName[0]}`.toUpperCase();
      }
    } else if (m.memberType === "employee") {
      const e = employeeMap.get(m.entityId);
      if (e) {
        memberName = `${e.firstName} ${e.lastName}`;
        memberInitials = `${e.firstName[0]}${e.lastName[0]}`.toUpperCase();
      }
    }

    return {
      id: m.id,
      entityId: m.entityId,
      memberName,
      memberInitials,
      membershipNumber: m.membershipId,
      memberType: m.memberType,
      memberTypeLabel: memberTypeLabel(m.memberType),
      booksIssued: activeIssueCount.get(m.id) ?? 0,
      activeIssues: activeIssueCount.get(m.id) ?? 0,
      totalBorrowed: totalBorrowedCount.get(m.id) ?? 0,
      maxBooksAllowed: m.maxBooksAllowed ?? 5,
      joinedDate: formatShortDate(m.registeredAt, locale),
      joinedDateRaw: m.registeredAt,
      status: m.status,
      statusVariant: memberStatusToVariant(m.status),
    };
  });
}

// ─── Member detail types ──────────────────────────────────────────────────────

export interface MemberDetailCurrentIssue {
  id: string;
  bookTitle: string;
  bookIsbn: string;
  issueDate: string;
  dueDate: string;
  status: string;
  statusVariant: StatusVariant;
  isOverdue: boolean;
}

export interface MemberDetailHistoryEntry {
  id: string;
  bookTitle: string;
  bookIsbn: string;
  issueDate: string;
  dueDate: string;
  returnDate: string | undefined;
  status: string;
  statusVariant: StatusVariant;
  fine: number;
  fineFormatted: string;
}

export function mapMemberCurrentIssues(
  issues: BookIssue[],
  books: Book[],
  locale = "en"
): MemberDetailCurrentIssue[] {
  const bookMap = new Map(books.map((b) => [b.id, b]));
  return issues
    .filter((i) => i.status === "issued" || i.status === "overdue")
    .map((i) => {
      const book = bookMap.get(i.bookId);
      return {
        id: i.id,
        bookTitle: book?.title ?? "—",
        bookIsbn: book?.isbn ?? "—",
        issueDate: formatShortDate(i.issueDate, locale),
        dueDate: formatShortDate(i.dueDate, locale),
        status: i.status,
        statusVariant: issueStatusToVariant(i.status),
        isOverdue: i.status === "overdue",
      };
    });
}

export function mapMemberHistory(
  issues: BookIssue[],
  books: Book[],
  locale = "en"
): MemberDetailHistoryEntry[] {
  const bookMap = new Map(books.map((b) => [b.id, b]));
  return issues
    .filter((i) => i.status === "returned" || i.status === "lost")
    .map((i) => {
      const book = bookMap.get(i.bookId);
      const fine = i.fine ?? 0;
      return {
        id: i.id,
        bookTitle: book?.title ?? "—",
        bookIsbn: book?.isbn ?? "—",
        issueDate: formatShortDate(i.issueDate, locale),
        dueDate: formatShortDate(i.dueDate, locale),
        returnDate: i.returnDate ? formatShortDate(i.returnDate, locale) : undefined,
        status: i.status,
        statusVariant: issueStatusToVariant(i.status),
        fine,
        fineFormatted: formatCurrency(fine, "USD", locale),
      };
    });
}
