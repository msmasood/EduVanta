// attendance-calculations.ts — summary computations for attendance module

import type { AttendanceRecord } from "@/types/attendance";

// ─── Attendance summary ───────────────────────────────────────────────────────

export interface AttendanceSummaryStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  leave: number;
  excused: number;
  holiday: number;
  attendanceRate: number;
}

export function computeAttendanceSummary(
  records: AttendanceRecord[]
): AttendanceSummaryStats {
  const stats: AttendanceSummaryStats = {
    total: records.length,
    present: 0,
    absent: 0,
    late: 0,
    halfDay: 0,
    leave: 0,
    excused: 0,
    holiday: 0,
    attendanceRate: 0,
  };

  for (const r of records) {
    switch (r.status) {
      case "present":
        stats.present++;
        break;
      case "absent":
        stats.absent++;
        break;
      case "late":
        stats.late++;
        break;
      case "half-day":
        stats.halfDay++;
        break;
      case "leave":
        stats.leave++;
        break;
      case "holiday":
        stats.holiday++;
        break;
      default:
        // excused or unknown
        stats.excused++;
        break;
    }
  }

  stats.attendanceRate = computeAttendanceRate(records);
  return stats;
}

export function computeAttendanceRate(records: AttendanceRecord[]): number {
  if (records.length === 0) return 0;
  const workingDays = records.filter((r) => r.status !== "holiday").length;
  if (workingDays === 0) return 0;
  const present = records.filter(
    (r) => r.status === "present" || r.status === "late"
  ).length;
  return Math.round((present / workingDays) * 100 * 10) / 10;
}
