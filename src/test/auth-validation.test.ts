import { describe, it, expect } from "vitest";

import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validations/auth";

// ─── loginSchema ──────────────────────────────────────────────────────────────

describe("loginSchema", () => {
  it("passes with valid credentials", () => {
    const result = loginSchema.safeParse({
      email: "admin@school.com",
      password: "Secure@99",
      rememberMe: false,
    });
    expect(result.success).toBe(true);
  });

  it("fails with missing email", () => {
    const result = loginSchema.safeParse({ email: "", password: "Secure@99" });
    expect(result.success).toBe(false);
  });

  it("fails with invalid email format", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "Secure@99",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("invalidEmail");
    }
  });

  it("fails with password shorter than 8 chars", () => {
    const result = loginSchema.safeParse({
      email: "admin@school.com",
      password: "short",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("passwordMin");
    }
  });

  it("accepts rememberMe false explicitly", () => {
    const result = loginSchema.safeParse({
      email: "admin@school.com",
      password: "Secure@99",
      rememberMe: false,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.rememberMe).toBe(false);
    }
  });
});

// ─── registerSchema ───────────────────────────────────────────────────────────

const validRegister = {
  schoolName: "Test School",
  fullName: "Jane Doe",
  email: "jane@school.com",
  phone: "+971501234567",
  country: "AE",
  preferredLanguage: "en",
  preferredCurrency: "USD",
  password: "Secure@99",
  confirmPassword: "Secure@99",
  agreeToTerms: true,
};

describe("registerSchema", () => {
  it("passes with all valid fields", () => {
    const result = registerSchema.safeParse(validRegister);
    expect(result.success).toBe(true);
  });

  it("passes without optional phone", () => {
    const { phone: _phone, ...rest } = validRegister;
    const result = registerSchema.safeParse(rest);
    expect(result.success).toBe(true);
  });

  it("fails when passwords do not match", () => {
    const result = registerSchema.safeParse({
      ...validRegister,
      confirmPassword: "DifferentPassword1",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(
        (i) => i.path[0] === "confirmPassword"
      );
      expect(issue?.message).toBe("passwordMismatch");
    }
  });

  it("fails when agreeToTerms is false", () => {
    const result = registerSchema.safeParse({
      ...validRegister,
      agreeToTerms: false,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(
        (i) => i.path[0] === "agreeToTerms"
      );
      expect(issue?.message).toBe("termsRequired");
    }
  });

  it("fails with schoolName shorter than 2 chars", () => {
    const result = registerSchema.safeParse({
      ...validRegister,
      schoolName: "X",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("minLength");
    }
  });

  it("fails with invalid email format", () => {
    const result = registerSchema.safeParse({
      ...validRegister,
      email: "not-valid",
    });
    expect(result.success).toBe(false);
  });
});

// ─── forgotPasswordSchema ─────────────────────────────────────────────────────

describe("forgotPasswordSchema", () => {
  it("passes with valid email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "user@school.com" });
    expect(result.success).toBe(true);
  });

  it("fails with empty email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "" });
    expect(result.success).toBe(false);
  });

  it("fails with invalid email format", () => {
    const result = forgotPasswordSchema.safeParse({ email: "bad-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("invalidEmail");
    }
  });
});

// ─── resetPasswordSchema ──────────────────────────────────────────────────────

describe("resetPasswordSchema", () => {
  it("passes with matching passwords", () => {
    const result = resetPasswordSchema.safeParse({
      password: "NewPass@12",
      confirmPassword: "NewPass@12",
    });
    expect(result.success).toBe(true);
  });

  it("fails when passwords do not match", () => {
    const result = resetPasswordSchema.safeParse({
      password: "NewPass@12",
      confirmPassword: "OtherPass@99",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(
        (i) => i.path[0] === "confirmPassword"
      );
      expect(issue?.message).toBe("passwordMismatch");
    }
  });

  it("fails with password shorter than 8 chars", () => {
    const result = resetPasswordSchema.safeParse({
      password: "short",
      confirmPassword: "short",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("passwordMin");
    }
  });
});
