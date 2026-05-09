import { describe, it, expect } from "vitest";
import {
  bookStatusToVariant,
  issueStatusToVariant,
  memberStatusToVariant,
  issueStatusLabel,
  memberTypeLabel,
  mapBooksToRows,
  mapMembersToRows,
  mapIssuesToRows,
  mapMemberCurrentIssues,
  mapMemberHistory,
} from "@/features/library/utils/library-mappers";
import type { Book, LibraryMember, BookIssue } from "@/types/library";
import type { Student } from "@/types/student";
import type { Teacher } from "@/types/teacher";
import type { Employee } from "@/types/employee";

// ─── Test fixtures ─────────────────────────────────────────────────────────────

const mockBook: Book = {
  id: "book-001",
  schoolId: "school-001",
  title: "Clean Code",
  author: "Robert C. Martin",
  isbn: "978-0132350884",
  subject: "Technology",
  publisher: "Prentice Hall",
  totalCopies: 5,
  availableCopies: 3,
  rackNumber: "A1",
  status: "active",
  audit: { createdAt: "2024-01-01", updatedAt: "2024-01-01", createdBy: "admin", updatedBy: "admin" },
};

const mockMember: LibraryMember = {
  id: "library-member-001",
  schoolId: "school-001",
  memberType: "student",
  entityId: "student-001",
  membershipId: "LIB-S-001",
  status: "active",
  registeredAt: "2024-01-15",
  maxBooksAllowed: 3,
  audit: { createdAt: "2024-01-15", updatedAt: "2024-01-15", createdBy: "admin", updatedBy: "admin" },
};

const mockIssue: BookIssue = {
  id: "bi-001",
  schoolId: "school-001",
  bookId: "book-001",
  memberId: "library-member-001",
  issueDate: "2025-01-01",
  dueDate: "2025-01-15",
  returnDate: "2025-01-14",
  status: "returned",
  fine: 0,
  audit: { createdAt: "2025-01-01", updatedAt: "2025-01-14", createdBy: "admin", updatedBy: "admin" },
};

const mockStudent: Student = {
  id: "student-001",
  schoolId: "school-001",
  admissionNumber: "ADM-001",
  firstName: "Ali",
  lastName: "Khan",
  dateOfBirth: "2008-05-10",
  gender: "male",
  categoryId: "cat-001",
  classId: "class-001",
  sectionId: "sec-001",
  rollNumber: "1",
  address: { line1: "123 Main", line2: "", city: "Karachi", state: "Sindh", country: "Pakistan", postalCode: "75000" },
  contact: { email: "ali@school.edu", phone: "+923001234567", alternatePhone: "" },
  guardianId: "guardian-001",
  nationality: "Pakistani",
  status: "active",
  admissionDate: "2020-01-01",
  defaultCurrency: "PKR",
  audit: { createdAt: "2020-01-01", updatedAt: "2024-01-01", createdBy: "admin", updatedBy: "admin" },
};

const noTeachers: Teacher[] = [];
const noEmployees: Employee[] = [];

// ─── Status mappings ───────────────────────────────────────────────────────────

describe("bookStatusToVariant", () => {
  it("active → active", () => expect(bookStatusToVariant("active")).toBe("active"));
  it("inactive → inactive", () => expect(bookStatusToVariant("inactive")).toBe("inactive"));
  it("undefined → active", () => expect(bookStatusToVariant(undefined)).toBe("active"));
});

describe("issueStatusToVariant", () => {
  it("issued → info", () => expect(issueStatusToVariant("issued")).toBe("info"));
  it("returned → active", () => expect(issueStatusToVariant("returned")).toBe("active"));
  it("overdue → overdue", () => expect(issueStatusToVariant("overdue")).toBe("overdue"));
  it("lost → destructive", () => expect(issueStatusToVariant("lost")).toBe("destructive"));
  it("unknown → neutral", () => expect(issueStatusToVariant("unknown")).toBe("neutral"));
});

describe("memberStatusToVariant", () => {
  it("active → active", () => expect(memberStatusToVariant("active")).toBe("active"));
  it("inactive → inactive", () => expect(memberStatusToVariant("inactive")).toBe("inactive"));
});

describe("issueStatusLabel", () => {
  it("issued → Issued", () => expect(issueStatusLabel("issued")).toBe("Issued"));
  it("returned → Returned", () => expect(issueStatusLabel("returned")).toBe("Returned"));
  it("overdue → Overdue", () => expect(issueStatusLabel("overdue")).toBe("Overdue"));
  it("lost → Lost", () => expect(issueStatusLabel("lost")).toBe("Lost"));
});

