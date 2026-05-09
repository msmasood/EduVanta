"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { DataTableColumnHeader, StatusBadge } from "@/components/data-table";
import type { PayrollTableRow } from "../utils/hrm-mappers";

// ─── Column definitions ───────────────────────────────────────────────────────

export function buildPayrollColumns(
  onViewPayslip: (row: PayrollTableRow) => void
): ColumnDef<PayrollTableRow>[] {
  return [
    {
      accessorKey: "employeeName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Employee" />,
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.employeeName}</p>
          <p className="text-xs text-muted-foreground">{row.original.employeeCode}</p>
        </div>
      ),
    },
    {
      accessorKey: "period",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Period" />,
    },
    {
      accessorKey: "basicSalaryFormatted",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Basic Salary" />,
    },
    {
      accessorKey: "allowancesFormatted",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Allowances" />,
    },
    {
      accessorKey: "deductionsFormatted",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Deductions" />,
    },
    {
      accessorKey: "netSalaryFormatted",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Net Salary" />,
      cell: ({ row }) => (
        <span className="font-semibold">{row.original.netSalaryFormatted}</span>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <StatusBadge status={row.original.statusVariant} label={row.original.status} />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <button
          onClick={() => onViewPayslip(row.original)}
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="View Payslip"
        >
          <Eye className="size-4" aria-hidden />
        </button>
      ),
    },
  ];
}
