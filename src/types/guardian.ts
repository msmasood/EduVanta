import type { ID, AuditMeta, ContactInfo, Address } from "./common";

// ─── Guardian ─────────────────────────────────────────────────────────────────

export type GuardianRelation = "father" | "mother" | "brother" | "sister" | "uncle" | "aunt" | "grandparent" | "legal-guardian" | "other";
export type GuardianStatus = "active" | "inactive" | "pending";

export interface Guardian {
  id: ID;
  schoolId: ID;
  firstName: string;
  lastName: string;
  relation: GuardianRelation;
  occupation?: string;
  nationalId?: string;
  contact: ContactInfo;
  address: Address;
  studentIds: ID[];
  status?: GuardianStatus;
  isEmergencyContact?: boolean;
  portalAccess?: boolean;
  audit: AuditMeta;
}

// ─── Guardian ↔ Student link ──────────────────────────────────────────────────

export interface GuardianStudentLink {
  id: ID;
  guardianId: ID;
  studentId: ID;
  relation: GuardianRelation;
  isPrimary: boolean;
  audit: AuditMeta;
}
