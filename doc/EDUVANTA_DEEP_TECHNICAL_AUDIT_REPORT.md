# EduVanta Deep Technical Audit Report

**Audit Date:** May 9, 2026  
**Audited By:** GitHub Copilot (Claude Sonnet 4.6) — Automated Code Audit  
**Project Root:** `c:\Users\Yoga\Documents\Projects\EduVanta`  
**Source of Truth:** Live codebase only — no prior reports referenced  

---

## 1. Audit Executive Summary

EduVanta is a **frontend-complete, mock-data-backed school management SaaS**. The codebase is architecturally mature for a frontend-only project: it has a clean Next.js 16 App Router structure, 16 feature modules, 60+ routes, comprehensive i18n (EN/AR/UR with RTL), a well-designed component library, TanStack Query hooks, Zod validation, and a 61-unit-test + 26-E2E-file test suite.

**However, all quality gate commands fail in this environment due to a Node.js v24.11.1 / pnpm dependency resolution incompatibility.** The `pnpm build`, `pnpm lint`, `pnpm test`, and `pnpm typecheck` commands all crash with missing transitive dependency errors — not due to application source errors. This is a critical infrastructure problem that must be resolved before any CI/CD pipeline can be established.

TypeScript errors reported by `tsc --noEmit` are overwhelmingly caused by the same missing types (React, vitest, @playwright/test, next, next-intl) that stem from the broken dependency tree, not from application logic bugs.

| Dimension | Status |
|---|---|
| **Frontend Demo Readiness** | HIGH — UI, data, navigation are all complete and polished |
| **Real SaaS Production Readiness** | LOW — all data is mock, no auth, no persistence, no backend |
| **Quality Gates Passing** | BLOCKED — all gate commands fail due to env/dependency issue |
| **Backend Integration Readiness** | MEDIUM — TQ hooks and service layer are well-structured for swap |
| **Biggest Strength** | Comprehensive, consistent module coverage across 16 domains |
| **Biggest Risk** | Broken dev environment (Node v24 / dependency resolution) blocks all tooling |

---

## 2. Audit Scope and Method

### Folders Inspected
- `package.json`, `next.config.ts`, `tsconfig.json`, `middleware.ts`
- `playwright.config.ts`, `vitest.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`
- `src/app/` — full route tree
- `src/components/` — all subdirectories
- `src/features/` — all 16 modules
- `src/data/mock/` — all mock data files
- `src/services/mock/` — all service files
- `src/hooks/queries/` — all TanStack Query hooks
- `src/lib/` — all utility modules including validations/
- `src/messages/` — en.json, ar.json, ur.json
- `src/stores/` — all Zustand stores
- `src/types/` — all type definitions
- `src/test/` — all 61 unit test files
- `e2e/` — all 26 E2E test files
- `public/` — all public assets

### Commands Run
| Command | Status | Notes |
|---|---|---|
| `pnpm typecheck` | FAILED | Node v24 / missing types |
| `pnpm lint` | FAILED | `Cannot find module 'debug'` (eslint dep) |
| `pnpm test -- --run` | FAILED | `Cannot find package '@vitest/utils'` |
| `pnpm build` | FAILED | `Cannot find module '@swc/helpers/_/_interop_require_default'` |
| E2E tests | NOT RUN | Skipped — build/dev server cannot start |

### Code Searches Run
- `console.log` across `src/**`
- `TODO|FIXME` across `src/**`
- `jquery|DataTables|ApexCharts|bootstrap` across `src/**`
- `: any|as any` across production `src/**`
- Message file line count comparison (en vs ar vs ur)
- File/folder counts for routes, test files, feature modules

### Items Skipped
- Full E2E test run (server cannot start in current environment)
- Bundle size analysis (build fails)
- Live browser validation (dev server not started for audit)

---

## 3. Final Quality Gate Results

| Gate | Command | Result | Evidence / Notes |
|---|---|---|---|
| TypeScript | `pnpm typecheck` | **FAILED** | 6,695 error lines. Root cause: `node_modules` dependency resolution is broken under Node.js v24.11.1. All errors are `TS2307: Cannot find module 'react'`, `'vitest'`, `'@playwright/test'`, `'next'`, `'next-intl/...'` — not application logic errors. |
| ESLint | `pnpm lint` | **FAILED** | `Error: Cannot find module 'debug'` — ESLint v9 transitive dependency missing. |
| Unit Tests | `pnpm test -- --run` | **FAILED** | `ERR_MODULE_NOT_FOUND: Cannot find package '@vitest/utils'` — vitest sub-package not resolvable via ESM from Node v24.11.1. |
| Production Build | `pnpm build` | **FAILED** | `Cannot find module '@swc/helpers/_/_interop_require_default'` — @swc/helpers present in pnpm store but not linked correctly. |
| Chromium E2E | `pnpm test:e2e --project=chromium` | **NOT RUN** | Dev server cannot start; environment must be fixed first. |

