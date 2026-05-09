import { describe, it, expect } from "vitest";
import {
  employeeStatusToVariant,
  employmentTypeLabel,
  mapEmployeesToRows,
  buildEmployeeStatusSummary,
  countAttendanceStatuses,
} from "@/features/employees/utils/employee-mappers";
import type { Employee } from "@/types/employee";
import type { AttendanceRecord } from "@/types/attendance";

// ─── employeeStatusToVariant ──────────────────────────────────────────────────

describe("employeeStatusToVariant", () => {
  it("maps active → active", () => {
    expect(employeeStatusToVariant("active")).toBe("active");
  });
  it("maps inactive → inactive", () => {
    expect(employeeStatusToVariant("inactive")).toBe("inactive");
  });
  it("maps on-leave → warning", () => {
    expect(employeeStatusToVariant("on-leave")).toBe("warning");
  });
  it("maps terminated → destructive", () => {
    expect(employeeStatusToVariant("terminated")).toBe("destructive");
  });
});

// ─── employmentTypeLabel ──────────────────────────────────────────────────────

describe("employmentTypeLabel", () => {
  it("returns Full Time for full-time", () => {
    expect(employmentTypeLabel("full-time")).toBe("Full Time");
  });
  it("returns Part Time for part-time", () => {
    expect(employmentTypeLabel("part-time")).toBe("Part Time");
  });
  it("returns Contract for contract", () => {
    expect(employmentTypeLabel("contract")).toBe("Contract");
  });
  it("returns Intern for intern", () => {
    expect(employmentTypeLabel("intern")).toBe("Intern");
  });
});

// ─── buildEmployeeStatusSummary ───────────────────────────────────────────────

const makeEmployee = (id: string, status: Employee["status"]): Employee => ({
  id,
  schoolId: "school-1",
  firstName: "Test",
  lastName: "User",
  employeeCode: `EMP-${id}`,
  gender: "male",
  dateOfBirth: "1990-01-01",
  status,
  departmentId: "dept-001",
  designationId: "des-001",
  employmentType: "full-time",
  joiningDate: "2022-01-01",
  qualification: "BSc",
  contact: { email: `user${id}@test.com`, phone: "+921234567890" },
  address: { line1: "123 Main St", city: "Karachi", country: "Pakistan" },
  basicSalary: { amount: 50000, currency: "PKR" },
  audit: { createdAt: "2022-01-01T00:00:00Z", updatedAt: "2022-01-01T00:00:00Z" },
});

describe("buildEmployeeStatusSummary", () => {
  it("correctly counts all statuses", () => {
    const employees: Employee[] = [
      makeEmployee("1", "active"),
      makeEmployee("2", "active"),
      makeEmployee("3", "on-leave"),
      makeEmployee("4", "terminated"),
      makeEmployee("5", "inactive"),
    ];
    const summary = buildEmployeeStatusSummary(employees);
    expect(summary.total).toBe(5);
    expect(summary.active).toBe(2);
    expect(summary.onLeave).toBe(1);
    expect(summary.terminated).toBe(1);
  });

  it("handles empty array", () => {
    const summary = buildEmployeeStatusSummary([]);
    expect(summary.total).toBe(0);
    expect(summary.active).toBe(0);
  });
});

// ─── countAttendanceStatuses ─────────────────────────────────────────────────

const makeAttendance = (id: string, status: AttendanceRecord["status"]): AttendanceRecord => ({
  id,
  schoolId: "school-1",
  entityId: "emp-001",
  entityType: "employee",
  date: "2025-07-01",
  status,
  markedBy: "admin-1",
  audit: { createdAt: "2025-07-01T00:00:00Z", updatedAt: "2025-07-01T00:00:00Z" },
});

describe("countAttendanceStatuses", () => {
  it("counts attendance statuses correctly", () => {
    const records: AttendanceRecord[] = [
      makeAttendance("1", "present"),
      makeAttendance("2", "present"),
      makeAttendance("3", "absent"),
      makeAttendance("4", "late"),
      makeAttendance("5", "half-day"),
      makeAttendance("6", "leave"),
    ];
    const counts = countAttendanceStatuses(records);
    expect(counts.present).toBe(2);
    expect(counts.absent).toBe(1);
    expect(counts.late).toBe(1);
    expect(counts.halfDay).toBe(1);
    expect(counts.leave).toBe(1);
  });

  it("returns all zeros for empty input", () => {
    const counts = countAttendanceStatuses([]);
    expect(counts.present).toBe(0);
    expect(counts.absent).toBe(0);
    expect(counts.late).toBe(0);
    expect(counts.halfDay).toBe(0);
    expect(counts.leave).toBe(0);
  });
});

// ─── mapEmployeesToRows ───────────────────────────────────────────────────────

describe("mapEmployeesToRows", () => {
  it("maps employees to flat rows correctly", () => {
    const employees: Employee[] = [makeEmployee("1", "active")];
    const departments = [{ id: "dept-001", schoolId: "school-1", name: "Math", headId: undefined, audit: { createdAt: "", updatedAt: "" } }];
    const designations = [{ id: "des-001", schoolId: "school-1", name: "Teacher", departmentId: "dept-001", audit: { createdAt: "", updatedAt: "" } }];
    const rows = mapEmployeesToRows(employees, departments, designations);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.fullName).toBe("Test User");
    expect(rows[0]!.departmentName).toBe("Math");
    expect(rows[0]!.designationName).toBe("Teacher");
    expect(rows[0]!.statusVariant).toBe("active");
  });

  it("falls back to entityId when department/designation not found", () => {
    const rows = mapEmployeesToRows([makeEmployee("1", "active")], [], []);
    expect(rows[0]!.departmentName).toBe("dept-001");
    expect(rows[0]!.designationName).toBe("des-001");
  });
});
