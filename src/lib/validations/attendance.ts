import { z } from "zod";

// ─── Supported attendance statuses ───────────────────────────────────────────

export const ATTENDANCE_STATUSES = [
  "present",
  "absent",
  "late",
  "half-day",
  "leave",
  "excused",
] as const;

export type AttendanceStatusValue = (typeof ATTENDANCE_STATUSES)[number];

// ─── Filter schema ────────────────────────────────────────────────────────────

export const attendanceFilterSchema = z.object({
  entityType: z.enum(["student", "teacher", "employee"], {
    error: "Entity type is required.",
  }),
  classId: z.string().optional(),
  sectionId: z.string().optional(),
  departmentId: z.string().optional(),
  status: z.enum(ATTENDANCE_STATUSES).optional(),
  date: z.string().optional(),
  month: z.string().optional(),
});

export type AttendanceFilterValues = z.infer<typeof attendanceFilterSchema>;

// ─── Update schema ────────────────────────────────────────────────────────────

export const attendanceUpdateSchema = z.object({
  recordId: z.string().min(1, { error: "Record ID is required." }),
  status: z.enum(ATTENDANCE_STATUSES, { error: "Status is required." }),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  notes: z.string().max(500, { error: "Notes must be 500 characters or fewer." }).optional(),
});

export type AttendanceUpdateValues = z.infer<typeof attendanceUpdateSchema>;

// ─── Bulk update schema ───────────────────────────────────────────────────────

export const attendanceBulkUpdateSchema = z.object({
  recordIds: z
    .array(z.string())
    .min(1, { message: "At least one record must be selected." }),
  status: z.enum(ATTENDANCE_STATUSES, { error: "Status is required." }),
  notes: z.string().max(500, { error: "Notes must be 500 characters or fewer." }).optional(),
});

export type AttendanceBulkUpdateValues = z.infer<typeof attendanceBulkUpdateSchema>;

// ─── Notes schema ─────────────────────────────────────────────────────────────

export const attendanceNotesSchema = z.object({
  recordId: z.string().min(1, { error: "Record ID is required." }),
  notes: z
    .string()
    .min(1, { error: "Notes cannot be empty." })
    .max(500, { error: "Notes must be 500 characters or fewer." }),
});

export type AttendanceNotesValues = z.infer<typeof attendanceNotesSchema>;
