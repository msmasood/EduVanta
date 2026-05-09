import { describe, it, expect } from "vitest";
import { getStudents, getStudentById, getStudentCategories, getStudentsByClass } from "@/services/mock/students.service";
import { getTeachers, getTeacherById } from "@/services/mock/teachers.service";
import { getGuardians, getGuardianByStudentId } from "@/services/mock/guardians.service";
import { getEmployees, getDepartments } from "@/services/mock/employees.service";
import { getAcademicYears, getCurrentAcademicYear } from "@/services/mock/academic.service";
import { getFeeInvoices, getFeeGroups } from "@/services/mock/fees.service";
import { getTransactions } from "@/services/mock/finance.service";
import { getAttendanceRecords, getAttendanceSummaries } from "@/services/mock/attendance.service";
import { getExams, getExamById, getGradeScales } from "@/services/mock/exams.service";
import { getLeaveRequests, getLeaveTypes } from "@/services/mock/leaves.service";
import { getBooks, getLibraryMembers } from "@/services/mock/library.service";
import { getNotices, getCalendarEvents } from "@/services/mock/communication.service";
import { getDashboardSummary, getAllDashboardPersonas } from "@/services/mock/dashboard.service";
import { getSchools, getSchoolById } from "@/services/mock/schools.service";

// All tests use ms=0 to skip artificial delays

// ─── Students ─────────────────────────────────────────────────────────────────
describe("studentsService", () => {
  it("returns paginated list", async () => {
    const res = await getStudents(undefined, 0);
    expect(res.data.length).toBeGreaterThan(0);
    expect(typeof res.total).toBe("number");
  });

  it("respects pageSize", async () => {
    const res = await getStudents({ page: 1, pageSize: 3 }, 0);
    expect(res.data.length).toBeLessThanOrEqual(3);
  });

  it("filters by search term", async () => {
    const all = await getStudents(undefined, 0);
    const firstName = all.data[0].firstName;
    const filtered = await getStudents({ search: firstName }, 0);
    expect(filtered.data.every((s) =>
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(firstName.toLowerCase())
    )).toBe(true);
  });

  it("returns student by id", async () => {
    const all = await getStudents(undefined, 0);
    const id = all.data[0].id;
    const res = await getStudentById(id, 0);
    expect(res.success).toBe(true);
    expect(res.data?.id).toBe(id);
  });

  it("returns error for unknown id", async () => {
    const res = await getStudentById("__nonexistent__", 0);
    expect(res.success).toBe(false);
  });

  it("returns categories", async () => {
    const res = await getStudentCategories(0);
    expect(res.success).toBe(true);
    expect(res.data.length).toBeGreaterThan(0);
  });

  it("filters by class", async () => {
    const all = await getStudents(undefined, 0);
    const classId = all.data[0].classId;
    if (classId) {
      const res = await getStudentsByClass(classId, undefined, 0);
      expect(res.data.every((s) => s.classId === classId)).toBe(true);
    }
  });
});

// ─── Teachers ─────────────────────────────────────────────────────────────────
describe("teachersService", () => {
  it("returns paginated list", async () => {
    const res = await getTeachers(undefined, 0);
    expect(res.data.length).toBeGreaterThan(0);
  });

  it("returns teacher by id", async () => {
    const all = await getTeachers(undefined, 0);
    const id = all.data[0].id;
    const res = await getTeacherById(id, 0);
    expect(res.success).toBe(true);
    expect(res.data?.id).toBe(id);
  });
});

// ─── Guardians ────────────────────────────────────────────────────────────────
describe("guardiansService", () => {
  it("returns paginated list", async () => {
    const res = await getGuardians(undefined, 0);
    expect(res.data.length).toBeGreaterThan(0);
  });

  it("returns guardian by student id", async () => {
    const students = await getStudents(undefined, 0);
    const studentId = students.data[0].id;
    const res = await getGuardianByStudentId(studentId, 0);
    // May or may not have a guardian, just must not throw
    expect(res).toBeDefined();
  });
});

// ─── Employees ────────────────────────────────────────────────────────────────
describe("employeesService", () => {
  it("returns employees", async () => {
    const res = await getEmployees(undefined, 0);
    expect(res.data.length).toBeGreaterThan(0);
  });

  it("returns departments", async () => {
    const res = await getDepartments(0);
    expect(res.data.length).toBeGreaterThan(0);
  });
});

// ─── Academic ─────────────────────────────────────────────────────────────────
describe("academicService", () => {
  it("returns academic years", async () => {
    const res = await getAcademicYears(undefined, 0);
    expect(res.data.length).toBeGreaterThan(0);
  });

  it("returns current academic year for school-001", async () => {
    const res = await getCurrentAcademicYear("school-001", 0);
    expect(res.success).toBe(true);
    expect(res.data).not.toBeNull();
  });
});

// ─── Fees ─────────────────────────────────────────────────────────────────────
describe("feesService", () => {
  it("returns paginated invoices", async () => {
    const res = await getFeeInvoices(undefined, 0);
    expect(res.data.length).toBeGreaterThan(0);
  });

  it("returns fee groups", async () => {
    const res = await getFeeGroups(0);
    expect(res.data.length).toBeGreaterThan(0);
  });
});

