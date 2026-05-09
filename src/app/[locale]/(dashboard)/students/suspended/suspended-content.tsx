"use client";

import { SuspendedStudentsList } from "@/features/students";
import { useStudents } from "@/hooks/queries/use-students";
import { useClasses, useSections } from "@/hooks/queries/use-academic";
import { TableSkeleton } from "@/components/data-table";
import { filterSuspendedStudents, mapStudentsToRows } from "@/features/students";
import { useGuardians } from "@/hooks/queries/use-guardians";

export function SuspendedContent() {
  // Fetch all students (large page size) so filtering works across all records
  const studentsQuery = useStudents({ pageSize: 100 });
  const classesQuery = useClasses();
  const sectionsQuery = useSections();
  const guardiansQuery = useGuardians();

  if (
    studentsQuery.isLoading ||
    classesQuery.isLoading ||
    sectionsQuery.isLoading
  ) {
    return (
      <div data-testid="suspended-page">
        <TableSkeleton />
      </div>
    );
  }

  const students = studentsQuery.data?.data ?? [];
  const classes = classesQuery.data?.data ?? [];
  const sections = sectionsQuery.data?.data ?? [];
  const guardians = guardiansQuery.data?.data ?? [];

  const suspended = filterSuspendedStudents(students);
  const rows = mapStudentsToRows(suspended, classes, sections, guardians);

  return (
    <div className="space-y-6" data-testid="suspended-page">
      <div>
        <h1 className="text-2xl font-semibold">Suspended Students</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and manage suspended student accounts.
        </p>
      </div>
      <SuspendedStudentsList rows={rows} />
    </div>
  );
}
