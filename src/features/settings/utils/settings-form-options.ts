import { CURRENCY_CODES, CURRENCIES } from "@/lib/currency";

export const LOCALE_OPTIONS = [
  { label: "English", value: "en" },
  { label: "Arabic (عربي)", value: "ar" },
  { label: "Urdu (اردو)", value: "ur" },
] as const;

export const CURRENCY_OPTIONS = CURRENCY_CODES.map((code) => ({
  label: `${code} — ${CURRENCIES[code].name} (${CURRENCIES[code].symbol})`,
  value: code,
}));

export const TIMEZONE_OPTIONS = [
  { label: "UTC (Coordinated Universal Time)", value: "UTC" },
  { label: "America/New_York (Eastern Time)", value: "America/New_York" },
  { label: "America/Chicago (Central Time)", value: "America/Chicago" },
  { label: "America/Denver (Mountain Time)", value: "America/Denver" },
  { label: "America/Los_Angeles (Pacific Time)", value: "America/Los_Angeles" },
  { label: "Europe/London (GMT)", value: "Europe/London" },
  { label: "Europe/Paris (CET)", value: "Europe/Paris" },
  { label: "Europe/Berlin (CET)", value: "Europe/Berlin" },
  { label: "Asia/Dubai (Gulf Standard Time)", value: "Asia/Dubai" },
  { label: "Asia/Riyadh (Arabia Standard Time)", value: "Asia/Riyadh" },
  { label: "Asia/Karachi (Pakistan Standard Time)", value: "Asia/Karachi" },
  { label: "Asia/Kolkata (India Standard Time)", value: "Asia/Kolkata" },
  { label: "Asia/Singapore (Singapore Time)", value: "Asia/Singapore" },
  { label: "Asia/Tokyo (Japan Standard Time)", value: "Asia/Tokyo" },
  { label: "Australia/Sydney (AET)", value: "Australia/Sydney" },
] as const;

export const ENTITY_TYPE_OPTIONS = [
  { label: "Employee", value: "employee" },
  { label: "Teacher", value: "teacher" },
  { label: "Student", value: "student" },
  { label: "Guardian", value: "guardian" },
] as const;

export const PLAN_TIER_OPTIONS = [
  { label: "Free", value: "free" },
  { label: "Basic", value: "basic" },
  { label: "Standard", value: "standard" },
  { label: "Premium", value: "premium" },
  { label: "Enterprise", value: "enterprise" },
] as const;

export const PERMISSION_MODULE_OPTIONS = [
  { label: "Students", value: "students" },
  { label: "Teachers", value: "teachers" },
  { label: "Guardians", value: "guardians" },
  { label: "Employees", value: "employees" },
  { label: "Academic", value: "academic" },
  { label: "Exams", value: "exams" },
  { label: "Fees", value: "fees" },
  { label: "Finance", value: "finance" },
  { label: "Library", value: "library" },
  { label: "Communication", value: "communication" },
  { label: "Notifications", value: "notifications" },
  { label: "Certificates", value: "certificates" },
  { label: "Settings", value: "settings" },
  { label: "HRM", value: "hrm" },
  { label: "Attendance", value: "attendance" },
  { label: "Reports", value: "reports" },
] as const;
