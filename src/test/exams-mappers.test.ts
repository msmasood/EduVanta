import { describe, it, expect } from "vitest";
import {
  examStatusToVariant,
  examStatusLabel,
  resultStatusToVariant,
  resultStatusLabel,
  gradeToVariant,
  mapExamsToRows,
  mapSchedulesToRows,
  mapResultsToRows,
  computeExamSummary,
  computeResultSummary,
} from "@/features/exams/utils/exam-mappers";
import type { Exam, ExamSchedule, ExamResult } from "@/types/exams";
import type { ClassLevel, Subject } from "@/types/academic";
import type { Student } from "@/types/student";

const audit = { createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z" };

// ─── examStatusToVariant ──────────────────────────────────────────────────────

describe("examStatusToVariant", () => {
  it("maps upcoming → info", () => expect(examStatusToVariant("upcoming")).toBe("info"));
  it("maps ongoing → active", () => expect(examStatusToVariant("ongoing")).toBe("active"));
  it("maps completed → success", () => expect(examStatusToVariant("completed")).toBe("success"));
  it("maps cancelled → destructive", () => expect(examStatusToVariant("cancelled")).toBe("destructive"));
});

// ─── examStatusLabel ──────────────────────────────────────────────────────────

describe("examStatusLabel", () => {
  it("returns Upcoming", () => expect(examStatusLabel("upcoming")).toBe("Upcoming"));
  it("returns Ongoing", () => expect(examStatusLabel("ongoing")).toBe("Ongoing"));
  it("returns Completed", () => expect(examStatusLabel("completed")).toBe("Completed"));
  it("returns Cancelled", () => expect(examStatusLabel("cancelled")).toBe("Cancelled"));
});

// ─── resultStatusToVariant ────────────────────────────────────────────────────

describe("resultStatusToVariant", () => {
  it("maps pass → success", () => expect(resultStatusToVariant("pass")).toBe("success"));
  it("maps fail → destructive", () => expect(resultStatusToVariant("fail")).toBe("destructive"));
  it("maps absent → absent", () => expect(resultStatusToVariant("absent")).toBe("absent"));
  it("maps pending → pending", () => expect(resultStatusToVariant("pending")).toBe("pending"));
});

// ─── resultStatusLabel ────────────────────────────────────────────────────────

describe("resultStatusLabel", () => {
  it("returns Pass", () => expect(resultStatusLabel("pass")).toBe("Pass"));
  it("returns Fail", () => expect(resultStatusLabel("fail")).toBe("Fail"));
  it("returns Absent", () => expect(resultStatusLabel("absent")).toBe("Absent"));
  it("returns Pending", () => expect(resultStatusLabel("pending")).toBe("Pending"));
});

// ─── gradeToVariant ───────────────────────────────────────────────────────────

describe("gradeToVariant", () => {
  it("maps A+ → success", () => expect(gradeToVariant("A+")).toBe("success"));
  it("maps A → success", () => expect(gradeToVariant("A")).toBe("success"));
  it("maps B+ → active", () => expect(gradeToVariant("B+")).toBe("active"));
  it("maps B → active", () => expect(gradeToVariant("B")).toBe("active"));
  it("maps C+ → info", () => expect(gradeToVariant("C+")).toBe("info"));
  it("maps C → info", () => expect(gradeToVariant("C")).toBe("info"));
  it("maps D → warning", () => expect(gradeToVariant("D")).toBe("warning"));
  it("maps F → destructive", () => expect(gradeToVariant("F")).toBe("destructive"));
});

// ─── mapExamsToRows ───────────────────────────────────────────────────────────

describe("mapExamsToRows", () => {
  const exams: Exam[] = [
    {
      id: "exam-001",
      schoolId: "school-001",
      name: "First Term",
      academicYearId: "ay-001",
      termName: "Term 1",
      startDate: "2024-07-15",
      endDate: "2024-07-25",
      status: "completed",
      audit,
    },
    {
      id: "exam-002",
      schoolId: "school-001",
      name: "Mid-Term",
      academicYearId: "ay-001",
      termName: "Mid-Term",
      startDate: "2024-10-07",
      endDate: "2024-10-15",
      status: "ongoing",
      audit,
    },
  ];

  it("maps exam fields correctly", () => {
    const rows = mapExamsToRows(exams);
    expect(rows).toHaveLength(2);
    expect(rows[0].id).toBe("exam-001");
    expect(rows[0].name).toBe("First Term");
    expect(rows[0].termName).toBe("Term 1");
    expect(rows[0].status).toBe("completed");
    expect(rows[0].statusVariant).toBe("success");
    expect(rows[0].statusLabel).toBe("Completed");
  });

  it("maps ongoing status correctly", () => {
    const rows = mapExamsToRows(exams);
    expect(rows[1].statusVariant).toBe("active");
    expect(rows[1].statusLabel).toBe("Ongoing");
  });
});

// ─── mapSchedulesToRows ───────────────────────────────────────────────────────

describe("mapSchedulesToRows", () => {
  const exams: Exam[] = [
    {
      id: "exam-001",
      schoolId: "s-001",
      name: "First Term",
      academicYearId: "ay-001",
      termName: "T1",
      startDate: "2024-07-15",
      endDate: "2024-07-25",
      status: "completed",
      audit,
    },
  ];
  const subjects: Subject[] = [
    {
      id: "sub-001",
      schoolId: "s-001",
      name: "Mathematics",
      code: "MATH",
      type: "theory",
      classIds: ["class-005"],
      status: "active",
      audit,
    },
  ];
  const classes: ClassLevel[] = [
    { id: "class-005", schoolId: "s-001", name: "Class 5", code: "CL-05", order: 5, status: "active", audit },
  ];
  const schedules: ExamSchedule[] = [
    {
      id: "es-001",
      examId: "exam-001",
      subjectId: "sub-001",
      classId: "class-005",
      date: "2024-07-15",
      startTime: "09:00",
      endTime: "11:00",
      classroomId: "room-001",
      maxMarks: 100,
      passingMarks: 33,
      audit,
    },
  ];

  it("maps schedule fields with lookups", () => {
    const rows = mapSchedulesToRows(schedules, exams, subjects, classes);
    expect(rows).toHaveLength(1);
    expect(rows[0].examName).toBe("First Term");
    expect(rows[0].subjectName).toBe("Mathematics");
    expect(rows[0].className).toBe("Class 5");
    expect(rows[0].date).toBe("2024-07-15");
    expect(rows[0].maxMarks).toBe(100);
  });

  it("falls back to id when no match", () => {
    const rows = mapSchedulesToRows(schedules, [], subjects, classes);
    expect(rows[0].examName).toBe("exam-001");
  });
});

// ─── mapResultsToRows ─────────────────────────────────────────────────────────

describe("mapResultsToRows", () => {
  const subjects: Subject[] = [
    {
      id: "sub-001",
      schoolId: "s-001",
      name: "Mathematics",
      code: "MATH",
      type: "theory",
      classIds: ["class-005"],
      status: "active",
      audit,
    },
  ];
  const classes: ClassLevel[] = [
    { id: "class-005", schoolId: "s-001", name: "Class 5", code: "CL-05", order: 5, status: "active", audit },
  ];
  const schedules: ExamSchedule[] = [
    {
      id: "es-001",
      examId: "exam-001",
      subjectId: "sub-001",
      classId: "class-005",
      date: "2024-07-15",
      startTime: "09:00",
      endTime: "11:00",
      classroomId: "room-001",
      maxMarks: 100,
      passingMarks: 33,
      audit,
    },
  ];
  const students: Student[] = [
    {
      id: "student-001",
      schoolId: "s-001",
      admissionNumber: "AN001",
      firstName: "Ahmed",
      lastName: "Khan",
      dateOfBirth: "2012-05-15",
      gender: "male",
      categoryId: "cat-001",
      classId: "class-005",
      sectionId: "sec-001",
      rollNumber: "01",
      address: { line1: "House 1", city: "Karachi", country: "PK" },
      contact: { email: "ahmed@test.com", phone: "+92-300-1234567" },
      guardianId: "guardian-001",
      nationality: "Pakistani",
      status: "active",
      admissionDate: "2024-04-05",
      defaultCurrency: "PKR",
      audit,
    },
  ];
  const results: ExamResult[] = [
    {
      id: "res-001",
      examScheduleId: "es-001",
      studentId: "student-001",
      marksObtained: 87,
      maxMarks: 100,
      percentage: 87,
      grade: "A",
      status: "pass",
      audit,
    },
  ];

  it("maps result fields with lookups", () => {
    const rows = mapResultsToRows(results, schedules, subjects, classes, students);
    expect(rows).toHaveLength(1);
    expect(rows[0].studentName).toBe("Ahmed Khan");
    expect(rows[0].subjectName).toBe("Mathematics");
    expect(rows[0].className).toBe("Class 5");
    expect(rows[0].grade).toBe("A");
    expect(rows[0].gradeVariant).toBe("success");
    expect(rows[0].statusVariant).toBe("success");
    expect(rows[0].statusLabel).toBe("Pass");
  });
});

// ─── computeExamSummary ───────────────────────────────────────────────────────

describe("computeExamSummary", () => {
  const exams: Exam[] = [
    { id: "e1", schoolId: "s", name: "E1", academicYearId: "a", termName: "T1", startDate: "2024-01-01", endDate: "2024-01-10", status: "upcoming", audit },
    { id: "e2", schoolId: "s", name: "E2", academicYearId: "a", termName: "T2", startDate: "2024-03-01", endDate: "2024-03-10", status: "ongoing", audit },
    { id: "e3", schoolId: "s", name: "E3", academicYearId: "a", termName: "T3", startDate: "2024-06-01", endDate: "2024-06-10", status: "completed", audit },
    { id: "e4", schoolId: "s", name: "E4", academicYearId: "a", termName: "T4", startDate: "2024-08-01", endDate: "2024-08-10", status: "cancelled", audit },
  ];

  it("counts totals correctly", () => {
    const summary = computeExamSummary(exams);
    expect(summary.total).toBe(4);
    expect(summary.upcoming).toBe(1);
    expect(summary.ongoing).toBe(1);
    expect(summary.completed).toBe(1);
    expect(summary.cancelled).toBe(1);
  });
});

// ─── computeResultSummary ─────────────────────────────────────────────────────

describe("computeResultSummary", () => {
  const results: ExamResult[] = [
    { id: "r1", examScheduleId: "es-001", studentId: "s1", marksObtained: 90, maxMarks: 100, percentage: 90, grade: "A", status: "pass", audit },
    { id: "r2", examScheduleId: "es-001", studentId: "s2", marksObtained: 30, maxMarks: 100, percentage: 30, grade: "F", status: "fail", audit },
    { id: "r3", examScheduleId: "es-001", studentId: "s3", marksObtained: 0, maxMarks: 100, percentage: 0, grade: "F", status: "absent", audit },
    { id: "r4", examScheduleId: "es-001", studentId: "s4", marksObtained: 0, maxMarks: 100, percentage: 0, grade: "F", status: "pending", audit },
  ];

  it("counts totals correctly", () => {
    const summary = computeResultSummary(results);
    expect(summary.total).toBe(4);
    expect(summary.passed).toBe(1);
    expect(summary.failed).toBe(1);
    expect(summary.absent).toBe(1);
    expect(summary.pending).toBe(1);
  });

  it("calculates average percentage from graded results only", () => {
    const summary = computeResultSummary(results);
    // Only pass (90%) and fail (30%) are graded: avg = (90+30)/2 = 60
    expect(summary.avgPercentage).toBe(60);
  });

  it("returns 0 for avgPercentage when no graded results", () => {
    const summary = computeResultSummary([]);
    expect(summary.avgPercentage).toBe(0);
  });
});
