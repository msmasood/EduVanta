// certificate-form-options.ts — select options for certificate forms

// ─── Certificate Status Options ───────────────────────────────────────────────

export const CERTIFICATE_STATUS_OPTIONS = [
  { label: "Draft", value: "draft" },
  { label: "Issued", value: "issued" },
] as const;

// ─── Certificate type label map ───────────────────────────────────────────────

export const CERTIFICATE_TYPE_LABEL_MAP: Record<string, string> = {
  bonafide: "Bonafide Certificate",
  transfer: "Transfer Certificate",
  character: "Character Certificate",
  completion: "Completion Certificate",
  attendance: "Attendance Certificate",
  achievement: "Achievement Certificate",
  examResult: "Exam Result Certificate",
  merit: "Merit Certificate",
  participation: "Participation Certificate",
  conduct: "Conduct Certificate",
  custom: "Custom Certificate",
};

export function getCertificateTypeLabel(type: string): string {
  return CERTIFICATE_TYPE_LABEL_MAP[type] ?? type;
}
