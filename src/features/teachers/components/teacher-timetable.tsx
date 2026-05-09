"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { TableSkeleton } from "@/components/data-table";
import { useTeachers } from "@/hooks/queries/use-teachers";
import { useClasses, useSections, useSubjects, useClassrooms } from "@/hooks/queries/use-academic";
import { mapTimetableEntriesToRows } from "../utils/teacher-mappers";
import type { TimetableListRow } from "../utils/teacher-mappers";
import { Calendar, Clock } from "lucide-react";

// Day label formatter
const DAY_LABELS: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const DAY_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

interface TeacherTimetableProps {
  /** If set, only shows entries for this teacher */
  teacherId?: string;
  /** Pre-loaded entries (if passed from a hook outside) */
  entries?: import("@/types/teacher").TeacherTimetableEntry[];
  isLoading?: boolean;
}

export function TeacherTimetable({ teacherId, entries, isLoading: externalLoading }: TeacherTimetableProps) {
  const teachersQuery = useTeachers();
  const classesQuery = useClasses();
  const sectionsQuery = useSections();
  const subjectsQuery = useSubjects();
  const classroomsQuery = useClassrooms();

  const allLoaded =
    !teachersQuery.isLoading &&
    !classesQuery.isLoading &&
    !sectionsQuery.isLoading &&
    !subjectsQuery.isLoading &&
    !classroomsQuery.isLoading;

  const rows = React.useMemo(() => {
    if (!entries || !allLoaded) return [];
    const filteredEntries = teacherId
      ? entries.filter((e) => e.teacherId === teacherId)
      : entries;

    return mapTimetableEntriesToRows(
      filteredEntries,
      teachersQuery.data?.data ?? [],
      subjectsQuery.data?.data ?? [],
      classesQuery.data?.data ?? [],
      sectionsQuery.data?.data ?? [],
      classroomsQuery.data?.data ?? []
    );
  }, [
    entries,
    teacherId,
    allLoaded,
    teachersQuery.data,
    subjectsQuery.data,
    classesQuery.data,
    sectionsQuery.data,
    classroomsQuery.data,
  ]);

  const columns: ColumnDef<TimetableListRow>[] = [
    {
      accessorKey: "day",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Day" />
      ),
      cell: ({ row }) => (
        <span className="font-medium capitalize">
          {DAY_LABELS[row.original.day] ?? row.original.day}
        </span>
      ),
      sortingFn: (a, b) =>
        DAY_ORDER.indexOf(a.original.day) - DAY_ORDER.indexOf(b.original.day),
    },
    {
      accessorKey: "timeLabel",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Time" />
      ),
      cell: ({ row }) => (
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          <Clock className="size-3.5 text-muted-foreground" aria-hidden />
          {row.original.timeLabel}
        </span>
      ),
    },
    {
      accessorKey: "subjectName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Subject" />
      ),
    },
    {
      accessorKey: "className",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Class" />
      ),
      cell: ({ row }) => (
        <span>
          {row.original.className} — {row.original.sectionName}
        </span>
      ),
    },
    {
      accessorKey: "room",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Room" />
      ),
    },
    {
      accessorKey: "teacherName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Teacher" />
      ),
    },
  ];

  const isLoading = externalLoading || !allLoaded;

  if (isLoading) {
    return (
      <div data-testid="timetable-list">
        <TableSkeleton columns={6} rows={5} />
      </div>
    );
  }

  return (
    <div data-testid="timetable-list">
      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-16 text-center">
          <Calendar className="mb-3 size-10 text-muted-foreground" aria-hidden />
          <p className="text-sm font-medium">No timetable entries found.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Assign classes and subjects to see the timetable.
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          defaultPageSize={20}
          emptyTitle="No timetable entries"
          emptyDescription="No classes scheduled."
        />
      )}
    </div>
  );
}
