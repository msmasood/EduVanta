/**
 * Certificates validation schema tests — Phase 21
 */

import { describe, it, expect } from "vitest";
import {
  certificateGenerateSchema,
  certificateRecordFilterSchema,
} from "@/lib/validations/certificates";

const today = new Date().toISOString().slice(0, 10);

// ─── certificateGenerateSchema ────────────────────────────────────────────────

describe("certificateGenerateSchema", () => {
  const validValues = {
    templateId: "cert-tpl-001",
    studentId: "student-001",
    issueDate: today,
  };

  it("accepts a valid minimum payload", () => {
    const result = certificateGenerateSchema.safeParse(validValues);
    expect(result.success).toBe(true);
  });

  it("accepts a full valid payload", () => {
    const result = certificateGenerateSchema.safeParse({
      ...validValues,
      certificateTitle: "Bonafide Certificate",
      academicYearId: "ay-001",
      classId: "class-005",
      remarks: "Issued on request.",
      signerName: "Dr. Rashida Akhtar",
      signerDesignation: "Principal",
      status: "issued",
    });
    expect(result.success).toBe(true);
  });

  it("fails when templateId is missing", () => {
    const result = certificateGenerateSchema.safeParse({
      ...validValues,
      templateId: "",
    });
    expect(result.success).toBe(false);
  });

  it("fails when studentId is missing", () => {
    const result = certificateGenerateSchema.safeParse({
      ...validValues,
      studentId: "",
    });
    expect(result.success).toBe(false);
  });

  it("fails when issueDate is missing", () => {
    const result = certificateGenerateSchema.safeParse({
      ...validValues,
      issueDate: "",
    });
    expect(result.success).toBe(false);
  });

  it("fails when certificateTitle is too short", () => {
    const result = certificateGenerateSchema.safeParse({
      ...validValues,
      certificateTitle: "A",
    });
    expect(result.success).toBe(false);
  });

  it("allows empty certificateTitle", () => {
    const result = certificateGenerateSchema.safeParse({
      ...validValues,
      certificateTitle: "",
    });
    expect(result.success).toBe(true);
  });

  it("fails when signerName is too short", () => {
    const result = certificateGenerateSchema.safeParse({
      ...validValues,
      signerName: "A",
    });
    expect(result.success).toBe(false);
  });

  it("allows empty signerName", () => {
    const result = certificateGenerateSchema.safeParse({
      ...validValues,
      signerName: "",
    });
    expect(result.success).toBe(true);
  });

  it("fails when signerDesignation is too short", () => {
    const result = certificateGenerateSchema.safeParse({
      ...validValues,
      signerDesignation: "A",
    });
    expect(result.success).toBe(false);
  });

  it("allows empty signerDesignation", () => {
    const result = certificateGenerateSchema.safeParse({
      ...validValues,
      signerDesignation: "",
    });
    expect(result.success).toBe(true);
  });

  it("accepts status of draft or issued", () => {
    expect(
      certificateGenerateSchema.safeParse({ ...validValues, status: "draft" }).success
    ).toBe(true);
    expect(
      certificateGenerateSchema.safeParse({ ...validValues, status: "issued" }).success
    ).toBe(true);
  });
});

// ─── certificateRecordFilterSchema ───────────────────────────────────────────

describe("certificateRecordFilterSchema", () => {
  it("accepts an empty filter", () => {
    const result = certificateRecordFilterSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts a fully populated filter", () => {
    const result = certificateRecordFilterSchema.safeParse({
      templateId: "cert-tpl-001",
      studentId: "student-001",
      status: "issued",
      dateFrom: "2024-01-01",
      dateTo: "2024-12-31",
    });
    expect(result.success).toBe(true);
  });

  it("fails when dateTo is before dateFrom", () => {
    const result = certificateRecordFilterSchema.safeParse({
      dateFrom: "2024-12-31",
      dateTo: "2024-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("passes when dateTo equals dateFrom", () => {
    const result = certificateRecordFilterSchema.safeParse({
      dateFrom: "2024-06-01",
      dateTo: "2024-06-01",
    });
    expect(result.success).toBe(true);
  });
});
