import { describe, it, expect } from "vitest";
import {
  studentFormSchema,
  studentCategorySchema,
  studentAttendanceFilterSchema,
} from "@/lib/validations/students";

// ─── studentFormSchema ─────────────────────────────────────────────────────────

describe("studentFormSchema", () => {
  const validStudent = {
    firstName: "Ahmed",
    lastName: "Al-Rashidi",
    admissionNumber: "AN2024001",
    rollNumber: "R001",
    gender: "male" as const,
    dateOfBirth: "2010-05-15",
    classId: "class-001",
    sectionId: "section-001",
    admissionDate: "2024-01-01",
    status: "active" as const,
  };

  it("accepts a valid student payload", () => {
    const result = studentFormSchema.safeParse(validStudent);
    expect(result.success).toBe(true);
  });

  it("rejects missing firstName", () => {
    const result = studentFormSchema.safeParse({
      ...validStudent,
      firstName: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects firstName shorter than 2 characters", () => {
    const result = studentFormSchema.safeParse({
      ...validStudent,
      firstName: "A",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing admissionNumber", () => {
    const result = studentFormSchema.safeParse({
      ...validStudent,
      admissionNumber: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid gender value", () => {
    const result = studentFormSchema.safeParse({
      ...validStudent,
      gender: "unknown",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid status value", () => {
    const result = studentFormSchema.safeParse({
      ...validStudent,
      status: "expelled",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email format", () => {
    const result = studentFormSchema.safeParse({
      ...validStudent,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("accepts empty string for optional email", () => {
    const result = studentFormSchema.safeParse({
      ...validStudent,
      email: "",
    });
    expect(result.success).toBe(true);
  });

  it("accepts all valid statuses", () => {
    const statuses = ["active", "inactive", "suspended", "graduated", "transferred"] as const;
    for (const status of statuses) {
      const result = studentFormSchema.safeParse({ ...validStudent, status });
      expect(result.success).toBe(true);
    }
  });

  it("accepts all valid gender values", () => {
    const genders = ["male", "female", "other"] as const;
    for (const gender of genders) {
      const result = studentFormSchema.safeParse({ ...validStudent, gender });
      expect(result.success).toBe(true);
    }
  });
});

// ─── studentCategorySchema ─────────────────────────────────────────────────────

describe("studentCategorySchema", () => {
  it("accepts a valid category", () => {
    const result = studentCategorySchema.safeParse({
      name: "General",
      description: "General students",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a category without description", () => {
    const result = studentCategorySchema.safeParse({ name: "SC" });
    expect(result.success).toBe(true);
  });

  it("rejects name shorter than 2 characters", () => {
    const result = studentCategorySchema.safeParse({ name: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    const result = studentCategorySchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });
});

// ─── studentAttendanceFilterSchema ────────────────────────────────────────────

describe("studentAttendanceFilterSchema", () => {
  it("accepts an empty object", () => {
    const result = studentAttendanceFilterSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts all optional fields filled", () => {
    const result = studentAttendanceFilterSchema.safeParse({
      classId: "class-001",
      sectionId: "section-001",
      date: "2024-01-15",
      status: "present",
    });
    expect(result.success).toBe(true);
  });
});
