// attendance-mappers.ts — data transformation utilities for attendance module

import type { AttendanceRecord } from "@/types/attendance";
import type { Student } from "@/types/student";
import type { Teacher } from "@/types/teacher";
import type { Employee, Department, Designation } from "@/types/employee";
import type { ClassLevel, Section } from "@/types/academic";
import type { StatusVariant } from "@/components/data-table/status-badge";

// ─── Status → StatusVariant ───────────────────────────────────────────────────

export function mapAttendanceStatusToVariant(status: string): StatusVariant {
  switch (status) {
    case "present":
      return "present";
    case "absent":
      return "absent";
    case "late":
      return "late";
    case "half-day":
      return "partial";
    case "leave":
      return "info";
    case "excused":
      return "warning";
    case "holiday":
      return "neutral";
    default:
      return "neutral";
  }
}

export function getAttendanceStatusLabel(status: string): string {
  switch (status) {
    case "present":
      return "Present";
    case "absent":
      return "Absent";
    case "late":
      return "Late";
    case "half-day":
      return "Half Day";
    case "leave":
      return "Leave";
    case "excused":
      return "Excused";
    case "holiday":
      return "Holiday";
    default:
      return status;
  }
}

// ─── Student attendance row ───────────────────────────────────────────────────

export interface StudentAttendanceRow {
  id: string;
  date: string;
  entityId: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  sectionName: string;
  status: string;
  statusVariant: StatusVariant;
  statusLabel: string;
  checkInTime: string;
  checkOutTime: string;
  notes: string;
}

export function mapStudentAttendanceRows(
  records: AttendanceRecord[],
  students: Student[],
  classLevels: ClassLevel[],
  sections: Section[]
): StudentAttendanceRow[] {
  const studentMap = new Map(students.map((s) => [s.id, s]));
  const classMap = new Map(classLevels.map((c) => [c.id, c.name]));
  const sectionMap = new Map(sections.map((s) => [s.id, s.name]));

  return records
    .filter((r) => r.entityType === "student")
    .map((r) => {
      const student = studentMap.get(r.entityId);
      return {
        id: r.id,
        date: r.date,
        entityId: r.entityId,
        studentName: student
          ? `${student.firstName} ${student.lastName}`
          : r.entityId,
        admissionNumber: student?.admissionNumber ?? "—",
        className: student ? (classMap.get(student.classId) ?? "—") : "—",
        sectionName: student ? (sectionMap.get(student.sectionId) ?? "—") : "—",
        status: r.status,
        statusVariant: mapAttendanceStatusToVariant(r.status),
        statusLabel: getAttendanceStatusLabel(r.status),
        checkInTime: r.checkInTime ?? "—",
        checkOutTime: r.checkOutTime ?? "—",
        notes: r.remarks ?? "",
      };
    });
}

// ─── Teacher attendance row ───────────────────────────────────────────────────

export interface TeacherAttendanceRow {
  id: string;
  date: string;
  entityId: string;
  teacherName: string;
  teacherCode: string;
  departmentName: string;
  status: string;
  statusVariant: StatusVariant;
  statusLabel: string;
  checkInTime: string;
  checkOutTime: string;
  notes: string;
  profileImageUrl?: string;
}

export function mapTeacherAttendanceRows(
  records: AttendanceRecord[],
  teachers: Teacher[],
  departments: Department[]
): TeacherAttendanceRow[] {
  const teacherMap = new Map(teachers.map((t) => [t.id, t]));
  const deptMap = new Map(departments.map((d) => [d.id, d.name]));

  return records
    .filter((r) => r.entityType === "teacher")
    .map((r) => {
      const teacher = teacherMap.get(r.entityId);
      return {
        id: r.id,
        date: r.date,
        entityId: r.entityId,
        teacherName: teacher
          ? `${teacher.firstName} ${teacher.lastName}`
          : r.entityId,
        teacherCode: teacher?.employeeCode ?? "—",
        departmentName: teacher ? (deptMap.get(teacher.departmentId) ?? "—") : "—",
        status: r.status,
        statusVariant: mapAttendanceStatusToVariant(r.status),
        statusLabel: getAttendanceStatusLabel(r.status),
        checkInTime: r.checkInTime ?? "—",
        checkOutTime: r.checkOutTime ?? "—",
        notes: r.remarks ?? "",
        profileImageUrl: teacher?.profileImageUrl,
      };
    });
}

// ─── Employee attendance row ──────────────────────────────────────────────────

