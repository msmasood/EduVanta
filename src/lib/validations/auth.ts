import { z } from "zod";

// ─── Login ────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().min(1, "required").email("invalidEmail"),
  password: z.string().min(8, "passwordMin"),
  rememberMe: z.boolean(),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ─── Register ─────────────────────────────────────────────────────────────────

export const registerSchema = z
  .object({
    schoolName: z.string().min(2, "minLength"),
    fullName: z.string().min(2, "minLength"),
    email: z.string().min(1, "required").email("invalidEmail"),
    phone: z.string().optional(),
    country: z.string().min(1, "required"),
    preferredLanguage: z.string().min(1, "required"),
    preferredCurrency: z.string().min(1, "required"),
    password: z.string().min(8, "passwordMin"),
    confirmPassword: z.string().min(1, "required"),
    agreeToTerms: z
      .boolean()
      .refine((v) => v === true, { message: "termsRequired" }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "passwordMismatch",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

// ─── Forgot password ──────────────────────────────────────────────────────────

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "required").email("invalidEmail"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// ─── Reset password ───────────────────────────────────────────────────────────

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "passwordMin"),
    confirmPassword: z.string().min(1, "required"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "passwordMismatch",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
