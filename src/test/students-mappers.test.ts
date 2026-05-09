import { describe, it, expect } from "vitest";
import type { Student } from "@/types/student";
import type { ClassLevel, Section } from "@/types/academic";
import type { Guardian } from "@/types/guardian";
import type { AttendanceRecord } from "@/types/attendance";

import {
  mapStudentsToRows,
  buildStudentStatusSummary,
  filterSuspendedStudents,
  countAttendanceStatuses,
  buildCategoryStudentCounts,
  studentStatusToVariant,
} from "@/features/students/utils/student-mappers";

// ─── Minimal fixtures ──────────────────────────────────────────────────────────

function makeStudent(overrides: Partial<Student> = {}): Student {
  return {
    id: "s-001",
    schoolId: "school-001",
    admissionNumber: "AN001",
    firstName: "Ahmed",
    lastName: "Ali",
    dateOfBirth: "2010-05-15",
    gender: "male",
    categoryId: "cat-001",
    classId: "class-001",
    sectionId: "section-001",
    rollNumber: "R001",
    address: { line1: "123 Main St", city: "Dubai", country: "UAE" },
    contact: { email: "ahmed@example.com", phone: "0501234567" },
    guardianId: "g-001",
    nationality: "Emirati",
    status: "active",
    admissionDate: "2024-01-01",
    defaultCurrency: "AED",
    audit: { createdAt: "2024-01-01", updatedAt: "2024-01-01" },
    ...overrides,
  };
}

function makeGuardian(overrides: Partial<Guardian> = {}): Guardian {
  return {
    id: "g-001",
    schoolId: "school-001",
    firstName: "Ali",
    lastName: "Hassan",
    relation: "father",
    contact: { email: "ali@example.com", phone: "0501234567" },
    address: { line1: "123 Main St", city: "Dubai", country: "UAE" },
    occupation: "Engineer",
    studentIds: ["s-001"],
    audit: { createdAt: "2024-01-01", updatedAt: "2024-01-01" },
    ...overrides,
  };
}

function makeClassLevel(overrides: Partial<ClassLevel> = {}): ClassLevel {
  return {
    id: "class-001",
    schoolId: "school-001",
    name: "Grade 1",
    order: 1,
    status: "active",
    audit: { createdAt: "2024-01-01", updatedAt: "2024-01-01" },
    ...overrides,
  };
}

function makeSection(overrides: Partial<Section> = {}): Section {
  return {
    id: "section-001",
    schoolId: "school-001",
    classId: "class-001",
    name: "A",
    code: "1-A",
    capacity: 30,
    status: "active",
    audit: { createdAt: "2024-01-01", updatedAt: "2024-01-01" },
    ...overrides,
  };
}

function makeAttendanceRecord(overrides: Partial<AttendanceRecord> = {}): AttendanceRecord {
  return {
    id: "att-001",
    schoolId: "school-001",
    date: "2024-01-15",
    entityType: "student",
    entityId: "s-001",
    status: "present",
    markedBy: "teacher-001",
    audit: { createdAt: "2024-01-15", updatedAt: "2024-01-15" },
    ...overrides,
  };
}

// ─── studentStatusToVariant ────────────────────────────────────────────────────

describe("studentStatusToVariant", () => {
  it("maps active to active", () => {
    expect(studentStatusToVariant("active")).toBe("active");
  });

  it("maps suspended to suspended", () => {
    expect(studentStatusToVariant("suspended")).toBe("suspended");
  });

  it("maps inactive to inactive", () => {
    expect(studentStatusToVariant("inactive")).toBe("inactive");
  });

  it("maps graduated to inactive (fallback)", () => {
    expect(studentStatusToVariant("graduated")).toBe("inactive");
  });
});

// ─── mapStudentsToRows ─────────────────────────────────────────────────────────

describe("mapStudentsToRows", () => {
  it("maps students to table rows", () => {
    const student = makeStudent();
    const cls = makeClassLevel();
    const section = makeSection();
    const guardian = makeGuardian();

    const rows = mapStudentsToRows([student], [cls], [section], [guardian]);

    expect(rows).toHaveLength(1);
    expect(rows[0].fullName).toBe("Ahmed Ali");
    expect(rows[0].className).toBe("Grade 1");
    expect(rows[0].sectionName).toBe("A");
    expect(rows[0].guardianName).toBe("Ali Hassan");
  });

  it("falls back to id when class/section not found", () => {
    const student = makeStudent({ classId: "unknown-class" });
    const rows = mapStudentsToRows([student], [], [], []);
    expect(rows[0].className).toBe("unknown-class");
  });

  it("falls back to dash when guardian not found", () => {
    const student = makeStudent();
    const rows = mapStudentsToRows([student], [], [], []);
    expect(rows[0].guardianName).toBe("—");
  });

  it("returns empty array for empty input", () => {
    const rows = mapStudentsToRows([], [], [], []);
    expect(rows).toHaveLength(0);
  });
});