export interface EmployeeAttendanceRow {
  id: string;
  date: string;
  entityId: string;
  employeeName: string;
  employeeCode: string;
  departmentName: string;
  designationName: string;
  status: string;
  statusVariant: StatusVariant;
  statusLabel: string;
  checkInTime: string;
  checkOutTime: string;
  notes: string;
  profileImageUrl?: string;
}

export function mapEmployeeAttendanceRows(
  records: AttendanceRecord[],
  employees: Employee[],
  departments: Department[],
  designations: Designation[]
): EmployeeAttendanceRow[] {
  const employeeMap = new Map(employees.map((e) => [e.id, e]));
  const deptMap = new Map(departments.map((d) => [d.id, d.name]));
  const desigMap = new Map(designations.map((d) => [d.id, d.name]));

  return records
    .filter((r) => r.entityType === "employee")
    .map((r) => {
      const employee = employeeMap.get(r.entityId);
      return {
        id: r.id,
        date: r.date,
        entityId: r.entityId,
        employeeName: employee
          ? `${employee.firstName} ${employee.lastName}`
          : r.entityId,
        employeeCode: employee?.employeeCode ?? "—",
        departmentName: employee ? (deptMap.get(employee.departmentId) ?? "—") : "—",
        designationName: employee ? (desigMap.get(employee.designationId) ?? "—") : "—",
        status: r.status,
        statusVariant: mapAttendanceStatusToVariant(r.status),
        statusLabel: getAttendanceStatusLabel(r.status),
        checkInTime: r.checkInTime ?? "—",
        checkOutTime: r.checkOutTime ?? "—",
        notes: r.remarks ?? "",
        profileImageUrl: employee?.profileImageUrl,
      };
    });
}

// ─── Group by date ────────────────────────────────────────────────────────────

export interface AttendanceDayGroup {
  date: string;
  records: AttendanceRecord[];
  presentCount: number;
  absentCount: number;
  lateCount: number;
  otherCount: number;
}

export function groupAttendanceByDate(records: AttendanceRecord[]): AttendanceDayGroup[] {
  const map = new Map<string, AttendanceRecord[]>();
  for (const r of records) {
    const existing = map.get(r.date) ?? [];
    existing.push(r);
    map.set(r.date, existing);
  }

  const groups: AttendanceDayGroup[] = [];
  for (const [date, recs] of map.entries()) {
    groups.push({
      date,
      records: recs,
      presentCount: recs.filter((r) => r.status === "present").length,
      absentCount: recs.filter((r) => r.status === "absent").length,
      lateCount: recs.filter((r) => r.status === "late").length,
      otherCount: recs.filter(
        (r) => r.status !== "present" && r.status !== "absent" && r.status !== "late"
      ).length,
    });
  }

  return groups.sort((a, b) => b.date.localeCompare(a.date));
}

// ─── Group by entity ──────────────────────────────────────────────────────────

export function groupAttendanceByEntity(
  records: AttendanceRecord[]
): Map<string, AttendanceRecord[]> {
  const map = new Map<string, AttendanceRecord[]>();
  for (const r of records) {
    const existing = map.get(r.entityId) ?? [];
    existing.push(r);
    map.set(r.entityId, existing);
  }
  return map;
}

// ─── Calendar days ────────────────────────────────────────────────────────────

export interface AttendanceCalendarDay {
  date: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  records: AttendanceRecord[];
  dominantStatus: string | null;
}

export function buildAttendanceCalendarDays(
  records: AttendanceRecord[],
  year: number,
  month: number // 1-based
): AttendanceCalendarDay[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const byDate = new Map<string, AttendanceRecord[]>();
  for (const r of records) {
    const existing = byDate.get(r.date) ?? [];
    existing.push(r);
    byDate.set(r.date, existing);
  }

  const days: AttendanceCalendarDay[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(month).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    const dateStr = `${year}-${mm}-${dd}`;
    const recs = byDate.get(dateStr) ?? [];

    // Compute dominant status: present > absent > late > others
    let dominant: string | null = null;
    if (recs.length > 0) {
      const counts: Record<string, number> = {};
      for (const r of recs) {
        counts[r.status] = (counts[r.status] ?? 0) + 1;
      }
      const statusOrder = ["absent", "late", "half-day", "leave", "excused", "present"];
      for (const s of statusOrder) {
        if (counts[s]) {
          dominant = s;
          break;
        }
      }
      if (!dominant) dominant = recs[0].status;
    }

    days.push({
      date: dateStr,
      dayNumber: d,
      isCurrentMonth: true,
      records: recs,
      dominantStatus: dominant,
    });
  }

  return days;
}
