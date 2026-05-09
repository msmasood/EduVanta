export const SUPPORTED_LOCALES = ["en", "ar", "ur"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = "en";
export const RTL_LOCALES: readonly SupportedLocale[] = ["ar", "ur"];

export function getDirection(locale: string): "ltr" | "rtl" {
  return RTL_LOCALES.includes(locale as SupportedLocale) ? "rtl" : "ltr";
}

export function withLocale(path: string, locale: SupportedLocale): string {
  const normalised = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalised}`;
}

// ─── Auth routes (no locale prefix) ──────────────────────────────────────────
export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
} as const;

// ─── Dashboard route variants ────────────────────────────────────────────────
export const DASHBOARD_ROUTES = {
  ROOT: "/dashboard",
  SCHOOL: "/dashboard",
  STUDENT: "/dashboard/student",
  TEACHER: "/dashboard/teacher",
  PARENT: "/dashboard/parent",
  LMS: "/dashboard/lms",
  UNIVERSITY: "/dashboard/university",
} as const;

// ─── All module routes (no locale prefix) ────────────────────────────────────
export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",

  // Students
  STUDENTS: "/students",
  STUDENTS_NEW: "/students/new",
  STUDENTS_ATTENDANCE: "/students/attendance",
  STUDENTS_CATEGORIES: "/students/categories",
  STUDENTS_SUSPENDED: "/students/suspended",

  // Teachers
  TEACHERS: "/teachers",
  TEACHERS_NEW: "/teachers/new",
  TEACHERS_ATTENDANCE: "/teachers/attendance",
  TEACHERS_TIMETABLE: "/teachers/timetable",

  // Guardians
  GUARDIANS: "/guardians",
  GUARDIANS_NEW: "/guardians/new",

  // Employees
  EMPLOYEES: "/employees",
  EMPLOYEES_NEW: "/employees/new",
  EMPLOYEES_ATTENDANCE: "/employees/attendance",
  EMPLOYEES_LEAVE_REQUESTS: "/employees/leave-requests",
  EMPLOYEES_LEAVE_TYPES: "/employees/leave-types",

  // HRM
  HRM_PAYROLL: "/hrm/payroll",
  HRM_DEPARTMENTS: "/hrm/departments",
  HRM_DESIGNATIONS: "/hrm/designations",

  // Academic
  ACADEMIC_CLASSES: "/academic/classes",
  ACADEMIC_CLASSROOMS: "/academic/classrooms",
  ACADEMIC_SECTIONS: "/academic/sections",
  ACADEMIC_SUBJECTS: "/academic/subjects",

  // Exams
  EXAMS: "/exams",
  EXAMS_SCHEDULE: "/exams/schedule",
  EXAMS_RESULTS: "/exams/results",

  // Fees
  FEES_COLLECT: "/fees/collect",
  FEES_GROUPS: "/fees/groups",
  FEES_TYPES: "/fees/types",
  FEES_DISCOUNTS: "/fees/discounts",

  // Finance
  FINANCE_INCOME_HEADS: "/finance/income-heads",
  FINANCE_INCOME: "/finance/income",
  FINANCE_EXPENSE_HEADS: "/finance/expense-heads",
  FINANCE_EXPENSES: "/finance/expenses",
  FINANCE_TRANSACTIONS: "/finance/transactions",

  // Library
  LIBRARY_BOOKS: "/library/books",
  LIBRARY_ISSUE_RETURN: "/library/issue-return",
  LIBRARY_MEMBERS: "/library/members",

  // Communication
  COMMUNICATION_NOTICES: "/communication/notices",
  COMMUNICATION_EVENTS: "/communication/events",
  COMMUNICATION_MESSAGES: "/communication/messages",

  // Notifications
  NOTIFICATIONS: "/notifications",
  NOTIFICATIONS_ALERTS: "/notifications/alerts",

  // Certificates
  CERTIFICATES: "/certificates",

  // Settings
  SETTINGS: "/settings",
  SETTINGS_GENERAL: "/settings/general",
  SETTINGS_LANGUAGES: "/settings/languages",
  SETTINGS_CURRENCIES: "/settings/currencies",
  SETTINGS_ROLES: "/settings/roles",
  SETTINGS_ASSIGN_ROLES: "/settings/assign-roles",
  SETTINGS_SUBSCRIPTION: "/settings/subscription",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
