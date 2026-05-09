import { describe, it, expect } from "vitest";
import {
  mapAttendanceStatusToVariant,
  getAttendanceStatusLabel,
  mapStudentAttendanceRows,
  mapTeacherAttendanceRows,
  mapEmployeeAttendanceRows,
  groupAttendanceByDate,
  buildAttendanceCalendarDays,
} from "@/features/attendance/utils/attendance-mappers";
import { computeAttendanceSummary, computeAttendanceRate } from "@/features/attendance/utils/attendance-calculations";
import type { AttendanceRecord } from "@/types/attendance";

const audit = {
  createdAt: "2024-10-01T08:00:00.000Z",
  updatedAt: "2024-10-01T08:00:00.000Z",
};

// ─── mapAttendanceStatusToVariant ─────────────────────────────────────────────

describe("mapAttendanceStatusToVariant", () => {
  it("maps present → present", () =>
    expect(mapAttendanceStatusToVariant("present")).toBe("present"));
  it("maps absent → absent", () =>
    expect(mapAttendanceStatusToVariant("absent")).toBe("absent"));
  it("maps late → late", () =>
    expect(mapAttendanceStatusToVariant("late")).toBe("late"));
  it("maps half-day → partial", () =>
    expect(mapAttendanceStatusToVariant("half-day")).toBe("partial"));
  it("maps leave → info", () =>
    expect(mapAttendanceStatusToVariant("leave")).toBe("info"));
  it("maps excused → warning", () =>
    expect(mapAttendanceStatusToVariant("excused")).toBe("warning"));
  it("maps unknown → neutral", () =>
    expect(mapAttendanceStatusToVariant("on-leave")).toBe("neutral"));
});

// ─── getAttendanceStatusLabel ─────────────────────────────────────────────────

describe("getAttendanceStatusLabel", () => {
  it("returns correct labels", () => {
    expect(getAttendanceStatusLabel("present")).toBe("Present");
    expect(getAttendanceStatusLabel("absent")).toBe("Absent");
    expect(getAttendanceStatusLabel("late")).toBe("Late");
    expect(getAttendanceStatusLabel("half-day")).toBe("Half Day");
    expect(getAttendanceStatusLabel("leave")).toBe("Leave");
  });
});

// ─── mapStudentAttendanceRows ─────────────────────────────────────────────────

describe("mapStudentAttendanceRows", () => {
  const records: AttendanceRecord[] = [
    {
      id: "att-001",
      schoolId: "school-001",
      date: "2024-10-01",
      entityType: "student",
      entityId: "student-001",
      status: "present",
      markedBy: "teacher-001",
      audit,
    },
    {
      id: "att-002",
      schoolId: "school-001",
      date: "2024-10-01",
      entityType: "teacher", // should be excluded
      entityId: "teacher-001",
      status: "present",
      markedBy: "emp-001",
      audit,
    },
  ];
  const students = [
    {
      id: "student-001",
      schoolId: "school-001",
      firstName: "Ali",
      lastName: "Hassan",
      admissionNumber: "ADM-001",
      classId: "class-001",
      sectionId: "sec-001",
      rollNumber: "01",
      dateOfBirth: "2010-01-01",
      gender: "male" as const,
      status: "active" as const,
      guardianId: "g-001",
      categoryId: "cat-001",
      address: { street: "", city: "", state: "", country: "", postalCode: "" },
      contact: { phone: "", email: "" },
      nationality: "PK",
      admissionDate: "2020-01-01",
      audit,
    },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ] as any[];
  const classes = [{ id: "class-001", schoolId: "school-001", name: "Class 1", code: "CL-01", order: 1, status: "active" as const, audit }];
  const sections = [{ id: "sec-001", schoolId: "school-001", classId: "class-001", name: "A", code: "1-A", capacity: 35, status: "active" as const, audit }];

  it("maps only student records", () => {
    const rows = mapStudentAttendanceRows(records, students, classes, sections);
    expect(rows).toHaveLength(1);
    expect(rows[0].id).toBe("att-001");
  });

  it("enriches with student name and class", () => {
    const rows = mapStudentAttendanceRows(records, students, classes, sections);
    expect(rows[0].studentName).toBe("Ali Hassan");
    expect(rows[0].admissionNumber).toBe("ADM-001");
    expect(rows[0].className).toBe("Class 1");
    expect(rows[0].sectionName).toBe("A");
  });

  it("uses entityId as fallback when student not found", () => {
    const rows = mapStudentAttendanceRows(
      [{ ...records[0], entityId: "unknown-student" }],
      students,
      classes,
      sections
    );
    expect(rows[0].studentName).toBe("unknown-student");
  });
});

// ─── mapTeacherAttendanceRows ─────────────────────────────────────────────────

