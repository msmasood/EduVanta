import { describe, it, expect } from "vitest";
import { guardianFormSchema, guardianStudentLinkSchema } from "@/lib/validations/guardians";

// ─── Valid base data ──────────────────────────────────────────────────────────

const validForm = {
  firstName: "Tariq",
  lastName: "Khan",
  relation: "father" as const,
  occupation: "Engineer",
  nationalId: "12345-6789012-3",
  email: "tariq@example.com",
  phone: "+923001234567",
  alternatePhone: "",
  addressLine1: "123 Main St",
  city: "Karachi",
  country: "Pakistan",
  isEmergencyContact: false,
  portalAccess: false,
  status: "active" as const,
  linkedStudentIds: [],
  primaryStudentId: "",
  profileImage: undefined,
};

// ─── guardianFormSchema ───────────────────────────────────────────────────────

describe("guardianFormSchema", () => {
  it("accepts a valid guardian form", () => {
    const result = guardianFormSchema.safeParse(validForm);
    expect(result.success).toBe(true);
  });

  it("rejects missing firstName", () => {
    const result = guardianFormSchema.safeParse({ ...validForm, firstName: "" });
    expect(result.success).toBe(false);
  });

  it("rejects firstName shorter than 2 chars", () => {
    const result = guardianFormSchema.safeParse({ ...validForm, firstName: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects missing lastName", () => {
    const result = guardianFormSchema.safeParse({ ...validForm, lastName: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing relation", () => {
    const result = guardianFormSchema.safeParse({ ...validForm, relation: undefined });
    expect(result.success).toBe(false);
  });

  it("rejects invalid relation value", () => {
    const result = guardianFormSchema.safeParse({ ...validForm, relation: "cousin" });
    expect(result.success).toBe(false);
  });

  it("rejects missing email", () => {
    const result = guardianFormSchema.safeParse({ ...validForm, email: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = guardianFormSchema.safeParse({ ...validForm, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects phone that is too short", () => {
    const result = guardianFormSchema.safeParse({ ...validForm, phone: "123" });
    expect(result.success).toBe(false);
  });

  it("rejects missing status", () => {
    const result = guardianFormSchema.safeParse({ ...validForm, status: undefined });
    expect(result.success).toBe(false);
  });

  it("rejects invalid status value", () => {
    const result = guardianFormSchema.safeParse({ ...validForm, status: "suspended" });
    expect(result.success).toBe(false);
  });

  it("allows optional fields to be absent", () => {
    const { occupation, nationalId, alternatePhone, addressLine1, city, country, ...minimal } = validForm;
    const result = guardianFormSchema.safeParse(minimal);
    expect(result.success).toBe(true);
  });

  it("accepts all valid relation values", () => {
    const relations = ["father", "mother", "brother", "sister", "uncle", "aunt", "grandparent", "legal-guardian", "other"] as const;
    for (const relation of relations) {
      const result = guardianFormSchema.safeParse({ ...validForm, relation });
      expect(result.success, `Expected ${relation} to be valid`).toBe(true);
    }
  });

  it("accepts all valid status values", () => {
    for (const status of ["active", "inactive", "pending"] as const) {
      const result = guardianFormSchema.safeParse({ ...validForm, status });
      expect(result.success).toBe(true);
    }
  });
});

// ─── guardianStudentLinkSchema ────────────────────────────────────────────────

describe("guardianStudentLinkSchema", () => {
  const validLink = {
    guardianId: "guardian-001",
    studentId: "student-001",
    relation: "father" as const,
    isPrimary: true,
  };

  it("accepts a valid link", () => {
    const result = guardianStudentLinkSchema.safeParse(validLink);
    expect(result.success).toBe(true);
  });

  it("rejects missing guardianId", () => {
    const result = guardianStudentLinkSchema.safeParse({ ...validLink, guardianId: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing studentId", () => {
    const result = guardianStudentLinkSchema.safeParse({ ...validLink, studentId: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid relation in link", () => {
    const result = guardianStudentLinkSchema.safeParse({ ...validLink, relation: "cousin" });
    expect(result.success).toBe(false);
  });
});
