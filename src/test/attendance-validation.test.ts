import { describe, it, expect } from "vitest";
import {
  attendanceFilterSchema,
  attendanceUpdateSchema,
  attendanceBulkUpdateSchema,
  attendanceNotesSchema,
} from "@/lib/validations/attendance";

// ─── attendanceFilterSchema ───────────────────────────────────────────────────

describe("attendanceFilterSchema", () => {
  it("accepts valid entity type", () => {
    expect(
      attendanceFilterSchema.safeParse({ entityType: "student" }).success
    ).toBe(true);
  });

  it("rejects missing entity type", () => {
    expect(attendanceFilterSchema.safeParse({}).success).toBe(false);
  });

  it("rejects invalid entity type", () => {
    expect(
      attendanceFilterSchema.safeParse({ entityType: "guardian" }).success
    ).toBe(false);
  });

  it("accepts optional filters", () => {
    expect(
      attendanceFilterSchema.safeParse({
        entityType: "teacher",
        status: "present",
        date: "2024-10-01",
        departmentId: "dept-001",
      }).success
    ).toBe(true);
  });

  it("rejects invalid status", () => {
    expect(
      attendanceFilterSchema.safeParse({
        entityType: "student",
        status: "on-leave",
      }).success
    ).toBe(false);
  });
});

// ─── attendanceUpdateSchema ───────────────────────────────────────────────────

describe("attendanceUpdateSchema", () => {
  const valid = { recordId: "att-001", status: "present" as const };

  it("accepts valid update", () => {
    expect(attendanceUpdateSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects empty recordId", () => {
    expect(
      attendanceUpdateSchema.safeParse({ ...valid, recordId: "" }).success
    ).toBe(false);
  });

  it("rejects invalid status", () => {
    expect(
      attendanceUpdateSchema.safeParse({ ...valid, status: "unknown" }).success
    ).toBe(false);
  });

  it("accepts optional fields", () => {
    expect(
      attendanceUpdateSchema.safeParse({
        ...valid,
        checkInTime: "08:00",
        checkOutTime: "14:00",
        notes: "Left early.",
      }).success
    ).toBe(true);
  });

  it("rejects notes exceeding 500 chars", () => {
    expect(
      attendanceUpdateSchema.safeParse({
        ...valid,
        notes: "x".repeat(501),
      }).success
    ).toBe(false);
  });
});

// ─── attendanceBulkUpdateSchema ───────────────────────────────────────────────

describe("attendanceBulkUpdateSchema", () => {
  it("accepts valid bulk update", () => {
    expect(
      attendanceBulkUpdateSchema.safeParse({
        recordIds: ["att-001", "att-002"],
        status: "absent",
      }).success
    ).toBe(true);
  });

  it("rejects empty recordIds array", () => {
    expect(
      attendanceBulkUpdateSchema.safeParse({ recordIds: [], status: "present" }).success
    ).toBe(false);
  });

  it("rejects missing status", () => {
    expect(
      attendanceBulkUpdateSchema.safeParse({ recordIds: ["att-001"] }).success
    ).toBe(false);
  });
});

// ─── attendanceNotesSchema ────────────────────────────────────────────────────

describe("attendanceNotesSchema", () => {
  it("accepts valid notes", () => {
    expect(
      attendanceNotesSchema.safeParse({
        recordId: "att-001",
        notes: "Student was late due to traffic.",
      }).success
    ).toBe(true);
  });

  it("rejects empty recordId", () => {
    expect(
      attendanceNotesSchema.safeParse({ recordId: "", notes: "Note" }).success
    ).toBe(false);
  });

  it("rejects empty notes", () => {
    expect(
      attendanceNotesSchema.safeParse({ recordId: "att-001", notes: "" }).success
    ).toBe(false);
  });

  it("rejects notes over 500 chars", () => {
    expect(
      attendanceNotesSchema.safeParse({
        recordId: "att-001",
        notes: "x".repeat(501),
      }).success
    ).toBe(false);
  });
});
