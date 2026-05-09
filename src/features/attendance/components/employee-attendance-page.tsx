"use client";

import * as React from "react";
import { toast } from "sonner";

import { useAttendanceRecords } from "@/hooks/queries/use-attendance";
import { useEmployees, useDepartments, useDesignations } from "@/hooks/queries/use-employees";
import {
  mapEmployeeAttendanceRows,
  buildAttendanceCalendarDays,
  type EmployeeAttendanceRow,
} from "../utils/attendance-mappers";
import { computeAttendanceSummary } from "../utils/attendance-calculations";
import { AttendanceSummaryCards } from "./attendance-summary-cards";
import { AttendanceFilterBar, type AttendanceFilters } from "./attendance-filter-bar";
import { AttendanceRecordsTable } from "./attendance-records-table";
import { AttendanceCalendarGrid } from "./attendance-calendar-grid";
import { AttendanceNotesDialog } from "./attendance-notes-dialog";

type ViewMode = "table" | "calendar";

export function EmployeeAttendancePage() {
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

  const attendanceQuery = useAttendanceRecords("employee");
  const employeesQuery = useEmployees();
  const departmentsQuery = useDepartments();
  const designationsQuery = useDesignations();

  const isLoading =
    attendanceQuery.isLoading ||
    employeesQuery.isLoading ||
    departmentsQuery.isLoading ||
    designationsQuery.isLoading;

  const allRows = React.useMemo(() => {
    const records = attendanceQuery.data?.data ?? [];
    const employees = employeesQuery.data?.data ?? [];
    const departments = departmentsQuery.data?.data ?? [];
    const designations = designationsQuery.data?.data ?? [];
    return mapEmployeeAttendanceRows(records, employees, departments, designations);
  }, [attendanceQuery.data, employeesQuery.data, departmentsQuery.data, designationsQuery.data]);

  const filteredRows = React.useMemo(() => {
    return allRows.filter((row) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !row.employeeName.toLowerCase().includes(q) &&
          !row.employeeCode.toLowerCase().includes(q)
        )
          return false;
      }
      if (filters.status && row.status !== filters.status) return false;
      if (filters.date && row.date !== filters.date) return false;
      if (filters.departmentId && row.departmentName !== filters.departmentId)
        return false;
      return true;
    });
  }, [allRows, filters]);

  const summary = React.useMemo(() => {
    const records = attendanceQuery.data?.data ?? [];
    return computeAttendanceSummary(records.filter((r) => r.entityType === "employee"));
  }, [attendanceQuery.data]);

  const deptOptions = React.useMemo(() => {
    const depts = departmentsQuery.data?.data ?? [];
    return depts.map((d) => ({ label: d.name, value: d.id }));
  }, [departmentsQuery.data]);

  const calendarDays = React.useMemo(() => {
    const now = new Date();
    const records = attendanceQuery.data?.data ?? [];
    return buildAttendanceCalendarDays(
      records.filter((r) => r.entityType === "employee"),
      now.getFullYear(),
      now.getMonth() + 1
    );
  }, [attendanceQuery.data]);

  function handleEdit(row: EmployeeAttendanceRow) {
    toast.info(`Edit status for ${row.employeeName} on ${row.date}.`);
  }

  function handleNotes(row: EmployeeAttendanceRow) {
    setNotesDialog({
      open: true,
      recordId: row.id,
      entityName: row.employeeName,
      date: row.date,
      currentNotes: row.notes,
    });
  }

  return (
    <div data-testid="employee-attendance">
    <div className="space-y-6" data-testid="employee-attendance-page">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Employee Attendance</h1>
        <p className="text-sm text-muted-foreground">
          View and manage daily attendance records for all employees.
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
        entityType="employee"
        filters={filters}
        onFiltersChange={setFilters}
        departmentOptions={deptOptions}
      />

      {/* Content */}
      {viewMode === "table" ? (
        <AttendanceRecordsTable
          entityType="employee"
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
