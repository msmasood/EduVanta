import { test, expect } from "@playwright/test";

// ─── Employees + HRM Module E2E Tests — Phase 13 ─────────────────────────────

test.describe("Employees Module", () => {
  // ─── List page ──────────────────────────────────────────────────────────────

  test("employees list page loads", async ({ page }) => {
    await page.goto("/en/employees", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("employee-list")).toBeVisible({ timeout: 60000 });
  });

  test("employee list shows Add Employee button", async ({ page }) => {
    await page.goto("/en/employees", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("employee-list")).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole("link", { name: /add employee/i })).toBeVisible({ timeout: 30000 });
  });

  test("employee list shows summary cards", async ({ page }) => {
    await page.goto("/en/employees", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Total Employees", { exact: true })).toBeVisible({ timeout: 30000 });
    await expect(page.getByText("Active", { exact: true }).first()).toBeVisible({ timeout: 30000 });
  });

  test("employee list shows first employee", async ({ page }) => {
    await page.goto("/en/employees", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("employee-list")).toBeVisible({ timeout: 30000 });
    await expect(page.getByText("EMP-2020-001")).toBeVisible({ timeout: 30000 });
  });

  test("employee list search filters rows", async ({ page }) => {
    await page.goto("/en/employees", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("employee-list")).toBeVisible({ timeout: 30000 });
    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill("Hassan");
    await expect(page.getByText("Hassan Malik")).toBeVisible({ timeout: 30000 });
  });

  // ─── Add employee page ───────────────────────────────────────────────────────

  test("add employee page loads", async ({ page }) => {
    await page.goto("/en/employees/new", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("add-employee-page")).toBeVisible({ timeout: 30000 });
  });

  test("add employee form shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/en/employees/new", { waitUntil: "domcontentloaded" });
    // Wait for network to settle so React is fully hydrated before interacting with the form
    await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
    await expect(page.getByTestId("add-employee-page")).toBeVisible({ timeout: 30000 });
    // Wait for the button to be enabled (JS hydration complete) before clicking
    const addBtn = page.getByRole("button", { name: /add employee/i });
    await expect(addBtn).toBeEnabled({ timeout: 15000 });
    await addBtn.click();
    await expect(page.getByText(/at least 2 characters/i).first()).toBeVisible({ timeout: 30000 });
  });

  // ─── Detail page ──────────────────────────────────────────────────────────────

  test("employee detail page loads", async ({ page }) => {
    await page.goto("/en/employees/emp-001", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("employee-detail")).toBeVisible({ timeout: 30000 });
  });

  test("employee detail shows tabs", async ({ page }) => {
    await page.goto("/en/employees/emp-001", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("employee-detail")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("tab", { name: /overview/i })).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole("tab", { name: /job/i })).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole("tab", { name: /attendance/i })).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole("tab", { name: /payroll/i })).toBeVisible({ timeout: 30000 });
  });

  // ─── Edit employee page ───────────────────────────────────────────────────────

  test("edit employee page loads", async ({ page }) => {
    await page.goto("/en/employees/emp-001/edit", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("edit-employee-page")).toBeVisible({ timeout: 30000 });
  });

  // ─── Attendance page ──────────────────────────────────────────────────────────

  test("employee attendance page loads", async ({ page }) => {
    await page.goto("/en/employees/attendance", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("employee-attendance")).toBeVisible({ timeout: 30000 });
  });

  // ─── Leave requests page ──────────────────────────────────────────────────────

  test("leave requests page loads", async ({ page }) => {
    await page.goto("/en/employees/leave-requests", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("leave-requests-list")).toBeVisible({ timeout: 30000 });
  });

  test("leave requests shows Apply for Leave button", async ({ page }) => {
    await page.goto("/en/employees/leave-requests", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("leave-requests-list")).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole("button", { name: /apply for leave/i })).toBeVisible({ timeout: 30000 });
  });

  // ─── Leave types page ─────────────────────────────────────────────────────────

  test("leave types page loads", async ({ page }) => {
    await page.goto("/en/employees/leave-types", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("leave-types-manager")).toBeVisible({ timeout: 30000 });
  });
});

