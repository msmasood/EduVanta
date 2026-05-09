/**
 * Certificate mappers unit tests — Phase 21
 */

import { describe, it, expect } from "vitest";
import {
  mapCertificateRecordsToRows,
  computeCertificateSummaryStats,
  buildCertificatePreviewData,
  getCertificateBodyText,
  certificateStatusToVariant,
  certificateStatusLabel,
} from "@/features/certificates/utils/certificate-mappers";
import { getCertificateTypeLabel } from "@/features/certificates/utils/certificate-form-options";
import type { CertificateTemplate, CertificateRecord } from "@/types/certificates";
import type { Student } from "@/types/student";
import type { ClassLevel } from "@/types/academic";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const MOCK_TEMPLATES: CertificateTemplate[] = [
  {
    id: "cert-tpl-001",
    schoolId: "school-001",
    name: "Bonafide Certificate",
    type: "bonafide",
    htmlTemplate: "",
    isActive: true,
    audit: { createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z" },
  },
  {
    id: "cert-tpl-002",
    schoolId: "school-001",
    name: "Completion Certificate",
    type: "completion",
    htmlTemplate: "",
    isActive: true,
    audit: { createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z" },
  },
];

const MOCK_STUDENTS: Student[] = [
  {
    id: "student-001",
    schoolId: "school-001",
    admissionNumber: "AN2024001",
    firstName: "Ahmed",
    lastName: "Khan",
    dateOfBirth: "2012-05-15",
    gender: "male",
    categoryId: "cat-001",
    classId: "class-005",
    sectionId: "sec-001",
    rollNumber: "01",
    address: { line1: "", city: "Karachi", country: "PK" },
    contact: { email: "", phone: "" },
    guardianId: "guardian-001",
    nationality: "Pakistani",
    status: "active",
    admissionDate: "2024-01-01",
    defaultCurrency: "PKR",
    audit: { createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z" },
  },
];

const MOCK_CLASSES: ClassLevel[] = [
  {
    id: "class-005",
    schoolId: "school-001",
    name: "Class 5",
    order: 5,
    status: "active",
    audit: { createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z" },
  },
];

const MOCK_RECORDS: CertificateRecord[] = [
  {
    id: "cert-rec-001",
    schoolId: "school-001",
    templateId: "cert-tpl-001",
    studentId: "student-001",
    classId: "class-005",
    certificateNumber: "CERT-2024-BON-001",
    issuedAt: "2024-08-05",
    issuedBy: "emp-001",
    status: "issued",
    variables: {
      studentName: "Ahmed Khan",
      admissionNumber: "AN2024001",
      className: "Class 5",
      academicYear: "2024-2025",
    },
    audit: { createdAt: "2024-08-05T00:00:00.000Z", updatedAt: "2024-08-05T00:00:00.000Z" },
  },
  {
    id: "cert-rec-002",
    schoolId: "school-001",
    templateId: "cert-tpl-002",
    studentId: "student-001",
    classId: "class-005",
    certificateNumber: "CERT-2024-COMP-002",
    issuedAt: "2024-09-10",
    issuedBy: "emp-001",
    status: "draft",
    variables: {},
    audit: { createdAt: "2024-09-10T00:00:00.000Z", updatedAt: "2024-09-10T00:00:00.000Z" },
  },
];

// ─── certificateStatusToVariant ───────────────────────────────────────────────

describe("certificateStatusToVariant", () => {
  it('maps "issued" to "active"', () => {
    expect(certificateStatusToVariant("issued")).toBe("active");
  });

  it('maps "draft" to "pending"', () => {
    expect(certificateStatusToVariant("draft")).toBe("pending");
  });

  it('maps "revoked" to "destructive"', () => {
    expect(certificateStatusToVariant("revoked")).toBe("destructive");
  });

  it('maps "expired" to "inactive"', () => {
    expect(certificateStatusToVariant("expired")).toBe("inactive");
  });

  it("falls back to neutral for unknown status", () => {
    expect(certificateStatusToVariant("unknown")).toBe("neutral");
  });
});

// ─── certificateStatusLabel ───────────────────────────────────────────────────

describe("certificateStatusLabel", () => {
  it("returns Issued for issued", () => {
    expect(certificateStatusLabel("issued")).toBe("Issued");
  });

  it("returns Draft for draft", () => {
    expect(certificateStatusLabel("draft")).toBe("Draft");
  });
});

// ─── getCertificateTypeLabel ──────────────────────────────────────────────────

describe("getCertificateTypeLabel", () => {
  it("returns bonafide label", () => {
    expect(getCertificateTypeLabel("bonafide")).toBe("Bonafide Certificate");
  });

  it("returns transfer label", () => {
    expect(getCertificateTypeLabel("transfer")).toBe("Transfer Certificate");
  });

  it("returns the raw value for unknown types", () => {
    expect(getCertificateTypeLabel("unknown")).toBe("unknown");
  });
});

// ─── mapCertificateRecordsToRows ──────────────────────────────────────────────

describe("mapCertificateRecordsToRows", () => {
  it("maps records to rows with student name resolved", () => {
    const rows = mapCertificateRecordsToRows(
      MOCK_RECORDS,
      MOCK_TEMPLATES,
      MOCK_STUDENTS,
      MOCK_CLASSES
    );
    expect(rows[0].studentName).toBe("Ahmed Khan");
  });

  it("maps records to rows with admission number resolved", () => {
    const rows = mapCertificateRecordsToRows(
      MOCK_RECORDS,
      MOCK_TEMPLATES,
      MOCK_STUDENTS,
      MOCK_CLASSES
    );
    expect(rows[0].admissionNumber).toBe("AN2024001");
  });

  it("resolves class name", () => {
    const rows = mapCertificateRecordsToRows(
      MOCK_RECORDS,
      MOCK_TEMPLATES,
      MOCK_STUDENTS,
      MOCK_CLASSES
    );
    expect(rows[0].className).toBe("Class 5");
  });

  it("resolves template name", () => {
    const rows = mapCertificateRecordsToRows(
      MOCK_RECORDS,
      MOCK_TEMPLATES,
      MOCK_STUDENTS,
      MOCK_CLASSES
    );
    expect(rows[0].templateName).toBe("Bonafide Certificate");
  });

  it("falls back safely for missing lookups", () => {
    const rows = mapCertificateRecordsToRows(
      MOCK_RECORDS,
      [],    // no templates
      [],    // no students
      []     // no classes
    );
    // Should not throw; use fallback from variables
    expect(rows[0].studentName).toBe("Ahmed Khan"); // from variables
    expect(rows[0].className).toBe("Class 5");      // from variables
  });
});

// ─── computeCertificateSummaryStats ──────────────────────────────────────────

describe("computeCertificateSummaryStats", () => {
  it("computes total count", () => {
    const stats = computeCertificateSummaryStats(MOCK_RECORDS);
    expect(stats.total).toBe(2);
  });

  it("computes issued count", () => {
    const stats = computeCertificateSummaryStats(MOCK_RECORDS);
    expect(stats.issued).toBe(1);
  });

  it("computes draft count", () => {
    const stats = computeCertificateSummaryStats(MOCK_RECORDS);
    expect(stats.draft).toBe(1);
  });

  it("returns 0 counts for empty records", () => {
    const stats = computeCertificateSummaryStats([]);
    expect(stats.total).toBe(0);
    expect(stats.issued).toBe(0);
    expect(stats.draft).toBe(0);
    expect(stats.thisMonth).toBe(0);
  });
});

// ─── getCertificateBodyText ───────────────────────────────────────────────────

describe("getCertificateBodyText", () => {
  const args = [
    "Ahmed Khan",
    "AN2024001",
    "Class 5",
    "2024-2025",
    "05 Aug 2024",
  ] as const;

  it("generates bonafide body text containing student name", () => {
    const text = getCertificateBodyText("bonafide", ...args);
    expect(text).toContain("Ahmed Khan");
    expect(text).toContain("bonafide student");
  });

  it("generates transfer body text", () => {
    const text = getCertificateBodyText("transfer", ...args);
    expect(text).toContain("Transfer Certificate");
  });

  it("generates character body text", () => {
    const text = getCertificateBodyText("character", ...args);
    expect(text).toContain("good character");
  });

  it("generates completion body text", () => {
    const text = getCertificateBodyText("completion", ...args);
    expect(text).toContain("successfully completed");
  });

  it("changes body text for different template types", () => {
    const bonafide = getCertificateBodyText("bonafide", ...args);
    const achievement = getCertificateBodyText("achievement", ...args);
    expect(bonafide).not.toBe(achievement);
  });
});

// ─── buildCertificatePreviewData ─────────────────────────────────────────────

describe("buildCertificatePreviewData", () => {
  it("resolves student name correctly", () => {
    const preview = buildCertificatePreviewData({
      templateId: "cert-tpl-001",
      templates: MOCK_TEMPLATES,
      studentId: "student-001",
      students: MOCK_STUDENTS,
      classes: MOCK_CLASSES,
      issueDate: "2024-08-05",
    });
    expect(preview.studentName).toBe("Ahmed Khan");
  });

  it("resolves admission number", () => {
    const preview = buildCertificatePreviewData({
      templateId: "cert-tpl-001",
      templates: MOCK_TEMPLATES,
      studentId: "student-001",
      students: MOCK_STUDENTS,
      classes: MOCK_CLASSES,
      issueDate: "2024-08-05",
    });
    expect(preview.admissionNumber).toBe("AN2024001");
  });

  it("generates a reference number", () => {
    const preview = buildCertificatePreviewData({
      templateId: "cert-tpl-001",
      templates: MOCK_TEMPLATES,
      studentId: "student-001",
      students: MOCK_STUDENTS,
      classes: MOCK_CLASSES,
      issueDate: "2024-08-05",
    });
    expect(preview.referenceNumber).toBeTruthy();
    expect(preview.referenceNumber.length).toBeGreaterThan(5);
  });

  it("uses certificateTitle override if provided", () => {
    const preview = buildCertificatePreviewData({
      templateId: "cert-tpl-001",
      templates: MOCK_TEMPLATES,
      studentId: "student-001",
      students: MOCK_STUDENTS,
      classes: MOCK_CLASSES,
      issueDate: "2024-08-05",
      certificateTitle: "Custom Title Override",
    });
    expect(preview.certificateTitle).toBe("Custom Title Override");
  });

  it("falls back to template name when no title override", () => {
    const preview = buildCertificatePreviewData({
      templateId: "cert-tpl-001",
      templates: MOCK_TEMPLATES,
      studentId: "student-001",
      students: MOCK_STUDENTS,
      classes: MOCK_CLASSES,
      issueDate: "2024-08-05",
    });
    expect(preview.certificateTitle).toBe("Bonafide Certificate");
  });

  it("handles missing student gracefully", () => {
    const preview = buildCertificatePreviewData({
      templateId: "cert-tpl-001",
      templates: MOCK_TEMPLATES,
      studentId: "non-existent",
      students: MOCK_STUDENTS,
      classes: MOCK_CLASSES,
      issueDate: "2024-08-05",
    });
    expect(preview.studentName).toBe("—");
  });
});
