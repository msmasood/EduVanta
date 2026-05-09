"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { List, CalendarDays } from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { TeacherTimetable } from "@/features/teachers";
import { TeacherTimetableCalendar } from "@/features/teachers";
import { useAllTimetableEntries } from "@/hooks/queries/use-teachers";
import { useTeachers } from "@/hooks/queries/use-teachers";
import { useClasses, useSections, useSubjects, useClassrooms } from "@/hooks/queries/use-academic";
import {
  mapTimetableEntriesToRows,
  mapTimetableToCalendarEvents,
} from "@/features/teachers/utils/teacher-mappers";
import { TableSkeleton } from "@/components/data-table";
import { cn } from "@/lib/utils";
import type { ClassLevel, Section, Subject } from "@/types/academic";

type ViewMode = "list" | "calendar";

export default function TeacherTimetablePage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";

  const [viewMode, setViewMode] = React.useState<ViewMode>("list");

  const entriesQuery = useAllTimetableEntries();
  const teachersQuery = useTeachers();
  const classesQuery = useClasses();
  const sectionsQuery = useSections();
  const subjectsQuery = useSubjects();
  const classroomsQuery = useClassrooms();

  const isLoading =
    entriesQuery.isLoading ||
    teachersQuery.isLoading ||
    classesQuery.isLoading ||
    sectionsQuery.isLoading ||
    subjectsQuery.isLoading ||
    classroomsQuery.isLoading;

  const entries = React.useMemo(() => entriesQuery.data?.data ?? [], [entriesQuery.data]);

  const rows = React.useMemo(() => {
    if (isLoading) return [];
    return mapTimetableEntriesToRows(
      entries,
      teachersQuery.data?.data ?? [],
      (subjectsQuery.data?.data ?? []) as Subject[],
      (classesQuery.data?.data ?? []) as ClassLevel[],
      (sectionsQuery.data?.data ?? []) as Section[],
      classroomsQuery.data?.data ?? []
    );
  }, [
    isLoading,
    entries,
    teachersQuery.data,
    subjectsQuery.data,
    classesQuery.data,
    sectionsQuery.data,
    classroomsQuery.data,
  ]);

  const calendarEvents = React.useMemo(() => mapTimetableToCalendarEvents(rows), [rows]);

  return (
    <DashboardLayout>
      <div className="space-y-6" data-testid="teacher-timetable-page">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Teacher Timetable</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              View the weekly class schedule for all teachers.
            </p>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 rounded-lg border bg-muted/50 p-1">
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                viewMode === "list"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-pressed={viewMode === "list"}
            >
              <List className="size-4" aria-hidden />
              List
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                viewMode === "calendar"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-pressed={viewMode === "calendar"}
            >
              <CalendarDays className="size-4" aria-hidden />
              Calendar
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <TableSkeleton columns={6} rows={6} />
        ) : viewMode === "list" ? (
          <TeacherTimetable
            entries={entries}
            isLoading={false}
          />
        ) : (
          <TeacherTimetableCalendar
            events={calendarEvents}
            locale={locale}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
