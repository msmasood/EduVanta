import { describe, it, expect } from "vitest";
import {
  bookFormSchema,
  issueBookFormSchema,
  returnBookFormSchema,
  libraryMemberFormSchema,
} from "@/lib/validations/library";

// ─── bookFormSchema ────────────────────────────────────────────────────────────

describe("bookFormSchema", () => {
  const validBook = {
    title: "Clean Code",
    isbn: "978-0132350884",
    author: "Robert C. Martin",
    category: "Technology",
    language: "English",
    totalCopies: 5,
    availableCopies: 3,
    status: "active" as const,
  };

  it("accepts a valid book payload", () => {
    expect(bookFormSchema.safeParse(validBook).success).toBe(true);
  });

  it("rejects title shorter than 2 characters", () => {
    expect(bookFormSchema.safeParse({ ...validBook, title: "A" }).success).toBe(false);
  });

  it("rejects missing isbn", () => {
    expect(bookFormSchema.safeParse({ ...validBook, isbn: "" }).success).toBe(false);
  });

  it("rejects author shorter than 2 characters", () => {
    expect(bookFormSchema.safeParse({ ...validBook, author: "X" }).success).toBe(false);
  });

  it("rejects negative totalCopies", () => {
    expect(bookFormSchema.safeParse({ ...validBook, totalCopies: -1 }).success).toBe(false);
  });

  it("rejects availableCopies exceeding totalCopies", () => {
    expect(
      bookFormSchema.safeParse({ ...validBook, totalCopies: 2, availableCopies: 5 }).success
    ).toBe(false);
  });

  it("accepts availableCopies equal to totalCopies", () => {
    expect(
      bookFormSchema.safeParse({ ...validBook, totalCopies: 3, availableCopies: 3 }).success
    ).toBe(true);
  });

  it("rejects invalid status", () => {
    expect(bookFormSchema.safeParse({ ...validBook, status: "archived" }).success).toBe(false);
  });
});

// ─── issueBookFormSchema ───────────────────────────────────────────────────────

describe("issueBookFormSchema", () => {
  const validIssue = {
    bookId: "book-001",
    memberId: "library-member-001",
    issueDate: "2025-01-01",
    dueDate: "2025-01-15",
  };

  it("accepts a valid issue payload", () => {
    expect(issueBookFormSchema.safeParse(validIssue).success).toBe(true);
  });

  it("rejects missing bookId", () => {
    expect(issueBookFormSchema.safeParse({ ...validIssue, bookId: "" }).success).toBe(false);
  });

  it("rejects missing memberId", () => {
    expect(issueBookFormSchema.safeParse({ ...validIssue, memberId: "" }).success).toBe(false);
  });

  it("rejects dueDate before issueDate", () => {
    expect(
      issueBookFormSchema.safeParse({
        ...validIssue,
        issueDate: "2025-01-10",
        dueDate: "2025-01-05",
      }).success
    ).toBe(false);
  });

  it("accepts dueDate equal to issueDate", () => {
    expect(
      issueBookFormSchema.safeParse({
        ...validIssue,
        issueDate: "2025-01-10",
        dueDate: "2025-01-10",
      }).success
    ).toBe(true);
  });
});

// ─── returnBookFormSchema ──────────────────────────────────────────────────────

describe("returnBookFormSchema", () => {
  const validReturn = {
    issueId: "bi-001",
    returnDate: "2025-01-15",
    condition: "good" as const,
  };

  it("accepts a valid return payload", () => {
    expect(returnBookFormSchema.safeParse(validReturn).success).toBe(true);
  });

  it("rejects missing issueId", () => {
    expect(returnBookFormSchema.safeParse({ ...validReturn, issueId: "" }).success).toBe(false);
  });

  it("rejects invalid condition", () => {
    expect(
      returnBookFormSchema.safeParse({ ...validReturn, condition: "worn" }).success
    ).toBe(false);
  });

  it("accepts optional fineAmount", () => {
    expect(returnBookFormSchema.safeParse({ ...validReturn, fineAmount: 50 }).success).toBe(true);
  });

  it("rejects negative fineAmount", () => {
    expect(returnBookFormSchema.safeParse({ ...validReturn, fineAmount: -10 }).success).toBe(false);
  });
});

// ─── libraryMemberFormSchema ───────────────────────────────────────────────────

describe("libraryMemberFormSchema", () => {
  const validMember = {
    memberType: "student" as const,
    linkedEntityId: "student-001",
    membershipNumber: "LIB-S-001",
    joinedDate: "2024-01-01",
    maxBooksAllowed: 3,
    status: "active" as const,
  };

  it("accepts a valid member payload", () => {
    expect(libraryMemberFormSchema.safeParse(validMember).success).toBe(true);
  });

  it("rejects missing linkedEntityId", () => {
    expect(
      libraryMemberFormSchema.safeParse({ ...validMember, linkedEntityId: "" }).success
    ).toBe(false);
  });

  it("rejects invalid memberType", () => {
    expect(
      libraryMemberFormSchema.safeParse({ ...validMember, memberType: "parent" }).success
    ).toBe(false);
  });

  it("rejects negative maxBooksAllowed", () => {
    expect(
      libraryMemberFormSchema.safeParse({ ...validMember, maxBooksAllowed: -1 }).success
    ).toBe(false);
  });

  it("accepts teacher as memberType", () => {
    expect(
      libraryMemberFormSchema.safeParse({ ...validMember, memberType: "teacher" }).success
    ).toBe(true);
  });
});
