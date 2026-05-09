/**
 * Settings validation unit tests — Phase 22
 */

import { describe, it, expect } from "vitest";
import {
  generalSettingsSchema,
  languageFormSchema,
  currencyFormSchema,
  roleFormSchema,
  assignRoleSchema,
} from "@/lib/validations/settings";

// ─── generalSettingsSchema ────────────────────────────────────────────────────

describe("generalSettingsSchema", () => {
  const validData = {
    schoolName: "EduVanta School",
    schoolCode: "EVS-001",
    schoolEmail: "admin@eduvanta.edu",
    schoolPhone: "1234567",
    schoolAddress: "123 Education Lane",
    schoolWebsite: "https://eduvanta.edu",
    defaultLocale: "en" as const,
    defaultCurrency: "USD",
    academicYearStart: "2025-01-01",
    academicYearEnd: "2025-12-31",
    timezone: "UTC",
  };

  it("accepts valid data", () => {
    expect(generalSettingsSchema.safeParse(validData).success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = generalSettingsSchema.safeParse({ ...validData, schoolEmail: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid website URL", () => {
    const result = generalSettingsSchema.safeParse({ ...validData, schoolWebsite: "not-a-url" });
    expect(result.success).toBe(false);
  });

  it("accepts valid https URL", () => {
    const result = generalSettingsSchema.safeParse({ ...validData, schoolWebsite: "https://example.com" });
    expect(result.success).toBe(true);
  });

  it("rejects schoolName too short", () => {
    const result = generalSettingsSchema.safeParse({ ...validData, schoolName: "A" });
    expect(result.success).toBe(false);
  });

  it("accepts optional website omitted", () => {
    const { schoolWebsite: _, ...rest } = validData;
    expect(generalSettingsSchema.safeParse(rest).success).toBe(true);
  });

  it("rejects invalid locale", () => {
    const result = generalSettingsSchema.safeParse({ ...validData, defaultLocale: "fr" });
    expect(result.success).toBe(false);
  });
});

// ─── languageFormSchema ───────────────────────────────────────────────────────

describe("languageFormSchema", () => {
  it("accepts valid language form", () => {
    const result = languageFormSchema.safeParse({ locale: "ar", isDefault: false, isEnabled: true });
    expect(result.success).toBe(true);
  });

  it("rejects invalid locale", () => {
    const result = languageFormSchema.safeParse({ locale: "fr", isDefault: false, isEnabled: true });
    expect(result.success).toBe(false);
  });

  it("rejects missing isEnabled", () => {
    const result = languageFormSchema.safeParse({ locale: "en", isDefault: false });
    expect(result.success).toBe(false);
  });
});

// ─── currencyFormSchema ───────────────────────────────────────────────────────

describe("currencyFormSchema", () => {
  it("accepts valid currency form", () => {
    const result = currencyFormSchema.safeParse({
      code: "USD",
      isDefault: true,
      isEnabled: true,
      exchangeRate: 1,
    });
    expect(result.success).toBe(true);
  });

  it("rejects exchangeRate of 0", () => {
    const result = currencyFormSchema.safeParse({
      code: "USD",
      isDefault: false,
      isEnabled: true,
      exchangeRate: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative exchangeRate", () => {
    const result = currencyFormSchema.safeParse({
      code: "USD",
      isDefault: false,
      isEnabled: true,
      exchangeRate: -1,
    });
    expect(result.success).toBe(false);
  });

  it("accepts small positive exchangeRate", () => {
    const result = currencyFormSchema.safeParse({
      code: "JPY",
      isDefault: false,
      isEnabled: true,
      exchangeRate: 0.007,
    });
    expect(result.success).toBe(true);
  });
});

// ─── roleFormSchema ───────────────────────────────────────────────────────────

describe("roleFormSchema", () => {
  it("accepts valid role", () => {
    const result = roleFormSchema.safeParse({ name: "Librarian", description: "Manages library", isActive: true });
    expect(result.success).toBe(true);
  });

  it("rejects name too short", () => {
    const result = roleFormSchema.safeParse({ name: "A", description: "", isActive: true });
    expect(result.success).toBe(false);
  });

  it("accepts without description", () => {
    const result = roleFormSchema.safeParse({ name: "Accountant", isActive: false });
    expect(result.success).toBe(true);
  });
});

// ─── assignRoleSchema ─────────────────────────────────────────────────────────

describe("assignRoleSchema", () => {
  it("accepts valid assignment", () => {
    const result = assignRoleSchema.safeParse({
      entityType: "employee",
      userId: "user-001",
      roleId: "role-001",
      isActive: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid entityType", () => {
    const result = assignRoleSchema.safeParse({
      entityType: "admin",
      userId: "user-001",
      roleId: "role-001",
      isActive: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing userId", () => {
    const result = assignRoleSchema.safeParse({
      entityType: "teacher",
      userId: "",
      roleId: "role-001",
      isActive: true,
    });
    expect(result.success).toBe(false);
  });
});
