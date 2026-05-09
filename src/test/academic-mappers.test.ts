import { describe, it, expect } from "vitest";
import {
  activeStatusToVariant,
  classroomTypeLabel,
  subjectTypeLabel,
  mapClassesToRows,
  mapClassroomsToRows,
  mapSectionsToRows,
  mapSubjectsToRows,
} from "@/features/academic/utils/academic-mappers";
import type { ClassLevel, Section, Subject, Classroom } from "@/types/academic";
import type { Teacher } from "@/types/teacher";

const audit = { createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z" };

// ─── Helpers ──────────────────────────────────────────────────────────────────

describe("activeStatusToVariant", () => {
  it("maps active → active", () => expect(activeStatusToVariant("active")).toBe("active"));
  it("maps inactive → inactive", () => expect(activeStatusToVariant("inactive")).toBe("inactive"));
});

describe("classroomTypeLabel", () => {
  it("returns correct labels", () => {
    expect(classroomTypeLabel("classroom")).toBe("Classroom");
    expect(classroomTypeLabel("lab")).toBe("Lab");
    expect(classroomTypeLabel("auditorium")).toBe("Auditorium");
    expect(classroomTypeLabel("library")).toBe("Library");
    expect(classroomTypeLabel("other")).toBe("Other");
  });
});

describe("subjectTypeLabel", () => {
  it("returns correct labels", () => {
    expect(subjectTypeLabel("theory")).toBe("Theory");
    expect(subjectTypeLabel("practical")).toBe("Practical");
    expect(subjectTypeLabel("elective")).toBe("Elective");
  });
});

// ─── mapClassesToRows ─────────────────────────────────────────────────────────

describe("mapClassesToRows", () => {
  const classes: ClassLevel[] = [
    { id: "class-001", schoolId: "school-001", name: "Class 1", code: "CL-01", order: 1, status: "active", audit },
    { id: "class-002", schoolId: "school-001", name: "Class 2", code: "CL-02", order: 2, status: "inactive", audit },
  ];
  const sections: Section[] = [
    { id: "sec-001", schoolId: "school-001", classId: "class-001", name: "A", code: "1-A", capacity: 35, status: "active", audit },
    { id: "sec-002", schoolId: "school-001", classId: "class-001", name: "B", code: "1-B", capacity: 35, status: "active", audit },
  ];

  it("maps class fields", () => {
    const rows = mapClassesToRows(classes, sections);
    expect(rows).toHaveLength(2);
    expect(rows[0].name).toBe("Class 1");
    expect(rows[0].code).toBe("CL-01");
    expect(rows[0].order).toBe(1);
    expect(rows[0].status).toBe("active");
    expect(rows[0].statusVariant).toBe("active");
  });

  it("counts sections per class", () => {
    const rows = mapClassesToRows(classes, sections);
    expect(rows[0].sectionCount).toBe(2);
    expect(rows[1].sectionCount).toBe(0);
  });

  it("maps inactive statusVariant", () => {
    const rows = mapClassesToRows(classes, sections);
    expect(rows[1].statusVariant).toBe("inactive");
  });
});

// ─── mapClassroomsToRows ──────────────────────────────────────────────────────

describe("mapClassroomsToRows", () => {
  const classrooms: Classroom[] = [
    {
      id: "room-001",
      schoolId: "school-001",
      name: "Room 101",
      code: "R101",
      type: "classroom",
      building: "Block A",
      floor: "1",
      capacity: 40,
      status: "active",
      audit,
    },
    {
      id: "room-002",
      schoolId: "school-001",
      name: "Computer Lab",
      code: "LAB-CS",
      type: "lab",
      capacity: 30,
      status: "active",
      audit,
    },
  ];

  it("maps classroom fields", () => {
    const rows = mapClassroomsToRows(classrooms);
    expect(rows).toHaveLength(2);
    expect(rows[0].name).toBe("Room 101");
    expect(rows[0].typeLabel).toBe("Classroom");
    expect(rows[0].building).toBe("Block A");
    expect(rows[1].typeLabel).toBe("Lab");
  });

  it("handles missing building/floor", () => {
    const rows = mapClassroomsToRows(classrooms);
    expect(rows[1].building).toBeUndefined();
  });
});

// ─── mapSectionsToRows ────────────────────────────────────────────────────────

describe("mapSectionsToRows", () => {
  const classes: ClassLevel[] = [
    { id: "class-001", schoolId: "s", name: "Class 1", code: "CL-01", order: 1, status: "active", audit },
  ];
  const classrooms: Classroom[] = [
    { id: "room-001", schoolId: "s", name: "Room 101", code: "R101", type: "classroom", capacity: 40, status: "active", audit },
  ];
  const teachers: Teacher[] = [
    {
      id: "teacher-001",
      schoolId: "s",
      employeeCode: "TCH-001",
      firstName: "Ahmed",
      lastName: "Khan",
      dateOfBirth: "1980-01-01",
      gender: "male",
      designation: "Teacher",
      departmentId: "dept-001",
      subjects: [],
      address: { line1: "123 St", city: "Karachi", country: "Pakistan" },
      contact: { email: "ahmed@test.com", phone: "+921234567890" },
      qualification: "BSc",
      experience: 5,
      joiningDate: "2019-01-01",
      status: "active",
      audit,
    },
  ];
  const sections: Section[] = [
    {
      id: "sec-001",
      schoolId: "s",
      classId: "class-001",
      name: "A",
      code: "1-A",
      capacity: 35,
      classroomId: "room-001",
      teacherId: "teacher-001",
      status: "active",
      audit,
    },
  ];

  it("maps section fields with resolved names", () => {
    const rows = mapSectionsToRows(sections, classes, teachers, classrooms);
    expect(rows).toHaveLength(1);
    expect(rows[0].className).toBe("Class 1");
    expect(rows[0].teacherName).toBe("Ahmed Khan");
    expect(rows[0].classroomName).toBe("Room 101");
  });

  it("shows — for missing teacher/classroom", () => {
    const sec = { ...sections[0], teacherId: undefined, classroomId: undefined };
    const rows = mapSectionsToRows([sec], classes, teachers, classrooms);
    expect(rows[0].teacherName).toBe("—");
    expect(rows[0].classroomName).toBe("—");
  });
});

// ─── mapSubjectsToRows ────────────────────────────────────────────────────────

describe("mapSubjectsToRows", () => {
  const subjects: Subject[] = [
    {
      id: "sub-001",
      schoolId: "s",
      name: "Mathematics",
      code: "MATH",
      type: "theory",
      classIds: ["class-001", "class-002", "class-003"],
      creditHours: 4,
      status: "active",
      audit,
    },
    {
      id: "sub-002",
      schoolId: "s",
      name: "Computer Science",
      code: "CS",
      type: "practical",
      classIds: [],
      status: "inactive",
      audit,
    },
  ];

  it("maps subject fields", () => {
    const rows = mapSubjectsToRows(subjects);
    expect(rows).toHaveLength(2);
    expect(rows[0].name).toBe("Mathematics");
    expect(rows[0].typeLabel).toBe("Theory");
    expect(rows[0].classCount).toBe(3);
    expect(rows[0].creditHours).toBe(4);
  });

  it("maps practical type label", () => {
    const rows = mapSubjectsToRows(subjects);
    expect(rows[1].typeLabel).toBe("Practical");
  });

  it("handles missing creditHours", () => {
    const rows = mapSubjectsToRows(subjects);
    expect(rows[1].creditHours).toBeUndefined();
  });
});
