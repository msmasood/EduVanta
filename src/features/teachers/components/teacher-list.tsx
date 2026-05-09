"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import { DataTable, TableSkeleton } from "@/components/data-table";
import { exportRowsToCsv } from "@/lib/export";
import { mapTeachersToRows, buildTeacherStatusSummary } from "../utils/teacher-mappers";
import { useTeacherColumns, TEACHER_FILTER_CONFIGS } from "./teacher-columns";
import { TeacherStatusCards } from "./teacher-status-summary";
import { useTeachers } from "@/hooks/queries/use-teachers";
import { useSubjects } from "@/hooks/queries/use-academic";
import { useDepartments } from "@/hooks/queries/use-employees";

export function TeacherList() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";

  const teachersQuery = useTeachers();
  const subjectsQuery = useSubjects();
  const departmentsQuery = useDepartments();

  const rows = React.useMemo(() => {
    const teachers = teachersQuery.data?.data ?? [];
    const subjects = subjectsQuery.data?.data ?? [];
    const departments = departmentsQuery.data?.data ?? [];
    return mapTeachersToRows(teachers, departments, subjects);
  }, [teachersQuery.data, subjectsQuery.data, departmentsQuery.data]);

  const summary = React.useMemo(() => {
    const teachers = teachersQuery.data?.data ?? [];
    const departments = departmentsQuery.data?.data ?? [];
    return buildTeacherStatusSummary(teachers, departments);
  }, [teachersQuery.data, departmentsQuery.data]);

  const handleDelete = React.useCallback((id: string) => {
    toast.success(`Teacher ${id} deleted (mock).`);
  }, []);

  const columns = useTeacherColumns(handleDelete);

  const isLoading =
    teachersQuery.isLoading ||
    subjectsQuery.isLoading ||
    departmentsQuery.isLoading;

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="teacher-list">
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
    <div className="space-y-6" data-testid="teacher-list">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Teachers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage teacher profiles, assignments, and records.
          </p>
        </div>
        <Link
          href={`/${locale}/teachers/new`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-2.5 h-8 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
        >
          <UserPlus className="me-2 size-4" aria-hidden />
          Add Teacher
        </Link>
      </div>

      {/* Summary cards */}
      <TeacherStatusCards summary={summary} />

      {/* Table */}
      <DataTable
        columns={columns}
        data={rows}
        filterConfigs={TEACHER_FILTER_CONFIGS}
        selectable
        defaultPageSize={10}
        emptyTitle="No teachers found"
        emptyDescription="Add your first teacher using the button above."
        showExport
        onExport={() =>
          exportRowsToCsv(
            rows as unknown as Record<string, unknown>[],
            [
              { accessorKey: "fullName", header: "Full Name" },
              { accessorKey: "employeeCode", header: "Employee Code" },
              { accessorKey: "departmentName", header: "Department" },
              { accessorKey: "qualification", header: "Qualification" },
              { accessorKey: "phone", header: "Phone" },
              { accessorKey: "email", header: "Email" },
              { accessorKey: "joiningDate", header: "Joining Date" },
              { accessorKey: "status", header: "Status" },
            ],
            "teachers-export.csv"
          )
        }
      />
    </div>
  );
}
