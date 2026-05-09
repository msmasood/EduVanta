"use client";

import * as React from "react";
import { useParams } from "next/navigation";

import { DataTable, TableSkeleton, EmptyTableState } from "@/components/data-table";
import { useEmployees, useDepartments, useDesignations } from "@/hooks/queries/use-employees";
import { useAttendanceRecords } from "@/hooks/queries/use-attendance";
import { countAttendanceStatuses } from "../utils/employee-mappers";
import { EmployeeAttendanceSummary } from "./employee-attendance-summary";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader, StatusBadge } from "@/components/data-table";
import type { AttendanceRecord } from "@/types/attendance";

// ─── Columns ──────────────────────────────────────────────────────────────────

const columns: ColumnDef<AttendanceRecord>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
  },
  {
    accessorKey: "entityId",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Employee" />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const s = row.original.status;
      const variant =
        s === "present"
          ? "active"
          : s === "absent"
          ? "destructive"
          : s === "late"
          ? "warning"
          : s === "leave"
          ? "info"
          : "neutral";
      return <StatusBadge status={variant} label={s} />;
    },
  },
  {
    accessorKey: "checkInTime",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Check In" />,
    cell: ({ row }) => row.original.checkInTime ?? "—",
  },
  {
    accessorKey: "checkOutTime",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Check Out" />,
    cell: ({ row }) => row.original.checkOutTime ?? "—",
  },
  {
    accessorKey: "remarks",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Remarks" />,
    cell: ({ row }) => row.original.remarks ?? "—",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function EmployeeAttendanceList() {
  const attendanceQuery = useAttendanceRecords("employee");
  const records = attendanceQuery.data?.data ?? [];
  const counts = React.useMemo(() => countAttendanceStatuses(records), [records]);

  if (attendanceQuery.isLoading) {
    return (
      <div className="space-y-4" data-testid="employee-attendance">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl border bg-muted" />
          ))}
        </div>
        <TableSkeleton columns={6} rows={8} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="employee-attendance">
      <div>
        <h1 className="text-2xl font-semibold">Employee Attendance</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and manage daily employee attendance records.
        </p>
      </div>

      <EmployeeAttendanceSummary counts={counts} />

      <DataTable
        columns={columns}
        data={records}
        defaultPageSize={10}
        emptyTitle="No attendance records"
        emptyDescription="No attendance records found for employees."
      />
    </div>
  );
}
