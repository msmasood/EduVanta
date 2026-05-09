// hrm-mappers.ts — data transformation utilities for HRM module

import type { PayrollRecord, PayrollStatus, Employee, Department, Designation } from "@/types/employee";
import type { StatusVariant } from "@/components/data-table/status-badge";
import { formatCurrency } from "@/lib/currency";

// ─── Payroll status mapping ────────────────────────────────────────────────────

export function payrollStatusToVariant(status: PayrollStatus): StatusVariant {
  switch (status) {
    case "paid":
      return "active";
    case "processed":
      return "info";
    case "draft":
      return "neutral";
    default:
      return "neutral";
  }
}

// ─── Payroll row shape ─────────────────────────────────────────────────────────

export interface PayrollTableRow {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  period: string;
  month: number;
  year: number;
  basicSalaryFormatted: string;
  allowancesFormatted: string;
  deductionsFormatted: string;
  netSalaryFormatted: string;
  netSalaryAmount: number;
  currency: string;
  status: PayrollStatus;
  statusVariant: StatusVariant;
  processedAt?: string;
  paidAt?: string;
}

export function mapPayrollToRows(
  records: PayrollRecord[],
  employees: Employee[]
): PayrollTableRow[] {
  const empMap = new Map(
    employees.map((e) => [e.id, { name: `${e.firstName} ${e.lastName}`, code: e.employeeCode }])
  );

  return records.map((r) => {
    const emp = empMap.get(r.employeeId);
    const currency = r.netSalary.currency;
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const period = `${months[r.month - 1] ?? r.month} ${r.year}`;

    return {
      id: r.id,
      employeeId: r.employeeId,
      employeeName: emp?.name ?? r.employeeId,
      employeeCode: emp?.code ?? "",
      period,
      month: r.month,
      year: r.year,
      basicSalaryFormatted: formatCurrency(r.basicSalary.amount, currency),
      allowancesFormatted: formatCurrency(r.allowances.amount, currency),
      deductionsFormatted: formatCurrency(r.deductions.amount, currency),
      netSalaryFormatted: formatCurrency(r.netSalary.amount, currency),
      netSalaryAmount: r.netSalary.amount,
      currency,
      status: r.status,
      statusVariant: payrollStatusToVariant(r.status),
      processedAt: r.processedAt,
      paidAt: r.paidAt,
    };
  });
}

// ─── Payroll summary ──────────────────────────────────────────────────────────

export interface PayrollSummary {
  totalFormatted: string;
  paidCount: number;
  pendingCount: number;
  avgFormatted: string;
  currency: string;
}

export function buildPayrollSummary(records: PayrollRecord[]): PayrollSummary {
  if (!records.length) {
    return { totalFormatted: "—", paidCount: 0, pendingCount: 0, avgFormatted: "—", currency: "PKR" };
  }
  const currency = records[0]!.netSalary.currency;
  const total = records.reduce((sum, r) => sum + r.netSalary.amount, 0);
  const paid = records.filter((r) => r.status === "paid");
  const pending = records.filter((r) => r.status !== "paid");
  const avg = total / records.length;

  return {
    totalFormatted: formatCurrency(total, currency),
    paidCount: paid.length,
    pendingCount: pending.length,
    avgFormatted: formatCurrency(avg, currency),
    currency,
  };
}

// ─── Department row shape ──────────────────────────────────────────────────────

export interface DepartmentTableRow {
  id: string;
  name: string;
  headId?: string;
  employeeCount?: number;
}

export function mapDepartmentsToRows(
  departments: Department[],
  employees: Employee[]
): DepartmentTableRow[] {
  return departments.map((d) => ({
    id: d.id,
    name: d.name,
    headId: d.headId,
    employeeCount: employees.filter((e) => e.departmentId === d.id).length,
  }));
}

// ─── Designation row shape ──────────────────────────────────────────────────────

export interface DesignationTableRow {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
  employeeCount?: number;
}

export function mapDesignationsToRows(
  designations: Designation[],
  departments: Department[],
  employees: Employee[]
): DesignationTableRow[] {
  const deptMap = new Map(departments.map((d) => [d.id, d.name]));
  return designations.map((d) => ({
    id: d.id,
    name: d.name,
    departmentId: d.departmentId,
    departmentName: deptMap.get(d.departmentId) ?? d.departmentId,
    employeeCount: employees.filter((e) => e.designationId === d.id).length,
  }));
}
