// guardian-mappers.ts — data transformation utilities for the Guardians module

import type { Guardian, GuardianRelation, GuardianStatus } from "@/types/guardian";
import type { GuardianStudentLink } from "@/types/guardian";
import type { Student } from "@/types/student";
import type { ClassLevel, Section } from "@/types/academic";
import type { StatusVariant } from "@/components/data-table/status-badge";

// ─── Status mapping ───────────────────────────────────────────────────────────

export function guardianStatusToVariant(status: GuardianStatus | undefined): StatusVariant {
  switch (status) {
    case "active":
      return "active";
    case "inactive":
      return "inactive";
    case "pending":
      return "pending";
    default:
      return "active";
  }
}

// ─── Relation label ───────────────────────────────────────────────────────────

export function formatRelation(relation: GuardianRelation): string {
  const labels: Record<GuardianRelation, string> = {
    father: "Father",
    mother: "Mother",
    brother: "Brother",
    sister: "Sister",
    uncle: "Uncle",
    aunt: "Aunt",
    grandparent: "Grandparent",
    "legal-guardian": "Legal Guardian",
    other: "Other",
  };
  return labels[relation] ?? relation;
}

// ─── List row shape ───────────────────────────────────────────────────────────

export interface GuardianTableRow {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  relation: GuardianRelation;
  relationLabel: string;
  email: string;
  phone: string;
  occupation: string;
  linkedStudentCount: number;
  portalAccess: boolean;
  isEmergencyContact: boolean;
  status: GuardianStatus;
  statusVariant: StatusVariant;
}

export function mapGuardiansToRows(guardians: Guardian[]): GuardianTableRow[] {
  return guardians.map((g) => ({
    id: g.id,
    firstName: g.firstName,
    lastName: g.lastName,
    fullName: `${g.firstName} ${g.lastName}`,
    relation: g.relation,
    relationLabel: formatRelation(g.relation),
    email: g.contact.email ?? "",
    phone: g.contact.phone ?? "",
    occupation: g.occupation ?? "",
    linkedStudentCount: g.studentIds.length,
    portalAccess: g.portalAccess ?? false,
    isEmergencyContact: g.isEmergencyContact ?? false,
    status: g.status ?? "active",
    statusVariant: guardianStatusToVariant(g.status),
  }));
}

// ─── Status summary ───────────────────────────────────────────────────────────

export interface GuardianStatusSummary {
  total: number;
  active: number;
  emergencyContacts: number;
  portalAccess: number;
}

export function buildGuardianStatusSummary(guardians: Guardian[]): GuardianStatusSummary {
  return {
    total: guardians.length,
    active: guardians.filter((g) => (g.status ?? "active") === "active").length,
    emergencyContacts: guardians.filter((g) => g.isEmergencyContact === true).length,
    portalAccess: guardians.filter((g) => g.portalAccess === true).length,
  };
}

// ─── Linked student row shape ─────────────────────────────────────────────────

export interface LinkedStudentRow {
  studentId: string;
  fullName: string;
  admissionNumber: string;
  className: string;
  sectionName: string;
  status: string;
  relation: GuardianRelation;
  isPrimary: boolean;
}

export function mapLinkedStudentsToRows(
  links: GuardianStudentLink[],
  students: Student[],
  classLevels: ClassLevel[],
  sections: Section[]
): LinkedStudentRow[] {
  const studentMap = new Map(students.map((s) => [s.id, s]));
  const classMap = new Map(classLevels.map((c) => [c.id, c.name]));
  const sectionMap = new Map(sections.map((s) => [s.id, s.name]));

  return links.map((link) => {
    const student = studentMap.get(link.studentId);
    return {
      studentId: link.studentId,
      fullName: student ? `${student.firstName} ${student.lastName}` : link.studentId,
      admissionNumber: student?.admissionNumber ?? "—",
      className: student ? (classMap.get(student.classId) ?? "—") : "—",
      sectionName: student ? (sectionMap.get(student.sectionId) ?? "—") : "—",
      status: student?.status ?? "—",
      relation: link.relation,
      isPrimary: link.isPrimary,
    };
  });
}

// ─── Relationship filter options ──────────────────────────────────────────────

export function createRelationFilterOptions(
  rows: GuardianTableRow[]
): { value: string; label: string }[] {
  const seen = new Set<string>();
  const opts: { value: string; label: string }[] = [];
  for (const row of rows) {
    if (!seen.has(row.relation)) {
      seen.add(row.relation);
      opts.push({ value: row.relation, label: row.relationLabel });
    }
  }
  return opts.sort((a, b) => a.label.localeCompare(b.label));
}
