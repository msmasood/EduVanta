"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import { DataTable, TableSkeleton } from "@/components/data-table";
import { exportRowsToCsv } from "@/lib/export";
import type { CsvColumn } from "@/lib/export";
import { mapEmployeesToRows, buildEmployeeStatusSummary } from "../utils/employee-mappers";
import { useEmployeeColumns, EMPLOYEE_FILTER_CONFIGS } from "./employee-columns";
import { EmployeeStatusCards } from "./employee-status-summary";
import { useEmployees, useDepartments, useDesignations } from "@/hooks/queries/use-employees";

// ─── CSV columns ──────────────────────────────────────────────────────────────

const CSV_COLUMNS: CsvColumn[] = [
  { accessorKey: "fullName", header: "Full Name" },
  { accessorKey: "employeeCode", header: "Employee Code" },
  { accessorKey: "departmentName", header: "Department" },
  { accessorKey: "designationName", header: "Designation" },
  { accessorKey: "employmentTypeLabel", header: "Employment Type" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "joiningDate", header: "Joining Date" },
  { accessorKey: "status", header: "Status" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function EmployeeList() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";

  const employeesQuery = useEmployees();
  const departmentsQuery = useDepartments();
  const designationsQuery = useDesignations();

  const rows = React.useMemo(() => {
    const employees = employeesQuery.data?.data ?? [];
    const departments = departmentsQuery.data?.data ?? [];
    const designations = designationsQuery.data?.data ?? [];
    return mapEmployeesToRows(employees, departments, designations);
  }, [employeesQuery.data, departmentsQuery.data, designationsQuery.data]);

  const summary = React.useMemo(
    () => buildEmployeeStatusSummary(employeesQuery.data?.data ?? []),
    [employeesQuery.data]
  );

  const handleDelete = React.useCallback((id: string) => {
    toast.success(`Employee ${id} deleted (mock).`);
  }, []);

  const columns = useEmployeeColumns(handleDelete);

  const isLoading =
    employeesQuery.isLoading || departmentsQuery.isLoading || designationsQuery.isLoading;

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="employee-list">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl border bg-muted" />
          ))}
        </div>
        <TableSkeleton columns={8} rows={8} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="employee-list">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Employees</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage employee profiles, departments, and records.
          </p>
        </div>
        <Link
          href={`/${locale}/employees/new`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-2.5 h-8 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
        >
          <UserPlus className="me-2 size-4" aria-hidden />
          Add Employee
        </Link>
      </div>

      {/* Summary cards */}
      <EmployeeStatusCards summary={summary} />

      {/* Table */}
      <DataTable
        columns={columns}
        data={rows}
        filterConfigs={EMPLOYEE_FILTER_CONFIGS}
        selectable
        defaultPageSize={10}
        emptyTitle="No employees found"
        emptyDescription="Add your first employee using the button above."
        showExport
        onExport={() =>
          exportRowsToCsv(
            rows as unknown as Record<string, unknown>[],
            CSV_COLUMNS,
            "employees"
          )
        }
      />
    </div>
  );
}
