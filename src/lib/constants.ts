// ─── App metadata ─────────────────────────────────────────────────────────────
export const APP_NAME = "EduVanta";
export const APP_TAGLINE = "Smart School Management SaaS";
export const APP_VERSION = "2.0.0";
export const APP_DESCRIPTION =
  "EduVanta is a comprehensive, multilingual school, college and LMS management platform.";

// ─── Theme ────────────────────────────────────────────────────────────────────
export const THEMES = ["light", "dark", "system"] as const;
export type Theme = (typeof THEMES)[number];
export const DEFAULT_THEME: Theme = "system";

// ─── Brand colors (reference — actual tokens live in globals.css) ─────────────
export const BRAND_COLORS = {
  primary: "#25A194",
  red: "#dc2626",
  blue: "#2563eb",
  yellow: "#ff9f29",
  cyan: "#00b8f2",
  violet: "#7c3aed",
} as const;

// ─── School roles ──────────────────────────────────────────────────────────────
export const SCHOOL_ROLES = [
  "super-admin",
  "admin",
  "principal",
  "teacher",
  "student",
  "parent",
  "guardian",
  "accountant",
  "librarian",
] as const;
export type SchoolRole = (typeof SCHOOL_ROLES)[number];

// ─── Pagination defaults ──────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

// ─── Date formats ─────────────────────────────────────────────────────────────
export const DATE_FORMAT = "MMM d, yyyy";
export const DATETIME_FORMAT = "MMM d, yyyy h:mm a";
