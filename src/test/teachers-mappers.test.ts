import { describe, it, expect } from "vitest";
import {
  mapTeachersToRows,
  buildTeacherStatusSummary,
  countTeacherAttendanceStatuses,
  mapTimetableEntriesToRows,
  mapTimetableToCalendarEvents,
  teacherStatusToVariant,
} from "@/features/teachers/utils/teacher-mappers";
import type { Teacher } from "@/types/teacher";
import type { AttendanceRecord } from "@/types/attendance";

// ─── Test fixtures ────────────────────────────────────────────────────────────

const mockTeacher: Teacher = {
  id: "teacher-001",
  schoolId: "school-001",
  employeeCode: "TC001",
  firstName: "Amina",
  lastName: "Bukhari",
  dateOfBirth: "1985-03-15",
  gender: "female",
  designation: "Senior Teacher",
  departmentId: "dept-001",
  subjects: ["sub-001", "sub-002"],
  address: {
    line1: "123 Main St",
    line2: "",
    city: "Karachi",
    state: "Sindh",
    country: "Pakistan",
    postalCode: "75000",
  },
  contact: {
    email: "amina@school.edu",
    phone: "+923001234567",
    alternatePhone: "",
  },
  qualification: "M.Ed",
  experience: 10,
  joiningDate: "2018-01-01",
  status: "active",
  audit: {
    createdAt: "2018-01-01",
    updatedAt: "2024-01-01",
    createdBy: "admin",
    updatedBy: "admin",
  },
};

const mockDepts = [{ id: "dept-001", name: "Mathematics", schoolId: "s1", audit: { createdAt: "", updatedAt: "", createdBy: "", updatedBy: "" } }];
const mockSubjects = [
  { id: "sub-001", schoolId: "s1", name: "Mathematics", code: "MATH", type: "theory" as const, classIds: [], status: "active" as const, audit: { createdAt: "", updatedAt: "", createdBy: "", updatedBy: "" } },
  { id: "sub-002", schoolId: "s1", name: "English", code: "ENG", type: "theory" as const, classIds: [], status: "active" as const, audit: { createdAt: "", updatedAt: "", createdBy: "", updatedBy: "" } },
];

// ─── teacherStatusToVariant ──────────────────────────────────────────────────

describe("teacherStatusToVariant", () => {
  it("maps active → active", () => {
    expect(teacherStatusToVariant("active")).toBe("active");
  });
  it("maps inactive → inactive", () => {
    expect(teacherStatusToVariant("inactive")).toBe("inactive");
  });
  it("maps on-leave → warning", () => {
    expect(teacherStatusToVariant("on-leave")).toBe("warning");
  });
});

// ─── mapTeachersToRows ───────────────────────────────────────────────────────

describe("mapTeachersToRows", () => {
  it("maps a teacher to a row", () => {
    const rows = mapTeachersToRows([mockTeacher], mockDepts, mockSubjects);
    expect(rows).toHaveLength(1);
    const row = rows[0];
    expect(row.fullName).toBe("Amina Bukhari");
    expect(row.employeeCode).toBe("TC001");
    expect(row.departmentName).toBe("Mathematics");
    expect(row.subjectNames).toEqual(["Mathematics", "English"]);
    expect(row.email).toBe("amina@school.edu");
    expect(row.phone).toBe("+923001234567");
    expect(row.status).toBe("active");
  });

  it("returns empty array for no teachers", () => {
    expect(mapTeachersToRows([], mockDepts, mockSubjects)).toHaveLength(0);
  });

  it("falls back to departmentId when dept not found", () => {
    const rows = mapTeachersToRows([mockTeacher], [], mockSubjects);
    expect(rows[0].departmentName).toBe("dept-001");
  });
});

// ─── buildTeacherStatusSummary ───────────────────────────────────────────────

describe("buildTeacherStatusSummary", () => {
  it("counts active and on-leave correctly", () => {
    const onLeaveTeacher: Teacher = { ...mockTeacher, id: "teacher-002", status: "on-leave" };
    const summary = buildTeacherStatusSummary([mockTeacher, onLeaveTeacher], mockDepts);
    expect(summary.total).toBe(2);
    expect(summary.active).toBe(1);
    expect(summary.onLeave).toBe(1);
    expect(summary.departments).toBe(1);
  });

  it("handles empty teacher list", () => {
    const summary = buildTeacherStatusSummary([], mockDepts);
    expect(summary.total).toBe(0);
    expect(summary.departments).toBe(0);
  });
});