describe("mapTeacherAttendanceRows", () => {
  const records: AttendanceRecord[] = [
    {
      id: "att-007",
      schoolId: "school-001",
      date: "2024-10-01",
      entityType: "teacher",
      entityId: "teacher-001",
      status: "present",
      checkInTime: "07:45",
      checkOutTime: "14:30",
      markedBy: "emp-001",
      audit,
    },
  ];
  const teachers = [
    {
      id: "teacher-001",
      schoolId: "school-001",
      firstName: "Fatima",
      lastName: "Khan",
      employeeCode: "TCH-001",
      departmentId: "dept-001",
      designation: "Senior Teacher",
      subjects: [] as string[],
      status: "active" as const,
      joiningDate: "2020-01-01",
      qualification: "M.Ed",
      experience: 5,
      dateOfBirth: "1985-01-01",
      gender: "female" as const,
      address: { street: "", city: "", state: "", country: "", postalCode: "" },
      contact: { phone: "", email: "" },
      audit,
    },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ] as any[];
  const departments = [
    { id: "dept-001", schoolId: "school-001", name: "Mathematics", code: "MATH", status: "active" as const, audit },
  ];

  it("maps teacher records correctly", () => {
    const rows = mapTeacherAttendanceRows(records, teachers, departments);
    expect(rows).toHaveLength(1);
    expect(rows[0].teacherName).toBe("Fatima Khan");
    expect(rows[0].departmentName).toBe("Mathematics");
    expect(rows[0].checkInTime).toBe("07:45");
  });
});

// ─── groupAttendanceByDate ────────────────────────────────────────────────────

describe("groupAttendanceByDate", () => {
  const records: AttendanceRecord[] = [
    { id: "att-001", schoolId: "s", date: "2024-10-01", entityType: "student", entityId: "student-001", status: "present", markedBy: "t", audit },
    { id: "att-002", schoolId: "s", date: "2024-10-01", entityType: "student", entityId: "student-002", status: "absent", markedBy: "t", audit },
    { id: "att-003", schoolId: "s", date: "2024-10-02", entityType: "student", entityId: "student-001", status: "present", markedBy: "t", audit },
  ];

  it("groups records by date", () => {
    const groups = groupAttendanceByDate(records);
    expect(groups).toHaveLength(2);
    const oct1 = groups.find((g) => g.date === "2024-10-01");
    expect(oct1?.records).toHaveLength(2);
    expect(oct1?.presentCount).toBe(1);
    expect(oct1?.absentCount).toBe(1);
  });
});

// ─── computeAttendanceSummary ─────────────────────────────────────────────────

describe("computeAttendanceSummary", () => {
  const records: AttendanceRecord[] = [
    { id: "a1", schoolId: "s", date: "2024-10-01", entityType: "student", entityId: "s1", status: "present", markedBy: "t", audit },
    { id: "a2", schoolId: "s", date: "2024-10-02", entityType: "student", entityId: "s1", status: "absent", markedBy: "t", audit },
    { id: "a3", schoolId: "s", date: "2024-10-03", entityType: "student", entityId: "s1", status: "late", markedBy: "t", audit },
    { id: "a4", schoolId: "s", date: "2024-10-04", entityType: "student", entityId: "s1", status: "half-day", markedBy: "t", audit },
  ];

  it("computes correct counts", () => {
    const summary = computeAttendanceSummary(records);
    expect(summary.present).toBe(1);
    expect(summary.absent).toBe(1);
    expect(summary.late).toBe(1);
    expect(summary.halfDay).toBe(1);
    expect(summary.total).toBe(4);
  });
});

// ─── computeAttendanceRate ────────────────────────────────────────────────────

describe("computeAttendanceRate", () => {
  it("returns 0 for empty records", () => {
    expect(computeAttendanceRate([])).toBe(0);
  });

  it("counts present and late as attended", () => {
    const records: AttendanceRecord[] = [
      { id: "a1", schoolId: "s", date: "2024-10-01", entityType: "student", entityId: "s1", status: "present", markedBy: "t", audit },
      { id: "a2", schoolId: "s", date: "2024-10-02", entityType: "student", entityId: "s1", status: "late", markedBy: "t", audit },
      { id: "a3", schoolId: "s", date: "2024-10-03", entityType: "student", entityId: "s1", status: "absent", markedBy: "t", audit },
      { id: "a4", schoolId: "s", date: "2024-10-04", entityType: "student", entityId: "s1", status: "absent", markedBy: "t", audit },
    ];
    expect(computeAttendanceRate(records)).toBe(50);
  });
});

// ─── buildAttendanceCalendarDays ──────────────────────────────────────────────

describe("buildAttendanceCalendarDays", () => {
  const records: AttendanceRecord[] = [
    { id: "a1", schoolId: "s", date: "2024-10-01", entityType: "student", entityId: "s1", status: "present", markedBy: "t", audit },
    { id: "a2", schoolId: "s", date: "2024-10-01", entityType: "student", entityId: "s2", status: "absent", markedBy: "t", audit },
    { id: "a3", schoolId: "s", date: "2024-10-15", entityType: "student", entityId: "s1", status: "late", markedBy: "t", audit },
  ];

  it("builds 31 days for October", () => {
    const days = buildAttendanceCalendarDays(records, 2024, 10);
    expect(days).toHaveLength(31);
  });

  it("assigns records to correct dates", () => {
    const days = buildAttendanceCalendarDays(records, 2024, 10);
    const oct1 = days.find((d) => d.dayNumber === 1);
    expect(oct1?.records).toHaveLength(2);
    const oct15 = days.find((d) => d.dayNumber === 15);
    expect(oct15?.records).toHaveLength(1);
    const oct10 = days.find((d) => d.dayNumber === 10);
    expect(oct10?.records).toHaveLength(0);
  });
});
