import { ROUTES } from "./routes";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NavigationItem {
  id: string;
  /** Translation key from the "navigation" namespace */
  labelKey: string;
  href: string;
  /** Icon name from lucide-react (string reference, not import) */
  icon: string;
  children?: NavigationItem[];
}

export interface NavigationGroup {
  id: string;
  /** Translation key for the group heading */
  labelKey: string;
  items: NavigationItem[];
}

// ─── Navigation config ────────────────────────────────────────────────────────

export const navigationGroups: NavigationGroup[] = [
  {
    id: "dashboard",
    labelKey: "navigation.dashboard",
    items: [
      { id: "school-dashboard", labelKey: "navigation.schoolDashboard", href: ROUTES.DASHBOARD, icon: "LayoutDashboard" },
      { id: "student-dashboard", labelKey: "navigation.studentDashboard", href: ROUTES.DASHBOARD + "/student", icon: "GraduationCap" },
      { id: "teacher-dashboard", labelKey: "navigation.teacherDashboard", href: ROUTES.DASHBOARD + "/teacher", icon: "Users" },
      { id: "parent-dashboard", labelKey: "navigation.parentDashboard", href: ROUTES.DASHBOARD + "/parent", icon: "UserCircle" },
      { id: "lms-dashboard", labelKey: "navigation.lmsDashboard", href: ROUTES.DASHBOARD + "/lms", icon: "BookOpen" },
      { id: "university-dashboard", labelKey: "navigation.universityDashboard", href: ROUTES.DASHBOARD + "/university", icon: "Building2" },
    ],
  },
  {
    id: "students",
    labelKey: "navigation.students",
    items: [
      { id: "students-list", labelKey: "navigation.students", href: ROUTES.STUDENTS, icon: "Users" },
      { id: "students-new", labelKey: "common.addNew", href: ROUTES.STUDENTS_NEW, icon: "UserPlus" },
      { id: "students-attendance", labelKey: "dashboard.attendance", href: ROUTES.STUDENTS_ATTENDANCE, icon: "ClipboardCheck" },
      { id: "students-categories", labelKey: "navigation.academic", href: ROUTES.STUDENTS_CATEGORIES, icon: "Tag" },
      { id: "students-suspended", labelKey: "navigation.students", href: ROUTES.STUDENTS_SUSPENDED, icon: "UserX" },
    ],
  },
  {
    id: "teachers",
    labelKey: "navigation.teachers",
    items: [
      { id: "teachers-list", labelKey: "navigation.teachers", href: ROUTES.TEACHERS, icon: "Users" },
      { id: "teachers-new", labelKey: "common.addNew", href: ROUTES.TEACHERS_NEW, icon: "UserPlus" },
      { id: "teachers-attendance", labelKey: "dashboard.attendance", href: ROUTES.TEACHERS_ATTENDANCE, icon: "ClipboardCheck" },
      { id: "teachers-timetable", labelKey: "navigation.academic", href: ROUTES.TEACHERS_TIMETABLE, icon: "Calendar" },
    ],
  },
  {
    id: "guardians",
    labelKey: "navigation.guardians",
    items: [
      { id: "guardians-list", labelKey: "navigation.guardians", href: ROUTES.GUARDIANS, icon: "UserCog" },
      { id: "guardians-new", labelKey: "common.addNew", href: ROUTES.GUARDIANS_NEW, icon: "UserPlus" },
    ],
  },
  {
    id: "employees",
    labelKey: "navigation.employees",
    items: [
      { id: "employees-list", labelKey: "navigation.employees", href: ROUTES.EMPLOYEES, icon: "Briefcase" },
      { id: "employees-new", labelKey: "common.addNew", href: ROUTES.EMPLOYEES_NEW, icon: "UserPlus" },
      { id: "employees-attendance", labelKey: "dashboard.attendance", href: ROUTES.EMPLOYEES_ATTENDANCE, icon: "ClipboardCheck" },
      { id: "employees-leave-requests", labelKey: "navigation.hrm", href: ROUTES.EMPLOYEES_LEAVE_REQUESTS, icon: "CalendarOff" },
      { id: "employees-leave-types", labelKey: "navigation.hrm", href: ROUTES.EMPLOYEES_LEAVE_TYPES, icon: "ListFilter" },
    ],
  },
  {
    id: "hrm",
    labelKey: "navigation.hrm",
    items: [
      { id: "hrm-payroll", labelKey: "navigation.hrm", href: ROUTES.HRM_PAYROLL, icon: "Banknote" },
      { id: "hrm-departments", labelKey: "navigation.hrm", href: ROUTES.HRM_DEPARTMENTS, icon: "Building" },
      { id: "hrm-designations", labelKey: "navigation.hrm", href: ROUTES.HRM_DESIGNATIONS, icon: "Award" },
    ],
  },
  {
    id: "academic",
    labelKey: "navigation.academic",
    items: [
      { id: "academic-classes", labelKey: "navigation.academic", href: ROUTES.ACADEMIC_CLASSES, icon: "BookMarked" },
      { id: "academic-classrooms", labelKey: "navigation.academic", href: ROUTES.ACADEMIC_CLASSROOMS, icon: "DoorOpen" },
      { id: "academic-sections", labelKey: "navigation.academic", href: ROUTES.ACADEMIC_SECTIONS, icon: "Layers" },
      { id: "academic-subjects", labelKey: "navigation.academic", href: ROUTES.ACADEMIC_SUBJECTS, icon: "BookOpen" },
    ],
  },
  {
    id: "exams",
    labelKey: "navigation.exams",
    items: [
      { id: "exams-list", labelKey: "navigation.exams", href: ROUTES.EXAMS, icon: "FileText" },
      { id: "exams-schedule", labelKey: "navigation.exams", href: ROUTES.EXAMS_SCHEDULE, icon: "CalendarDays" },
      { id: "exams-results", labelKey: "navigation.exams", href: ROUTES.EXAMS_RESULTS, icon: "BarChart3" },
    ],
  },
  {
    id: "fees",
    labelKey: "navigation.fees",
    items: [
      { id: "fees-collect", labelKey: "navigation.fees", href: ROUTES.FEES_COLLECT, icon: "CreditCard" },
      { id: "fees-groups", labelKey: "navigation.fees", href: ROUTES.FEES_GROUPS, icon: "FolderOpen" },
      { id: "fees-types", labelKey: "navigation.fees", href: ROUTES.FEES_TYPES, icon: "ListOrdered" },
      { id: "fees-discounts", labelKey: "navigation.fees", href: ROUTES.FEES_DISCOUNTS, icon: "Percent" },
    ],
  },
  {
    id: "finance",
    labelKey: "navigation.finance",
    items: [
      { id: "finance-income-heads", labelKey: "navigation.finance", href: ROUTES.FINANCE_INCOME_HEADS, icon: "TrendingUp" },
      { id: "finance-income", labelKey: "navigation.finance", href: ROUTES.FINANCE_INCOME, icon: "ArrowUpCircle" },
      { id: "finance-expense-heads", labelKey: "navigation.finance", href: ROUTES.FINANCE_EXPENSE_HEADS, icon: "TrendingDown" },
      { id: "finance-expenses", labelKey: "navigation.finance", href: ROUTES.FINANCE_EXPENSES, icon: "ArrowDownCircle" },
      { id: "finance-transactions", labelKey: "navigation.finance", href: ROUTES.FINANCE_TRANSACTIONS, icon: "ArrowLeftRight" },
    ],
  },
  {
    id: "library",
    labelKey: "navigation.library",
    items: [
      { id: "library-books", labelKey: "navigation.library", href: ROUTES.LIBRARY_BOOKS, icon: "Library" },
      { id: "library-issue-return", labelKey: "navigation.library", href: ROUTES.LIBRARY_ISSUE_RETURN, icon: "RefreshCw" },
      { id: "library-members", labelKey: "navigation.library", href: ROUTES.LIBRARY_MEMBERS, icon: "Users" },
    ],
  },
  {
    id: "communication",
    labelKey: "navigation.communication",
    items: [
      { id: "communication-notices", labelKey: "navigation.communication", href: ROUTES.COMMUNICATION_NOTICES, icon: "Bell" },
      { id: "communication-events", labelKey: "navigation.communication", href: ROUTES.COMMUNICATION_EVENTS, icon: "CalendarDays" },
      { id: "communication-messages", labelKey: "navigation.communication", href: ROUTES.COMMUNICATION_MESSAGES, icon: "MessageSquare" },
    ],
  },
  {
    id: "notifications",
    labelKey: "navigation.notifications",
    items: [
      { id: "notifications-list", labelKey: "navigation.notifications", href: ROUTES.NOTIFICATIONS, icon: "Bell" },
      { id: "notifications-alerts", labelKey: "navigation.notifications", href: ROUTES.NOTIFICATIONS_ALERTS, icon: "AlertCircle" },
    ],
  },
  {
    id: "certificates",
    labelKey: "navigation.certificates",
    items: [
      { id: "certificates-list", labelKey: "navigation.certificates", href: ROUTES.CERTIFICATES, icon: "Award" },
    ],
  },
  {
    id: "settings",
    labelKey: "navigation.settings",
    items: [
      { id: "settings-general", labelKey: "settings.general", href: ROUTES.SETTINGS_GENERAL, icon: "Settings" },
      { id: "settings-languages", labelKey: "settings.languages", href: ROUTES.SETTINGS_LANGUAGES, icon: "Languages" },
      { id: "settings-currencies", labelKey: "settings.currencies", href: ROUTES.SETTINGS_CURRENCIES, icon: "Coins" },
      { id: "settings-roles", labelKey: "settings.roles", href: ROUTES.SETTINGS_ROLES, icon: "ShieldCheck" },
      { id: "settings-assign-roles", labelKey: "settings.assignRoles", href: ROUTES.SETTINGS_ASSIGN_ROLES, icon: "UserCheck" },
      { id: "settings-subscription", labelKey: "settings.subscription", href: ROUTES.SETTINGS_SUBSCRIPTION, icon: "Star" },
    ],
  },
];

/** Flat list of all navigation items (useful for breadcrumbs / route matching) */
export const allNavigationItems: NavigationItem[] = navigationGroups.flatMap(
  (group) => group.items,
);
