# EduVanta Frontend

**EduVanta** — School, College & LMS Management SaaS Frontend

Converted from the EduDash Bootstrap 5 static HTML template into a fully modern
Next.js 16 / React 19 application with App Router, i18n (EN/AR/UR), RTL support,
dark mode, multi-currency, and a complete E2E test suite.

---

## 1. Product Overview

EduVanta is a multi-tenant school management frontend covering:

- **Authentication** — login, register, forgot/reset password (UI shell; no real auth backend)
- **Dashboards** — School, Student, Teacher, Parent, LMS, University variants
- **People** — Students, Teachers, Guardians, Employees
- **HRM** — Payroll, Departments, Designations, Leave Requests, Leave Types
- **Academic** — Classes, Classrooms, Sections, Subjects
- **Exams** — Exams, Schedule, Results
- **Fees** — Collect, Groups, Types, Discounts
- **Finance** — Income, Expenses, Transactions with heads
- **Attendance** — Student, Teacher, Employee
- **Library** — Books, Issue & Return, Members
- **Communication** — Notices, Events, Messages
- **Notifications** — Alerts, Notification Feed
- **Certificates** — Certificate generator with print layout
- **Settings** — General, Languages, Currencies (11 supported), Roles, Assign Roles, Subscription Plans

All data is mock/static — no backend, database, or real API calls.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.4 with Turbopack |
| React | 19.2.4 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui components |
| UI Primitives | Base UI React, shadcn/ui |
| Icons | Lucide React |
| i18n | next-intl 4.11.0 |
| Routing | Next.js App Router + next-intl middleware |
| State | Zustand 5 (UI, currency, school context) |
| Server State | TanStack Query 5 (with mock services) |
| Tables | TanStack Table 8 |
| Forms | React Hook Form 7 + Zod 4 |
| Charts | Recharts 3 |
| Calendar | FullCalendar 6 (React) |
| Animation | Framer Motion 12 |
| Date Handling | date-fns 4, react-day-picker 9 |
| Command Palette | cmdk |
| Toasts | Sonner |
| Dark Mode | next-themes |
| Unit Testing | Vitest 4 + Testing Library |
| E2E Testing | Playwright 1.59 |

---

## 3. Project Structure

```
eduvanta/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (auth)/         # Login, Register, Forgot/Reset Password
│   │   │   ├── (dashboard)/    # All protected app routes
│   │   │   │   ├── academic/
│   │   │   │   ├── certificates/
│   │   │   │   ├── communication/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── employees/
│   │   │   │   ├── exams/
│   │   │   │   ├── fees/
│   │   │   │   ├── finance/
│   │   │   │   ├── guardians/
│   │   │   │   ├── hrm/
│   │   │   │   ├── library/
│   │   │   │   ├── notifications/
│   │   │   │   ├── settings/
│   │   │   │   ├── students/
│   │   │   │   └── teachers/
│   │   │   └── layout.tsx      # Root locale layout with RTL inline script
│   │   └── layout.tsx          # Root HTML layout
│   ├── components/             # Shared UI components (data-table, layout, ui/)
│   ├── data/                   # Mock data files
│   ├── features/               # Feature-scoped components and logic
│   ├── hooks/                  # Custom React hooks + TanStack Query hooks
│   ├── i18n/                   # next-intl configuration
│   ├── lib/                    # Utilities (currency, routes, table, validation, etc.)
│   ├── messages/               # i18n message files (en.json, ar.json, ur.json)
│   ├── services/               # Mock service layer (simulates API calls)
│   ├── stores/                 # Zustand stores
│   ├── test/                   # Vitest unit tests
│   └── types/                  # TypeScript type definitions
├── e2e/                        # Playwright E2E tests (600 tests)
├── public/                     # Static assets
├── playwright.config.ts
├── vitest.config.ts
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## 4. Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+

### Installation

```bash
git clone <repo-url>
cd eduvanta
pnpm install
```

### Install Playwright browsers (first time)

```bash
pnpm exec playwright install chromium
```

### Start development server

```bash
pnpm dev
```

Open [http://localhost:3000/en](http://localhost:3000/en) in your browser.

---

## 5. Commands

| Command | Description |
|---|---|
| `pnpm install` | Install all dependencies |
| `pnpm dev` | Start Next.js dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server (after build) |
| `pnpm typecheck` | TypeScript type check (no emit) |
| `pnpm lint` | ESLint check |
| `pnpm test -- --run` | Run all unit tests (Vitest, non-watch) |
| `pnpm test:watch` | Run unit tests in watch mode |
| `pnpm test:e2e --project=chromium` | Run Chromium E2E suite (600 tests) |
| `pnpm test:e2e --project=firefox` | Run Firefox E2E suite |
| `pnpm test:e2e` | Run all browser E2E suites |
| `pnpm format` | Format code with Prettier |

> **Note:** Always run `pnpm` commands from inside `eduvanta/`, not from the project root.

---

## 6. Locale URLs

| Locale | Language | Direction | Base URL |
|---|---|---|---|
| `en` | English | LTR | `http://localhost:3000/en` |
| `ar` | Arabic | RTL | `http://localhost:3000/ar` |
| `ur` | Urdu | RTL | `http://localhost:3000/ur` |

