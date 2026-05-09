/**
 * Playwright Global Setup — Route Warmup
 *
 * Pre-compiles all major routes with Turbopack before the parallel test suite
 * starts. This eliminates cold-start timeouts that occur when multiple workers
 * simultaneously request uncompiled routes for the first time.
 *
 * Routes are fetched sequentially so Turbopack can compile each one without
 * overwhelming the dev-server. Each fetch waits for the response body to be
 * received (not just headers) to ensure the page is fully compiled.
 */

import { chromium } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

const WARMUP_ROUTES = [
  // Core
  "/en",
  "/ar",
  "/ur",
  "/en/login",
  "/ar/login",
  "/en/forgot-password",
  "/ar/forgot-password",
  "/en/reset-password",
  "/ar/reset-password",
  "/en/register",
  "/en/dashboard",

  // Students
  "/en/students",
  "/en/students/new",
  "/en/students/student-001",

  // Teachers
  "/en/teachers",
  "/en/teachers/new",
  "/en/teachers/teacher-001",

  // Guardians
  "/en/guardians",
  "/en/guardians/new",

  // Employees / HRM
  "/en/employees",
  "/en/employees/new",
  "/en/employees/attendance",
  "/en/employees/leave-requests",
  "/en/hrm/payroll",
  "/en/hrm/departments",
  "/en/hrm/designations",

  // Academic
  "/en/academic/classes",
  "/en/academic/classrooms",
  "/en/academic/sections",
  "/en/academic/subjects",

  // Exams
  "/en/exams",
  "/en/exams/schedule",
  "/en/exams/results",

  // Fees
  "/en/fees/collect",
  "/en/fees/groups",
  "/en/fees/types",
  "/en/fees/discounts",

  // Finance
  "/en/finance/transactions",
  "/en/finance/income-heads",
  "/en/finance/expense-heads",

  // Attendance
  "/en/students/attendance",
  "/en/teachers/attendance",

  // Library
  "/en/library/books",
  "/en/library/issue-return",
  "/en/library/members",

  // Communication / Notifications
  "/en/communication/notices",
  "/en/communication/events",
  "/en/communication/messages",
  "/en/notifications",
  "/en/notifications/alerts",

  // Dev routes
  "/en/dev/infrastructure",

  // Certificates
  "/en/certificates",

  // Settings — these are the Phase 22 routes most affected by cold-start
  "/en/settings/general",
  "/en/settings/languages",
  "/en/settings/currencies",
  "/en/settings/roles",
  "/en/settings/assign-roles",
  "/en/settings/subscription",
];

async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log(
    `\n[global-setup] Warming up ${WARMUP_ROUTES.length} routes on ${BASE_URL}…`
  );

  for (const route of WARMUP_ROUTES) {
    try {
      // Use "load" (not "domcontentloaded") so that Turbopack fully compiles
      // and serves all JavaScript bundles before tests start. With
      // "domcontentloaded" only the HTML is received; the JS chunks are
      // compiled lazily on the next request, causing cold-start failures.
      await page.goto(`${BASE_URL}${route}`, {
        waitUntil: "load",
        timeout: 90000,
      });
    } catch {
      // Non-fatal — a warmup miss means the test itself will handle the slower first load.
      console.warn(`[global-setup] Warning: warmup timed out for ${route}`);
    }
  }
  // Brief settle — lets Turbopack finish any background compilation before
  // parallel workers start hitting routes simultaneously.
  await new Promise((r) => setTimeout(r, 3000));
  console.log("[global-setup] Warmup complete.\n");

  await browser.close();
}

export default globalSetup;
