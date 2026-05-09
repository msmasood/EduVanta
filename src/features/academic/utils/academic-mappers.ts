// academic-mappers.ts — data transformation utilities for academic module

import type { ClassLevel, Section, Subject, Classroom, ClassroomType } from "@/types/academic";
import type { StatusVariant } from "@/components/data-table/status-badge";
import type { Teacher } from "@/types/teacher";

// ─── Status mapping ───────────────────────────────────────────────────────────

export function activeStatusToVariant(status: string): StatusVariant {
  return status === "active" ? "active" : "inactive";
}

export function classroomTypeLabel(type: ClassroomType): string {
  const map: Record<ClassroomType, string> = {
    classroom: "Classroom",
    lab: "Lab",
    auditorium: "Auditorium",
    library: "Library",
    other: "Other",
  };
  return map[type] ?? type;
}

export function subjectTypeLabel(type: "theory" | "practical" | "elective"): string {
  const map = { theory: "Theory", practical: "Practical", elective: "Elective" };
  return map[type] ?? type;
}

// ─── Class table row ──────────────────────────────────────────────────────────

export interface ClassTableRow {
  id: string;
  name: string;
  code: string;
  order: number;
  sectionCount: number;
  capacity?: number;
  status: string;
  statusVariant: StatusVariant;
}

export function mapClassesToRows(
  classes: ClassLevel[],
  sections: Section[]
): ClassTableRow[] {
  return classes.map((cls) => ({
    id: cls.id,
    name: cls.name,
    code: cls.code ?? "",
    order: cls.order,
    sectionCount: sections.filter((s) => s.classId === cls.id).length,
    capacity: cls.capacity,
    status: cls.status,
    statusVariant: activeStatusToVariant(cls.status),
  }));
}

// ─── Classroom table row ──────────────────────────────────────────────────────

export interface ClassroomTableRow {
  id: string;
  name: string;
  code: string;
  type: ClassroomType;
  typeLabel: string;
  building?: string;
  floor?: string;
  capacity: number;
  status: string;
  statusVariant: StatusVariant;
}

export function mapClassroomsToRows(classrooms: Classroom[]): ClassroomTableRow[] {
  return classrooms.map((room) => ({
    id: room.id,
    name: room.name,
    code: room.code,
    type: room.type,
    typeLabel: classroomTypeLabel(room.type),
    building: room.building,
    floor: room.floor,
    capacity: room.capacity,
    status: room.status,
    statusVariant: activeStatusToVariant(room.status),
  }));
}

// ─── Section table row ────────────────────────────────────────────────────────

export interface SectionTableRow {
  id: string;
  name: string;
  code: string;
  classId: string;
  className: string;
  teacherId?: string;
  teacherName: string;
  classroomId?: string;
  classroomName: string;
  capacity: number;
  status: string;
  statusVariant: StatusVariant;
}

export function mapSectionsToRows(
  sections: Section[],
  classes: ClassLevel[],
  teachers: Teacher[],
  classrooms: Classroom[]
): SectionTableRow[] {
  const classMap = new Map(classes.map((c) => [c.id, c.name]));
  const teacherMap = new Map(
    teachers.map((t) => [t.id, `${t.firstName} ${t.lastName}`])
  );
  const roomMap = new Map(classrooms.map((r) => [r.id, r.name]));

  return sections.map((sec) => ({
    id: sec.id,
    name: sec.name,
    code: sec.code,
    classId: sec.classId,
    className: classMap.get(sec.classId) ?? sec.classId,
    teacherId: sec.teacherId,
    teacherName: sec.teacherId ? (teacherMap.get(sec.teacherId) ?? "—") : "—",
    classroomId: sec.classroomId,
    classroomName: sec.classroomId ? (roomMap.get(sec.classroomId) ?? "—") : "—",
    capacity: sec.capacity,
    status: sec.status,
    statusVariant: activeStatusToVariant(sec.status),
  }));
}

// ─── Subject table row ────────────────────────────────────────────────────────

export interface SubjectTableRow {
  id: string;
  name: string;
  code: string;
  type: "theory" | "practical" | "elective";
  typeLabel: string;
  classCount: number;
  creditHours?: number;
  status: string;
  statusVariant: StatusVariant;
}

export function mapSubjectsToRows(subjects: Subject[]): SubjectTableRow[] {
  return subjects.map((sub) => ({
    id: sub.id,
    name: sub.name,
    code: sub.code,
    type: sub.type,
    typeLabel: subjectTypeLabel(sub.type),
    classCount: sub.classIds.length,
    creditHours: sub.creditHours,
    status: sub.status,
    statusVariant: activeStatusToVariant(sub.status),
  }));
}
