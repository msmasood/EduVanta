"use client";

import * as React from "react";
import { toast } from "sonner";

import { TableSkeleton } from "@/components/data-table";
import { useCertificateTemplates, useCertificateRecords } from "@/hooks/queries/use-certificates";
import { useStudents } from "@/hooks/queries/use-students";
import { useClasses, useAcademicYears } from "@/hooks/queries/use-academic";
import {
  mapCertificateRecordsToRows,
  computeCertificateSummaryStats,
  buildCertificatePreviewData,
  type CertificatePreviewData,
  type CertificateRecordRow,
} from "../utils/certificate-mappers";
import { CertificateControlPanel } from "./certificate-control-panel";
import { CertificatePreview } from "./certificate-preview";
import { CertificateRecordsTable } from "./certificate-records-table";
import { CertificateSummaryCards } from "./certificate-summary-cards";
import { printCertificate } from "../utils/certificate-print";
import type { CertificateGenerateValues } from "@/lib/validations/certificates";

const SCHOOL_ID = "school-001";

export function CertificatesManager() {
  const templatesQuery = useCertificateTemplates();
  const recordsQuery = useCertificateRecords();
  const studentsQuery = useStudents();
  const classesQuery = useClasses(SCHOOL_ID);
  const yearsQuery = useAcademicYears(SCHOOL_ID);

  const [preview, setPreview] = React.useState<CertificatePreviewData | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const templates = templatesQuery.data?.data ?? [];
  const rawRecords = recordsQuery.data?.data ?? [];
  const students = studentsQuery.data?.data ?? [];
  const classes = classesQuery.data?.data ?? [];
  const academicYears = yearsQuery.data?.data ?? [];

  const rows: CertificateRecordRow[] = React.useMemo(
    () => mapCertificateRecordsToRows(rawRecords, templates, students, classes),
    [rawRecords, templates, students, classes]
  );

  const stats = React.useMemo(
    () => computeCertificateSummaryStats(rawRecords),
    [rawRecords]
  );

  const isLoading =
    templatesQuery.isLoading ||
    recordsQuery.isLoading ||
    studentsQuery.isLoading ||
    classesQuery.isLoading;

  const handleGenerate = async (values: CertificateGenerateValues) => {
    setIsGenerating(true);
    try {
      await new Promise((r) => setTimeout(r, 300));

      // Find the academic year name if provided
      const yearName = values.academicYearId
        ? (academicYears.find((y) => y.id === values.academicYearId)?.name ?? "")
        : "";

      const previewData = buildCertificatePreviewData({
        templateId: values.templateId,
        templates,
        studentId: values.studentId,
        students,
        classes,
        classId: values.classId,
        academicYear: yearName,
        issueDate: values.issueDate,
        certificateTitle: values.certificateTitle,
        remarks: values.remarks,
        signerName: values.signerName,
        signerDesignation: values.signerDesignation,
      });

      setPreview(previewData);
      toast.success("Certificate preview generated.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    if (!preview) return;
    printCertificate();
    toast.info("Opening print dialog...");
  };

  const handleDownload = () => {
    toast.info("PDF export will be available after backend integration.");
  };

  const handleLoadRecord = (row: CertificateRecordRow) => {
    const template = templates.find((t) => t.id === row.templateId);
    const student = students.find((s) => s.id === row.studentId);
    const cls = classes.find((c) => c.id === row.classId);

    const previewData: CertificatePreviewData = {
      referenceNumber: row.certificateNumber,
      templateId: row.templateId,
      templateName: row.templateName,
      templateType: row.templateType,
      studentName: row.studentName,
      admissionNumber: row.admissionNumber,
      classSection: row.className,
      academicYear: "2024–2025",
      issueDate: row.issueDate,
      certificateTitle: template?.name ?? row.templateName,
      bodyText: row.templateType
        ? `${row.studentName} (Admission No. ${row.admissionNumber}) — ${row.templateName}`
        : "Certificate record loaded.",
      remarks: "",
      signerName: "Principal",
      signerDesignation: "Principal, EduVanta School",
    };

    // Use full mapper if we have enough data
    if (template && student) {
      const built = buildCertificatePreviewData({
        templateId: row.templateId,
        templates,
        studentId: row.studentId,
        students,
        classes,
        classId: row.classId,
        academicYear: "2024–2025",
        issueDate: row.issueDateRaw,
        signerName: "",
        signerDesignation: "",
      });
      setPreview({ ...built, referenceNumber: row.certificateNumber });
    } else {
      setPreview(previewData);
    }

    toast.info("Record loaded into preview.");
    // Scroll to top on mobile
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div data-testid="certificates-manager">
        <TableSkeleton columns={4} rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="certificates-manager">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Certificates</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate, preview, and print certificates for students.
        </p>
      </div>

      {/* Summary cards */}
      <CertificateSummaryCards {...stats} />

      {/* Control panel + preview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        <CertificateControlPanel
          templates={templates}
          students={students}
          classes={classes}
          academicYears={academicYears}
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
          onPrint={handlePrint}
          onDownload={handleDownload}
          hasPreview={!!preview}
        />

        <CertificatePreview preview={preview} />
      </div>

      {/* Records table */}
      <CertificateRecordsTable
        rows={rows}
        isLoading={recordsQuery.isLoading}
        onLoad={handleLoadRecord}
      />
    </div>
  );
}
