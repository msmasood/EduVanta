// Public API for the shared attendance feature module

export { StudentAttendancePage } from "./components/student-attendance-page";
export { TeacherAttendancePage } from "./components/teacher-attendance-page";
export { EmployeeAttendancePage } from "./components/employee-attendance-page";

export { AttendanceSummaryCards } from "./components/attendance-summary-cards";
export { AttendanceStatusBadge } from "./components/attendance-status-badge";
export { AttendanceFilterBar } from "./components/attendance-filter-bar";
export type { AttendanceFilters, AttendanceEntityType } from "./components/attendance-filter-bar";
export { AttendanceCalendarGrid } from "./components/attendance-calendar-grid";
export { AttendanceRecordsTable } from "./components/attendance-records-table";
export { AttendanceNotesDialog } from "./components/attendance-notes-dialog";
export { AttendanceStatusToggle } from "./components/attendance-status-toggle";
export { AttendanceBulkActions } from "./components/attendance-bulk-actions";

export {
  mapAttendanceStatusToVariant,
  getAttendanceStatusLabel,
  mapStudentAttendanceRows,
  mapTeacherAttendanceRows,
  mapEmployeeAttendanceRows,
  groupAttendanceByDate,
  groupAttendanceByEntity,
  buildAttendanceCalendarDays,
} from "./utils/attendance-mappers";
export type {
  StudentAttendanceRow,
  TeacherAttendanceRow,
  EmployeeAttendanceRow,
  AttendanceDayGroup,
  AttendanceCalendarDay,
} from "./utils/attendance-mappers";

export {
  computeAttendanceSummary,
  computeAttendanceRate,
} from "./utils/attendance-calculations";
export type { AttendanceSummaryStats } from "./utils/attendance-calculations";

export {
  ATTENDANCE_STATUS_OPTIONS,
  ENTITY_TYPE_OPTIONS,
  MONTH_OPTIONS,
} from "./utils/attendance-form-options";
