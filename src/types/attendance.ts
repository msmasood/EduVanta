import type { ID, AuditMeta, AttendanceStatus } from "./common";

export { AttendanceStatus };

// ─── Attendance record ────────────────────────────────────────────────────────

export interface AttendanceRecord {
  id: ID;
  schoolId: ID;
  date: string;
  entityType: "student" | "teacher" | "employee";
  entityId: ID;
  status: AttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  remarks?: string;
  markedBy: ID;
  audit: AuditMeta;
}

// ─── Attendance summary ───────────────────────────────────────────────────────

export interface AttendanceSummary {
  entityId: ID;
  entityType: "student" | "teacher" | "employee";
  period: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  halfDays: number;
  holidayDays: number;
  leaveDays: number;
  attendancePercentage: number;
}

// ─── Monthly attendance report ────────────────────────────────────────────────

export interface MonthlyAttendance {
  entityId: ID;
  month: number;
  year: number;
  records: { day: number; status: AttendanceStatus }[];
  summary: Omit<AttendanceSummary, "entityId" | "entityType" | "period">;
}