Navigating to `http://localhost:3000` redirects to `/en` via middleware.

---

## 7. Important Routes

### Marketing / Auth
- `/[locale]` — Landing page
- `/[locale]/login` — Login
- `/[locale]/register` — Register
- `/[locale]/forgot-password` — Forgot password
- `/[locale]/reset-password` — Reset password

### Dashboards
- `/[locale]/dashboard` — School dashboard (default)
- `/[locale]/dashboard/student` — Student dashboard
- `/[locale]/dashboard/teacher` — Teacher dashboard
- `/[locale]/dashboard/parent` — Parent dashboard
- `/[locale]/dashboard/lms` — LMS dashboard
- `/[locale]/dashboard/university` — University dashboard

### Students
- `/[locale]/students` — Student list
- `/[locale]/students/new` — Add student
- `/[locale]/students/[id]` — Student details
- `/[locale]/students/[id]/edit` — Edit student
- `/[locale]/students/attendance` — Attendance
- `/[locale]/students/categories` — Categories
- `/[locale]/students/suspended` — Suspended students

### Teachers
- `/[locale]/teachers` — Teacher list
- `/[locale]/teachers/new` — Add teacher
- `/[locale]/teachers/[id]` — Teacher details
- `/[locale]/teachers/[id]/edit` — Edit teacher
- `/[locale]/teachers/attendance` — Attendance
- `/[locale]/teachers/timetable` — Timetable

### Guardians
- `/[locale]/guardians` — Guardian list
- `/[locale]/guardians/new` — Add guardian
- `/[locale]/guardians/[id]` — Guardian details
- `/[locale]/guardians/[id]/edit` — Edit guardian

### Employees / HRM
- `/[locale]/employees` — Employee list
- `/[locale]/employees/new` — Add employee
- `/[locale]/employees/[id]` — Employee details
- `/[locale]/employees/[id]/edit` — Edit employee
- `/[locale]/employees/attendance` — Employee attendance
- `/[locale]/employees/leave-requests` — Leave requests
- `/[locale]/employees/leave-types` — Leave types
- `/[locale]/hrm/payroll` — Payroll
- `/[locale]/hrm/departments` — Departments
- `/[locale]/hrm/designations` — Designations

### Academic
- `/[locale]/academic/classes` — Classes
- `/[locale]/academic/classrooms` — Classrooms
- `/[locale]/academic/sections` — Sections
- `/[locale]/academic/subjects` — Subjects

### Exams
- `/[locale]/exams` — Exams list
- `/[locale]/exams/schedule` — Exam schedule
- `/[locale]/exams/results` — Exam results

### Fees
- `/[locale]/fees/collect` — Collect fees
- `/[locale]/fees/groups` — Fee groups
- `/[locale]/fees/types` — Fee types
- `/[locale]/fees/discounts` — Fee discounts

### Finance
- `/[locale]/finance/income-heads` — Income heads
- `/[locale]/finance/income` — Income list
- `/[locale]/finance/expense-heads` — Expense heads
- `/[locale]/finance/expenses` — Expense list
- `/[locale]/finance/transactions` — Transactions

### Library
- `/[locale]/library/books` — Books
- `/[locale]/library/issue-return` — Issue & Return
- `/[locale]/library/members` — Library members
- `/[locale]/library/members/[id]` — Member details

