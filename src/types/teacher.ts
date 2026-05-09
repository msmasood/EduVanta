import type { ID, ActiveStatus, Gender, Address, ContactInfo, AuditMeta } from "./common";

// ─── Teacher ──────────────────────────────────────────────────────────────────

export type TeacherStatus = "active" | "inactive" | "on-leave";

export interface Teacher {
  id: ID;
  schoolId: ID;
  employeeCode: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  designation: string;
  departmentId: ID;
  subjects: ID[];
  address: Address;
  contact: ContactInfo;
  qualification: string;
  experience: number;
  joiningDate: string;
  status: TeacherStatus;
  profileImageUrl?: string;
  audit: AuditMeta;
}

// ─── Teacher subject assignment ───────────────────────────────────────────────

export interface TeacherSubjectAssignment {
  id: ID;
  teacherId: ID;
  subjectId: ID;
  classId: ID;
  sectionId: ID;
  academicYearId: ID;
  audit: AuditMeta;
}

// ─── Teacher timetable ────────────────────────────────────────────────────────

export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface TeacherTimetableEntry {
  id: ID;
  teacherId: ID;
  subjectId: ID;
  classId: ID;
  sectionId: ID;
  classroomId: ID;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  academicYearId: ID;
  audit: AuditMeta;
}
