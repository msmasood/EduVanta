import { z } from "zod";

// ─── Guardian form schema ─────────────────────────────────────────────────────

export const guardianFormSchema = z.object({
  // Personal
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  relation: z.enum(
    ["father", "mother", "brother", "sister", "uncle", "aunt", "grandparent", "legal-guardian", "other"] as const,
    { error: "Relationship is required" }
  ),
  occupation: z.string().optional(),
  nationalId: z.string().optional(),
  // Contact
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Phone number must be at least 7 characters"),
  alternatePhone: z
    .string()
    .min(7, "Alternate phone must be at least 7 characters")
    .optional()
    .or(z.literal("")),
  addressLine1: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  // Access / Emergency
  isEmergencyContact: z.boolean(),
  portalAccess: z.boolean(),
  status: z.enum(["active", "inactive", "pending"] as const, {
    error: "Status is required",
  }),
  // Linked students (mock, no real mutation)
  linkedStudentIds: z.array(z.string()).optional(),
  primaryStudentId: z.string().optional(),
  // Profile image (mock, visual only)
  profileImage: z.any().optional(),
});

export type GuardianFormValues = z.infer<typeof guardianFormSchema>;

// ─── Guardian student link schema ─────────────────────────────────────────────

export const guardianStudentLinkSchema = z.object({
  guardianId: z.string().min(1, "Guardian ID is required"),
  studentId: z.string().min(1, "Student ID is required"),
  relation: z.enum(
    ["father", "mother", "brother", "sister", "uncle", "aunt", "grandparent", "legal-guardian", "other"] as const,
    { error: "Relationship is required" }
  ),
  isPrimary: z.boolean(),
});

export type GuardianStudentLinkFormValues = z.infer<typeof guardianStudentLinkSchema>;
