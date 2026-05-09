"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTable, DataTableColumnHeader, StatusBadge, AvatarCell } from "@/components/data-table";
import { TableSkeleton } from "@/components/data-table";
import { useAttendanceRecords } from "@/hooks/queries/use-attendance";
import { useTeachers } from "@/hooks/queries/use-teachers";
import { useDepartments } from "@/hooks/queries/use-employees";
import { countTeacherAttendanceStatuses } from "../utils/teacher-mappers";
import type { AttendanceRecord } from "@/types/attendance";
import { formatDate } from "@/lib/dates";
import { Users, UserCheck, UserX, Clock } from "lucide-react";

export function TeacherAttendanceList() {
  const attendanceQuery = useAttendanceRecords("teacher");
  const teachersQuery = useTeachers();
  const departmentsQuery = useDepartments();

  const records: AttendanceRecord[] = attendanceQuery.data?.data ?? [];
  const teachers = teachersQuery.data?.data ?? [];
  const departments = departmentsQuery.data?.data ?? [];

  const deptMap = new Map(departments.map((d) => [d.id, d.name]));

  const summary = countTeacherAttendanceStatuses(records);

  const enrichedRows = records.map((record) => {
    const teacher = teachers.find((t) => t.id === record.entityId);
    const deptName = teacher ? (deptMap.get(teacher.departmentId) ?? "—") : "—";
    return {
      ...record,
      teacherName: teacher
        ? `${teacher.firstName} ${teacher.lastName}`
        : record.entityId,
      employeeCode: teacher?.employeeCode ?? "—",
      departmentName: deptName,
      profileImageUrl: teacher?.profileImageUrl,
    };
  });

  type EnrichedRecord = (typeof enrichedRows)[0];

  const columns: ColumnDef<EnrichedRecord>[] = [
    {
      accessorKey: "teacherName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Teacher" />
      ),
      cell: ({ row }) => (
        <AvatarCell
          name={row.original.teacherName}
          subtitle={row.original.employeeCode}
          avatarUrl={row.original.profileImageUrl}
        />
      ),
    },
    {
      accessorKey: "departmentName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Department" />
      ),
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => formatDate(row.original.date),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const s = row.original.status;
        const variant =
          s === "present"
            ? "active"
            : s === "absent"
            ? "suspended"
            : s === "late"
            ? "on-leave"
            : "inactive";
        return <StatusBadge status={variant} label={s} />;
      },
    },
    {
      accessorKey: "checkInTime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Check-in" />
      ),
      cell: ({ row }) => row.original.checkInTime ?? "—",
    },
    {
      accessorKey: "checkOutTime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Check-out" />
      ),
      cell: ({ row }) => row.original.checkOutTime ?? "—",
    },
    {
      accessorKey: "remarks",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Remarks" />
      ),
      cell: ({ row }) => (
        <span className="line-clamp-1 max-w-[180px]">
          {row.original.remarks ?? "—"}
        </span>
      ),
    },
  ];

  const isLoading =
    attendanceQuery.isLoading ||
    teachersQuery.isLoading ||
    departmentsQuery.isLoading;

  const summaryCards = [
    {
      label: "Present",
      value: summary.present,
      icon: UserCheck,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-950/30",
    },
    {
      label: "Absent",
      value: summary.absent,
      icon: UserX,
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-950/30",
    },
    {
      label: "Late",
      value: summary.late,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      label: "On Leave",
      value: summary.leave,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="teacher-attendance-page">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl border bg-muted" />
          ))}
        </div>
        <TableSkeleton columns={7} rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="teacher-attendance-page">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${card.bg}`}>
                  <Icon className={`size-5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={enrichedRows}
        defaultPageSize={10}
        emptyTitle="No attendance records"
        emptyDescription="Teacher attendance records will appear here."
      />
    </div>
  );
}