// ─── buildStudentStatusSummary ─────────────────────────────────────────────────

describe("buildStudentStatusSummary", () => {
  it("counts total, active, and suspended correctly", () => {
    const students = [
      makeStudent({ status: "active" }),
      makeStudent({ id: "s-002", status: "active" }),
      makeStudent({ id: "s-003", status: "suspended" }),
      makeStudent({ id: "s-004", status: "graduated" }),
    ];

    const summary = buildStudentStatusSummary(students, 2024);

    expect(summary.total).toBe(4);
    expect(summary.active).toBe(2);
    expect(summary.suspended).toBe(1);
  });

  it("counts new admissions for the given year", () => {
    const students = [
      makeStudent({ admissionDate: "2024-01-01" }),
      makeStudent({ id: "s-002", admissionDate: "2023-01-01" }),
    ];

    const summary = buildStudentStatusSummary(students, 2024);
    expect(summary.newAdmissions).toBe(1);
  });

  it("returns zeros for empty array", () => {
    const summary = buildStudentStatusSummary([]);
    expect(summary.total).toBe(0);
    expect(summary.active).toBe(0);
    expect(summary.suspended).toBe(0);
    expect(summary.newAdmissions).toBe(0);
  });
});

// ─── filterSuspendedStudents ───────────────────────────────────────────────────

describe("filterSuspendedStudents", () => {
  it("returns only suspended students", () => {
    const students = [
      makeStudent({ status: "active" }),
      makeStudent({ id: "s-002", status: "suspended" }),
      makeStudent({ id: "s-003", status: "suspended" }),
    ];

    const suspended = filterSuspendedStudents(students);
    expect(suspended).toHaveLength(2);
    expect(suspended.every((s) => s.status === "suspended")).toBe(true);
  });

  it("returns empty when no suspended students", () => {
    const students = [
      makeStudent({ status: "active" }),
      makeStudent({ id: "s-002", status: "inactive" }),
    ];

    expect(filterSuspendedStudents(students)).toHaveLength(0);
  });
});

// ─── countAttendanceStatuses ───────────────────────────────────────────────────

describe("countAttendanceStatuses", () => {
  it("counts each attendance status correctly", () => {
    const records = [
      makeAttendanceRecord({ status: "present" }),
      makeAttendanceRecord({ id: "att-002", status: "present" }),
      makeAttendanceRecord({ id: "att-003", status: "absent" }),
      makeAttendanceRecord({ id: "att-004", status: "late" }),
      makeAttendanceRecord({ id: "att-005", status: "half-day" }),
    ];

    const summary = countAttendanceStatuses(records);

    expect(summary.present).toBe(2);
    expect(summary.absent).toBe(1);
    expect(summary.late).toBe(1);
    expect(summary.halfDay).toBe(1);
    expect(summary.total).toBe(5);
  });

  it("returns zeros for empty array", () => {
    const summary = countAttendanceStatuses([]);
    expect(summary.total).toBe(0);
    expect(summary.present).toBe(0);
  });
});

// ─── buildCategoryStudentCounts ───────────────────────────────────────────────

describe("buildCategoryStudentCounts", () => {
  it("counts students per category", () => {
    const categories = [
      { id: "cat-001", schoolId: "school-001", name: "General", audit: { createdAt: "", updatedAt: "" } },
      { id: "cat-002", schoolId: "school-001", name: "SC", audit: { createdAt: "", updatedAt: "" } },
    ];
    const students = [
      makeStudent({ categoryId: "cat-001" }),
      makeStudent({ id: "s-002", categoryId: "cat-001" }),
      makeStudent({ id: "s-003", categoryId: "cat-002" }),
    ];

    const counts = buildCategoryStudentCounts(categories, students);

    expect(counts.get("cat-001")).toBe(2);
    expect(counts.get("cat-002")).toBe(1);
  });

  it("returns 0 for categories with no students", () => {
    const categories = [
      { id: "cat-001", schoolId: "school-001", name: "General", audit: { createdAt: "", updatedAt: "" } },
    ];
    const counts = buildCategoryStudentCounts(categories, []);
    expect(counts.get("cat-001")).toBe(0);
  });
});
