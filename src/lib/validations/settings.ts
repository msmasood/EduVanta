import { z } from "zod";

// ─── General Settings Schema ──────────────────────────────────────────────────

export const generalSettingsSchema = z.object({
  schoolName: z.string().min(2, { message: "School name must be at least 2 characters." }),
  schoolCode: z.string().min(2, { message: "School code must be at least 2 characters." }),
  schoolEmail: z.string().email({ message: "Enter a valid email address." }),
  schoolPhone: z
    .string()
    .optional()
    .refine((v) => !v || v.length >= 7, {
      message: "Phone number must be at least 7 characters.",
    }),
  schoolAddress: z.string().optional(),
  schoolWebsite: z
    .string()
    .optional()
    .refine((v) => !v || /^https?:\/\/.+/.test(v), {
      message: "Website must be a valid URL starting with http:// or https://.",
    }),
  defaultLocale: z.enum(["en", "ar", "ur"] as const),
  defaultCurrency: z.string().min(3, { message: "Select a default currency." }),
  academicYearStart: z.string().min(1, { message: "Academic year start is required." }),
  academicYearEnd: z.string().min(1, { message: "Academic year end is required." }),
  timezone: z.string().min(1, { message: "Timezone is required." }),
});

export type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>;

// ─── Language Form Schema ─────────────────────────────────────────────────────

export const languageFormSchema = z.object({
  locale: z.enum(["en", "ar", "ur"] as const),
  isDefault: z.boolean(),
  isEnabled: z.boolean(),
});

export type LanguageFormValues = z.infer<typeof languageFormSchema>;

// ─── Currency Form Schema ─────────────────────────────────────────────────────

export const currencyFormSchema = z.object({
  code: z.string().min(3, { message: "Currency code is required." }),
  isDefault: z.boolean(),
  isEnabled: z.boolean(),
  exchangeRate: z.number().min(0.0001, { error: "Exchange rate must be greater than zero." }),
});

export type CurrencyFormValues = z.infer<typeof currencyFormSchema>;

// ─── Role Form Schema ─────────────────────────────────────────────────────────

export const roleFormSchema = z.object({
  name: z.string().min(2, { message: "Role name must be at least 2 characters." }),
  description: z
    .string()
    .optional()
    .refine((v) => !v || v.length >= 5, {
      message: "Description must be at least 5 characters.",
    }),
  isActive: z.boolean(),
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;

// ─── Assign Role Schema ───────────────────────────────────────────────────────

export const assignRoleSchema = z.object({
  userId: z.string().min(1, { message: "User is required." }),
  roleId: z.string().min(1, { message: "Role is required." }),
  entityType: z.enum(["employee", "teacher", "student", "guardian"] as const),
  isActive: z.boolean(),
});

export type AssignRoleValues = z.infer<typeof assignRoleSchema>;
