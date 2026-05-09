import { z } from "zod";

// ─── Teacher form schema ──────────────────────────────────────────────────────

export const teacherFormSchema = z.object({
  // Personal
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  teacherCode: z.string().min(1, "Teacher code is required"),
  gender: z.enum(["male", "female", "other"] as const, { error: "Gender is required" }),
  dateOfBirth: z.string().optional(),
  // Professional
  departmentId: z.string().min(1, "Department is required"),
  designation: z.string().optional(),
  qualification: z.string().min(1, "Qualification is required"),
  experienceYears: z
    .number({ error: "Must be a number" })
    .min(0, "Experience cannot be negative")
    .optional()
    .or(z.nan().transform(() => undefined)),
  joiningDate: z.string().min(1, "Joining date is required"),
  employmentStatus: z.enum(["active", "inactive", "on-leave"] as const, {
    error: "Status is required",
  }),
  subjectsAssigned: z.array(z.string()).optional(),
  // Contact
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Phone number too short"),
  alternatePhone: z
    .string()
    .min(7, "Phone number too short")
    .optional()
    .or(z.literal("")),
  addressLine1: z.string().optional(),
  city: z.string().optional(),
  // Emergency
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z
    .string()
    .min(7, "Emergency phone too short")
    .optional()
    .or(z.literal("")),
  notes: z.string().optional(),
  // Profile image (mock only)
  profileImage: z.any().optional(),
});

export type TeacherFormValues = z.infer<typeof teacherFormSchema>;

// ─── Attendance filter schema ─────────────────────────────────────────────────

export const teacherAttendanceFilterSchema = z.object({
  departmentId: z.string().optional(),
  date: z.string().optional(),
  month: z.string().optional(),
  status: z.enum(["present", "absent", "late", "half-day", "leave"] as const).optional(),
});

export type TeacherAttendanceFilterValues = z.infer<typeof teacherAttendanceFilterSchema>;

// ─── Timetable filter schema ──────────────────────────────────────────────────

export const teacherTimetableFilterSchema = z.object({
  teacherId: z.string().optional(),
  classId: z.string().optional(),
  subjectId: z.string().optional(),
  day: z
    .enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const)
    .optional(),
});

export type TeacherTimetableFilterValues = z.infer<typeof teacherTimetableFilterSchema>;
