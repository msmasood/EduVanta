import { z } from "zod";

// ─── Class schema ────────────────────────────────────────────────────────────

export const classFormSchema = z.object({
  name: z.string().min(2, { error: "Class name must be at least 2 characters." }),
  code: z.string().min(1, { error: "Class code is required." }),
  academicYearId: z.string().optional(),
  order: z.number().min(0).optional(),
  capacity: z.number().min(0).optional(),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"] as const, { error: "Status is required." }),
});

export type ClassFormValues = z.infer<typeof classFormSchema>;

// ─── Classroom schema ────────────────────────────────────────────────────────

export const classroomFormSchema = z.object({
  name: z.string().min(1, { error: "Room name is required." }),
  code: z.string().min(1, { error: "Room code is required." }),
  type: z.enum(["classroom", "lab", "auditorium", "library", "other"] as const, {
    error: "Room type is required.",
  }),
  building: z.string().optional(),
  floor: z.string().optional(),
  capacity: z.number().min(1, { error: "Capacity must be at least 1." }),
  status: z.enum(["active", "inactive"] as const, { error: "Status is required." }),
});

export type ClassroomFormValues = z.infer<typeof classroomFormSchema>;

// ─── Section schema ──────────────────────────────────────────────────────────

export const sectionFormSchema = z.object({
  name: z.string().min(1, { error: "Section name is required." }),
  code: z.string().min(1, { error: "Section code is required." }),
  classId: z.string().min(1, { error: "Class is required." }),
  classroomId: z.string().optional(),
  teacherId: z.string().optional(),
  capacity: z.number().min(1, { error: "Capacity must be at least 1." }),
  status: z.enum(["active", "inactive"] as const, { error: "Status is required." }),
});

export type SectionFormValues = z.infer<typeof sectionFormSchema>;

// ─── Subject schema ──────────────────────────────────────────────────────────

export const subjectFormSchema = z.object({
  name: z.string().min(2, { error: "Subject name must be at least 2 characters." }),
  code: z.string().min(1, { error: "Subject code is required." }),
  type: z.enum(["theory", "practical", "elective"] as const, {
    error: "Subject type is required.",
  }),
  creditHours: z.number().min(0).optional(),
  status: z.enum(["active", "inactive"] as const, { error: "Status is required." }),
});

export type SubjectFormValues = z.infer<typeof subjectFormSchema>;
