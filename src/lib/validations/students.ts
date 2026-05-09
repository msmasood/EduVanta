import { z } from "zod";

// ─── Student form schema ───────────────────────────────────────────────────────

export const studentFormSchema = z.object({
  // Personal
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  admissionNumber: z.string().min(1, "Admission number is required"),
  rollNumber: z.string().min(1, "Roll number is required"),
  gender: z.enum(["male", "female", "other"] as const, { error: "Gender is required" }),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  bloodGroup: z.string().optional(),
  religion: z.string().optional(),
  nationality: z.string().optional(),
  // Contact
  email: z.string().email("Enter a valid email address").optional().or(z.literal("")),
  phone: z.string().min(7, "Phone number too short").optional().or(z.literal("")),
  addressLine1: z.string().optional(),
  city: z.string().optional(),
  // Academic
  classId: z.string().min(1, "Class is required"),
  sectionId: z.string().min(1, "Section is required"),
  categoryId: z.string().optional(),
  admissionDate: z.string().min(1, "Admission date is required"),
  academicYearId: z.string().optional(),
  status: z.enum(["active", "inactive", "suspended", "graduated", "transferred"] as const, {
    error: "Status is required",
  }),
  // Guardian
  guardianId: z.string().optional(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  guardianPhone: z.string().optional(),
  guardianEmail: z
    .string()
    .email("Enter a valid guardian email")
    .optional()
    .or(z.literal("")),
  // Profile image (mock, no actual upload)
  profileImage: z.any().optional(),
});

export type StudentFormValues = z.infer<typeof studentFormSchema>;

// ─── Student category schema ──────────────────────────────────────────────────

export const studentCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  description: z.string().optional(),
});

export type StudentCategoryFormValues = z.infer<typeof studentCategorySchema>;

// ─── Attendance filter schema ─────────────────────────────────────────────────

export const studentAttendanceFilterSchema = z.object({
  classId: z.string().optional(),
  sectionId: z.string().optional(),
  date: z.string().optional(),
  status: z.string().optional(),
});

export type StudentAttendanceFilterValues = z.infer<
  typeof studentAttendanceFilterSchema
>;