// ─── countTeacherAttendanceStatuses ─────────────────────────────────────────

describe("countTeacherAttendanceStatuses", () => {
  const makeRecord = (status: AttendanceRecord["status"]): AttendanceRecord => ({
    id: `att-${status}`,
    schoolId: "s1",
    entityId: "teacher-001",
    entityType: "teacher",
    date: "2024-01-15",
    status,
    checkInTime: undefined,
    checkOutTime: undefined,
    remarks: undefined,
    markedBy: "admin",
    audit: { createdAt: "", updatedAt: "", createdBy: "", updatedBy: "" },
  });

  it("counts all attendance statuses", () => {
    const records = [
      makeRecord("present"),
      makeRecord("present"),
      makeRecord("absent"),
      makeRecord("late"),
      makeRecord("leave"),
    ];
    const counts = countTeacherAttendanceStatuses(records);
    expect(counts.present).toBe(2);
    expect(counts.absent).toBe(1);
    expect(counts.late).toBe(1);
    expect(counts.leave).toBe(1);
  });

  it("returns zeros for empty records", () => {
    const counts = countTeacherAttendanceStatuses([]);
    expect(counts.present).toBe(0);
    expect(counts.absent).toBe(0);
    expect(counts.late).toBe(0);
  });
});

// ─── mapTimetableEntriesToRows ───────────────────────────────────────────────

describe("mapTimetableEntriesToRows", () => {
  const mockEntry = {
    id: "tte-001",
    teacherId: "teacher-001",
    subjectId: "sub-001",
    classId: "class-001",
    sectionId: "sec-001",
    classroomId: "room-001",
    day: "monday" as const,
    startTime: "08:00",
    endTime: "09:00",
    academicYearId: "ay-2024",
    audit: { createdAt: "", updatedAt: "", createdBy: "", updatedBy: "" },
  };
  const classes = [{ id: "class-001", name: "Class 1", order: 1, schoolId: "s1", status: "active" as const, audit: { createdAt: "", updatedAt: "", createdBy: "", updatedBy: "" } }];
  const sections = [{ id: "sec-001", name: "A", code: "1-A", classId: "class-001", schoolId: "s1", capacity: 30, status: "active" as const, audit: { createdAt: "", updatedAt: "", createdBy: "", updatedBy: "" } }];
  const classrooms = [{ id: "room-001", name: "Room 101", code: "R101", type: "classroom" as const, schoolId: "s1", capacity: 30, status: "active" as const, audit: { createdAt: "", updatedAt: "", createdBy: "", updatedBy: "" } }];

  it("maps a timetable entry to a row", () => {
    const rows = mapTimetableEntriesToRows(
      [mockEntry],
      [mockTeacher],
      mockSubjects,
      classes,
      sections,
      classrooms
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].teacherName).toBe("Amina Bukhari");
    expect(rows[0].subjectName).toBe("Mathematics");
    expect(rows[0].className).toBe("Class 1");
    expect(rows[0].sectionName).toBe("A");
    expect(rows[0].room).toBe("Room 101");
    expect(rows[0].day).toBe("monday");
    expect(rows[0].timeLabel).toContain("08:00");
  });
});

// ─── mapTimetableToCalendarEvents ────────────────────────────────────────────

describe("mapTimetableToCalendarEvents", () => {
  it("returns empty array for empty rows", () => {
    expect(mapTimetableToCalendarEvents([])).toHaveLength(0);
  });

  it("generates calendar events from rows", () => {
    const rows = [
      {
        id: "tte-001",
        teacherId: "teacher-001",
        teacherName: "Amina Bukhari",
        subjectName: "Mathematics",
        className: "Class 1",
        sectionName: "A",
        room: "Room 101",
        day: "monday",
        startTime: "08:00",
        endTime: "09:00",
        timeLabel: "08:00 – 09:00",
      },
    ];
    const events = mapTimetableToCalendarEvents(rows);
    expect(events).toHaveLength(1);
    expect(events[0].title).toContain("Mathematics");
    expect(events[0].start).toBeTruthy();
    expect(events[0].end).toBeTruthy();
  });
});
