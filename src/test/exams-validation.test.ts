import { describe, it, expect } from "vitest";
import {
  examFormSchema,
  examScheduleFormSchema,
  examResultFormSchema,
} from "@/lib/validations/exams";

// ─── examFormSchema ───────────────────────────────────────────────────────────

describe("examFormSchema", () => {
  const valid = {
    name: "First Term Examination",
    termName: "Term 1",
    startDate: "2024-07-15",
    endDate: "2024-07-25",
    status: "upcoming" as const,
  };

  it("accepts valid exam", () => {
    expect(examFormSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects name shorter than 2 chars", () => {
    expect(examFormSchema.safeParse({ ...valid, name: "E" }).success).toBe(false);
  });

  it("rejects empty termName", () => {
    expect(examFormSchema.safeParse({ ...valid, termName: "" }).success).toBe(false);
  });

  it("rejects empty startDate", () => {
    expect(examFormSchema.safeParse({ ...valid, startDate: "" }).success).toBe(false);
  });

  it("rejects empty endDate", () => {
    expect(examFormSchema.safeParse({ ...valid, endDate: "" }).success).toBe(false);
  });

  it("rejects invalid status", () => {
    expect(examFormSchema.safeParse({ ...valid, status: "draft" }).success).toBe(false);
  });

  it("accepts all valid statuses", () => {
    for (const status of ["upcoming", "ongoing", "completed", "cancelled"] as const) {
      expect(examFormSchema.safeParse({ ...valid, status }).success).toBe(true);
    }
  });
});

// ─── examScheduleFormSchema ───────────────────────────────────────────────────

describe("examScheduleFormSchema", () => {
  const valid = {
    examId: "exam-001",
    subjectId: "sub-001",
    classId: "class-005",
    date: "2024-07-15",
    startTime: "09:00",
    endTime: "11:00",
    maxMarks: 100,
    passingMarks: 33,
  };

  it("accepts valid schedule", () => {
    expect(examScheduleFormSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects empty examId", () => {
    expect(examScheduleFormSchema.safeParse({ ...valid, examId: "" }).success).toBe(false);
  });

  it("rejects empty subjectId", () => {
    expect(examScheduleFormSchema.safeParse({ ...valid, subjectId: "" }).success).toBe(false);
  });

  it("rejects empty classId", () => {
    expect(examScheduleFormSchema.safeParse({ ...valid, classId: "" }).success).toBe(false);
  });

  it("rejects empty date", () => {
    expect(examScheduleFormSchema.safeParse({ ...valid, date: "" }).success).toBe(false);
  });

  it("rejects maxMarks less than 1", () => {
    expect(examScheduleFormSchema.safeParse({ ...valid, maxMarks: 0 }).success).toBe(false);
  });

  it("rejects passingMarks less than 1", () => {
    expect(examScheduleFormSchema.safeParse({ ...valid, passingMarks: 0 }).success).toBe(false);
  });

  it("accepts optional classroomId", () => {
    expect(
      examScheduleFormSchema.safeParse({ ...valid, classroomId: "room-001" }).success
    ).toBe(true);
  });
});

// ─── examResultFormSchema ─────────────────────────────────────────────────────

describe("examResultFormSchema", () => {
  const valid = {
    examScheduleId: "es-001",
    studentId: "student-001",
    marksObtained: 87,
    maxMarks: 100,
    grade: "A",
    status: "pass" as const,
  };

  it("accepts valid result", () => {
    expect(examResultFormSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects empty examScheduleId", () => {
    expect(examResultFormSchema.safeParse({ ...valid, examScheduleId: "" }).success).toBe(false);
  });

  it("rejects empty studentId", () => {
    expect(examResultFormSchema.safeParse({ ...valid, studentId: "" }).success).toBe(false);
  });

  it("rejects negative marksObtained", () => {
    expect(examResultFormSchema.safeParse({ ...valid, marksObtained: -1 }).success).toBe(false);
  });

  it("accepts marksObtained of 0", () => {
    expect(examResultFormSchema.safeParse({ ...valid, marksObtained: 0 }).success).toBe(true);
  });

  it("rejects maxMarks less than 1", () => {
    expect(examResultFormSchema.safeParse({ ...valid, maxMarks: 0 }).success).toBe(false);
  });

  it("rejects empty grade", () => {
    expect(examResultFormSchema.safeParse({ ...valid, grade: "" }).success).toBe(false);
  });

  it("rejects invalid status", () => {
    expect(examResultFormSchema.safeParse({ ...valid, status: "unknown" }).success).toBe(false);
  });

  it("accepts all valid result statuses", () => {
    for (const status of ["pass", "fail", "absent", "pending"] as const) {
      expect(examResultFormSchema.safeParse({ ...valid, status }).success).toBe(true);
    }
  });

  it("accepts optional remarks", () => {
    expect(
      examResultFormSchema.safeParse({ ...valid, remarks: "Good performance" }).success
    ).toBe(true);
  });
});
