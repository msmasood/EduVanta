"use client";

import * as React from "react";
import { Pencil, StickyNote } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { DataTable, TableSkeleton, DataTableColumnHeader } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { AttendanceStatusBadge } from "./attendance-status-badge";
import type { StudentAttendanceRow } from "../utils/attendance-mappers";
import type { TeacherAttendanceRow } from "../utils/attendance-mappers";
import type { EmployeeAttendanceRow } from "../utils/attendance-mappers";
import { formatShortDate } from "@/lib/dates";
import type { FilterConfig } from "@/components/data-table/data-table";

// ─── Filter configs ───────────────────────────────────────────────────────────

export const ATTENDANCE_STATUS_FILTER_CONFIGS: FilterConfig[] = [
  {
    columnId: "status",
    title: "Status",
    options: [
      { label: "Present", value: "present" },
      { label: "Absent", value: "absent" },
      { label: "Late", value: "late" },
      { label: "Half Day", value: "half-day" },
      { label: "Leave", value: "leave" },
    ],
  },
];

// ─── Student columns ──────────────────────────────────────────────────────────

type StudentColAction = {
  onNotes: (row: StudentAttendanceRow) => void;
  onEdit: (row: StudentAttendanceRow) => void;
};

export function buildStudentAttendanceColumns(
  actions: StudentColAction
): ColumnDef<StudentAttendanceRow>[] {
  return [
    {
      accessorKey: "date",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
      cell: ({ getValue }) => (
        <span className="text-sm">{formatShortDate(getValue<string>())}</span>
      ),
    },
    {
      accessorKey: "studentName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Student" />,
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "admissionNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Adm. No." />
      ),
    },
    {
      accessorKey: "className",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Class" />,
    },
    {
      accessorKey: "sectionName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Section" />,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <AttendanceStatusBadge status={row.original.status} />
      ),
      filterFn: (row, columnId, value) =>
        !value || value.length === 0 || value.includes(row.getValue(columnId)),
    },
    {
      accessorKey: "checkInTime",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Check-In" />,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            title="Edit status"
            onClick={() => actions.onEdit(row.original)}
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            title="Add notes"
            onClick={() => actions.onNotes(row.original)}
          >
            <StickyNote className="size-3.5" />
          </Button>
        </div>
      ),
    },
  ];
}

// ─── Teacher columns ──────────────────────────────────────────────────────────

type TeacherColAction = {
  onNotes: (row: TeacherAttendanceRow) => void;
  onEdit: (row: TeacherAttendanceRow) => void;
};

export function buildTeacherAttendanceColumns(
  actions: TeacherColAction
): ColumnDef<TeacherAttendanceRow>[] {
  return [
    {
      accessorKey: "date",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
      cell: ({ getValue }) => (
        <span className="text-sm">{formatShortDate(getValue<string>())}</span>
      ),
    },
    {
      accessorKey: "teacherName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Teacher" />,
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "teacherCode",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Code" />
      ),
    },
    {
      accessorKey: "departmentName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Department" />
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => <AttendanceStatusBadge status={row.original.status} />,
      filterFn: (row, columnId, value) =>
        !value || value.length === 0 || value.includes(row.getValue(columnId)),
    },
    {
      accessorKey: "checkInTime",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Check-In" />,
    },
    {
      accessorKey: "checkOutTime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Check-Out" />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            title="Edit status"
            onClick={() => actions.onEdit(row.original)}
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            title="Add notes"
            onClick={() => actions.onNotes(row.original)}
          >
            <StickyNote className="size-3.5" />
          </Button>
        </div>
      ),
    },
  ];
}

// ─── Employee columns ─────────────────────────────────────────────────────────

type EmployeeColAction = {
  onNotes: (row: EmployeeAttendanceRow) => void;
  onEdit: (row: EmployeeAttendanceRow) => void;
};

export function buildEmployeeAttendanceColumns(
  actions: EmployeeColAction
): ColumnDef<EmployeeAttendanceRow>[] {
  return [
    {
      accessorKey: "date",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
      cell: ({ getValue }) => (
        <span className="text-sm">{formatShortDate(getValue<string>())}</span>
      ),
    },
    {
      accessorKey: "employeeName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Employee" />
      ),
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "employeeCode",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
    },
    {
      accessorKey: "departmentName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Department" />
      ),
    },
    {
      accessorKey: "designationName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Designation" />
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => <AttendanceStatusBadge status={row.original.status} />,
      filterFn: (row, columnId, value) =>
        !value || value.length === 0 || value.includes(row.getValue(columnId)),
    },
    {
      accessorKey: "checkInTime",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Check-In" />,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            title="Edit status"
            onClick={() => actions.onEdit(row.original)}
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            title="Add notes"
            onClick={() => actions.onNotes(row.original)}
          >
            <StickyNote className="size-3.5" />
          </Button>
        </div>
      ),
    },
  ];
}

// ─── AttendanceRecordsTable ───────────────────────────────────────────────────

interface StudentTableProps {
  entityType: "student";
  rows: StudentAttendanceRow[];
  isLoading: boolean;
  onNotes: (row: StudentAttendanceRow) => void;
  onEdit: (row: StudentAttendanceRow) => void;
}
interface TeacherTableProps {
  entityType: "teacher";
  rows: TeacherAttendanceRow[];
  isLoading: boolean;
  onNotes: (row: TeacherAttendanceRow) => void;
  onEdit: (row: TeacherAttendanceRow) => void;
}
interface EmployeeTableProps {
  entityType: "employee";
  rows: EmployeeAttendanceRow[];
  isLoading: boolean;
  onNotes: (row: EmployeeAttendanceRow) => void;
  onEdit: (row: EmployeeAttendanceRow) => void;
}

type AttendanceRecordsTableProps =
  | StudentTableProps
  | TeacherTableProps
  | EmployeeTableProps;

export function AttendanceRecordsTable(props: AttendanceRecordsTableProps) {
  if (props.isLoading) {
    return <TableSkeleton columns={7} rows={6} />;
  }

  if (props.entityType === "student") {
    const columns = buildStudentAttendanceColumns({
      onNotes: props.onNotes,
      onEdit: props.onEdit,
    });
    return (
      <DataTable
        columns={columns}
        data={props.rows}
        filterConfigs={ATTENDANCE_STATUS_FILTER_CONFIGS}
        defaultPageSize={10}
        emptyTitle="No attendance records"
        emptyDescription="No records match the current filters."
      />
    );
  }

  if (props.entityType === "teacher") {
    const columns = buildTeacherAttendanceColumns({
      onNotes: props.onNotes,
      onEdit: props.onEdit,
    });
    return (
      <DataTable
        columns={columns}
        data={props.rows}
        filterConfigs={ATTENDANCE_STATUS_FILTER_CONFIGS}
        defaultPageSize={10}
        emptyTitle="No attendance records"
        emptyDescription="No records match the current filters."
      />
    );
  }

  const columns = buildEmployeeAttendanceColumns({
    onNotes: props.onNotes,
    onEdit: props.onEdit,
  });
  return (
    <DataTable
      columns={columns}
      data={props.rows}
      filterConfigs={ATTENDANCE_STATUS_FILTER_CONFIGS}
      defaultPageSize={10}
      emptyTitle="No attendance records"
      emptyDescription="No records match the current filters."
    />
  );
}
