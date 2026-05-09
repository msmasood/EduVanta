import type { ID, ActiveStatus, AuditMeta } from "./common";

// ─── Academic year ────────────────────────────────────────────────────────────

export interface AcademicYear {
  id: ID;
  schoolId: ID;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  audit: AuditMeta;
}

// ─── Class level ──────────────────────────────────────────────────────────────

export interface ClassLevel {
  id: ID;
  schoolId: ID;
  name: string;
  code?: string;
  order: number;
  capacity?: number;
  description?: string;
  academicYearId?: ID;
  status: ActiveStatus;
  audit: AuditMeta;
}

// ─── Section ──────────────────────────────────────────────────────────────────

export interface Section {
  id: ID;
  schoolId: ID;
  classId: ID;
  name: string;
  code: string;
  capacity: number;
  classroomId?: ID;
  teacherId?: ID;
  status: ActiveStatus;
  audit: AuditMeta;
}

// ─── Subject ──────────────────────────────────────────────────────────────────

export interface Subject {
  id: ID;
  schoolId: ID;
  name: string;
  code: string;
  type: "theory" | "practical" | "elective";
  classIds: ID[];
  creditHours?: number;
  status: ActiveStatus;
  audit: AuditMeta;
}

// ─── Classroom ────────────────────────────────────────────────────────────────

export type ClassroomType = "classroom" | "lab" | "auditorium" | "library" | "other";

export interface Classroom {
  id: ID;
  schoolId: ID;
  name: string;
  code: string;
  type: ClassroomType;
  building?: string;
  floor?: string;
  capacity: number;
  status: ActiveStatus;
  audit: AuditMeta;
}
