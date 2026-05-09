import type { QueryParams } from "@/types/common";
import type { DashboardPersona } from "@/types/dashboard";

/**
 * Centralized query key factory for TanStack Query.
 * Keys follow the pattern: [domain, ...scope, params?]
 */
export const queryKeys = {
  // ─── Dashboard ──────────────────────────────────────────────────────────────
  dashboard: {
    all: ["dashboard"] as const,
    personas: () => [...queryKeys.dashboard.all, "personas"] as const,
    summary: (persona: DashboardPersona, schoolId: string) =>
      [...queryKeys.dashboard.all, persona, schoolId] as const,
  },

  // ─── Schools ────────────────────────────────────────────────────────────────
  schools: {
    all: ["schools"] as const,
    lists: () => [...queryKeys.schools.all, "list"] as const,
    list: () => [...queryKeys.schools.lists()] as const,
    detail: (id: string) => [...queryKeys.schools.all, "detail", id] as const,
    profile: (id: string) => [...queryKeys.schools.all, "profile", id] as const,
    settings: (id: string) => [...queryKeys.schools.all, "settings", id] as const,
  },

  // ─── Students ───────────────────────────────────────────────────────────────
  students: {
    all: ["students"] as const,
    lists: () => [...queryKeys.students.all, "list"] as const,
    list: (params?: QueryParams) => [...queryKeys.students.lists(), params] as const,
    detail: (id: string) => [...queryKeys.students.all, "detail", id] as const,
    byClass: (classId: string, sectionId?: string) =>
      [...queryKeys.students.all, "byClass", classId, sectionId] as const,
    categories: () => [...queryKeys.students.all, "categories"] as const,
  },

  // ─── Teachers ───────────────────────────────────────────────────────────────
  teachers: {
    all: ["teachers"] as const,
    lists: () => [...queryKeys.teachers.all, "list"] as const,
    list: (params?: QueryParams) => [...queryKeys.teachers.lists(), params] as const,
    detail: (id: string) => [...queryKeys.teachers.all, "detail", id] as const,
    assignments: (teacherId: string) => [...queryKeys.teachers.all, "assignments", teacherId] as const,
    timetable: (teacherId: string) => [...queryKeys.teachers.all, "timetable", teacherId] as const,
    allTimetable: () => [...queryKeys.teachers.all, "timetable", "all"] as const,
  },

  // ─── Guardians ──────────────────────────────────────────────────────────────
  guardians: {
    all: ["guardians"] as const,
    lists: () => [...queryKeys.guardians.all, "list"] as const,
    list: (params?: QueryParams) => [...queryKeys.guardians.lists(), params] as const,
    detail: (id: string) => [...queryKeys.guardians.all, "detail", id] as const,
    links: (guardianId: string) => [...queryKeys.guardians.all, "links", guardianId] as const,
    byStudent: (studentId: string) => [...queryKeys.guardians.all, "byStudent", studentId] as const,
  },

  // ─── Employees ──────────────────────────────────────────────────────────────
  employees: {
    all: ["employees"] as const,
    lists: () => [...queryKeys.employees.all, "list"] as const,
    list: (params?: QueryParams) => [...queryKeys.employees.lists(), params] as const,
    detail: (id: string) => [...queryKeys.employees.all, "detail", id] as const,
    departments: () => [...queryKeys.employees.all, "departments"] as const,
    designations: (departmentId?: string) => [...queryKeys.employees.all, "designations", departmentId] as const,
    payroll: (params?: QueryParams) => [...queryKeys.employees.all, "payroll", params] as const,
    employeePayroll: (employeeId: string) => [...queryKeys.employees.all, "employeePayroll", employeeId] as const,
  },

  // ─── Academic ───────────────────────────────────────────────────────────────
  academic: {
    all: ["academic"] as const,
    years: (schoolId?: string) => [...queryKeys.academic.all, "years", schoolId] as const,
    currentYear: (schoolId: string) => [...queryKeys.academic.all, "currentYear", schoolId] as const,
    classes: (schoolId?: string) => [...queryKeys.academic.all, "classes", schoolId] as const,
    sections: (classId?: string) => [...queryKeys.academic.all, "sections", classId] as const,
    subjects: (classId?: string) => [...queryKeys.academic.all, "subjects", classId] as const,
    classrooms: (schoolId?: string) => [...queryKeys.academic.all, "classrooms", schoolId] as const,
  },

  // ─── Fees ───────────────────────────────────────────────────────────────────
  fees: {
    all: ["fees"] as const,
    groups: () => [...queryKeys.fees.all, "groups"] as const,
    types: (groupId?: string) => [...queryKeys.fees.all, "types", groupId] as const,
    discounts: () => [...queryKeys.fees.all, "discounts"] as const,
    invoices: (params?: QueryParams) => [...queryKeys.fees.all, "invoices", params] as const,
    invoice: (id: string) => [...queryKeys.fees.all, "invoice", id] as const,
    studentInvoices: (studentId: string) => [...queryKeys.fees.all, "studentInvoices", studentId] as const,
    payments: (invoiceId?: string) => [...queryKeys.fees.all, "payments", invoiceId] as const,
  },

  // ─── Finance ────────────────────────────────────────────────────────────────
  finance: {
    all: ["finance"] as const,
    incomeHeads: () => [...queryKeys.finance.all, "incomeHeads"] as const,
    incomeRecords: (params?: QueryParams) => [...queryKeys.finance.all, "incomeRecords", params] as const,
    expenseHeads: () => [...queryKeys.finance.all, "expenseHeads"] as const,
    expenseRecords: (params?: QueryParams) => [...queryKeys.finance.all, "expenseRecords", params] as const,
    transactions: (params?: QueryParams) => [...queryKeys.finance.all, "transactions", params] as const,
  },

  // ─── Attendance ─────────────────────────────────────────────────────────────
  attendance: {
    all: ["attendance"] as const,
    records: (entityType?: string, date?: string) => [...queryKeys.attendance.all, "records", entityType, date] as const,
    entity: (entityId: string, entityType: string) => [...queryKeys.attendance.all, "entity", entityId, entityType] as const,
    summary: (entityId: string) => [...queryKeys.attendance.all, "summary", entityId] as const,
    summaries: (entityType?: string) => [...queryKeys.attendance.all, "summaries", entityType] as const,
  },

  // ─── Exams ──────────────────────────────────────────────────────────────────
  exams: {
    all: ["exams"] as const,
    lists: () => [...queryKeys.exams.all, "list"] as const,
    list: (params?: QueryParams) => [...queryKeys.exams.lists(), params] as const,
    detail: (id: string) => [...queryKeys.exams.all, "detail", id] as const,
    allSchedules: (params?: QueryParams) => [...queryKeys.exams.all, "allSchedules", params] as const,
    schedules: (examId: string) => [...queryKeys.exams.all, "schedules", examId] as const,
    allResults: (params?: QueryParams) => [...queryKeys.exams.all, "allResults", params] as const,
    results: (examScheduleId?: string, studentId?: string) =>
      [...queryKeys.exams.all, "results", examScheduleId, studentId] as const,
    studentResults: (studentId: string) => [...queryKeys.exams.all, "studentResults", studentId] as const,
    gradeScales: () => [...queryKeys.exams.all, "gradeScales"] as const,
  },

  // ─── Leaves ─────────────────────────────────────────────────────────────────
  leaves: {
    all: ["leaves"] as const,
    types: () => [...queryKeys.leaves.all, "types"] as const,
    requests: (params?: QueryParams) => [...queryKeys.leaves.all, "requests", params] as const,
    entityRequests: (entityId: string) => [...queryKeys.leaves.all, "entityRequests", entityId] as const,
    pending: () => [...queryKeys.leaves.all, "pending"] as const,
  },

  // ─── Library ────────────────────────────────────────────────────────────────
  library: {
    all: ["library"] as const,
    books: (params?: QueryParams) => [...queryKeys.library.all, "books", params] as const,
    book: (id: string) => [...queryKeys.library.all, "book", id] as const,
    members: () => [...queryKeys.library.all, "members"] as const,
    member: (id: string) => [...queryKeys.library.all, "member", id] as const,
    issues: (params?: QueryParams) => [...queryKeys.library.all, "issues", params] as const,
    memberIssues: (memberId: string) => [...queryKeys.library.all, "memberIssues", memberId] as const,
    overdue: () => [...queryKeys.library.all, "overdue"] as const,
  },

  // ─── Communication ──────────────────────────────────────────────────────────
  communication: {
    all: ["communication"] as const,
    notices: (params?: QueryParams) => [...queryKeys.communication.all, "notices", params] as const,
    events: (from?: string, to?: string) => [...queryKeys.communication.all, "events", from, to] as const,
    threads: (userId: string) => [...queryKeys.communication.all, "threads", userId] as const,
    messages: (threadId: string) => [...queryKeys.communication.all, "messages", threadId] as const,
  },

  // ─── Notifications ──────────────────────────────────────────────────────────
  notifications: {
    all: ["notifications"] as const,
    user: (userId: string) => [...queryKeys.notifications.all, userId] as const,
    unread: (userId: string) => [...queryKeys.notifications.all, "unread", userId] as const,
    unreadCount: (userId: string) => [...queryKeys.notifications.all, "unreadCount", userId] as const,
  },

  // ─── Certificates ───────────────────────────────────────────────────────────
  certificates: {
    all: ["certificates"] as const,
    templates: () => [...queryKeys.certificates.all, "templates"] as const,
    records: () => [...queryKeys.certificates.all, "records"] as const,
    student: (studentId: string) => [...queryKeys.certificates.all, "student", studentId] as const,
  },

  // ─── Settings ───────────────────────────────────────────────────────────────
  settings: {
    all: ["settings"] as const,
    general: () => [...queryKeys.settings.all, "general"] as const,
    languages: () => [...queryKeys.settings.all, "languages"] as const,
    currencies: () => [...queryKeys.settings.all, "currencies"] as const,
    roles: () => [...queryKeys.settings.all, "roles"] as const,
    userRoles: () => [...queryKeys.settings.all, "user-roles"] as const,
    plans: () => [...queryKeys.settings.all, "plans"] as const,
    usage: () => [...queryKeys.settings.all, "usage"] as const,
    billing: () => [...queryKeys.settings.all, "billing"] as const,
  },
} as const;