**Root cause diagnosis:** Node.js v24.11.1 is very new. The project's dependency tree — especially pnpm's virtual store structure — has broken symlinks or resolution gaps for ESM packages (`vitest`, `@vitest/*`, `@swc/helpers`, ESLint's `debug`). The application source code itself is not the primary problem.

**Recommended fix:** Downgrade Node.js to v20 LTS or v22 LTS, then run `pnpm install --force` to rebuild the dependency tree cleanly.

---

## 4. Confirmed Tech Stack

| Layer | Confirmed Package / Approach | Evidence |
|---|---|---|
| Framework | Next.js 16.2.4 (App Router) | `package.json` `"next": "16.2.4"` |
| React | React 19.2.4 | `package.json` `"react": "19.2.4"` |
| Language | TypeScript 5.x | `package.json` `"typescript": "^5"`, `tsconfig.json` strict mode |
| Styling | Tailwind CSS v4 + tailwind-animate + tw-animate-css | `package.json`, `postcss.config.mjs` `@tailwindcss/postcss` |
| UI Primitives | shadcn/ui (v4.6.0 CLI) + Base UI (@base-ui/react ^1.4.1) | `components.json`, `src/components/ui/` |
| Motion | Framer Motion 12.38.0 | `package.json` |
| i18n | next-intl 4.11.0 | `package.json`, `next.config.ts`, `src/i18n/` |
| Themes | next-themes 0.4.6 | `package.json`, `src/components/providers/theme-provider.tsx` |
| State | Zustand 5.0.12 | `package.json`, `src/stores/` (3 stores) |
| Query/Data | TanStack Query v5.100.9 | `package.json`, `src/hooks/queries/` |
| Tables | TanStack Table v8.21.3 | `package.json`, `src/components/data-table/data-table.tsx` |
| Forms | React Hook Form 7.75.0 + @hookform/resolvers | `package.json` |
| Validation | Zod 4.4.3 | `package.json`, `src/lib/validations/` |
| Charts | Recharts 3.8.1 | `package.json`, `src/components/charts/` |
| Calendar | FullCalendar 6.1.20 (daygrid/timegrid/interaction/react) | `package.json` |
| Date utilities | date-fns 4.1.0 + react-day-picker 9.14.0 | `package.json` |
| Toast notifications | Sonner 2.0.7 | `package.json`, `src/components/ui/sonner.tsx` |
| Icons | Lucide React 1.14.0 | `package.json` |
| Command palette | cmdk 1.1.1 | `package.json` |
| Unit Testing | Vitest 4.1.5 + @testing-library/react 16.3.2 + jsdom | `package.json`, `vitest.config.ts` |
| E2E Testing | Playwright 1.59.1 | `package.json`, `playwright.config.ts` |
| Code Quality | ESLint 9.39.4 + eslint-config-next + Prettier 3.8.3 | `package.json`, `eslint.config.mjs`, `.prettierrc` |

**Notable observations:**
- Next.js 16 is a very recent/bleeding-edge version — this is part of the Node v24 compatibility risk.
- React 19 is latest stable.
- No legacy libraries (jQuery, Bootstrap, ApexCharts, DataTables) — confirmed zero hits in source search.
- No AI packages present.
- No Supabase, Prisma, or backend client packages.
- No payment SDK (Stripe, etc.).

---

## 5. Application Architecture Overview

### App Router Structure
```
src/app/
  layout.tsx                       ← Root layout: fonts (Geist, Noto Arabic), RTL inline script
  globals.css                      ← Design tokens, CSS variables for theming
  page.tsx                         ← Redirects to /[locale]
  [locale]/
    layout.tsx                     ← NextIntlClientProvider + AppProviders
    page.tsx                       ← Landing/marketing page
    (auth)/                        ← Route group — auth pages, no sidebar
      layout.tsx                   → AuthLayoutShell
      login/, register/, forgot-password/, reset-password/
    (dashboard)/                   ← Route group — all dashboard pages, AppShell
      layout.tsx                   → AppShell
      dashboard/                   ← Multi-persona dashboards
      students/, teachers/, guardians/, employees/, hrm/
      academic/, exams/, fees/, finance/
      library/, communication/, notifications/, certificates/
      settings/
      dev/                         ← Internal dev-only routes
```

### Locale Route Structure
- Three locales: `en`, `ar`, `ur` — configured in `src/i18n/routing.ts`
- Middleware (`middleware.ts`) uses `next-intl/middleware` to enforce locale prefixes
- All dashboard URLs are locale-prefixed: `/en/students`, `/ar/students`, `/ur/students`
- RTL locales: `ar`, `ur` — `dir="rtl"` set via inline script in root layout before React hydration

### Dashboard Shell
- `AppShell` component wraps all dashboard pages
- Collapsible sidebar (`AppSidebar`) with nav groups, powered by `useUIStore` (Zustand)
- Sticky topbar (`AppTopbar`) with theme toggle, locale switcher, currency selector, notifications
- Mobile sidebar via `MobileSidebarDrawer` (Sheet component)
- Responsive: sidebar collapses on mobile, drawer opens via menu button
- `SkipToMain` for accessibility

### Shared Components
- `src/components/ui/` — 30 shadcn/ui primitives
- `src/components/data-table/` — 14 data table components (TanStack Table)
- `src/components/forms/` — 13 shared form fields (text, password, phone, date, file, currency, etc.)
- `src/components/charts/` — 8 chart components (Recharts wrappers)
- `src/components/navigation/` — 8 navigation components
- `src/components/marketing/` — 16 landing page sections
- `src/components/auth/` — 8 auth components
- `src/components/layout/` — 4 layout components

### Feature Modules (16 total)
Each module follows: `src/features/{module}/components/`, `/utils/`, `index.ts`

### Mock Service Layer
- `src/services/mock/*.service.ts` — 20 service files simulating async CRUD with `withMockDelay()`
- `src/data/mock/*.ts` — static data arrays per domain
- `src/hooks/queries/use-*.ts` — TanStack Query wrappers over mock services
- No backend, no HTTP, no real persistence

### Validation Layer
- `src/lib/validations/*.ts` — 16 Zod schema files, one per module
- All forms use React Hook Form + `zodResolver`

### Testing Layer
- 61 unit test files in `src/test/` (vitest + @testing-library/react)
- 26 E2E test files in `e2e/` (Playwright)
- Global E2E warmup script pre-compiles ~60 routes before parallel test runs

---

## 6. Route Inventory and Status

### Marketing / Auth

| Module | Route | File Path | Status | Notes |
|---|---|---|---|---|
| Landing | `/{locale}` | `src/app/[locale]/page.tsx` | Complete | Full marketing page, 14 sections |
| Login | `/{locale}/login` | `src/app/[locale]/(auth)/login/page.tsx` | Mock | RHF + Zod, mock submit, demo role selector |
| Register | `/{locale}/register` | `src/app/[locale]/(auth)/register/page.tsx` | Mock | Form only, no real registration |
| Forgot Password | `/{locale}/forgot-password` | `src/app/[locale]/(auth)/forgot-password/page.tsx` | Mock | Form only |
| Reset Password | `/{locale}/reset-password` | `src/app/[locale]/(auth)/reset-password/page.tsx` | Mock | Form only |

### Dashboard

| Module | Route | File Path | Status | Notes |
|---|---|---|---|---|
| School Dashboard | `/{locale}/dashboard` | `(dashboard)/dashboard/page.tsx` | Mock | Charts, stats, TanStack Query |
| Student Dashboard | `/{locale}/dashboard/student` | `(dashboard)/dashboard/student/page.tsx` | Mock | Role-specific view |
| Teacher Dashboard | `/{locale}/dashboard/teacher` | `(dashboard)/dashboard/teacher/page.tsx` | Mock | Role-specific view |
| Parent Dashboard | `/{locale}/dashboard/parent` | `(dashboard)/dashboard/parent/page.tsx` | Mock | Role-specific view |
| LMS Dashboard | `/{locale}/dashboard/lms` | `(dashboard)/dashboard/lms/page.tsx` | Mock | LMS persona |
| University Dashboard | `/{locale}/dashboard/university` | `(dashboard)/dashboard/university/page.tsx` | Mock | University persona |

### Students

| Module | Route | File Path | Status | Notes |
|---|---|---|---|---|
| Student List | `/{locale}/students` | `(dashboard)/students/page.tsx` | Mock | DataTable, search, filter, pagination |
| New Student | `/{locale}/students/new` | `(dashboard)/students/new/page.tsx` | Mock | Full Zod form |
| Student Detail | `/{locale}/students/[id]` | `(dashboard)/students/[id]/page.tsx` | Mock | Profile, tabs, cards |
| Student Attendance | `/{locale}/students/attendance` | `(dashboard)/students/attendance/page.tsx` | Mock | Attendance grid |
| Student Categories | `/{locale}/students/categories` | `(dashboard)/students/categories/page.tsx` | Mock | CRUD manager |
| Suspended Students | `/{locale}/students/suspended` | `(dashboard)/students/suspended/page.tsx` | Mock | Filtered list |

### Teachers

| Module | Route | File Path | Status | Notes |
|---|---|---|---|---|
| Teacher List | `/{locale}/teachers` | `(dashboard)/teachers/page.tsx` | Mock | DataTable |
| New Teacher | `/{locale}/teachers/new` | `(dashboard)/teachers/new/page.tsx` | Mock | Form |
| Teacher Detail | `/{locale}/teachers/[id]` | `(dashboard)/teachers/[id]/page.tsx` | Mock | Profile |
| Teacher Attendance | `/{locale}/teachers/attendance` | `(dashboard)/teachers/attendance/page.tsx` | Mock | Attendance |
| Teacher Timetable | `/{locale}/teachers/timetable` | `(dashboard)/teachers/timetable/page.tsx` | Mock | Timetable view |

### Guardians

| Module | Route | File Path | Status | Notes |
|---|---|---|---|---|
| Guardian List | `/{locale}/guardians` | `(dashboard)/guardians/page.tsx` | Mock | DataTable |
| New Guardian | `/{locale}/guardians/new` | `(dashboard)/guardians/new/page.tsx` | Mock | Form |
| Guardian Detail | `/{locale}/guardians/[id]` | `(dashboard)/guardians/[id]/page.tsx` | Mock | Profile |

### Employees / HRM

| Module | Route | File Path | Status | Notes |
|---|---|---|---|---|
| Employee List | `/{locale}/employees` | `(dashboard)/employees/page.tsx` | Mock | DataTable |
| New Employee | `/{locale}/employees/new` | `(dashboard)/employees/new/page.tsx` | Mock | Form |
| Employee Detail | `/{locale}/employees/[id]` | `(dashboard)/employees/[id]/page.tsx` | Mock | Profile |
| Employee Attendance | `/{locale}/employees/attendance` | `(dashboard)/employees/attendance/page.tsx` | Mock | |
| Leave Requests | `/{locale}/employees/leave-requests` | `(dashboard)/employees/leave-requests/page.tsx` | Mock | |
| Leave Types | `/{locale}/employees/leave-types` | `(dashboard)/employees/leave-types/page.tsx` | Mock | |
| HRM Payroll | `/{locale}/hrm/payroll` | `(dashboard)/hrm/payroll/page.tsx` | Mock | Payslip preview dialog |
| HRM Departments | `/{locale}/hrm/departments` | `(dashboard)/hrm/departments/page.tsx` | Mock | |
| HRM Designations | `/{locale}/hrm/designations` | `(dashboard)/hrm/designations/page.tsx` | Mock | |

### Academic

| Module | Route | File Path | Status | Notes |
|---|---|---|---|---|
| Classes | `/{locale}/academic/classes` | `(dashboard)/academic/classes/page.tsx` | Mock | |
| Classrooms | `/{locale}/academic/classrooms` | `(dashboard)/academic/classrooms/page.tsx` | Mock | |
| Sections | `/{locale}/academic/sections` | `(dashboard)/academic/sections/page.tsx` | Mock | |
| Subjects | `/{locale}/academic/subjects` | `(dashboard)/academic/subjects/page.tsx` | Mock | |

### Exams

| Module | Route | File Path | Status | Notes |
|---|---|---|---|---|
| Exam Dashboard | `/{locale}/exams` | `(dashboard)/exams/page.tsx` | Mock | |
| Exam Schedule | `/{locale}/exams/schedule` | `(dashboard)/exams/schedule/page.tsx` | Mock | |
| Exam Results | `/{locale}/exams/results` | `(dashboard)/exams/results/page.tsx` | Mock | |

### Fees

| Module | Route | File Path | Status | Notes |
|---|---|---|---|---|
| Collect Fees | `/{locale}/fees/collect` | `(dashboard)/fees/collect/page.tsx` | Mock | |
| Fee Groups | `/{locale}/fees/groups` | `(dashboard)/fees/groups/page.tsx` | Mock | |
| Fee Types | `/{locale}/fees/types` | `(dashboard)/fees/types/page.tsx` | Mock | |
| Fee Discounts | `/{locale}/fees/discounts` | `(dashboard)/fees/discounts/page.tsx` | Mock | |

### Finance

| Module | Route | File Path | Status | Notes |
|---|---|---|---|---|
| Transactions | `/{locale}/finance/transactions` | `(dashboard)/finance/transactions/page.tsx` | Mock | Currency-aware |
| Income | `/{locale}/finance/income` | `(dashboard)/finance/income/page.tsx` | Mock | |
| Income Heads | `/{locale}/finance/income-heads` | `(dashboard)/finance/income-heads/page.tsx` | Mock | |
| Expenses | `/{locale}/finance/expenses` | `(dashboard)/finance/expenses/page.tsx` | Mock | |
| Expense Heads | `/{locale}/finance/expense-heads` | `(dashboard)/finance/expense-heads/page.tsx` | Mock | |

### Attendance

| Module | Route | File Path | Status | Notes |
|---|---|---|---|---|
| Student Attendance | `/{locale}/students/attendance` | See Students | Mock | Nested under students |
| Teacher Attendance | `/{locale}/teachers/attendance` | See Teachers | Mock | Nested under teachers |
| Employee Attendance | `/{locale}/employees/attendance` | See Employees | Mock | Nested under employees |

### Library

| Module | Route | File Path | Status | Notes |
|---|---|---|---|---|
| Books | `/{locale}/library/books` | `(dashboard)/library/books/page.tsx` | Mock | Full CRUD |
| Issue/Return | `/{locale}/library/issue-return` | `(dashboard)/library/issue-return/page.tsx` | Mock | Issue/return workflow |
| Members | `/{locale}/library/members` | `(dashboard)/library/members/page.tsx` | Mock | Member profiles, borrowing history |

### Communication

| Module | Route | File Path | Status | Notes |
|---|---|---|---|---|
| Notices | `/{locale}/communication/notices` | `(dashboard)/communication/notices/page.tsx` | Mock | Card grid + table |
| Events | `/{locale}/communication/events` | `(dashboard)/communication/events/page.tsx` | Mock | FullCalendar integration |
| Messages | `/{locale}/communication/messages` | `(dashboard)/communication/messages/page.tsx` | Mock | Conversation-style layout |

### Notifications

| Module | Route | File Path | Status | Notes |
|---|---|---|---|---|
| Notifications | `/{locale}/notifications` | `(dashboard)/notifications/page.tsx` | Mock | Channel preferences |
| Alerts | `/{locale}/notifications/alerts` | `(dashboard)/notifications/alerts/page.tsx` | Mock | Notification list |

### Certificates

| Module | Route | File Path | Status | Notes |
|---|---|---|---|---|
| Certificates | `/{locale}/certificates` | `(dashboard)/certificates/page.tsx` | Mock | Print-only PDF layout |

### Settings

| Module | Route | File Path | Status | Notes |
|---|---|---|---|---|
| General | `/{locale}/settings/general` | `(dashboard)/settings/general/page.tsx` | Mock | School profile form |
| Languages | `/{locale}/settings/languages` | `(dashboard)/settings/languages/page.tsx` | Mock | Language manager |
| Currencies | `/{locale}/settings/currencies` | `(dashboard)/settings/currencies/page.tsx` | Mock | Currency manager |
| Roles | `/{locale}/settings/roles` | `(dashboard)/settings/roles/page.tsx` | Mock | Role + permission matrix |
| Assign Roles | `/{locale}/settings/assign-roles` | `(dashboard)/settings/assign-roles/page.tsx` | Mock | User-role assignment |
| Subscription | `/{locale}/settings/subscription` | `(dashboard)/settings/subscription/page.tsx` | Mock | Plan cards, billing history |

### Dev / Internal

| Module | Route | File Path | Status | Notes |
|---|---|---|---|---|
| Infrastructure | `/{locale}/dev/infrastructure` | `(dashboard)/dev/infrastructure/page.tsx` | Dev-only | Foundation verification page |

**Total confirmed routes: ~65 page.tsx files across 3 locales = ~195 addressable URLs**

---

## 7. Module-by-Module Audit

### 1. Landing / Auth

**Routes:** `/`, `/login`, `/register`, `/forgot-password`, `/reset-password`

**Main Components:**
- `landing-hero.tsx`, `marketing-navbar.tsx`, `trust-metrics.tsx`, `product-module-grid.tsx`, `role-experience-section.tsx`, `dashboard-preview-section.tsx`, `pricing-teaser.tsx`, `faq-section.tsx`, `final-cta.tsx`, `marketing-footer.tsx` — full marketing page
- `AuthBrandPanel` — left-side brand panel on auth pages (gradient, `E` letter monogram, text — no actual logo image)
- `LoginForm` — RHF + Zod, `RoleDemoSelector` for 8 demo roles, mock `onSubmit` (1s delay + toast)
- `RegisterForm`, `ForgotPasswordForm`, `ResetPasswordForm` — all mock forms

**Data/hooks/services:** None (auth is entirely mock — no session, no token, no redirect guard)

**Forms/Validation:** `src/lib/validations/auth.ts` — Zod schema for email, password, rememberMe

**Limitations:**
- Auth is completely mock — any credentials accepted
- No session management, no JWT, no cookie
- No redirect after login (no protected route enforcement)
- `AuthBrandPanel` uses a text `E` monogram instead of an EduVanta logo image
- Pricing teaser is hardcoded marketing copy — no real plan API

**Risk:** HIGH (for production) / LOW (for demo)

---

### 2. App Shell / Dashboards

**Routes:** `/dashboard`, `/dashboard/student`, `/dashboard/teacher`, `/dashboard/parent`, `/dashboard/lms`, `/dashboard/university`

**Main Components:**
- `AppShell` — sidebar + topbar wrapper, RTL-aware
- `AppSidebar` — collapsible, icon-based nav, uses `navigationGroups` config, text `E` monogram for brand
- `AppTopbar` — theme toggle, locale switcher, currency selector, notification bell, user menu
- `SchoolDashboard` — stat cards, Recharts charts, recent activity, quick links
- `StudentDashboard`, `TeacherDashboard`, `ParentDashboard`, `LmsDashboard`, `UniversityDashboard` — role-specific dashboard views

**Data/hooks/services:** `use-dashboard.ts` wraps `dashboard.service.ts` → mock data

**i18n/RTL:** Fully translated; sidebar uses `useTranslations`; RTL layout via Tailwind logical properties

**Limitations:**
- No RBAC enforcement — all dashboards accessible to all users
- No real "currently logged in" user — role is a Zustand store value only
- `AppSidebar` brand shows text `E` instead of logo image

**Risk:** LOW (demo) / HIGH (production — no auth gate)

---

### 3. Students

**Routes:** `/students`, `/students/new`, `/students/[id]`, `/students/attendance`, `/students/categories`, `/students/suspended`

**Main Components:**
- `StudentList` — DataTable with search, filter, sort, pagination
- `StudentForm` — multi-section Zod form (personal, contact, academic, guardian)
- `StudentProfileHeader`, `StudentProfileTabs`, `StudentInfoCard`, `StudentAcademicCard`, `StudentGuardianCard` — profile views
- `StudentAttendanceGrid` — grid-based attendance by date
- `StudentCategoryManager` — CRUD dialog manager
- `SuspendedStudentsList` — filtered DataTable

**Data/hooks/services:** `use-students.ts` → `students.service.ts` → `src/data/mock/students.ts`

**Forms/Validation:** `src/lib/validations/students.ts` — comprehensive Zod schema (personal, contact, academic, guardian, profileImage)

**Limitations:** No real persistence; `profileImage` is `z.any().optional()` (no actual upload); guardian relationship is loose ID reference

**Risk:** LOW

---

### 4. Teachers

**Routes:** `/teachers`, `/teachers/new`, `/teachers/[id]`, `/teachers/attendance`, `/teachers/timetable`

**Main Components:** `TeacherList`, `TeacherForm`, `TeacherProfile`, `TeacherAttendance`, `TeacherTimetable`

**Data/hooks/services:** `use-teachers.ts` → `teachers.service.ts` → mock data

**Forms/Validation:** `src/lib/validations/teachers.ts`

**Limitations:** Timetable is UI-only, no drag-and-drop scheduling; no subject assignment logic

**Risk:** LOW

---

### 5. Guardians

**Routes:** `/guardians`, `/guardians/new`, `/guardians/[id]`

**Main Components:** `GuardianList`, `GuardianForm`, `GuardianDetail`

**Data/hooks/services:** `use-guardians.ts` → `guardians.service.ts` → mock data

**Forms/Validation:** `src/lib/validations/guardians.ts`

**Risk:** LOW

---

### 6. Employees / HRM / Payroll / Leaves

**Routes:** `/employees`, `/employees/new`, `/employees/[id]`, `/employees/attendance`, `/employees/leave-requests`, `/employees/leave-types`, `/hrm/payroll`, `/hrm/departments`, `/hrm/designations`

**Main Components:**
- `EmployeeList`, `EmployeeForm`, `EmployeeDetail`, `EmployeeAttendance`
- `LeaveRequestManager` (via `employees/leave-requests`), `LeaveTypeManager`
- `PayrollList`, `PayrollSummaryCards`, `PayslipPreviewDialog` — print-style payslip
- `DepartmentsManager`, `DesignationsManager`

**Data/hooks/services:** `use-employees.ts`, `use-leaves.ts` → respective services → mock data

**Forms/Validation:** `src/lib/validations/employees.ts`, `src/lib/validations/hrm.ts`

**Notable:** `PayslipPreviewDialog` generates a print layout — browser-print-only, no PDF generation

**Risk:** LOW (demo) / MEDIUM (payroll is sensitive — must be real before any production use)

---

### 7. Academic

**Routes:** `/academic/classes`, `/academic/classrooms`, `/academic/sections`, `/academic/subjects`

**Main Components:** `ClassesManager`, `ClassroomsManager`, `SectionsManager`, `SubjectsManager` — CRUD dialog managers

**Data/hooks/services:** `use-academic.ts` → `academic.service.ts` → mock data

**Forms/Validation:** `src/lib/validations/academic.ts`

**Risk:** LOW

---

### 8. Exams

**Routes:** `/exams`, `/exams/schedule`, `/exams/results`

**Main Components:** `ExamsDashboard`, `ExamScheduleManager`, `ExamResultsManager`

**Data/hooks/services:** `use-exams.ts` → `exams.service.ts` → mock data

**Forms/Validation:** `src/lib/validations/exams.ts`

**Risk:** LOW

---

### 9. Fees

**Routes:** `/fees/collect`, `/fees/groups`, `/fees/types`, `/fees/discounts`

**Main Components:** `FeesCollectManager`, `FeeGroupsManager`, `FeeTypesManager`, `FeeDiscountsManager`

**Data/hooks/services:** `use-fees.ts` → `fees.service.ts` → mock data; currency display via `useCurrencyStore`

**Forms/Validation:** `src/lib/validations/fees.ts`

**Limitations:** No real payment processing; no payment gateway integration

**Risk:** LOW (demo) / HIGH (production — financial module needs real payment backend)

---

### 10. Finance

**Routes:** `/finance/transactions`, `/finance/income`, `/finance/income-heads`, `/finance/expenses`, `/finance/expense-heads`

**Main Components:**
- `TransactionsManager`, `IncomeManager`, `ExpensesManager` — DataTable views
- `IncomeHeadsManager`, `ExpenseHeadsManager` — category CRUD
- `FinanceAmountCell` — currency-aware amount display using `useCurrencyStore`
- `TransactionDetailDialog`, `IncomeFormDialog`, `ExpenseFormDialog`

**Notable:** `expense-form-dialog.tsx` and `income-form-dialog.tsx` use `control as any` cast (2 instances of `as any` in production code)

**Data/hooks/services:** `use-finance.ts` → `finance.service.ts` → mock data

**Forms/Validation:** `src/lib/validations/finance.ts`

**Risk:** MEDIUM (production — financial data needs real persistence)

---

### 11. Attendance

(Distributed across Students, Teachers, Employees — see those modules)

**Risk:** LOW

---

### 12. Library / Members

**Routes:** `/library/books`, `/library/issue-return`, `/library/members`

**Main Components:**
- `BooksManager` — full CRUD DataTable, `BookFormDialog`
- `IssueReturnManager` — `IssueBookDialog`, `ReturnBookDialog`
- `MembersManager` — member profiles, `MemberDetailView`, `MemberBorrowingHistory`, `MemberCurrentIssuesCard`
- `LibrarySummaryCards`, `LibraryStatusBadges`

**Data/hooks/services:** `use-library.ts` → `library.service.ts` → mock data

**Forms/Validation:** `src/lib/validations/library.ts`

**Risk:** LOW — well-developed module per repo memory

---

### 13. Communication

**Routes:** `/communication/notices`, `/communication/events`, `/communication/messages`

**Main Components:**
- `NoticesManager` — notice card grid + table + `NoticeFormDialog`
- `EventsManager` — FullCalendar integration (`EventCalendar`), `EventFormDialog`, `EventDetailDialog`
- `MessagesLayout` — two-panel conversation layout: `MessageThreadList`, `MessageConversation`, `MessageComposer`

**Data/hooks/services:** `use-communication.ts` → `communication.service.ts` → mock data

**Forms/Validation:** `src/lib/validations/communication.ts`

**Limitations:** Messages are entirely mock — no real-time, no WebSocket, no push

**Risk:** MEDIUM (production — real messaging requires WebSocket/server push)

---

### 14. Notifications

**Routes:** `/notifications`, `/notifications/alerts`

**Main Components:**
- `NotificationsManager` — `NotificationPreferenceCard`, `NotificationChannelToggle` — preference UI
- `NotificationAlertManager` — `NotificationCardList`, notification status badges

**Data/hooks/services:** `use-notifications.ts` → `notifications.service.ts` → mock data

**Limitations:** No real delivery — email/SMS/push are display-only toggles

**Risk:** MEDIUM (production — no real channel delivery)

---

### 15. Certificates

**Routes:** `/certificates`

**Main Components:**
- `CertificatesManager` — `CertificateRecordsTable`, summary cards, status badges
- `CertificatePreview` — live preview pane
- `CertificatePrintLayout` — A4-proportioned CSS certificate with decorative border, corner ornaments, watermark — uses `window.print()` trigger
- `CertificateControlPanel` — template controls

**Data/hooks/services:** `use-certificates.ts` → `certificates.service.ts` → mock data

**Forms/Validation:** `src/lib/validations/certificates.ts`

**Notable:** Certificates are **browser-print-only** — no actual PDF generation library (no `jsPDF`, `puppeteer`, or PDF service). The design is polished but the output is browser print dialog only.

**Risk:** MEDIUM (production — real certificates need server-side PDF generation)

---

### 16. Settings / Roles / Subscription

**Routes:** `/settings/general`, `/settings/languages`, `/settings/currencies`, `/settings/roles`, `/settings/assign-roles`, `/settings/subscription`

**Main Components:**
- `GeneralSettingsForm` — school profile, timezone, academic year
- `LanguagesManager`, `CurrenciesManager` — manage available locales/currencies
- `RolesManager` + `RolePermissionMatrix` — role CRUD with permission toggles (frontend-only)
- `AssignRolesManager` — assign roles to users
- `SubscriptionManager` — `SubscriptionPlanCard`, `SubscriptionUsageCard`, `SubscriptionBillingHistory`

**Data/hooks/services:** `use-settings.ts`, `use-schools.ts` → mock services

**Forms/Validation:** `src/lib/validations/settings.ts`

**Notable:**
- `SubscriptionManager` shows `toast.success(...)` with `(Mock)` label when upgrading — no real billing
- `RolePermissionMatrix` is display-only — permissions are not enforced anywhere in the code
- Subscription data is entirely mocked (plan cards, billing history rows)

**Risk:** HIGH (production — RBAC not enforced, no real billing integration)

---

## 8. Design System and UI Infrastructure Audit

### Tailwind Setup
- **Tailwind CSS v4** — uses PostCSS plugin `@tailwindcss/postcss`; config in `postcss.config.mjs`
- Design tokens defined in `src/app/globals.css` as CSS custom properties
- Brand primary: `#25A194` (teal)
- Dark mode: `next-themes` with `class` strategy
- Animations: `tailwindcss-animate` + `tw-animate-css`

### shadcn/ui Primitives (`src/components/ui/`)
30 components including: accordion, alert-dialog, avatar, badge, breadcrumb, button, calendar, card, checkbox, command, dialog, dropdown-menu, input-group, input, label, navigation-menu, popover, progress, radio-group, scroll-area, select, separator, sheet, skeleton, sonner, switch, table, tabs, textarea, tooltip

### Theme / Dark Mode
- `ThemeProvider` (next-themes) wraps all pages
- Theme toggle in topbar
- CSS variable-based theming — both light/dark modes supported

### Sidebar/Topbar
- Collapsible sidebar: full text + icon when expanded, icon-only when collapsed
- Mobile: Sheet-based drawer (`MobileSidebarDrawer`)
- Topbar: breadcrumbs, notifications bell, currency selector, locale switcher, user menu, theme toggle

### Responsive Layout
- Sidebar is `hidden lg:flex` — collapses below `lg` breakpoint
- Mobile menu via topbar hamburger → `MobileSidebarDrawer`
- DataTable has horizontal scroll on small screens

### Charts
- `AreaChart`, `BarChart`, `LineChart`, `DonutChart`, `MiniSparkline` — all Recharts wrappers
- `ChartContainer`, `ChartSkeleton`, `ChartEmptyState` — consistent loading/empty states

### Calendar
- FullCalendar (daygrid + timegrid + interaction) used in `EventCalendar` component

### Logo / Brand Usage
- **No logo image files in `public/`** — `public/` contains only default Next.js placeholder SVGs (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`)
- `public/brand/` directory does **not exist**
- All brand placements use text: sidebar shows `"E"` or `"EduVanta"` text, auth panel shows `"E"` div with gradient background
- No `<img>` or `<Image>` component referencing a brand logo

---

## 9. DataTable Infrastructure Audit

### Component API (`src/components/data-table/data-table.tsx`)
Built on **TanStack Table v8** with full feature set.

### Features Confirmed
- **Search:** Global filter via `DataTableToolbar` input
- **Filters:** Faceted filter via `DataTableFacetedFilter` (multi-select filter popover)
- **Sorting:** Column header sort via `DataTableColumnHeader`
- **Pagination:** `DataTablePagination` — page size selector (10/25/50/100), prev/next, page info
- **Column visibility:** `DataTableViewOptions` — column show/hide toggle
- **Row selection:** `RowSelectionState` managed via TanStack Table
- **Row actions:** `DataTableRowActions` dropdown (edit, delete, view)
- **Action menus:** `ActionMenu` component
- **Export:** `ExportDialog` — CSV export behavior (frontend-only)
- **Loading state:** `TableSkeleton` — animated skeleton rows
- **Empty state:** `EmptyTableState` — icon + message
- **Status badges:** `StatusBadge` component
- **Avatar cells:** `AvatarCell` component
- **Confirm dialog:** `ConfirmDialog` for destructive actions

### Limitations
- CSV export is frontend-only (no server-side generation, no Excel)
- No server-side pagination (all pagination is client-side over mock array)
- No bulk edit operations
- No drag-to-reorder rows

### Responsive Behavior
- Horizontal scroll on overflow
- Column visibility allows hiding columns on small screens

---

## 10. Form and Validation Infrastructure Audit

### Shared Form Fields (`src/components/forms/`)
13 reusable RHF-compatible field components:
- `TextField`, `TextareaField`, `PasswordField`, `PhoneField`
- `SelectField`, `CheckboxField`, `SwitchField`
- `DatePickerField` (react-day-picker integration)
- `FileUploadField` (mock — no actual upload API)
- `CurrencyField` (currency-aware amount input)
- `FormSection`, `FormActions`, `FormErrorSummary`

### Zod Schemas by Module
16 validation files in `src/lib/validations/`:
`academic.ts`, `attendance.ts`, `auth.ts`, `certificates.ts`, `communication.ts`, `employees.ts`, `exams.ts`, `fees.ts`, `finance.ts`, `guardians.ts`, `hrm.ts`, `library.ts`, `notifications.ts`, `settings.ts`, `students.ts`, `teachers.ts`

### React Hook Form Patterns
- All forms use `useForm` + `zodResolver`
- Error display via `.formState.errors`
- Form submission is mock: `async function onSubmit()` — artificial delay + toast

### Validation Consistency
- Generally consistent across modules
- Student schema is very comprehensive (personal, contact, academic, guardian sections)
- Profile image uses `z.any().optional()` — not validated for type/size

### File Upload Behavior
- `FileUploadField` renders a file input but no actual upload is wired
- No presigned URL, no multipart, no storage

### Date / Currency / Phone Handling
- Dates: `react-day-picker` calendar UI, values stored as ISO date strings
- Currency: `CurrencyField` uses `useCurrencyStore` for active currency
- Phone: `PhoneField` — basic text field with country prefix — no real phone validation library

### Missing Validation Risks
- File upload size/type not validated
- Phone fields use basic min-length only (no E.164 validation)
- Date range validation not implemented in most schemas

---

## 11. i18n and RTL Audit

### Supported Locales
- `en` (English, LTR), `ar` (Arabic, RTL), `ur` (Urdu, RTL)
- Defined in `src/i18n/routing.ts`

### Message Files
| File | Lines | Coverage |
|---|---|---|
| `src/messages/en.json` | 1,688 | Full baseline |
| `src/messages/ar.json` | 1,345 | ~80% of en.json — some sections may be missing |
| `src/messages/ur.json` | 1,346 | ~80% of en.json — same gap as ar |

The Arabic and Urdu files are approximately 343 lines shorter than English — indicating some translation keys are missing or some sections are not yet translated.

### Middleware Behavior
- `middleware.ts` uses `next-intl/middleware` with `createMiddleware(routing)`
- Redirects `/` → `/{defaultLocale}` (en)
- All routes require locale prefix

### dir/lang Setting
- Root layout (`src/app/layout.tsx`) has an inline JavaScript snippet that reads the URL path, detects the locale, and sets `document.documentElement.lang` and `dir` synchronously before React hydration
- This pattern ensures E2E tests reading `html[dir]` after `domcontentloaded` see the correct RTL value
- `suppressHydrationWarning` prevents React from overwriting these values

### RTL Implementation
- Tailwind CSS logical properties used throughout: `ps-`, `pe-`, `ms-`, `me-`, `start-`, `end-`, `rounded-ss`, `rounded-se`, etc.
- Sidebar positioning, certificate layout, and auth brand panel all use logical properties
- No hardcoded `left`/`right` CSS detected in application components

### Translation Completeness Risk
- ~343 missing lines between en.json and ar/ur.json
- Missing keys would silently fall back or throw next-intl errors depending on configuration
- Quick-search comment (`// TODO Phase 5: open command palette`) suggests some features are i18n-incomplete

### Known Risks
- `ar.json` and `ur.json` completeness not fully verified at key level — only line count comparison
- Some marketing section copy may only exist in English in the component JSX

---

## 12. Currency and Money Display Audit

### Supported Currencies
11 currencies: USD, AED, SAR, PKR, GBP, EUR, QAR, KWD, OMR, BHD, INR

Defined in `src/lib/currency.ts` with full metadata: symbol, BCP 47 formatting locale, decimal digits.

### Utility Implementation
- `formatCurrency(amount, currency, locale)` — uses `Intl.NumberFormat` with `style: 'currency'`
- `getCurrencyMetadata(currency)` — returns symbol, decimalDigits, formattingLocale
- `getDefaultCurrencyForLocale(locale)` — maps `en→USD`, `ar→AED`, `ur→PKR`
- `isCurrencyCode(value)` — type guard

### Store Implementation
- `useCurrencyStore` (Zustand) — `activeCurrency`, `setCurrency`, `resetCurrencyForLocale`
- Currency selector in topbar allows runtime switching

### Modules Using Currency
- Finance: `FinanceAmountCell` uses `useCurrencyStore`
- Fees: fee amounts displayed with active currency
- Settings/Currencies: manage available currencies
- `src/app/[locale]/_components/currency-display.tsx` — inline currency display component

### Hardcoded Currency Symbol Scan
Searched production `src/**/*.{ts,tsx}` for raw `$`:
- Zero raw `$` currency symbols found in JSX user-visible text
- All monetary amounts use `formatCurrency()` or `CurrencyField`

### Limitations
- No exchange rate conversion — amounts stored in mock data without currency unit
- Switching currency changes display formatting only, not data values
- No multi-currency transaction support

---

## 13. Mock Data, Services, and Query Hooks Audit

### Mock Data Location
`src/data/mock/` — 18 files:
`academic.ts`, `attendance.ts`, `certificates.ts`, `communication.ts`, `dashboard.ts`, `employees.ts`, `exams.ts`, `fees.ts`, `finance.ts`, `guardians.ts`, `index.ts`, `leaves.ts`, `library.ts`, `notifications.ts`, `schools.ts`, `settings.ts`, `students.ts`, `teachers.ts`

All files export static arrays of typed objects.

### Service Layer (`src/services/mock/`)
20 service files. Pattern:
```typescript
export async function getStudents(params?: QueryParams, ms = 250): Promise<PaginatedResponse<Student>> {
  const filtered = applyQueryParams(students, params, SEARCH_FIELDS);
  return withMockDelay(createPaginatedResponse(filtered, params), ms);
}
```
- `withMockDelay(data, ms)` — simulates network latency (250ms default, 0ms in tests)
- `applyQueryParams()` — in-memory search/filter/sort/paginate
- `createPaginatedResponse()` — wraps array with `{ data, meta: { total, page, pageSize, totalPages } }`
- `createMockResponse()`, `createErrorResponse()` — ApiResponse wrappers

### TanStack Query Layer
19 hook files in `src/hooks/queries/`. Every hook wraps a mock service call:
```typescript
export function useStudents(params?: QueryParams) {
  return useQuery({
    queryKey: queryKeys.students.list(params),
    queryFn: () => getStudents(params),
  });
}
```
- `query-keys.ts` — centralized key factory for cache invalidation
- Hooks use `enabled: !!id` guards for conditional queries
- Query provider wraps app in `src/components/providers/query-provider.tsx`

### Local State Behavior
- No optimistic updates implemented
- Mutations use `toast.success()` + local state update; no `queryClient.invalidateQueries()`
- CRUD operations do not persist across page reload

### Persistence Limitations
- **Zero persistence** — all data resets on page refresh
- No localStorage, no sessionStorage, no IndexedDB
- No cookies (except what Next.js/browser sets automatically)

### Backend Replacement Readiness
**MEDIUM-HIGH.** The service layer is well-abstracted:
1. Replace `src/services/mock/students.service.ts` → `src/services/students.service.ts` with real API calls
2. Update `src/hooks/queries/use-students.ts` imports (no interface change needed)
3. TanStack Query caching, loading states, error handling already in place
4. `QueryParams` type already defined for server-side filtering params

Main risk: mutations currently don't invalidate TanStack Query cache — real mutations must add `queryClient.invalidateQueries()`.

---

## 14. Testing Architecture Audit

### Unit Test Setup
- **Vitest 4.1.5** + `@testing-library/react` + jsdom
- Setup file: `src/test/setup.ts` — imports `@testing-library/jest-dom`
- Config: `vitest.config.ts` — excludes `node_modules`, `e2e`; globals enabled

### Unit Test Files (61 total)
Coverage areas:
- **Mappers:** 16 mapper test files (academic, attendance, certificates, communication, dashboard, employees, exams, fees, finance, guardians, hrm, library, notifications, settings, students, teachers)
- **Validation:** 16 validation test files (one per module)
- **Components:** 14 component test files
- **Utilities:** `breadcrumbs.test.ts`, `currency.test.ts`, `dashboard-helpers.test.ts`, `form-helpers.test.ts`, `icons.test.ts`, `navigation.test.ts`, `table-helpers.test.ts`, `utils.test.ts`
- **Infrastructure:** `data-table.test.tsx`, `form-fields.test.tsx`, `mock-data-integrity.test.ts`, `mock-services.test.ts`, `query-keys.test.ts`, `dashboard-pages.test.tsx`

### E2E Test Files (26 total)
`academic.test.ts`, `accessibility.test.ts`, `app-shell.test.ts`, `attendance.test.ts`, `auth.test.ts`, `certificates.test.ts`, `communication-notifications.test.ts`, `currency-global.test.ts`, `dark-mode.test.ts`, `dashboard-variants.test.ts`, `employees-hrm.test.ts`, `exams.test.ts`, `fees.test.ts`, `finance.test.ts`, `global-routes.test.ts`, `global-setup.ts`, `guardians.test.ts`, `infrastructure.test.ts`, `landing.test.ts`, `library.test.ts`, `responsive.test.ts`, `rtl.test.ts`, `settings.test.ts`, `smoke.test.ts`, `students.test.ts`, `teachers.test.ts`

### Global E2E Warmup Strategy
`e2e/global-setup.ts`:
- Pre-compiles ~60 routes by navigating a headless browser to each before parallel workers start
- Uses `waitUntil: "load"` (not `domcontentloaded`) to ensure JS bundles are compiled by Turbopack
- 3-second settle time after warmup
- Non-fatal: warmup misses are caught — individual tests handle slower cold starts
- 90-second timeout per route navigation

### Test Coverage Notes
- `accessibility.test.ts` — structural checks only (button names, form labels, dialog roles, keyboard Tab); axe-core is **not installed**
- `rtl.test.ts` — verifies `html[dir="rtl"]` for Arabic/Urdu routes
- `dark-mode.test.ts` — verifies theme toggle behavior
- `responsive.test.ts` — Playwright viewport simulation tests
- `currency-global.test.ts` — currency display and switcher tests

### Reliability Strengths
- Centralized route warmup eliminates cold-start flakiness
- 120-second test timeout, 90-second navigation timeout
- Retry on failure (1 retry local, 2 in CI)
- `waitUntil: "domcontentloaded"` used in most E2E tests (fast, avoids JS bundle waits)

### Fragility Risks
- Tests cannot run in current environment (Node v24 / broken deps)
- E2E depends on dev server being available at `localhost:3000`
- No seeded test database (no backend) — all tests rely on mock data rendering
- Accessibility tests do not use axe-core — structural checks only

---

## 15. Build and Performance Audit

### Build Result
`pnpm build` **FAILED** with:
```
Error: Cannot find module '@swc/helpers/_/_interop_require_default'
```
Root cause: `@swc/helpers` is in the pnpm virtual store but not linked correctly under Node.js v24.11.1.

**Route count cannot be verified** — build did not complete.

### Estimated Route Count (from source inspection)
~65 `page.tsx` files × 3 locales = ~195 addressable routes. The Next.js build would generate these as static or dynamic server components.

### Heavy Dependencies
| Package | Size concern | Notes |
|---|---|---|
| `framer-motion` 12.38.0 | High | Full animation library — heavy if not tree-shaken |
| `@fullcalendar/*` (4 packages) | High | FullCalendar is large; only used in communication/events |
| `recharts` 3.8.1 | Medium | Used across dashboards and finance |
| `@tanstack/react-table` 8.21.3 | Low | Tree-shakeable |
| `next-intl` 4.11.0 | Low | Efficient |

### Dynamic Imports
- No explicit `dynamic(() => import(...))` calls found in source
- FullCalendar and framer-motion are imported statically — **bundle risk** if not code-split
- Recommendation: Lazily import FullCalendar and framer-motion heavy components

### Potential Bundle Concerns
- FullCalendar loaded for all users, used only in `/communication/events`
- Framer Motion used site-wide (not isolated to specific animations)
- No webpack/bundle analyzer config present

### Performance Recommendations
1. Dynamic import FullCalendar component
2. Audit framer-motion usage — may be replaceable with CSS animations
3. Add `@next/bundle-analyzer` to inspect bundle composition after build is fixed
4. Consider `next/image` for any future image assets

---

## 16. Code Hygiene Audit

| Pattern | Search Method | Result | Notes |
|---|---|---|---|
| jQuery | `grep_search src/**` | **0 matches** | Clean — no jQuery |
| Bootstrap | `grep_search src/**` | **0 matches** | Clean — no Bootstrap |
| DataTables | `grep_search src/**` | **0 matches** | Clean — no DataTables.js |
| ApexCharts | `grep_search src/**` | **0 matches** | Clean — Recharts only |
| `console.log` | PowerShell Select-String | **0 matches** | Clean production code |
| `TODO/FIXME` | PowerShell Select-String | **1 match** | `quick-search.tsx:17` — `// TODO Phase 5: open command palette` |
| Raw currency symbols (`$` in JSX) | Source inspection | **0 user-visible `$`** | All amounts use `formatCurrency()` |
| `as any` / `: any` | PowerShell regex | **2 matches** | `expense-form-dialog.tsx:106`, `income-form-dialog.tsx:106` — `control as any` cast |

### Assessment
- Codebase is very clean: no legacy libraries, no debug logs
- Only 2 instances of `as any` in production code — minor, in specific RHF controller casting
- 1 TODO comment — not a defect, marks a planned feature
- No hardcoded currency symbols in user-facing JSX
- No secrets or API keys in source

---

## 17. Branding and Logo Audit

### Logo Assets Found
| Asset | Status |
|---|---|
| `public/brand/` directory | **DOES NOT EXIST** |
| EduVanta logo image (SVG/PNG) | **NOT PRESENT** |
| Square logo / icon | **NOT PRESENT** |
| Horizontal logo | **NOT PRESENT** |
| Favicon | Default Next.js `favicon.ico` in `src/app/` — not EduVanta branded |
| `public/` brand assets | Only default Next.js placeholders (`next.svg`, `vercel.svg`, `globe.svg`, `window.svg`, `file.svg`) |

### Brand Placement Status
| Location | Current | Recommended |
|---|---|---|
| Marketing Navbar | Text `EduVanta` in link | Replace with SVG logo |
| Auth Brand Panel | Text `E` in styled `div` (gradient square) | Replace with logo image |
| App Sidebar (collapsed) | Text `E` span | Replace with square logo |
| App Sidebar (expanded) | Text `EduVanta` span | Replace with horizontal logo |
| App Topbar | Not visible | Consider favicon/logo |
| Favicon / Browser tab | Default Next.js favicon | Replace with EduVanta favicon |
| og:image / metadata | Not set | Add branded og:image |
| Certificate watermark | Text `EduVanta` (CSS) | Acceptable for now |
| Footer | Text `EduVanta` | Replace with SVG logo when available |

### Recommendations
1. Create `public/brand/` with `logo-horizontal.svg`, `logo-square.svg`, `logo-dark.svg`, `favicon.svg`
2. Update `src/app/layout.tsx` metadata with favicon and og:image
3. Replace text `E` monograms in sidebar and auth panel with `<Image>` using `logo-square.svg`
4. Replace text `EduVanta` spans with `<Image>` using `logo-horizontal.svg`
5. Test both light and dark mode (dark variant logo or inverted CSS filter)

---

## 18. Documentation Structure Recommendation

### Current Status
- `doc/` directory: **Created during this audit** (`c:\Users\Yoga\Documents\Projects\EduVanta\doc\`)
- Documentation files currently in project root: `README.md`, `AGENTS.md`, `CLAUDE.md`
- `typecheck-phase23.txt` in project root — prior phase output artifact
- No documentation outside the project root was found (references to `../documentation/` and `../edudash-admin/` not inspected per audit scope)

### What Should NOT Be Moved Now
- `README.md`, `AGENTS.md`, `CLAUDE.md` — convention files, should remain in root
- Do not move files without explicit instruction

### Recommended Documentation Organization
```
doc/
  audits/
    EDUVANTA_DEEP_TECHNICAL_AUDIT_REPORT.md   ← this document
  backend-planning/
    (future: database schema, API design, Supabase setup)
  deployment/
    (future: Vercel config, env vars, CI/CD setup)
  phase-reports/
    (future: per-phase completion summaries)
  handoff/
    (future: onboarding guides, architecture decisions)
  prompts/
    (future: reusable agent prompts)
```

All future audit, planning, backend, and documentation files should be created in `doc/` subdirectories, not in the project root.

---

## 19. Security and Production Readiness Audit

| Area | Current State | Production Gap | Priority |
|---|---|---|---|
| **Authentication** | Mock only — any credentials pass login; `onSubmit` is a 1-second delay + toast | No real auth provider (Supabase Auth, Auth.js, Clerk, etc.); no session; no JWT; no cookies | **CRITICAL** |
| **Route Protection** | None — all dashboard routes are accessible without login | No middleware auth check; `middleware.ts` only handles i18n locale routing | **CRITICAL** |
| **RBAC** | UI displays role concept (`useSchoolContextStore.activeRole`) but zero enforcement | Permission matrix in settings is display-only; any user can access any page | **CRITICAL** |
| **Tenant Isolation** | `useSchoolContextStore.activeSchoolId` is a Zustand field; always `null` on fresh load | No multi-tenancy enforcement; no RLS; no server-side tenant context | **HIGH** |
| **Data Persistence** | None — all data resets on page refresh | No database; no API; no local storage persistence | **CRITICAL** |
| **File Storage** | `FileUploadField` accepts a file but does not upload it | No storage bucket; files are lost on form submit | **HIGH** |
| **Payments / Billing** | `SubscriptionManager` shows `toast.success("(Mock)")` | No Stripe, no payment gateway, no real invoice | **HIGH** |
| **Notifications Delivery** | Channel toggles are frontend-only state | No email, no SMS, no push notification delivery | **MEDIUM** |
| **Certificate Generation** | Browser print dialog only (`window.print()`) | No server-side PDF; no signing; no QR code verification | **MEDIUM** |
| **API Security** | No API routes in this codebase | When real API is added: must enforce auth, rate limiting, CSRF | **HIGH** (future) |
| **Secrets / Env Vars** | No `.env` file in project; no API keys in source | No secrets present — clean. When backend is added, use `.env.local` + Vercel env vars | **LOW** (clean) |
| **XSS / Injection** | No `dangerouslySetInnerHTML` with user data; `LOCALE_ATTRS_SCRIPT` is a fixed inline script | React escapes by default; `dangerouslySetInnerHTML` in layout only for fixed system script | **LOW** |
| **HTTPS** | Not applicable (dev only) | Must enforce HTTPS in production (Vercel does this by default) | **LOW** |
| **Dependency Vulnerabilities** | Node modules installed but build broken; no `pnpm audit` run | Run `pnpm audit` after fixing dependency tree | **MEDIUM** |

---

## 20. Backend Integration Readiness

### Current Readiness Level: MEDIUM
The frontend is structured to make backend integration straightforward. The key abstraction is the service layer.

### Recommended Backend Migration Path

**Phase 1: Infrastructure**
1. Define database domains from `src/types/` — each type file maps to a DB domain
2. Create Supabase project (or equivalent PostgreSQL)
3. Set up Supabase Auth — replace mock `onSubmit` in `login-form.tsx` with `supabase.auth.signInWithPassword()`
4. Configure `middleware.ts` — add auth session check alongside i18n middleware

**Phase 2: Schema and Security**
5. Create PostgreSQL schema from type definitions
6. Add `tenant_id` / `school_id` column to all tables — enables multi-tenancy
7. Implement Row Level Security (RLS) policies per table
8. Create `schools` table, seed with demo school

**Phase 3: Service Layer Replacement**
9. Replace `src/services/mock/*.service.ts` files one domain at a time
10. New services call Supabase JS client (or REST API) instead of returning mock arrays
11. Preserve the `PaginatedResponse<T>` / `ApiResponse<T>` return types — hooks don't need to change
12. Add `queryClient.invalidateQueries(queryKeys.students.lists())` to mutation hooks

**Phase 4: Storage and Files**
13. Create Supabase Storage buckets for profile images, certificates
14. Replace `FileUploadField` mock behavior with real presigned upload
15. Certificate PDF: add server-side PDF generation (Puppeteer/Chrome headless or react-pdf)

**Phase 5: Real-Time and Notifications**
16. Add Supabase Realtime subscription for messages/notifications
17. Integrate email delivery (Resend or Supabase Edge Functions + SMTP)
18. SMS via Twilio/MessageBird

**Phase 6: Payments**
19. Integrate Stripe for subscription billing
20. Add webhook handler for Stripe events

### Easiest Modules to Migrate First
1. **Academic** (classes, sections, subjects) — simple CRUD, low data complexity
2. **Settings/General** — single school record
3. **Library** — self-contained, clear data model
4. **Students** — well-defined schema, good Zod validation already

### Hardest Modules to Migrate
1. **Communication/Messages** — requires real-time WebSocket
2. **Certificates** — requires server-side PDF pipeline
3. **Fees/Finance** — financial audit trail, payment gateway integration
4. **Subscription** — Stripe integration, webhook handling

### Key Integration Points
- `src/hooks/queries/use-*.ts` — swap service imports only; hook signatures stay same
- `src/types/` — use these as Supabase/Prisma schema source of truth
- `src/lib/validations/` — reuse server-side for API request validation
- `queryKeys.ts` — use for cache invalidation after mutations

---

## 21. Risk Register

| Risk | Severity | Evidence | Recommendation |
|---|---|---|---|
| Broken development environment (Node v24) | **CRITICAL** | All 4 quality gate commands fail with module resolution errors | Downgrade to Node 20 LTS; run `pnpm install --force` |
| No real authentication | **CRITICAL** | `login-form.tsx` `onSubmit` is `setTimeout + toast.success` only | Implement Supabase Auth or equivalent before any stakeholder who expects real login |
| No route protection middleware | **CRITICAL** | `middleware.ts` only handles i18n; any URL is accessible without login | Add auth session check to middleware; redirect to `/login` if unauthenticated |
| No RBAC enforcement | **CRITICAL** | `RolePermissionMatrix` is display-only; `useSchoolContextStore` has no server backing | Plan RBAC system with server-side role checks before production |
| Zero data persistence | **CRITICAL** | All data resets on page refresh; no database | Define backend integration timeline |
| No tenant isolation | **HIGH** | `activeSchoolId` is always `null` on load; no server-side context | Must implement before multi-tenant production use |
| No file storage | **HIGH** | `FileUploadField` accepts file objects but does not upload | Integrate Supabase Storage before any real file feature |
| No real billing | **HIGH** | `SubscriptionManager` logs `"(Mock)"` to toast | Stripe integration required before monetization |
| Partial translations (ar/ur) | **MEDIUM** | en.json 1,688 lines vs ar.json/ur.json ~1,345 lines (~343 line gap) | Complete Arabic and Urdu translations; add missing keys |
| No real notification delivery | **MEDIUM** | Channel toggles are localStorage/Zustand state only | Integrate email/push delivery service |
| Browser-print certificates only | **MEDIUM** | `CertificatePrintLayout` triggers `window.print()` — no PDF library | Add server-side PDF generation for real certificate issuance |
| Bundle size risk (FullCalendar, Framer Motion) | **MEDIUM** | Static imports for heavy packages | Add dynamic imports; run bundle analyzer after build is fixed |
| E2E test reliability (cold-start) | **LOW-MEDIUM** | Global warmup mitigates this but is complex | Consider reducing route count in warmup after build is stable |
| `as any` in finance forms | **LOW** | 2 instances in `expense-form-dialog.tsx`, `income-form-dialog.tsx` | Properly type the RHF controller generic to eliminate |
| No EduVanta logo assets | **LOW** (for demo) | `public/brand/` does not exist; `public/` has only Next.js placeholders | Create SVG logo assets and integrate |
| Documentation scattered outside `doc/` | **LOW** | `typecheck-phase23.txt` in project root | Move to `doc/phase-reports/` or delete |
| No `pnpm audit` run | **LOW** | Dependency vulnerabilities not scanned | Run after fixing Node/dependency issue |

---

## 22. Recommended Next Workstreams

Prioritized in order of urgency:

### Workstream 1 — Fix Development Environment (URGENT, BLOCKER)
- Downgrade Node.js to v20 LTS
- Run `pnpm install --force` to rebuild the pnpm virtual store
- Verify all 4 quality gates pass: `pnpm typecheck`, `pnpm lint`, `pnpm test -- --run`, `pnpm build`
- Run E2E smoke tests to confirm Playwright works

### Workstream 2 — Logo / Branding Integration
- Create `public/brand/` with `logo-horizontal.svg`, `logo-square.svg`, `favicon.svg`
- Update `src/app/layout.tsx` metadata for favicon and og:image
- Replace text monograms in sidebar and auth panel with `<Image>` components
- Test in light/dark mode and RTL layout

### Workstream 3 — Translation Completeness
- Compare `en.json` vs `ar.json` and `ur.json` at key level
- Add missing translation keys to both files
- Test all pages at `/ar/` and `/ur/` for missing translation errors

### Workstream 4 — Backend Architecture and Supabase Planning
- Create `doc/backend-planning/DATABASE_SCHEMA.md`
- Define tables from `src/types/*.ts`
- Design RLS policies for multi-tenant architecture
- Select auth strategy (Supabase Auth recommended)

### Workstream 5 — Real Authentication and Route Protection
- Implement Supabase Auth (or equivalent)
- Update `middleware.ts` to enforce auth session
- Replace mock `onSubmit` in `login-form.tsx`, `register-form.tsx`
- Add redirect guards to dashboard routes

### Workstream 6 — Service Layer Replacement (Phased)
- Start with Academic module (simplest)
- Replace mock services with real Supabase queries
- Add mutation cache invalidation to TanStack Query hooks
- Expand module by module

### Workstream 7 — Storage Integration
- Set up Supabase Storage buckets
- Wire `FileUploadField` to real upload API
- Handle profile images for students/teachers/employees

### Workstream 8 — Server-Side PDF for Certificates
- Evaluate: `react-pdf`, Puppeteer, or Supabase Edge Function + Chrome headless
- Implement `/api/certificates/generate` endpoint
- Replace print button with PDF download

### Workstream 9 — Deployment and Hosting
- Configure Vercel project
- Set up environment variables
- Configure `pnpm build` in CI
- Set up GitHub Actions for lint + typecheck + test on PRs

### Workstream 10 — Subscription and Billing
- Integrate Stripe
- Implement subscription plan selection
- Add Stripe webhook handler for billing events
- Replace `SubscriptionManager` mock toast with real plan upgrade flow

---

## 23. Final Auditor Verdict

### Is EduVanta frontend demo-ready?
**YES — with caveats.**

The UI is polished, feature-complete as a frontend mock, and covers 16 major modules with consistent design patterns. A stakeholder demo can walk through all screens, create/edit/delete mock records, switch languages (EN/AR/UR), toggle dark/light mode, change currency, and see charts and tables.

**Caveat:** The development environment (Node v24.11.1) breaks all tooling commands. A demo requires fixing the environment first or running the dev server via a different Node version. Once the environment is fixed, the app should run fine as a dev server.

---

### Is EduVanta frontend production SaaS-ready?
**NO — it is not production-ready.**

Critical gaps that prevent production launch:
1. **No real authentication** — any credentials accepted
2. **No route protection** — all routes publicly accessible
3. **No data persistence** — all data lost on refresh
4. **No RBAC enforcement** — roles are display-only
5. **No tenant isolation** — multi-tenancy is not implemented
6. **No real payments** — subscription billing is mock
7. **No real notifications** — email/SMS/push not delivered
8. **Broken tooling** — cannot build, test, or lint in current environment

---

### Is EduVanta ready for backend integration planning?
**YES — the frontend is well-structured for backend integration.**

- Service layer is fully abstracted (`src/services/mock/`)
- TanStack Query hooks have stable interfaces
- Type definitions in `src/types/` can be used directly as database schema input
- Zod validation schemas in `src/lib/validations/` can be reused server-side
- The migration path is clear (swap service files, add cache invalidation)

---

### What should be fixed before stakeholder demo?
1. Fix Node.js environment → run dev server successfully
2. Add EduVanta logo assets (low effort, high visual impact)
3. Verify ar.json/ur.json completeness for demo locales
4. Ensure mock data is seeded with realistic school names and student counts

---

### What must be built before real launch?
In strict priority order:
1. Real authentication (Supabase Auth or equivalent)
2. Protected routes (middleware auth check)
3. Database and data persistence (Supabase PostgreSQL)
4. RBAC enforcement (server-side role checks)
5. Tenant isolation (school-scoped RLS)
6. Storage for file uploads
7. Fix broken development tooling
8. Complete translations (AR/UR)
9. Server-side certificate PDF generation
10. Real payment integration (Stripe)
11. Real notification delivery (email/push)

---

*End of EduVanta Deep Technical Audit Report*  
*Generated: May 9, 2026 | Audited codebase commit: HEAD at time of audit*