### Communication / Notifications
- `/[locale]/communication/notices` — Notice board
- `/[locale]/communication/events` — Events
- `/[locale]/communication/messages` — Messages
- `/[locale]/notifications` — Notification feed
- `/[locale]/notifications/alerts` — Alert settings

### Settings
- `/[locale]/settings/general` — General settings
- `/[locale]/settings/languages` — Language settings
- `/[locale]/settings/currencies` — Currency settings
- `/[locale]/settings/roles` — Role management
- `/[locale]/settings/assign-roles` — Assign roles
- `/[locale]/settings/subscription` — Subscription plans

---

## 8. Mock Data Architecture

All data is static mock data — there is no database or API:

- **`src/data/`** — Raw mock data arrays (students, teachers, employees, etc.)
- **`src/services/`** — Mock service functions that simulate async API calls using `Promise.resolve()` with artificial delays
- **`src/hooks/queries/`** — TanStack Query hooks that call mock services; return `isLoading`, `data`, `error` states exactly as real API hooks would
- **`src/stores/`** — Zustand stores for UI state, selected currency, and school context

This architecture is designed so that replacing mock services with real Supabase/REST/GraphQL clients is a minimal, isolated change.

---

## 9. i18n and RTL Notes

- Three locales: **en** (English/LTR), **ar** (Arabic/RTL), **ur** (Urdu/RTL)
- next-intl middleware handles locale detection and routing
- **RTL fix**: The root `[locale]/layout.tsx` contains an inline synchronous script that sets `document.documentElement.dir` and `document.documentElement.lang` before the page renders, preventing the FOUC (flash of wrong direction)
- Translation strings are in `src/messages/en.json`, `ar.json`, `ur.json`
- Not all strings are translated — Arabic and Urdu translations are partial placeholders

### RTL inline script location

```typescript
// src/app/[locale]/layout.tsx
const LOCALE_ATTRS_SCRIPT = `(function(){...})();`;
```

This runs synchronously in the browser before React hydrates, ensuring correct `dir` from the first paint.

---

## 10. Currency Notes

- 11 currencies supported: USD, AED, SAR, PKR, GBP, EUR, QAR, KWD, OMR, BHD, INR
- Currency selection stored in Zustand (`use-currency-store.ts`)
- All monetary values formatted using `formatCurrency()` from `src/lib/currency.ts`
- Uses `Intl.NumberFormat` with per-currency formatting locales
- No raw `"$"` hardcoding in component code — all amounts go through `formatCurrency()`

---

## 11. Testing Notes

### Unit Tests (Vitest)
- **60 test files, 1164 tests** — all passing
- Tests cover: utilities, hooks, form helpers, breadcrumbs, mock services, component logic
- Run with: `pnpm test -- --run`

### E2E Tests (Playwright / Chromium)
- **600 tests** across 20+ test files
- Tests cover all major routes, interactions, RTL, dark mode, accessibility, responsive, currency
- **Global warmup**: 58 routes are pre-compiled sequentially before parallel tests run (eliminates Turbopack cold-start failures)
- E2E must be run from `eduvanta/` directory
- Configuration: `playwright.config.ts` — `retries: 1`, `timeout: 120000`, `navigationTimeout: 90000`
- 3 warmup routes may time out on cold start (settings pages) — this is non-fatal

### Important E2E Note
Running `pnpm build` before `pnpm test:e2e` can cause Turbopack to need to recompile routes in dev mode, which may cause the first 2 tests of a file to fail on a fresh server start. For most reliable E2E results, run the E2E suite on a warm dev server (with `pnpm dev` already running) without a preceding production build in the same session.

---

## 12. Current Limitations

- **Frontend-only** — no backend, database, or real API
- **No real authentication** — login/register forms are UI only; no JWT, session, or cookie auth
- **No real file uploads** — profile images, certificates, and library covers use placeholder images
- **No real payments** — subscription/billing UI exists but no Stripe or payment gateway
- **No real notifications** — email, SMS, push delivery not implemented
- **No real PDF generation** — certificate print uses browser `window.print()`
- **No multi-tenant security** — role/permission UI exists but no enforcement
- **Mock data is static** — create/edit/delete actions update local React state only; refresh resets data
- **Partial translations** — Arabic and Urdu message files are partial placeholders
- **Turbopack cold-start** — first request to uncompiled routes can be slow; the E2E warmup mitigates this
- **188 ESLint warnings** — pre-existing, no errors; mostly `@typescript-eslint/no-unused-vars` for exported types

