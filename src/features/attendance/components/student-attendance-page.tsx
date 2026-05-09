"use client";

import * as React from "react";
import { toast } from "sonner";

import { TableSkeleton } from "@/components/data-table";
import { useAttendanceRecords } from "@/hooks/queries/use-attendance";
import { useStudents } from "@/hooks/queries/use-students";
import { useClasses, useSections } from "@/hooks/queries/use-academic";
import {
  mapStudentAttendanceRows,
  buildAttendanceCalendarDays,
  type StudentAttendanceRow,
} from "../utils/attendance-mappers";
import { computeAttendanceSummary } from "../utils/attendance-calculations";
import { AttendanceSummaryCards } from "./attendance-summary-cards";
import { AttendanceFilterBar, type AttendanceFilters } from "./attendance-filter-bar";
import { AttendanceRecordsTable } from "./attendance-records-table";
import { AttendanceCalendarGrid } from "./attendance-calendar-grid";
import { AttendanceNotesDialog } from "./attendance-notes-dialog";

type ViewMode = "table" | "calendar";

export function StudentAttendancePage() {
  const [viewMode, setViewMode] = React.useState<ViewMode>("table");
  const [filters, setFilters] = React.useState<AttendanceFilters>({
    search: "",
    status: "",
    date: "",
    departmentId: "",
    classId: "",
  });
  const [notesDialog, setNotesDialog] = React.useState<{
    open: boolean;
    recordId: string;
    entityName: string;
    date: string;
    currentNotes: string;
  }>({ open: false, recordId: "", entityName: "", date: "", currentNotes: "" });

  const attendanceQuery = useAttendanceRecords("student");
  const studentsQuery = useStudents();
  const classesQuery = useClasses();
  const sectionsQuery = useSections();

  const isLoading =
    attendanceQuery.isLoading ||
    studentsQuery.isLoading ||
    classesQuery.isLoading ||
    sectionsQuery.isLoading;

  const allRows = React.useMemo(() => {
    const records = attendanceQuery.data?.data ?? [];
    const students = studentsQuery.data?.data ?? [];
    const classes = classesQuery.data?.data ?? [];
    const sections = sectionsQuery.data?.data ?? [];
    return mapStudentAttendanceRows(records, students, classes, sections);
  }, [attendanceQuery.data, studentsQuery.data, classesQuery.data, sectionsQuery.data]);

  const filteredRows = React.useMemo(() => {
    return allRows.filter((row) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !row.studentName.toLowerCase().includes(q) &&
          !row.admissionNumber.toLowerCase().includes(q)
        )
          return false;
      }
      if (filters.status && row.status !== filters.status) return false;
      if (filters.date && row.date !== filters.date) return false;
      if (filters.classId && row.className !== filters.classId) return false;
      return true;
    });
  }, [allRows, filters]);

  const summary = React.useMemo(() => {
    const records = attendanceQuery.data?.data ?? [];
    return computeAttendanceSummary(records.filter((r) => r.entityType === "student"));
  }, [attendanceQuery.data]);

  const classOptions = React.useMemo(() => {
    const classes = classesQuery.data?.data ?? [];
    return classes.map((c) => ({ label: c.name, value: c.id }));
  }, [classesQuery.data]);

  const calendarDays = React.useMemo(() => {
    const now = new Date();
    const records = attendanceQuery.data?.data ?? [];
    return buildAttendanceCalendarDays(
      records.filter((r) => r.entityType === "student"),
      now.getFullYear(),
      now.getMonth() + 1
    );
  }, [attendanceQuery.data]);

  function handleEdit(row: StudentAttendanceRow) {
    toast.info(`Edit status for ${row.studentName} on ${row.date}.`);
  }

  function handleNotes(row: StudentAttendanceRow) {
    setNotesDialog({
      open: true,
      recordId: row.id,
      entityName: row.studentName,
      date: row.date,
      currentNotes: row.notes,
    });
  }

  return (
    <div data-testid="attendance-page">
    <div className="space-y-6" data-testid="student-attendance-page">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Student Attendance</h1>
        <p className="text-sm text-muted-foreground">
          View and manage daily attendance records for all students.
        </p>
      </div>

      {/* Summary cards */}
      <AttendanceSummaryCards summary={summary} isLoading={isLoading} />

      {/* View toggle */}
      <div className="flex items-center gap-2">
        <button
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${viewMode === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
          onClick={() => setViewMode("table")}
        >
          Table
        </button>
        <button
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${viewMode === "calendar" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
          onClick={() => setViewMode("calendar")}
        >
          Calendar
        </button>
      </div>

      {/* Filters */}
      <AttendanceFilterBar
        entityType="student"
        filters={filters}
        onFiltersChange={setFilters}
        classOptions={classOptions}
      />

      {/* Content */}
      {viewMode === "table" ? (
        <AttendanceRecordsTable
          entityType="student"
          rows={filteredRows}
          isLoading={isLoading}
          onEdit={handleEdit}
          onNotes={handleNotes}
        />
      ) : (
        <AttendanceCalendarGrid
          days={calendarDays}
          year={new Date().getFullYear()}
          month={new Date().getMonth() + 1}
        />
      )}

      {/* Notes dialog */}
      <AttendanceNotesDialog
        open={notesDialog.open}
        onOpenChange={(open) => setNotesDialog((prev) => ({ ...prev, open }))}
        recordId={notesDialog.recordId}
        entityName={notesDialog.entityName}
        date={notesDialog.date}
        currentNotes={notesDialog.currentNotes}
      />
    </div>
    </div>
  );
}
