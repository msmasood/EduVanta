import { z } from "zod";

const CURRENT_YEAR = new Date().getFullYear();

// ─── Book Form Schema ─────────────────────────────────────────────────────────

export const bookFormSchema = z
  .object({
    title: z.string().min(2, { message: "Title must be at least 2 characters." }),
    isbn: z.string().min(1, { message: "ISBN is required." }),
    author: z.string().min(2, { message: "Author must be at least 2 characters." }),
    publisher: z.string().optional(),
    category: z.string().min(1, { message: "Category is required." }),
    language: z.string().min(1, { message: "Language is required." }),
    edition: z.string().optional(),
    publishedYear: z
      .number()
      .min(1000, { message: "Invalid year." })
      .max(CURRENT_YEAR + 1, { message: "Year cannot be in the future." })
      .optional(),
    totalCopies: z
      .number({ message: "Total copies is required." })
      .min(0, { message: "Total copies must be 0 or more." }),
    availableCopies: z
      .number({ message: "Available copies is required." })
      .min(0, { message: "Available copies must be 0 or more." }),
    shelfLocation: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(["active", "inactive"] as const, {
      message: "Status is required.",
    }),
  })
  .refine((data) => data.availableCopies <= data.totalCopies, {
    message: "Available copies cannot exceed total copies.",
    path: ["availableCopies"],
  });

export type BookFormValues = z.infer<typeof bookFormSchema>;

// ─── Issue Book Form Schema ───────────────────────────────────────────────────

export const issueBookFormSchema = z
  .object({
    bookId: z.string().min(1, { message: "Book is required." }),
    memberId: z.string().min(1, { message: "Member is required." }),
    issueDate: z.string().min(1, { message: "Issue date is required." }),
    dueDate: z.string().min(1, { message: "Due date is required." }),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.issueDate && data.dueDate) {
        return new Date(data.dueDate) >= new Date(data.issueDate);
      }
      return true;
    },
    {
      message: "Due date must be on or after the issue date.",
      path: ["dueDate"],
    }
  );

export type IssueBookFormValues = z.infer<typeof issueBookFormSchema>;

// ─── Return Book Form Schema ──────────────────────────────────────────────────

export const returnBookFormSchema = z.object({
  issueId: z.string().min(1, { message: "Issue record is required." }),
  returnDate: z.string().min(1, { message: "Return date is required." }),
  condition: z.enum(["good", "damaged", "lost"] as const, {
    message: "Condition is required.",
  }),
  fineAmount: z
    .number()
    .min(0, { message: "Fine amount must be 0 or more." })
    .optional(),
  notes: z.string().optional(),
});

export type ReturnBookFormValues = z.infer<typeof returnBookFormSchema>;

// ─── Library Member Form Schema ───────────────────────────────────────────────

export const libraryMemberFormSchema = z.object({
  memberType: z.enum(["student", "teacher", "employee"] as const, {
    message: "Member type is required.",
  }),
  linkedEntityId: z.string().min(1, { message: "Linked entity is required." }),
  membershipNumber: z.string().min(1, { message: "Membership number is required." }),
  joinedDate: z.string().min(1, { message: "Joined date is required." }),
  maxBooksAllowed: z
    .number({ message: "Max books allowed is required." })
    .min(0, { message: "Must be 0 or more." }),
  status: z.enum(["active", "inactive"] as const, {
    message: "Status is required.",
  }),
  notes: z.string().optional(),
});

export type LibraryMemberFormValues = z.infer<typeof libraryMemberFormSchema>;

// ─── Library Filter Schema ────────────────────────────────────────────────────

export const libraryFilterSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  category: z.string().optional(),
  language: z.string().optional(),
  memberType: z.string().optional(),
});

export type LibraryFilterValues = z.infer<typeof libraryFilterSchema>;
