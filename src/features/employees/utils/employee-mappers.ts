// employee-mappers.ts — data transformation utilities for the Employees module

import type { Employee, EmployeeStatus, EmploymentType } from "@/types/employee";
import type { Department, Designation } from "@/types/employee";
import type { AttendanceRecord } from "@/types/attendance";
import type { StatusVariant } from "@/components/data-table/status-badge";

// ─── Status mapping ───────────────────────────────────────────────────────────

export function employeeStatusToVariant(status: EmployeeStatus): StatusVariant {
  switch (status) {
    case "active":
      return "active";
    case "inactive":
      return "inactive";
    case "on-leave":
      return "warning";
    case "terminated":
      return "destructive";
    default:
      return "inactive";
  }
}

export function employmentTypeLabel(type?: EmploymentType): string {
  switch (type) {
    case "full-time":
      return "Full Time";
    case "part-time":
      return "Part Time";
    case "contract":
      return "Contract";
    case "intern":
      return "Intern";
    default:
      return "—";
  }
}

// ─── List row shape ───────────────────────────────────────────────────────────

export interface EmployeeTableRow {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  departmentId: string;
  departmentName: string;
  designationId: string;
  designationName: string;
  employmentType: EmploymentType | undefined;
  employmentTypeLabel: string;
  phone: string;
  email: string;
  joiningDate: string;
  baseSalaryAmount: number;
  baseSalaryCurrency: string;
  status: EmployeeStatus;
  statusVariant: StatusVariant;
  qualification: string;
  profileImageUrl?: string;
}

export function mapEmployeesToRows(
  employees: Employee[],
  departments: Department[],
  designations: Designation[]
): EmployeeTableRow[] {
  const deptMap = new Map(departments.map((d) => [d.id, d.name]));
  const desMap = new Map(designations.map((d) => [d.id, d.name]));

  return employees.map((e) => ({
    id: e.id,
    employeeCode: e.employeeCode,
    firstName: e.firstName,
    lastName: e.lastName,
    fullName: `${e.firstName} ${e.lastName}`,
    departmentId: e.departmentId,
    departmentName: deptMap.get(e.departmentId) ?? e.departmentId,
    designationId: e.designationId,
    designationName: desMap.get(e.designationId) ?? e.designationId,
    employmentType: e.employmentType,
    employmentTypeLabel: employmentTypeLabel(e.employmentType),
    phone: e.contact?.phone ?? "—",
    email: e.contact?.email ?? "—",
    joiningDate: e.joiningDate,
    baseSalaryAmount: e.basicSalary.amount,
    baseSalaryCurrency: e.basicSalary.currency,
    status: e.status,
    statusVariant: employeeStatusToVariant(e.status),
    qualification: e.qualification,
    profileImageUrl: e.profileImageUrl,
  }));
}

// ─── Status summary ───────────────────────────────────────────────────────────

export interface EmployeeStatusSummary {
  total: number;
  active: number;
  onLeave: number;
  terminated: number;
}

export function buildEmployeeStatusSummary(employees: Employee[]): EmployeeStatusSummary {
  return {
    total: employees.length,
    active: employees.filter((e) => e.status === "active").length,
    onLeave: employees.filter((e) => e.status === "on-leave").length,
    terminated: employees.filter((e) => e.status === "terminated").length,
  };
}

// ─── Attendance helpers ────────────────────────────────────────────────────────

export interface AttendanceStatusCounts {
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  leave: number;
}

export function countAttendanceStatuses(records: AttendanceRecord[]): AttendanceStatusCounts {
  return {
    present: records.filter((r) => r.status === "present").length,
    absent: records.filter((r) => r.status === "absent").length,
    late: records.filter((r) => r.status === "late").length,
    halfDay: records.filter((r) => r.status === "half-day").length,
    leave: records.filter((r) => r.status === "leave").length,
  };
}
