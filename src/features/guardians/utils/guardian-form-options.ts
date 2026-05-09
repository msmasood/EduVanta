// guardian-form-options.ts — select option arrays for GuardianForm

import type { SelectOption } from "@/types/common";

// ─── Relationship options ─────────────────────────────────────────────────────

export const GUARDIAN_RELATION_OPTIONS: SelectOption[] = [
  { value: "father", label: "Father" },
  { value: "mother", label: "Mother" },
  { value: "brother", label: "Brother" },
  { value: "sister", label: "Sister" },
  { value: "uncle", label: "Uncle" },
  { value: "aunt", label: "Aunt" },
  { value: "grandparent", label: "Grandparent" },
  { value: "legal-guardian", label: "Legal Guardian" },
  { value: "other", label: "Other" },
];

// ─── Status options ──────────────────────────────────────────────────────────

export const GUARDIAN_STATUS_OPTIONS: SelectOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

// ─── Country options (abbreviated) ───────────────────────────────────────────

export const COUNTRY_OPTIONS: SelectOption[] = [
  { value: "PK", label: "Pakistan" },
  { value: "AE", label: "United Arab Emirates" },
  { value: "SA", label: "Saudi Arabia" },
  { value: "GB", label: "United Kingdom" },
  { value: "US", label: "United States" },
  { value: "IN", label: "India" },
  { value: "BD", label: "Bangladesh" },
  { value: "QA", label: "Qatar" },
  { value: "KW", label: "Kuwait" },
  { value: "OM", label: "Oman" },
  { value: "BH", label: "Bahrain" },
  { value: "EG", label: "Egypt" },
  { value: "JO", label: "Jordan" },
  { value: "LB", label: "Lebanon" },
  { value: "TR", label: "Turkey" },
  { value: "OTHER", label: "Other" },
];
