// attendance-form-options.ts — select options for attendance forms and filters

import type { SelectOption } from "@/types/common";

// ─── Status options ───────────────────────────────────────────────────────────

export const ATTENDANCE_STATUS_OPTIONS: SelectOption[] = [
  { label: "Present", value: "present" },
  { label: "Absent", value: "absent" },
  { label: "Late", value: "late" },
  { label: "Half Day", value: "half-day" },
  { label: "Leave", value: "leave" },
  { label: "Excused", value: "excused" },
];

// ─── Entity type options ──────────────────────────────────────────────────────

export const ENTITY_TYPE_OPTIONS: SelectOption[] = [
  { label: "Student", value: "student" },
  { label: "Teacher", value: "teacher" },
  { label: "Employee", value: "employee" },
];

// ─── Month options ────────────────────────────────────────────────────────────

export const MONTH_OPTIONS: SelectOption[] = [
  { label: "January", value: "01" },
  { label: "February", value: "02" },
  { label: "March", value: "03" },
  { label: "April", value: "04" },
  { label: "May", value: "05" },
  { label: "June", value: "06" },
  { label: "July", value: "07" },
  { label: "August", value: "08" },
  { label: "September", value: "09" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];
