// Library feature — utility functions for form options

import type { MemberType } from "@/types/library";

// ─── Book categories ──────────────────────────────────────────────────────────
export const BOOK_CATEGORY_OPTIONS = [
  { label: "Mathematics", value: "Mathematics" },
  { label: "English", value: "English" },
  { label: "Physics", value: "Physics" },
  { label: "Chemistry", value: "Chemistry" },
  { label: "Biology", value: "Biology" },
  { label: "Computer Science", value: "Computer Science" },
  { label: "Islamic Studies", value: "Islamic Studies" },
  { label: "Social Studies", value: "Social Studies" },
  { label: "History", value: "History" },
  { label: "Geography", value: "Geography" },
  { label: "Fiction", value: "Fiction" },
  { label: "Non-Fiction", value: "Non-Fiction" },
  { label: "Reference", value: "Reference" },
  { label: "Science", value: "Science" },
  { label: "Arts", value: "Arts" },
  { label: "Other", value: "Other" },
] as const;

// ─── Languages ────────────────────────────────────────────────────────────────
export const LANGUAGE_OPTIONS = [
  { label: "English", value: "English" },
  { label: "Urdu", value: "Urdu" },
  { label: "Arabic", value: "Arabic" },
  { label: "French", value: "French" },
  { label: "German", value: "German" },
  { label: "Other", value: "Other" },
] as const;

// ─── Book status ──────────────────────────────────────────────────────────────
export const BOOK_STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
] as const;

// ─── Issue status ─────────────────────────────────────────────────────────────
export const ISSUE_STATUS_OPTIONS = [
  { label: "Issued", value: "issued" },
  { label: "Returned", value: "returned" },
  { label: "Overdue", value: "overdue" },
  { label: "Lost", value: "lost" },
] as const;

// ─── Member type ──────────────────────────────────────────────────────────────
export const MEMBER_TYPE_OPTIONS: { label: string; value: MemberType }[] = [
  { label: "Student", value: "student" },
  { label: "Teacher", value: "teacher" },
  { label: "Employee", value: "employee" },
];

// ─── Member status ────────────────────────────────────────────────────────────
export const MEMBER_STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
] as const;

// ─── Condition options ────────────────────────────────────────────────────────
export const CONDITION_OPTIONS = [
  { label: "Good", value: "good" },
  { label: "Damaged", value: "damaged" },
  { label: "Lost", value: "lost" },
] as const;
