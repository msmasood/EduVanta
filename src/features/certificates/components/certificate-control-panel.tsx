"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Printer, Download, RotateCcw, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TextField,
  SelectField,
  TextareaField,
  FormActions,
} from "@/components/forms";
import {
  certificateGenerateSchema,
  type CertificateGenerateValues,
} from "@/lib/validations/certificates";
import { CERTIFICATE_STATUS_OPTIONS } from "../utils/certificate-form-options";
import type { CertificateTemplate } from "@/types/certificates";
import type { Student } from "@/types/student";
import type { ClassLevel, AcademicYear } from "@/types/academic";

interface CertificateControlPanelProps {
  templates: CertificateTemplate[];
  students: Student[];
  classes: ClassLevel[];
  academicYears: AcademicYear[];
  isGenerating?: boolean;
  onGenerate: (values: CertificateGenerateValues) => void;
  onPrint: () => void;
  onDownload: () => void;
  hasPreview: boolean;
}

const today = new Date().toISOString().slice(0, 10);

const DEFAULT_VALUES: CertificateGenerateValues = {
  templateId: "",
  studentId: "",
  issueDate: today,
  certificateTitle: "",
  academicYearId: "",
  classId: "",
  remarks: "",
  signerName: "",
  signerDesignation: "",
  status: "draft",
};

export function CertificateControlPanel({
  templates,
  students,
  classes,
  academicYears,
  isGenerating = false,
  onGenerate,
  onPrint,
  onDownload,
  hasPreview,
}: CertificateControlPanelProps) {
  const { control, handleSubmit, reset } = useForm<CertificateGenerateValues>({
    resolver: zodResolver(certificateGenerateSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const templateOptions = templates
    .filter((t) => t.isActive)
    .map((t) => ({ label: t.name, value: t.id }));

  const studentOptions = students.map((s) => ({
    label: `${s.firstName} ${s.lastName} — ${s.admissionNumber}`,
    value: s.id,
  }));

  const classOptions = classes.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const yearOptions = academicYears.map((y) => ({
    label: y.name,
    value: y.id,
  }));

  const handleReset = () => {
    reset(DEFAULT_VALUES);
  };

  return (
    <Card data-testid="certificate-control-panel">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Generate Certificate</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onGenerate)}
          className="space-y-4"
          data-testid="certificate-form"
          noValidate
        >
          {/* Template */}
          <SelectField
            control={control}
            name="templateId"
            label="Certificate Template"
            options={templateOptions}
            placeholder="Select template..."
            required
          />

          {/* Student */}
          <SelectField
            control={control}
            name="studentId"
            label="Student"
            options={studentOptions}
            placeholder="Select student..."
            required
          />

          {/* Issue Date */}
          <TextField
            control={control}
            name="issueDate"
            label="Issue Date"
            type="date"
            required
          />

          {/* Academic Year */}
          {yearOptions.length > 0 && (
            <SelectField
              control={control}
              name="academicYearId"
              label="Academic Year"
              options={yearOptions}
              placeholder="Select year..."
            />
          )}

          {/* Class */}
          {classOptions.length > 0 && (
            <SelectField
              control={control}
              name="classId"
              label="Class"
              options={classOptions}
              placeholder="Select class..."
            />
          )}

          {/* Certificate Title */}
          <TextField
            control={control}
            name="certificateTitle"
            label="Certificate Title (optional)"
            placeholder="e.g. Certificate of Completion"
          />

          {/* Signer Name */}
          <TextField
            control={control}
            name="signerName"
            label="Signer Name (optional)"
            placeholder="e.g. Dr. Rashida Akhtar"
          />

          {/* Signer Designation */}
          <TextField
            control={control}
            name="signerDesignation"
            label="Signer Designation (optional)"
            placeholder="e.g. Principal"
          />

          {/* Remarks */}
          <TextareaField
            control={control}
            name="remarks"
            label="Remarks (optional)"
            placeholder="Any additional notes..."
            rows={3}
          />

          {/* Status */}
          <SelectField
            control={control}
            name="status"
            label="Status"
            options={CERTIFICATE_STATUS_OPTIONS.map((o) => ({ ...o }))}
            placeholder="Select status..."
          />

          {/* Actions */}
          <FormActions
            submitLabel="Generate Preview"
            isLoading={isGenerating}
            showCancel={false}
            showReset
            resetLabel="Reset"
            onReset={handleReset}
          />
        </form>

        {/* Print / Download (only visible after preview generated) */}
        {hasPreview && (
          <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={onPrint}
              data-testid="print-certificate-btn"
            >
              <Printer className="size-4" aria-hidden />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={onDownload}
              data-testid="download-certificate-btn"
            >
              <Download className="size-4" aria-hidden />
              Download PDF
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
