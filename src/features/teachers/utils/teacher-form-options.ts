// teacher-form-options.ts — static select options for teacher form dropdowns

import type { SelectOption } from "@/types/common";

export const GENDER_OPTIONS: SelectOption[] = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

export const TEACHER_STATUS_OPTIONS: SelectOption[] = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "On Leave", value: "on-leave" },
];

export const ATTENDANCE_STATUS_OPTIONS: SelectOption[] = [
  { label: "Present", value: "present" },
  { label: "Absent", value: "absent" },
  { label: "Late", value: "late" },
  { label: "Half Day", value: "half-day" },
  { label: "Leave", value: "leave" },
];

export const DAY_OF_WEEK_OPTIONS: SelectOption[] = [
  { label: "Monday", value: "monday" },
  { label: "Tuesday", value: "tuesday" },
  { label: "Wednesday", value: "wednesday" },
  { label: "Thursday", value: "thursday" },
  { label: "Friday", value: "friday" },
  { label: "Saturday", value: "saturday" },
  { label: "Sunday", value: "sunday" },
];
