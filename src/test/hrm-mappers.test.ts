import { describe, it, expect } from "vitest";
import {
  payrollStatusToVariant,
  mapPayrollToRows,
  buildPayrollSummary,
  mapDepartmentsToRows,
} from "@/features/hrm/utils/hrm-mappers";
import type { PayrollRecord, Employee, Department } from "@/types/employee";

// ─── payrollStatusToVariant ───────────────────────────────────────────────────

describe("payrollStatusToVariant", () => {
  it("maps paid → active", () => expect(payrollStatusToVariant("paid")).toBe("active"));
  it("maps processed → info", () => expect(payrollStatusToVariant("processed")).toBe("info"));
  it("maps draft → neutral", () => expect(payrollStatusToVariant("draft")).toBe("neutral"));
});

// ─── helpers ──────────────────────────────────────────────────────────────────

const audit = { createdAt: "", updatedAt: "" };

const makePayroll = (id: string, status: PayrollRecord["status"]): PayrollRecord => ({
  id,
  employeeId: "emp-001",
  schoolId: "school-1",
  month: 7,
  year: 2025,
  basicSalary: { amount: 50000, currency: "PKR" },
  allowances: { amount: 5000, currency: "PKR" },
  deductions: { amount: 2000, currency: "PKR" },
  netSalary: { amount: 53000, currency: "PKR" },
  status,
  audit,
});

const makeEmployee = (id: string): Employee => ({
  id,
  schoolId: "school-1",
  firstName: "Hassan",
  lastName: "Malik",
  employeeCode: "EMP-001",
  gender: "male",
  dateOfBirth: "1990-01-01",
  status: "active",
  departmentId: "dept-001",
  designationId: "des-001",
  employmentType: "full-time",
  joiningDate: "2022-01-01",
  qualification: "BSc",
  contact: { email: "hassan@test.com", phone: "+921234567890" },
  address: { line1: "123 Main St", city: "Karachi", country: "Pakistan" },
  basicSalary: { amount: 50000, currency: "PKR" },
  audit,
});

// ─── mapPayrollToRows ─────────────────────────────────────────────────────────

describe("mapPayrollToRows", () => {
  it("maps payroll records to rows", () => {
    const records = [makePayroll("pay-1", "paid")];
    const employees = [makeEmployee("emp-001")];
    const rows = mapPayrollToRows(records, employees);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.employeeName).toBe("Hassan Malik");
    expect(rows[0]!.status).toBe("paid");
    expect(rows[0]!.statusVariant).toBe("active");
    expect(rows[0]!.period).toMatch(/Jul 2025/);
  });

  it("handles missing employee gracefully", () => {
    const rows = mapPayrollToRows([makePayroll("pay-1", "draft")], []);
    expect(rows[0]!.employeeName).toBe("emp-001");
  });
});

// ─── buildPayrollSummary ──────────────────────────────────────────────────────

describe("buildPayrollSummary", () => {
  it("returns default summary for empty records", () => {
    const summary = buildPayrollSummary([]);
    expect(summary.paidCount).toBe(0);
    expect(summary.pendingCount).toBe(0);
    expect(summary.totalFormatted).toBe("—");
  });

  it("correctly counts paid and pending", () => {
    const records = [
      makePayroll("p1", "paid"),
      makePayroll("p2", "paid"),
      makePayroll("p3", "draft"),
    ];
    const summary = buildPayrollSummary(records);
    expect(summary.paidCount).toBe(2);
    expect(summary.pendingCount).toBe(1);
  });
});

// ─── mapDepartmentsToRows ─────────────────────────────────────────────────────

describe("mapDepartmentsToRows", () => {
  it("maps departments with employee counts", () => {
    const departments: Department[] = [
      { id: "dept-001", schoolId: "school-1", name: "Math", headId: undefined, audit },
    ];
    const employees = [makeEmployee("emp-001")];
    const rows = mapDepartmentsToRows(departments, employees);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.name).toBe("Math");
    expect(rows[0]!.employeeCount).toBe(1);
  });
});
