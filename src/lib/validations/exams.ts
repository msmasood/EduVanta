import { z } from "zod";

// ─── Exam schema ──────────────────────────────────────────────────────────────

export const examFormSchema = z.object({
  name: z.string().min(2, { error: "Exam name must be at least 2 characters." }),
  termName: z.string().min(1, { error: "Term name is required." }),
  startDate: z.string().min(1, { error: "Start date is required." }),
  endDate: z.string().min(1, { error: "End date is required." }),
  status: z.enum(["upcoming", "ongoing", "completed", "cancelled"] as const, {
    error: "Status is required.",
  }),
});

export type ExamFormValues = z.infer<typeof examFormSchema>;

// ─── Exam Schedule schema ─────────────────────────────────────────────────────

export const examScheduleFormSchema = z.object({
  examId: z.string().min(1, { error: "Exam is required." }),
  subjectId: z.string().min(1, { error: "Subject is required." }),
  classId: z.string().min(1, { error: "Class is required." }),
  date: z.string().min(1, { error: "Date is required." }),
  startTime: z.string().min(1, { error: "Start time is required." }),
  endTime: z.string().min(1, { error: "End time is required." }),
  classroomId: z.string().optional(),
  maxMarks: z.number().min(1, { error: "Max marks must be at least 1." }),
  passingMarks: z.number().min(1, { error: "Passing marks must be at least 1." }),
});

export type ExamScheduleFormValues = z.infer<typeof examScheduleFormSchema>;

// ─── Exam Result schema ───────────────────────────────────────────────────────

export const examResultFormSchema = z.object({
  examScheduleId: z.string().min(1, { error: "Exam schedule is required." }),
  studentId: z.string().min(1, { error: "Student is required." }),
  marksObtained: z.number().min(0, { error: "Marks obtained must be 0 or more." }),
  maxMarks: z.number().min(1, { error: "Max marks must be at least 1." }),
  grade: z.string().min(1, { error: "Grade is required." }),
  status: z.enum(["pass", "fail", "absent", "pending"] as const, {
    error: "Status is required.",
  }),
  remarks: z.string().optional(),
});

export type ExamResultFormValues = z.infer<typeof examResultFormSchema>;
