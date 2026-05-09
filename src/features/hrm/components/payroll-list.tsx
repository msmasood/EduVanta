"use client";

import * as React from "react";
import { toast } from "sonner";

import { DataTable, TableSkeleton } from "@/components/data-table";
import { exportRowsToCsv } from "@/lib/export";
import type { CsvColumn } from "@/lib/export";
import { mapPayrollToRows, buildPayrollSummary } from "../utils/hrm-mappers";
import { buildPayrollColumns } from "./payroll-columns";
import { PayrollSummaryCards } from "./payroll-summary-cards";
import { PayslipPreviewDialog } from "./payslip-preview-dialog";
import { usePayrollRecords, useEmployees } from "@/hooks/queries/use-employees";
import type { PayrollTableRow } from "../utils/hrm-mappers";
import { type FilterConfig } from "@/components/data-table";

// ─── CSV columns ──────────────────────────────────────────────────────────────

const CSV_COLUMNS: CsvColumn[] = [
  { accessorKey: "employeeName", header: "Employee" },
  { accessorKey: "employeeCode", header: "Employee Code" },
  { accessorKey: "period", header: "Period" },
  { accessorKey: "basicSalaryFormatted", header: "Basic Salary" },
  { accessorKey: "allowancesFormatted", header: "Allowances" },
  { accessorKey: "deductionsFormatted", header: "Deductions" },
  { accessorKey: "netSalaryFormatted", header: "Net Salary" },
  { accessorKey: "status", header: "Status" },
];

const PAYROLL_FILTER_CONFIGS: FilterConfig[] = [
  {
    columnId: "status",
    title: "Status",
    options: [
      { label: "Draft", value: "draft" },
      { label: "Processed", value: "processed" },
      { label: "Paid", value: "paid" },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function PayrollList() {
  const payrollQuery = usePayrollRecords();
  const employeesQuery = useEmployees();

  const [selectedRecord, setSelectedRecord] = React.useState<PayrollTableRow | null>(null);
  const [payslipOpen, setPayslipOpen] = React.useState(false);

  const rows = React.useMemo(() => {
    const records = payrollQuery.data?.data ?? [];
    const employees = employeesQuery.data?.data ?? [];
    return mapPayrollToRows(records, employees);
  }, [payrollQuery.data, employeesQuery.data]);

  const summary = React.useMemo(
    () => buildPayrollSummary(payrollQuery.data?.data ?? []),
    [payrollQuery.data]
  );

  const handleViewPayslip = React.useCallback((row: PayrollTableRow) => {
    setSelectedRecord(row);
    setPayslipOpen(true);
  }, []);

  const columns = React.useMemo(
    () => buildPayrollColumns(handleViewPayslip),
    [handleViewPayslip]
  );

  const isLoading = payrollQuery.isLoading || employeesQuery.isLoading;

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="payroll-list">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl border bg-muted" />
          ))}
        </div>
        <TableSkeleton columns={8} rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="payroll-list">
      <div>
        <h1 className="text-2xl font-semibold">Payroll</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and manage employee payroll records.
        </p>
      </div>

      <PayrollSummaryCards summary={summary} />

      <DataTable
        columns={columns}
        data={rows}
        filterConfigs={PAYROLL_FILTER_CONFIGS}
        defaultPageSize={10}
        emptyTitle="No payroll records"
        emptyDescription="No payroll records found."
        showExport
        onExport={() =>
          exportRowsToCsv(
            rows as unknown as Record<string, unknown>[],
            CSV_COLUMNS,
            "payroll"
          )
        }
      />

      <PayslipPreviewDialog
        open={payslipOpen}
        onOpenChange={setPayslipOpen}
        record={selectedRecord}
      />
    </div>
  );
}
