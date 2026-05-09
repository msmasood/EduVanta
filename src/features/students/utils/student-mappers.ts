// student-mappers.ts — data transformation utilities for the Students module

import type { Student, StudentCategory, StudentStatus } from "@/types/student";
import type { AttendanceRecord, AttendanceSummary } from "@/types/attendance";
import type { ClassLevel, Section } from "@/types/academic";
import type { Guardian } from "@/types/guardian";
import type { StatusVariant } from "@/components/data-table/status-badge";

// ─── Status mapping ───────────────────────────────────────────────────────────

export function studentStatusToVariant(status: StudentStatus): StatusVariant {
  switch (status) {
    case "active":
      return "active";
    case "suspended":
      return "suspended";
    case "inactive":
      return "inactive";
    default:
      return "inactive";
  }
}

// ─── List row shape ───────────────────────────────────────────────────────────

export interface StudentTableRow {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  rollNumber: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  guardianName: string;
  phone: string;
  status: StudentStatus;
  statusVariant: StatusVariant;
  admissionDate: string;
  profileImageUrl?: string;
}

export function mapStudentsToRows(
  students: Student[],
  classLevels: ClassLevel[],
  sections: Section[],
  guardians: Guardian[]
): StudentTableRow[] {
  const classMap = new Map(classLevels.map((c) => [c.id, c.name]));
  const sectionMap = new Map(sections.map((s) => [s.id, s.name]));
  const guardianMap = new Map(guardians.map((g) => [g.id, `${g.firstName} ${g.lastName}`]));

  return students.map((s) => ({
    id: s.id,
    admissionNumber: s.admissionNumber,
    firstName: s.firstName,
    lastName: s.lastName,
    fullName: `${s.firstName} ${s.lastName}`,
    rollNumber: s.rollNumber,
    classId: s.classId,
    className: classMap.get(s.classId) ?? s.classId,
    sectionId: s.sectionId,
    sectionName: sectionMap.get(s.sectionId) ?? s.sectionId,
    guardianName: guardianMap.get(s.guardianId) ?? "—",
    phone: s.contact?.phone ?? "—",
    status: s.status,
    statusVariant: studentStatusToVariant(s.status),
    admissionDate: s.admissionDate,
    profileImageUrl: s.profileImageUrl,
  }));
}

// ─── Status summary counts ────────────────────────────────────────────────────

export interface StudentStatusSummary {
  total: number;
  active: number;
  suspended: number;
  newAdmissions: number;
}

export function buildStudentStatusSummary(
  students: Student[],
  currentYear = new Date().getFullYear()
): StudentStatusSummary {
  return {
    total: students.length,
    active: students.filter((s) => s.status === "active").length,
    suspended: students.filter((s) => s.status === "suspended").length,
    newAdmissions: students.filter((s) =>
      s.admissionDate?.startsWith(String(currentYear))
    ).length,
  };
}

// ─── Suspended filter ─────────────────────────────────────────────────────────

export function filterSuspendedStudents(students: Student[]): Student[] {
  return students.filter((s) => s.status === "suspended");
}

// ─── Attendance summary counts ────────────────────────────────────────────────

export interface AttendanceCountSummary {
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  total: number;
}

export function countAttendanceStatuses(
  records: AttendanceRecord[]
): AttendanceCountSummary {
  const counts = { present: 0, absent: 0, late: 0, halfDay: 0, total: records.length };
  for (const r of records) {
    if (r.status === "present") counts.present++;
    else if (r.status === "absent") counts.absent++;
    else if (r.status === "late") counts.late++;
    else if (r.status === "half-day") counts.halfDay++;
  }
  return counts;
}

// ─── Category student counts ──────────────────────────────────────────────────

export function buildCategoryStudentCounts(
  categories: StudentCategory[],
  students: Student[]
): Map<string, number> {
  const map = new Map<string, number>();
  for (const cat of categories) {
    map.set(cat.id, students.filter((s) => s.categoryId === cat.id).length);
  }
  return map;
}

// ─── Attendance summary (for profile) ────────────────────────────────────────

export function buildAttendanceSummaryFromRecords(
  records: AttendanceRecord[],
  entityId: string
): AttendanceSummary {
  const filtered = records.filter((r) => r.entityId === entityId);
  const present = filtered.filter((r) => r.status === "present").length;
  const absent = filtered.filter((r) => r.status === "absent").length;
  const late = filtered.filter((r) => r.status === "late").length;
  const halfDays = filtered.filter((r) => r.status === "half-day").length;
  const total = filtered.length;
  return {
    entityId,
    entityType: "student",
    period: "all",
    totalDays: total,
    presentDays: present,
    absentDays: absent,
    lateDays: late,
    halfDays,
    holidayDays: 0,
    leaveDays: 0,
    attendancePercentage: total > 0 ? Math.round((present / total) * 100) : 0,
  };
}