// ─── HRM Module ───────────────────────────────────────────────────────────────

test.describe("HRM Module", () => {
  // ─── Payroll page ─────────────────────────────────────────────────────────────

  test("payroll page loads", async ({ page }) => {
    await page.goto("/en/hrm/payroll", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("payroll-list")).toBeVisible({ timeout: 30000 });
  });

  test("payroll page shows summary cards", async ({ page }) => {
    await page.goto("/en/hrm/payroll", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("payroll-list")).toBeVisible({ timeout: 30000 });
    await expect(page.getByText("Total Payroll", { exact: true })).toBeVisible({ timeout: 30000 });
    await expect(page.getByText("Paid Records", { exact: true })).toBeVisible({ timeout: 30000 });
  });

  test("payroll page shows Hassan Malik", async ({ page }) => {
    await page.goto("/en/hrm/payroll", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("payroll-list")).toBeVisible({ timeout: 30000 });
    await expect(page.getByText("Hassan Malik")).toBeVisible({ timeout: 30000 });
  });

  // ─── Departments page ─────────────────────────────────────────────────────────

  test("departments page loads", async ({ page }) => {
    await page.goto("/en/hrm/departments", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("departments-manager")).toBeVisible({ timeout: 30000 });
  });

  test("departments page shows Add Department button", async ({ page }) => {
    await page.goto("/en/hrm/departments", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("departments-manager")).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole("button", { name: /add department/i })).toBeVisible({ timeout: 30000 });
  });

  test("departments page shows Mathematics department", async ({ page }) => {
    await page.goto("/en/hrm/departments", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("departments-manager")).toBeVisible({ timeout: 30000 });
    await expect(page.getByText("Mathematics")).toBeVisible({ timeout: 30000 });
  });

  // ─── Designations page ────────────────────────────────────────────────────────

  test("designations page loads", async ({ page }) => {
    await page.goto("/en/hrm/designations", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("designations-manager")).toBeVisible({ timeout: 30000 });
  });

  test("designations page shows Add Designation button", async ({ page }) => {
    await page.goto("/en/hrm/designations", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("designations-manager")).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole("button", { name: /add designation/i })).toBeVisible({ timeout: 30000 });
  });
});

// ─── RTL / multilingual ───────────────────────────────────────────────────────

test.describe("Employees + HRM RTL", () => {
  test("employees list loads in Arabic", async ({ page }) => {
    await page.goto("/ar/employees", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("employee-list")).toBeVisible({ timeout: 60000 });
  });

  test("payroll loads in Arabic", async ({ page }) => {
    await page.goto("/ar/hrm/payroll", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("payroll-list")).toBeVisible({ timeout: 60000 });
  });

  test("employees list loads in Urdu", async ({ page }) => {
    await page.goto("/ur/employees", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("employee-list")).toBeVisible({ timeout: 60000 });
  });
});

// ─── Mobile overflow ──────────────────────────────────────────────────────────

test("employee list has no horizontal overflow on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/en/employees", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("employee-list")).toBeVisible({ timeout: 30000 });
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  const viewportWidth = await page.evaluate(() => window.innerWidth);
  expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5);
});

// ─── Regression checks ────────────────────────────────────────────────────────

test.describe("Regression checks", () => {
  test("teachers list still loads", async ({ page }) => {
    await page.goto("/en/teachers", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("teacher-list")).toBeVisible({ timeout: 60000 });
  });

  test("students list still loads", async ({ page }) => {
    await page.goto("/en/students", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("student-list")).toBeVisible({ timeout: 60000 });
  });

  test("guardians list still loads", async ({ page }) => {
    await page.goto("/en/guardians", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("guardian-list")).toBeVisible({ timeout: 60000 });
  });
});
