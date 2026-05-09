"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import { DataTable, TableSkeleton, EmptyTableState } from "@/components/data-table";
import { exportRowsToCsv } from "@/lib/export";
import { mapStudentsToRows, buildStudentStatusSummary } from "../utils/student-mappers";
import { useStudentColumns, STUDENT_FILTER_CONFIGS } from "./student-columns";
import { StudentStatusCards } from "./student-status-summary";
import { useStudents } from "@/hooks/queries/use-students";
import { useClasses, useSections } from "@/hooks/queries/use-academic";
import { useGuardians } from "@/hooks/queries/use-guardians";

export function StudentList() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";

  const studentsQuery = useStudents();
  const classesQuery = useClasses();
  const sectionsQuery = useSections();
  const guardiansQuery = useGuardians();

  const rows = React.useMemo(() => {
    const students = studentsQuery.data?.data ?? [];
    const classLevels = classesQuery.data?.data ?? [];
    const sections = sectionsQuery.data?.data ?? [];
    const guardians = guardiansQuery.data?.data ?? [];
    return mapStudentsToRows(students, classLevels, sections, guardians);
  }, [studentsQuery.data, classesQuery.data, sectionsQuery.data, guardiansQuery.data]);

  const summary = React.useMemo(
    () => buildStudentStatusSummary(studentsQuery.data?.data ?? []),
    [studentsQuery.data]
  );

  const handleDelete = React.useCallback((id: string) => {
    toast.success(`Student ${id} deleted (mock).`);
  }, []);

  const columns = useStudentColumns(handleDelete);

  const isLoading =
    studentsQuery.isLoading ||
    classesQuery.isLoading ||
    sectionsQuery.isLoading ||
    guardiansQuery.isLoading;

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="student-list">
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
    <div className="space-y-6" data-testid="student-list">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Students</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage student enrolments, profiles, and records.
          </p>
        </div>
        <Link
          href={`/${locale}/students/new`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-2.5 h-8 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
        >
          <UserPlus className="me-2 size-4" aria-hidden />
          Add Student
        </Link>
      </div>

      {/* Summary cards */}
      <StudentStatusCards summary={summary} />

      {/* Table */}
      <DataTable
        columns={columns}
        data={rows}
        filterConfigs={STUDENT_FILTER_CONFIGS}
        selectable
        defaultPageSize={10}
        emptyTitle="No students found"
        emptyDescription="Add your first student using the button above."
        showExport
        onExport={() =>
          exportRowsToCsv(
            rows as unknown as Record<string, unknown>[],
            [
              { accessorKey: "admissionNumber", header: "Admission No." },
              { accessorKey: "fullName", header: "Name" },
              { accessorKey: "rollNumber", header: "Roll No." },
              { accessorKey: "className", header: "Class" },
              { accessorKey: "sectionName", header: "Section" },
              { accessorKey: "status", header: "Status" },
            ],
            "students"
          )
        }
      />
    </div>
  );
}