describe("memberTypeLabel", () => {
  it("student → Student", () => expect(memberTypeLabel("student")).toBe("Student"));
  it("teacher → Teacher", () => expect(memberTypeLabel("teacher")).toBe("Teacher"));
  it("employee → Employee", () => expect(memberTypeLabel("employee")).toBe("Employee"));
});

// ─── mapBooksToRows ────────────────────────────────────────────────────────────

describe("mapBooksToRows", () => {
  it("maps a book to a row", () => {
    const rows = mapBooksToRows([mockBook]);
    expect(rows).toHaveLength(1);
    const row = rows[0];
    expect(row.id).toBe("book-001");
    expect(row.title).toBe("Clean Code");
    expect(row.author).toBe("Robert C. Martin");
    expect(row.totalCopies).toBe(5);
    expect(row.availableCopies).toBe(3);
    expect(row.issuedCopies).toBe(2);
    expect(row.statusVariant).toBe("active");
  });

  it("returns empty array for no books", () => {
    expect(mapBooksToRows([])).toHaveLength(0);
  });
});

// ─── mapMembersToRows ──────────────────────────────────────────────────────────

describe("mapMembersToRows", () => {
  it("maps a student member to a row", () => {
    const rows = mapMembersToRows([mockMember], [mockIssue], [mockStudent], noTeachers, noEmployees, "en");
    expect(rows).toHaveLength(1);
    const row = rows[0];
    expect(row.id).toBe("library-member-001");
    expect(row.memberName).toBe("Ali Khan");
    expect(row.memberType).toBe("student");
    expect(row.membershipNumber).toBe("LIB-S-001");
    expect(row.totalBorrowed).toBe(1);
    expect(row.activeIssues).toBe(0); // returned issue doesn't count
  });

  it("shows memberName as — for unknown entity", () => {
    const rows = mapMembersToRows([mockMember], [], [], noTeachers, noEmployees, "en");
    expect(rows[0].memberName).toBe("—");
  });
});

// ─── mapIssuesToRows ───────────────────────────────────────────────────────────

describe("mapIssuesToRows", () => {
  it("maps an issue to a row", () => {
    const rows = mapIssuesToRows([mockIssue], [mockBook], [mockMember], [mockStudent], noTeachers, noEmployees, "en");
    expect(rows).toHaveLength(1);
    const row = rows[0];
    expect(row.bookTitle).toBe("Clean Code");
    expect(row.memberName).toBe("Ali Khan");
    expect(row.status).toBe("returned");
    expect(row.fine).toBe(0);
  });

  it("returns empty array for no issues", () => {
    expect(mapIssuesToRows([], [mockBook], [mockMember], [mockStudent], noTeachers, noEmployees, "en")).toHaveLength(0);
  });
});

// ─── mapMemberCurrentIssues ────────────────────────────────────────────────────

describe("mapMemberCurrentIssues", () => {
  const activeIssue: BookIssue = { ...mockIssue, id: "bi-002", status: "issued", returnDate: undefined, fine: 0 };
  const overdueIssue: BookIssue = { ...mockIssue, id: "bi-003", status: "overdue", returnDate: undefined, fine: 25 };

  it("includes only issued and overdue records", () => {
    const result = mapMemberCurrentIssues([mockIssue, activeIssue, overdueIssue], [mockBook], "en");
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.status)).toEqual(expect.arrayContaining(["issued", "overdue"]));
  });

  it("marks overdue issues with isOverdue flag", () => {
    const result = mapMemberCurrentIssues([overdueIssue], [mockBook], "en");
    expect(result[0].isOverdue).toBe(true);
  });
});

// ─── mapMemberHistory ──────────────────────────────────────────────────────────

describe("mapMemberHistory", () => {
  it("includes only returned and lost records", () => {
    const lostIssue: BookIssue = { ...mockIssue, id: "bi-004", status: "lost", returnDate: undefined, fine: 100 };
    const result = mapMemberHistory([mockIssue, lostIssue], [mockBook], "en");
    expect(result).toHaveLength(2);
  });

  it("excludes active and overdue records", () => {
    const activeIssue: BookIssue = { ...mockIssue, id: "bi-005", status: "issued", returnDate: undefined };
    const result = mapMemberHistory([activeIssue], [mockBook], "en");
    expect(result).toHaveLength(0);
  });
});
