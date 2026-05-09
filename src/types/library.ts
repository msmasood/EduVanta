import type { ID, ActiveStatus, AuditMeta } from "./common";

// ─── Book ─────────────────────────────────────────────────────────────────────

export interface Book {
  id: ID;
  schoolId: ID;
  title: string;
  author: string;
  isbn?: string;
  subject?: string;
  publisher?: string;
  publishYear?: number;
  edition?: string;
  totalCopies: number;
  availableCopies: number;
  rackNumber?: string;
  status: ActiveStatus;
  coverImageUrl?: string;
  audit: AuditMeta;
}

// ─── Library member ───────────────────────────────────────────────────────────

export type MemberType = "student" | "teacher" | "employee";

export interface LibraryMember {
  id: ID;
  schoolId: ID;
  memberType: MemberType;
  entityId: ID;
  membershipId: string;
  status: ActiveStatus;
  registeredAt: string;
  maxBooksAllowed?: number;
  notes?: string;
  audit: AuditMeta;
}

// ─── Book issue ───────────────────────────────────────────────────────────────

export type BookIssueStatus = "issued" | "returned" | "overdue" | "lost";

export interface BookIssue {
  id: ID;
  schoolId: ID;
  bookId: ID;
  memberId: ID;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: BookIssueStatus;
  fine?: number;
  audit: AuditMeta;
}
