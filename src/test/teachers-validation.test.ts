import { describe, it, expect } from "vitest";
import {
  teacherFormSchema,
  teacherAttendanceFilterSchema,
  teacherTimetableFilterSchema,
} from "@/lib/validations/teachers";

// ─── teacherFormSchema ─────────────────────────────────────────────────────────

describe("teacherFormSchema", () => {
  const validTeacher = {
    firstName: "Amina",
    lastName: "Bukhari",
    teacherCode: "TC001",
    gender: "female" as const,
    dateOfBirth: "1985-03-15",
    departmentId: "dept-001",
    designation: "Senior Teacher",
    qualification: "M.Ed",
    experienceYears: 10,
    joiningDate: "2018-01-01",
    employmentStatus: "active" as const,
    subjectsAssigned: ["sub-001"],
    email: "amina@school.edu",
    phone: "+923001234567",
    alternatePhone: "",
    addressLine1: "123 Main St",
    city: "Karachi",
    emergencyContactName: "Ahmed Bukhari",
    emergencyContactPhone: "+923001234568",
    notes: "",
  };

  it("accepts a valid teacher payload", () => {
    const result = teacherFormSchema.safeParse(validTeacher);
    expect(result.success).toBe(true);
  });

  it("rejects missing firstName", () => {
    const result = teacherFormSchema.safeParse({ ...validTeacher, firstName: "" });
    expect(result.success).toBe(false);
  });

  it("rejects firstName shorter than 2 characters", () => {
    const result = teacherFormSchema.safeParse({ ...validTeacher, firstName: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects missing lastName", () => {
    const result = teacherFormSchema.safeParse({ ...validTeacher, lastName: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing teacherCode", () => {
    const result = teacherFormSchema.safeParse({ ...validTeacher, teacherCode: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = teacherFormSchema.safeParse({ ...validTeacher, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects phone shorter than 7 characters", () => {
    const result = teacherFormSchema.safeParse({ ...validTeacher, phone: "12345" });
    expect(result.success).toBe(false);
  });

  it("rejects missing qualification", () => {
    const result = teacherFormSchema.safeParse({ ...validTeacher, qualification: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing joiningDate", () => {
    const result = teacherFormSchema.safeParse({ ...validTeacher, joiningDate: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing departmentId", () => {
    const result = teacherFormSchema.safeParse({ ...validTeacher, departmentId: "" });
    expect(result.success).toBe(false);
  });

  it("accepts on-leave status", () => {
    const result = teacherFormSchema.safeParse({ ...validTeacher, employmentStatus: "on-leave" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid gender value", () => {
    const result = teacherFormSchema.safeParse({ ...validTeacher, gender: "robot" as "male" });
    expect(result.success).toBe(false);
  });
});

// ─── teacherAttendanceFilterSchema ──────────────────────────────────────────

describe("teacherAttendanceFilterSchema", () => {
  it("accepts valid filter payload", () => {
    const result = teacherAttendanceFilterSchema.safeParse({
      date: "2024-01-15",
      status: "present",
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty filter payload", () => {
    const result = teacherAttendanceFilterSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

// ─── teacherTimetableFilterSchema ───────────────────────────────────────────

describe("teacherTimetableFilterSchema", () => {
  it("accepts valid filter payload", () => {
    const result = teacherTimetableFilterSchema.safeParse({
      day: "monday",
      subjectId: "sub-001",
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty filter payload", () => {
    const result = teacherTimetableFilterSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});
