import type { ID, FullStatus, Gender, Address, ContactInfo, AuditMeta, Maybe } from "./common";
import type { CurrencyCode } from "@/lib/currency";

// ─── Student category ─────────────────────────────────────────────────────────

export interface StudentCategory {
  id: ID;
  schoolId: ID;
  name: string;
  description?: string;
  audit: AuditMeta;
}

// ─── Student status ───────────────────────────────────────────────────────────

export type StudentStatus = "active" | "inactive" | "suspended" | "graduated" | "transferred";

// ─── Core student ─────────────────────────────────────────────────────────────

export interface Student {
  id: ID;
  schoolId: ID;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  categoryId: ID;
  classId: ID;
  sectionId: ID;
  rollNumber: string;
  address: Address;
  contact: ContactInfo;
  guardianId: ID;
  bloodGroup?: string;
  religion?: string;
  nationality: string;
  status: StudentStatus;
  admissionDate: string;
  profileImageUrl?: string;
  defaultCurrency: CurrencyCode;
  audit: AuditMeta;
}

// ─── Student enrollment ───────────────────────────────────────────────────────

export interface StudentEnrollment {
  id: ID;
  studentId: ID;
  classId: ID;
  sectionId: ID;
  academicYearId: ID;
  enrolledAt: string;
  audit: AuditMeta;
}

// ─── Student profile summary (for lists/cards) ────────────────────────────────

export interface StudentProfileSummary {
  id: ID;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  className: string;
  sectionName: string;
  status: StudentStatus;
  guardianName: Maybe<string>;
  profileImageUrl?: string;
}