// ─── Finance ──────────────────────────────────────────────────────────────────
describe("financeService", () => {
  it("returns transactions", async () => {
    const res = await getTransactions(undefined, 0);
    expect(res.data.length).toBeGreaterThan(0);
  });
});

// ─── Attendance ───────────────────────────────────────────────────────────────
describe("attendanceService", () => {
  it("returns records", async () => {
    const res = await getAttendanceRecords(undefined, undefined, 0);
    expect(res.data.length).toBeGreaterThan(0);
  });

  it("filters by entityType", async () => {
    const res = await getAttendanceRecords("student", undefined, 0);
    expect(res.data.every((r) => r.entityType === "student")).toBe(true);
  });

  it("returns summaries", async () => {
    const res = await getAttendanceSummaries(undefined, 0);
    expect(res.data.length).toBeGreaterThan(0);
  });
});

// ─── Exams ────────────────────────────────────────────────────────────────────
describe("examsService", () => {
  it("returns paginated exams", async () => {
    const res = await getExams(undefined, 0);
    expect(res.data.length).toBeGreaterThan(0);
  });

  it("returns exam by id", async () => {
    const all = await getExams(undefined, 0);
    const id = all.data[0].id;
    const res = await getExamById(id, 0);
    expect(res.success).toBe(true);
    expect(res.data?.id).toBe(id);
  });

  it("returns grade scales", async () => {
    const res = await getGradeScales(0);
    expect(res.data.length).toBeGreaterThan(0);
  });
});

// ─── Leaves ───────────────────────────────────────────────────────────────────
describe("leavesService", () => {
  it("returns leave types", async () => {
    const res = await getLeaveTypes(0);
    expect(res.data.length).toBeGreaterThan(0);
  });

  it("returns paginated leave requests", async () => {
    const res = await getLeaveRequests(undefined, 0);
    expect(res.data.length).toBeGreaterThan(0);
  });
});

// ─── Library ──────────────────────────────────────────────────────────────────
describe("libraryService", () => {
  it("returns books", async () => {
    const res = await getBooks(undefined, 0);
    expect(res.data.length).toBeGreaterThan(0);
  });

  it("returns library members", async () => {
    const res = await getLibraryMembers(0);
    expect(res.data.length).toBeGreaterThan(0);
  });
});

// ─── Communication ────────────────────────────────────────────────────────────
describe("communicationService", () => {
  it("returns notices", async () => {
    const res = await getNotices(undefined, 0);
    expect(res.data.length).toBeGreaterThan(0);
  });

  it("returns calendar events", async () => {
    const res = await getCalendarEvents(undefined, undefined, 0);
    expect(res.data.length).toBeGreaterThan(0);
  });
});

// ─── Schools ──────────────────────────────────────────────────────────────────
describe("schoolsService", () => {
  it("returns schools", async () => {
    const res = await getSchools(0);
    expect(res.data.length).toBeGreaterThan(0);
  });

  it("returns school by id", async () => {
    const res = await getSchoolById("school-001", 0);
    expect(res.success).toBe(true);
    expect(res.data?.id).toBe("school-001");
  });

  it("returns error for invalid id", async () => {
    const res = await getSchoolById("__bad__", 0);
    expect(res.success).toBe(false);
  });
});

// ─── Dashboard ────────────────────────────────────────────────────────────────
describe("dashboardService", () => {
  const PERSONAS = ["school", "student", "teacher", "parent", "lms", "university"] as const;

  it("returns summary for all 6 personas", async () => {
    for (const p of PERSONAS) {
      const res = await getDashboardSummary(p, "school-001", 0);
      expect(res.success).toBe(true);
      expect(res.data?.data).toBeDefined();
    }
  });

  it("returns all persona keys", async () => {
    const res = await getAllDashboardPersonas(0);
    expect(res.success).toBe(true);
    PERSONAS.forEach((p) => expect(res.data).toContain(p));
  });

  it("returns error for unknown persona", async () => {
    const res = await getDashboardSummary("__bad__" as never, "school-001", 0);
    expect(res.success).toBe(false);
  });
});

// ─── Sorting ──────────────────────────────────────────────────────────────────
describe("service sorting", () => {
  it("students sorted ascending by firstName", async () => {
    const res = await getStudents({ sortField: "firstName", sortDirection: "asc" }, 0);
    const names = res.data.map((s) => s.firstName);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  it("students sorted descending by firstName", async () => {
    const res = await getStudents({ sortField: "firstName", sortDirection: "desc" }, 0);
    const names = res.data.map((s) => s.firstName);
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });
});

// ─── Pagination ───────────────────────────────────────────────────────────────
describe("service pagination", () => {
  it("page 1 and page 2 return different records", async () => {
    const p1 = await getStudents({ page: 1, pageSize: 5 }, 0);
    const p2 = await getStudents({ page: 2, pageSize: 5 }, 0);
    if (p2.data.length > 0) {
      const p1ids = p1.data.map((s) => s.id);
      const p2ids = p2.data.map((s) => s.id);
      expect(p1ids.some((id) => p2ids.includes(id))).toBe(false);
    }
  });

  it("total reflects full dataset", async () => {
    const all = await getStudents(undefined, 0);
    const paged = await getStudents({ page: 1, pageSize: 3 }, 0);
    expect(paged.total).toBe(all.total);
  });
});
