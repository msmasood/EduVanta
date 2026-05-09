// certificate-mappers.ts — data transformation utilities for the Certificates module

import type { CertificateTemplate, CertificateRecord, CertificateStatus } from "@/types/certificates";
import type { Student } from "@/types/student";
import type { ClassLevel } from "@/types/academic";
import type { StatusVariant } from "@/components/data-table/status-badge";
import { formatShortDate } from "@/lib/dates";
import { getCertificateTypeLabel } from "./certificate-form-options";

// ─── Status helpers ───────────────────────────────────────────────────────────

export function certificateStatusToVariant(status?: string): StatusVariant {
  const map: Record<string, StatusVariant> = {
    issued: "active",
    draft: "pending",
    revoked: "destructive",
    expired: "inactive",
  };
  return map[status ?? ""] ?? "neutral";
}

export function certificateStatusLabel(status?: string): string {
  const map: Record<string, string> = {
    issued: "Issued",
    draft: "Draft",
    revoked: "Revoked",
    expired: "Expired",
  };
  return map[status ?? ""] ?? (status ?? "—");
}

// ─── Certificate record row ───────────────────────────────────────────────────

export interface CertificateRecordRow {
  id: string;
  certificateNumber: string;
  templateId: string;
  templateName: string;
  templateType: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  classId: string;
  className: string;
  issueDate: string;
  issueDateRaw: string;
  status: CertificateStatus;
  statusVariant: StatusVariant;
  statusLabel: string;
}

export function mapCertificateRecordsToRows(
  records: CertificateRecord[],
  templates: CertificateTemplate[],
  students: Student[],
  classes: ClassLevel[]
): CertificateRecordRow[] {
  const templateMap = new Map(templates.map((t) => [t.id, t]));
  const studentMap = new Map(students.map((s) => [s.id, s]));
  const classMap = new Map(classes.map((c) => [c.id, c]));

  return records.map((rec) => {
    const template = templateMap.get(rec.templateId);
    const student = studentMap.get(rec.studentId);
    const cls = classMap.get(rec.classId ?? "");

    const studentName = student
      ? `${student.firstName} ${student.lastName}`
      : (rec.variables?.studentName ?? "—");

    const admissionNumber = student?.admissionNumber ?? rec.variables?.admissionNumber ?? "—";
    const className = cls?.name ?? rec.variables?.className ?? "—";
    const templateName = template
      ? template.name
      : getCertificateTypeLabel(rec.variables?.templateType ?? "");

    return {
      id: rec.id,
      certificateNumber: rec.certificateNumber,
      templateId: rec.templateId,
      templateName: templateName || "—",
      templateType: template?.type ?? "custom",
      studentId: rec.studentId,
      studentName,
      admissionNumber,
      classId: rec.classId ?? "",
      className,
      issueDate: formatShortDate(rec.issuedAt),
      issueDateRaw: rec.issuedAt,
      status: rec.status,
      statusVariant: certificateStatusToVariant(rec.status),
      statusLabel: certificateStatusLabel(rec.status),
    };
  });
}

// ─── Certificate summary stats ────────────────────────────────────────────────

export interface CertificateSummaryStats {
  total: number;
  issued: number;
  draft: number;
  thisMonth: number;
}

export function computeCertificateSummaryStats(
  records: CertificateRecord[]
): CertificateSummaryStats {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const total = records.length;
  const issued = records.filter((r) => r.status === "issued").length;
  const draft = records.filter((r) => r.status === "draft").length;
  const thisMonthCount = records.filter((r) => {
    const d = new Date(r.issuedAt);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;

  return { total, issued, draft, thisMonth: thisMonthCount };
}

// ─── Certificate preview data ─────────────────────────────────────────────────

export interface CertificatePreviewData {
  referenceNumber: string;
  templateId: string;
  templateName: string;
  templateType: string;
  studentName: string;
  admissionNumber: string;
  classSection: string;
  academicYear: string;
  issueDate: string;
  certificateTitle: string;
  bodyText: string;
  remarks: string;
  signerName: string;
  signerDesignation: string;
}

export function getCertificateBodyText(
  templateType: string,
  studentName: string,
  admissionNumber: string,
  className: string,
  academicYear: string,
  issueDate: string
): string {
  const base = `${studentName} (Admission No. ${admissionNumber})`;

  switch (templateType) {
    case "bonafide":
      return `This is to certify that ${base} is a bonafide student of ${className} at this institution for the academic year ${academicYear}.`;
    case "transfer":
      return `This is to certify that ${base}, a student of ${className}, has been granted a Transfer Certificate from this institution with effect from ${issueDate}.`;
    case "character":
      return `This is to certify that ${base}, a student of ${className}, has been of good character and conduct throughout the period of study at this institution.`;
    case "completion":
      return `This is to certify that ${base} has successfully completed ${className} for the academic year ${academicYear} from this institution.`;
    case "attendance":
      return `This is to certify that ${base}, a student of ${className}, has maintained satisfactory attendance during the academic year ${academicYear}.`;
    case "achievement":
      return `This is to certify that ${base}, a student of ${className}, has demonstrated outstanding achievement during the academic year ${academicYear} and is hereby recognized for their excellence.`;
    case "examResult":
      return `This is to certify that ${base}, a student of ${className}, has appeared in the examinations held during the academic year ${academicYear} and has passed with distinction.`;
    default:
      return `This is to certify that ${base} is a student of ${className} at this institution for the academic year ${academicYear}.`;
  }
}

export function buildCertificatePreviewData(params: {
  templateId: string;
  templates: CertificateTemplate[];
  studentId: string;
  students: Student[];
  classes: ClassLevel[];
  classId?: string;
  academicYear?: string;
  issueDate: string;
  certificateTitle?: string;
  remarks?: string;
  signerName?: string;
  signerDesignation?: string;
}): CertificatePreviewData {
  const {
    templateId,
    templates,
    studentId,
    students,
    classes,
    classId,
    academicYear = "",
    issueDate,
    certificateTitle,
    remarks = "",
    signerName = "",
    signerDesignation = "",
  } = params;

  const template = templates.find((t) => t.id === templateId);
  const student = students.find((s) => s.id === studentId);
  const cls = classes.find((c) => c.id === (classId ?? student?.classId));

  const studentName = student ? `${student.firstName} ${student.lastName}` : "—";
  const admissionNumber = student?.admissionNumber ?? "—";
  const className = cls?.name ?? "—";
  const formattedDate = formatShortDate(issueDate);

  const templateType = template?.type ?? "custom";
  const autoTitle = certificateTitle || (template ? template.name : "Certificate");

  const bodyText = getCertificateBodyText(
    templateType,
    studentName,
    admissionNumber,
    className,
    academicYear || "2024–2025",
    formattedDate
  );

  const refNum = `CERT-${new Date().getFullYear()}-${templateType.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    referenceNumber: refNum,
    templateId,
    templateName: template?.name ?? "—",
    templateType,
    studentName,
    admissionNumber,
    classSection: className,
    academicYear: academicYear || "2024–2025",
    issueDate: formattedDate,
    certificateTitle: autoTitle,
    bodyText,
    remarks,
    signerName: signerName || "Principal",
    signerDesignation: signerDesignation || "Principal, EduVanta School",
  };
}
