import { describe, it, expect } from "vitest";
import {
  employeeFormSchema,
  leaveRequestSchema as leaveRequestFormSchema,
  leaveTypeSchema as leaveTypeFormSchema,
} from "@/lib/validations/employees";

// ─── Valid base data ──────────────────────────────────────────────────────────

const validEmployee = {
  firstName: "Hassan",
  lastName: "Malik",
  employeeCode: "EMP-006",
  gender: "male" as const,
  dateOfBirth: "1990-01-15",
  departmentId: "dept-001",
  designationId: "des-001",
  employmentType: "full-time" as const,
  status: "active" as const,
  joiningDate: "2022-06-01",
  qualification: "BSc Computer Science",
  workEmail: "hassan@school.edu",
  phone: "+923001234567",
  baseSalary: 58000,
  currency: "PKR",
};

// ─── employeeFormSchema ───────────────────────────────────────────────────────

describe("employeeFormSchema", () => {
  it("accepts a valid employee form", () => {
    const result = employeeFormSchema.safeParse(validEmployee);
    expect(result.success).toBe(true);
  });

  it("rejects missing firstName", () => {
    const result = employeeFormSchema.safeParse({ ...validEmployee, firstName: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing lastName", () => {
    const result = employeeFormSchema.safeParse({ ...validEmployee, lastName: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing employeeCode", () => {
    const result = employeeFormSchema.safeParse({ ...validEmployee, employeeCode: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid gender", () => {
    const result = employeeFormSchema.safeParse({ ...validEmployee, gender: "unknown" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid employmentType", () => {
    const result = employeeFormSchema.safeParse({ ...validEmployee, employmentType: "freelance" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid status", () => {
    const result = employeeFormSchema.safeParse({ ...validEmployee, status: "fired" });
    expect(result.success).toBe(false);
  });

  it("rejects negative baseSalary", () => {
    const result = employeeFormSchema.safeParse({ ...validEmployee, baseSalary: -100 });
    expect(result.success).toBe(false);
  });

  it("accepts zero baseSalary", () => {
    const result = employeeFormSchema.safeParse({ ...validEmployee, baseSalary: 0 });
    expect(result.success).toBe(true);
  });

  it("accepts empty workEmail", () => {
    const result = employeeFormSchema.safeParse({ ...validEmployee, workEmail: "" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid workEmail", () => {
    const result = employeeFormSchema.safeParse({ ...validEmployee, workEmail: "not-an-email" });
    expect(result.success).toBe(false);
  });
});

// ─── leaveRequestFormSchema ───────────────────────────────────────────────────

const validLeaveRequest = {
  employeeId: "emp-001",
  leaveTypeId: "lt-001",
  startDate: "2025-07-01",
  endDate: "2025-07-05",
  reason: "Family vacation trip",
};

describe("leaveRequestFormSchema", () => {
  it("accepts a valid leave request", () => {
    const result = leaveRequestFormSchema.safeParse(validLeaveRequest);
    expect(result.success).toBe(true);
  });

  it("rejects missing employeeId", () => {
    const result = leaveRequestFormSchema.safeParse({ ...validLeaveRequest, employeeId: "" });
    expect(result.success).toBe(false);
  });

  it("rejects short reason", () => {
    const result = leaveRequestFormSchema.safeParse({ ...validLeaveRequest, reason: "No" });
    expect(result.success).toBe(false);
  });

  it("rejects missing startDate", () => {
    const result = leaveRequestFormSchema.safeParse({ ...validLeaveRequest, startDate: "" });
    expect(result.success).toBe(false);
  });
});

// ─── leaveTypeFormSchema ──────────────────────────────────────────────────────

const validLeaveType = {
  name: "Annual Leave",
  totalDays: 21,
  isPaid: true,
  applicableTo: ["employee"],
};

describe("leaveTypeFormSchema", () => {
  it("accepts a valid leave type", () => {
    const result = leaveTypeFormSchema.safeParse(validLeaveType);
    expect(result.success).toBe(true);
  });

  it("rejects short name", () => {
    const result = leaveTypeFormSchema.safeParse({ ...validLeaveType, name: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects totalDays less than 1", () => {
    const result = leaveTypeFormSchema.safeParse({ ...validLeaveType, totalDays: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects empty applicableTo", () => {
    const result = leaveTypeFormSchema.safeParse({ ...validLeaveType, applicableTo: [] });
    expect(result.success).toBe(false);
  });
});
