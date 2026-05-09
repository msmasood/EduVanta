import { z } from "zod";

// ─── Certificate Generate Schema ──────────────────────────────────────────────

export const certificateGenerateSchema = z.object({
  templateId: z.string().min(1, { message: "Template is required." }),
  studentId: z.string().min(1, { message: "Student is required." }),
  issueDate: z.string().min(1, { message: "Issue date is required." }),
  certificateTitle: z
    .string()
    .optional()
    .refine((v) => !v || v.length >= 2, {
      message: "Certificate title must be at least 2 characters.",
    }),
  academicYearId: z.string().optional(),
  classId: z.string().optional(),
  remarks: z.string().optional(),
  signerName: z
    .string()
    .optional()
    .refine((v) => !v || v.length >= 2, {
      message: "Signer name must be at least 2 characters.",
    }),
  signerDesignation: z
    .string()
    .optional()
    .refine((v) => !v || v.length >= 2, {
      message: "Signer designation must be at least 2 characters.",
    }),
  status: z.enum(["draft", "issued"] as const).optional(),
});

export type CertificateGenerateValues = z.infer<typeof certificateGenerateSchema>;

// ─── Certificate Record Filter Schema ────────────────────────────────────────

export const certificateRecordFilterSchema = z
  .object({
    templateId: z.string().optional(),
    studentId: z.string().optional(),
    status: z.string().optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.dateFrom && data.dateTo) {
        return new Date(data.dateTo) >= new Date(data.dateFrom);
      }
      return true;
    },
    {
      message: "End date must be on or after the start date.",
      path: ["dateTo"],
    }
  );

export type CertificateRecordFilterValues = z.infer<typeof certificateRecordFilterSchema>;
