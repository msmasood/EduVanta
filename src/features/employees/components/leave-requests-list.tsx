"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { DataTable, TableSkeleton, DataTableColumnHeader, StatusBadge } from "@/components/data-table";
import { useLeaveRequests, useLeaveTypes } from "@/hooks/queries/use-leaves";
import { useEmployees } from "@/hooks/queries/use-employees";
import type { LeaveRequest } from "@/types/leaves";
import { LeaveRequestFormDialog } from "./leave-request-form-dialog";

// ─── Status variant helper ────────────────────────────────────────────────────

function leaveStatusVariant(status: string) {
  if (status === "approved") return "active" as const;
  if (status === "rejected") return "destructive" as const;
  return "pending" as const;
}

// ─── Columns ──────────────────────────────────────────────────────────────────

function buildColumns(
  employeeMap: Map<string, string>,
  leaveTypeMap: Map<string, string>
): ColumnDef<LeaveRequest>[] {
  return [
    {
      accessorKey: "entityId",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Employee" />,
      cell: ({ row }) => employeeMap.get(row.original.entityId) ?? row.original.entityId,
    },
    {
      accessorKey: "leaveTypeId",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Leave Type" />,
      cell: ({ row }) => leaveTypeMap.get(row.original.leaveTypeId) ?? row.original.leaveTypeId,
    },
    {
      accessorKey: "fromDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="From" />,
    },
    {
      accessorKey: "toDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="To" />,
    },
    {
      accessorKey: "days",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Days" />,
    },
    {
      accessorKey: "reason",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Reason" />,
      cell: ({ row }) => (
        <span className="max-w-40 truncate block" title={row.original.reason}>
          {row.original.reason}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <StatusBadge
          status={leaveStatusVariant(row.original.status)}
          label={row.original.status}
        />
      ),
    },
    {
      accessorKey: "appliedAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Applied" />,
      cell: ({ row }) => new Date(row.original.appliedAt).toLocaleDateString(),
    },
  ];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LeaveRequestsList() {
  const leaveRequestsQuery = useLeaveRequests();
  const leaveTypesQuery = useLeaveTypes();
  const employeesQuery = useEmployees();

  const employeeRequests = React.useMemo(() => {
    const all = leaveRequestsQuery.data?.data ?? [];
    return all.filter((r) => r.entityType === "employee");
  }, [leaveRequestsQuery.data]);

  const employeeMap = React.useMemo(() => {
    const employees = employeesQuery.data?.data ?? [];
    return new Map(employees.map((e) => [e.id, `${e.firstName} ${e.lastName}`]));
  }, [employeesQuery.data]);

  const leaveTypeMap = React.useMemo(() => {
    const types = leaveTypesQuery.data?.data ?? [];
    return new Map(types.map((t) => [t.id, t.name]));
  }, [leaveTypesQuery.data]);

  const columns = React.useMemo(
    () => buildColumns(employeeMap, leaveTypeMap),
    [employeeMap, leaveTypeMap]
  );

  const isLoading =
    leaveRequestsQuery.isLoading || leaveTypesQuery.isLoading || employeesQuery.isLoading;

  if (isLoading) {
    return (
      <div className="space-y-4" data-testid="leave-requests-list">
        <TableSkeleton columns={7} rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="leave-requests-list">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Leave Requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and manage employee leave requests.
          </p>
        </div>
        <LeaveRequestFormDialog
          employees={employeesQuery.data?.data ?? []}
          leaveTypes={leaveTypesQuery.data?.data ?? []}
          onSubmit={() => toast.success("Leave request submitted.")}
        />
      </div>

      <DataTable
        columns={columns}
        data={employeeRequests}
        defaultPageSize={10}
        emptyTitle="No leave requests"
        emptyDescription="No employee leave requests found."
      />
    </div>
  );
}
