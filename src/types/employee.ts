import type { ID, ActiveStatus, Gender, Address, ContactInfo, AuditMeta, MoneyAmount } from "./common";

// ─── Department ───────────────────────────────────────────────────────────────

export interface Department {
  id: ID;
  schoolId: ID;
  name: string;
  headId?: ID;
  audit: AuditMeta;
}

// ─── Designation ──────────────────────────────────────────────────────────────

export interface Designation {
  id: ID;
  schoolId: ID;
  name: string;
  departmentId: ID;
  audit: AuditMeta;
}

// ─── Employee ─────────────────────────────────────────────────────────────────

export type EmployeeStatus = "active" | "inactive" | "on-leave" | "terminated";
export type EmploymentType = "full-time" | "part-time" | "contract" | "intern";

export interface Employee {
  id: ID;
  schoolId: ID;
  employeeCode: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  departmentId: ID;
  designationId: ID;
  contact: ContactInfo;
  address: Address;
  joiningDate: string;
  qualification: string;
  basicSalary: MoneyAmount;
  employmentType?: EmploymentType;
  status: EmployeeStatus;
  profileImageUrl?: string;
  audit: AuditMeta;
}

// ─── Payroll ──────────────────────────────────────────────────────────────────

export type PayrollStatus = "draft" | "processed" | "paid";

export interface PayrollRecord {
  id: ID;
  employeeId: ID;
  schoolId: ID;
  month: number;
  year: number;
  basicSalary: MoneyAmount;
  allowances: MoneyAmount;
  deductions: MoneyAmount;
  netSalary: MoneyAmount;
  status: PayrollStatus;
  processedAt?: string;
  paidAt?: string;
  audit: AuditMeta;
}
