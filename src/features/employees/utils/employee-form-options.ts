// employee-form-options.ts — select options for employee forms

export const EMPLOYMENT_TYPE_OPTIONS = [
  { label: "Full Time", value: "full-time" },
  { label: "Part Time", value: "part-time" },
  { label: "Contract", value: "contract" },
  { label: "Intern", value: "intern" },
] as const;

export const EMPLOYEE_STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "On Leave", value: "on-leave" },
  { label: "Terminated", value: "terminated" },
] as const;

export const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
] as const;
