import { describe, it, expect } from "vitest";
import { departmentSchema, designationSchema, payrollFilterSchema } from "@/lib/validations/hrm";

// ─── departmentSchema ─────────────────────────────────────────────────────────

describe("departmentSchema", () => {
  const validDept = { name: "Mathematics", code: "MATH", status: "active" as const };

  it("accepts valid department", () => {
    expect(departmentSchema.safeParse(validDept).success).toBe(true);
  });

  it("rejects short name", () => {
    expect(departmentSchema.safeParse({ ...validDept, name: "A" }).success).toBe(false);
  });

  it("rejects empty code", () => {
    expect(departmentSchema.safeParse({ ...validDept, code: "" }).success).toBe(false);
  });

  it("rejects invalid status", () => {
    expect(departmentSchema.safeParse({ ...validDept, status: "deleted" }).success).toBe(false);
  });

  it("accepts optional description", () => {
    expect(departmentSchema.safeParse({ ...validDept, description: "Core math dept" }).success).toBe(true);
  });
});

// ─── designationSchema ────────────────────────────────────────────────────────

describe("designationSchema", () => {
  const validDes = { title: "Senior Teacher", code: "SR-TCH", status: "active" as const };

  it("accepts valid designation", () => {
    expect(designationSchema.safeParse(validDes).success).toBe(true);
  });

  it("rejects short title", () => {
    expect(designationSchema.safeParse({ ...validDes, title: "A" }).success).toBe(false);
  });

  it("rejects empty code", () => {
    expect(designationSchema.safeParse({ ...validDes, code: "" }).success).toBe(false);
  });

  it("accepts optional departmentId", () => {
    expect(designationSchema.safeParse({ ...validDes, departmentId: "dept-001" }).success).toBe(true);
  });
});

// ─── payrollFilterSchema ──────────────────────────────────────────────────────

describe("payrollFilterSchema", () => {
  it("accepts empty object (all optional)", () => {
    expect(payrollFilterSchema.safeParse({}).success).toBe(true);
  });

  it("accepts valid filter", () => {
    expect(
      payrollFilterSchema.safeParse({ month: 7, year: 2025, status: "paid" }).success
    ).toBe(true);
  });

  it("rejects invalid status", () => {
    expect(payrollFilterSchema.safeParse({ status: "cancelled" }).success).toBe(false);
  });
});
