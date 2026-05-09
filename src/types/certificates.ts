import type { ID, AuditMeta } from "./common";

// ─── Certificate template ─────────────────────────────────────────────────────

export type CertificateType =
  | "bonafide"
  | "transfer"
  | "character"
  | "completion"
  | "attendance"
  | "achievement"
  | "examResult"
  | "merit"
  | "participation"
  | "conduct"
  | "custom";

export type CertificateStatus = "draft" | "issued" | "revoked" | "expired";

export interface CertificateTemplate {
  id: ID;
  schoolId: ID;
  name: string;
  type: CertificateType;
  htmlTemplate: string;
  isActive: boolean;
  audit: AuditMeta;
}

// ─── Certificate record ───────────────────────────────────────────────────────

export interface CertificateRecord {
  id: ID;
  schoolId: ID;
  templateId: ID;
  studentId: ID;
  classId?: ID;
  academicYearId?: ID;
  certificateNumber: string;
  issuedAt: string;
  issuedBy: ID;
  status: CertificateStatus;
  variables: Record<string, string>;
  audit: AuditMeta;
}
