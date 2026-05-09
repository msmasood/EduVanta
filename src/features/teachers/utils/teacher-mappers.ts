// teacher-mappers.ts — data transformation utilities for the Teachers module

import type { Teacher, TeacherStatus, TeacherTimetableEntry } from "@/types/teacher";
import type { AttendanceRecord } from "@/types/attendance";
import type { ClassLevel, Section, Subject, Classroom } from "@/types/academic";
import type { Department } from "@/types/employee";
import type { StatusVariant } from "@/components/data-table/status-badge";

// ─── Status mapping ───────────────────────────────────────────────────────────

export function teacherStatusToVariant(status: TeacherStatus): StatusVariant {
  switch (status) {
    case "active":
      return "active";
    case "inactive":
      return "inactive";
    case "on-leave":
      return "warning";
    default:
      return "inactive";
  }
}

// ─── List row shape ───────────────────────────────────────────────────────────

export interface TeacherTableRow {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  departmentId: string;
  departmentName: string;
  designation: string;
  subjectIds: string[];
  subjectNames: string[];
  phone: string;
  email: string;
  joiningDate: string;
  status: TeacherStatus;
  statusVariant: StatusVariant;
  experience: number;
  qualification: string;
  profileImageUrl?: string;
}

export function mapTeachersToRows(
  teachers: Teacher[],
  departments: Department[],
  subjects: Subject[]
): TeacherTableRow[] {
  const deptMap = new Map(departments.map((d) => [d.id, d.name]));
  const subjectMap = new Map(subjects.map((s) => [s.id, s.name]));

  return teachers.map((t) => ({
    id: t.id,
    employeeCode: t.employeeCode,
    firstName: t.firstName,
    lastName: t.lastName,
    fullName: `${t.firstName} ${t.lastName}`,
    departmentId: t.departmentId,
    departmentName: deptMap.get(t.departmentId) ?? t.departmentId,
    designation: t.designation,
    subjectIds: t.subjects,
    subjectNames: t.subjects.map((sid) => subjectMap.get(sid) ?? sid),
    phone: t.contact?.phone ?? "—",
    email: t.contact?.email ?? "—",
    joiningDate: t.joiningDate,
    status: t.status,
    statusVariant: teacherStatusToVariant(t.status),
    experience: t.experience,
    qualification: t.qualification,
    profileImageUrl: t.profileImageUrl,
  }));
}

// ─── Status summary ───────────────────────────────────────────────────────────

export interface TeacherStatusSummary {
  total: number;
  active: number;
  onLeave: number;
  departments: number;
}

export function buildTeacherStatusSummary(
  teachers: Teacher[],
  departments: Department[]
): TeacherStatusSummary {
  const activeDeptIds = new Set(teachers.map((t) => t.departmentId));
  return {
    total: teachers.length,
    active: teachers.filter((t) => t.status === "active").length,
    onLeave: teachers.filter((t) => t.status === "on-leave").length,
    departments: departments.filter((d) => activeDeptIds.has(d.id)).length,
  };
}

// ─── Attendance summary ───────────────────────────────────────────────────────

export interface AttendanceStatusCounts {
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  leave: number;
}

export function countTeacherAttendanceStatuses(
  records: AttendanceRecord[]
): AttendanceStatusCounts {
  return {
    present: records.filter((r) => r.status === "present").length,
    absent: records.filter((r) => r.status === "absent").length,
    late: records.filter((r) => r.status === "late").length,
    halfDay: records.filter((r) => r.status === "half-day").length,
    leave: records.filter((r) => r.status === "leave").length,
  };
}

// ─── Timetable event mapping ──────────────────────────────────────────────────

export interface TimetableListRow {
  id: string;
  teacherId: string;
  teacherName: string;
  subjectName: string;
  className: string;
  sectionName: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
  timeLabel: string;
}

export function mapTimetableEntriesToRows(
  entries: TeacherTimetableEntry[],
  teachers: Teacher[],
  subjects: Subject[],
  classes: ClassLevel[],
  sections: Section[],
  classrooms: Classroom[]
): TimetableListRow[] {
  const teacherMap = new Map(
    teachers.map((t) => [t.id, `${t.firstName} ${t.lastName}`])
  );
  const subjectMap = new Map(subjects.map((s) => [s.id, s.name]));
  const classMap = new Map(classes.map((c) => [c.id, c.name]));
  const sectionMap = new Map(sections.map((s) => [s.id, s.name]));
  const roomMap = new Map(classrooms.map((r) => [r.id, r.name]));

  return entries.map((e) => ({
    id: e.id,
    teacherId: e.teacherId,
    teacherName: teacherMap.get(e.teacherId) ?? e.teacherId,
    subjectName: subjectMap.get(e.subjectId) ?? e.subjectId,
    className: classMap.get(e.classId) ?? e.classId,
    sectionName: sectionMap.get(e.sectionId) ?? e.sectionId,
    room: roomMap.get(e.classroomId) ?? e.classroomId,
    day: e.day,
    startTime: e.startTime,
    endTime: e.endTime,
    timeLabel: `${e.startTime} – ${e.endTime}`,
  }));
}

// ─── FullCalendar event mapping ───────────────────────────────────────────────

// Day-of-week → ISO date offset from a reference Monday
const DAY_OFFSETS: Record<string, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
};

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  extendedProps: {
    teacher: string;
    subject: string;
    class: string;
    room: string;
  };
}

/**
 * Map timetable entries to FullCalendar-compatible event objects.
 * All events are anchored to the current ISO week (Monday-based).
 */
export function mapTimetableToCalendarEvents(
  rows: TimetableListRow[]
): CalendarEvent[] {
  // Get Monday of the current week
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);

  return rows.map((row) => {
    const offset = DAY_OFFSETS[row.day] ?? 0;
    const eventDate = new Date(monday);
    eventDate.setDate(monday.getDate() + offset);
    const dateStr = eventDate.toISOString().split("T")[0];

    return {
      id: row.id,
      title: `${row.subjectName} — ${row.className}${row.sectionName}`,
      start: `${dateStr}T${row.startTime}:00`,
      end: `${dateStr}T${row.endTime}:00`,
      extendedProps: {
        teacher: row.teacherName,
        subject: row.subjectName,
        class: `${row.className} ${row.sectionName}`,
        room: row.room,
      },
    };
  });
}