---

## 13. Backend Integration Readiness

The frontend is architecturally ready for backend integration. Recommended steps:

1. **Replace mock services** (`src/services/`) with real Supabase or REST API clients
2. **Add real authentication** — Supabase Auth or NextAuth; update the auth layout and route guards
3. **Add multi-tenant model** — school/organization workspace context
4. **Add database schema** — use Supabase with Row Level Security (RLS)
5. **Add file storage** — Supabase Storage for images, certificates, library covers
6. **Add payment gateway** — Stripe after billing model is finalized
7. **Add notification providers** — email (Resend/SendGrid), push (OneSignal)
8. **Keep TanStack Query hooks stable** — only change service implementations, not hook signatures

---

## 14. Phase Status Summary

| Phase | Title | Status |
|---|---|---|
| 0 | Project Bootstrap | ✅ Complete |
| 1 | Stack Setup & Configuration | ✅ Complete |
| 2 | Foundation & Global Setup | ✅ Complete |
| 2B | Foundation Stabilization | ✅ Complete |
| 3 | App Shell & Navigation | ✅ Complete |
| 3B | App Shell Stabilization | ✅ Complete |
| 4 | Landing & Marketing Page | ✅ Complete |
| 5 | Authentication | ✅ Complete |
| 6 | Students Module | ✅ Complete |
| 7 | Teachers Module | ✅ Complete |
| 7B | Teachers Stabilization | ✅ Complete |
| 8 | Dashboard Variants | ✅ Complete |
| 8B | Dashboard Stabilization | ✅ Complete |
| 9 | Guardians Module | ✅ Complete |
| 10 | Attendance Module | ✅ Complete |
| 11 | Exams Module | ✅ Complete |
| 12 | Fees Module | ✅ Complete |
| 13 | Academic Module | ✅ Complete |
| 14 | Communication & Notifications | ✅ Complete |
| 15 | Finance Module | ✅ Complete |
| 15B | Finance Stabilization | ✅ Complete |
| 16 | Employees & HRM Module | ✅ Complete |
| 16B | HRM Stabilization | ✅ Complete |
| 17 | Finance Module (extended) | ✅ Complete |
| 17B | Finance Extended Stabilization | ✅ Complete |
| 18 | Library Module | ✅ Complete |
| 18B | Library Stabilization | ✅ Complete |
| 19 | Library Members Module | ✅ Complete |
| 20 | Currency & Global Settings | ✅ Complete |
| 21 | Certificates Module | ✅ Complete |
| 22 | Settings, Roles & Subscription | ✅ Complete |
| 23 | Global QA, Responsive, RTL, Dark Mode, Accessibility, E2E | ✅ Complete |
| 24 | Final Testing, Build, Performance & Handoff | ✅ Complete |

---

## 15. Handoff Checklist

- [ ] Clone repository
- [ ] `cd eduvanta`
- [ ] `pnpm install`
- [ ] `pnpm exec playwright install chromium` (first time)
- [ ] `pnpm dev` — verify `/en` loads
- [ ] Open `/ar` — verify RTL layout (Arabic)
- [ ] Open `/ur` — verify RTL layout (Urdu)
- [ ] Toggle dark mode — verify theme switch works
- [ ] `pnpm typecheck` — expect 0 errors
- [ ] `pnpm lint` — expect 0 errors
- [ ] `pnpm test -- --run` — expect 1164 tests passing
- [ ] `pnpm build` — expect exit 0
- [ ] `pnpm test:e2e --project=chromium` — expect 600 tests passing (run on warm dev server, not immediately after build)
- [ ] Review `EDUVANTA_PHASE_24_FINAL_HANDOFF_REPORT.md`
- [ ] Review all phase reports in `eduvanta/`
- [ ] Confirm `../edudash-admin/`, `../edudash-admin-rtl/`, `../documentation/` were NOT modified

---

## Reference Documents

- `EDUVANTA_FRONTEND_CONVERSION_MASTER_PLAN.md` (project root)
- `EDUVANTA_PHASE_23_GLOBAL_QA_REPORT.md`
- `EDUVANTA_PHASE_24_FINAL_HANDOFF_REPORT.md`

---

*EduVanta Frontend — Phase 24 Complete — May 2026*
