import { test, expect } from "@playwright/test";

// ─── Academic Module E2E Tests — Phase 14 ────────────────────────────────────

test.describe("Academic Module", () => {
  // ─── Classes ──────────────────────────────────────────────────────────────

  test("classes page loads", async ({ page }) => {
    await page.goto("/en/academic/classes", { waitUntil: "domcontentloaded", timeout: 60000 });
    // Wait for network to settle so Turbopack-compiled bundles are fully hydrated
    await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
    await expect(page.getByTestId("classes-manager")).toBeVisible({ timeout: 60000 });
  });

  test("classes page has table, search, and add button", async ({ page }) => {
    await page.goto("/en/academic/classes", { waitUntil: "domcontentloaded", timeout: 60000 });
    // Wait for network to settle so Turbopack-compiled bundles are fully hydrated
    await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
    await expect(page.getByTestId("classes-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("textbox", { name: /search/i })).toBeVisible({ timeout: 30000 });
    await expect(page.getByTestId("add-class-btn")).toBeVisible({ timeout: 30000 });
  });

  test("classes table shows existing class data", async ({ page }) => {
    await page.goto("/en/academic/classes", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("classes-manager")).toBeVisible({ timeout: 60000 });
    // Wait for network to settle so Turbopack-compiled table rows are hydrated
    await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
    await expect(page.getByText("Class 1", { exact: true })).toBeVisible({ timeout: 30000 });
  });

  test("class table search filters rows", async ({ page }) => {
    await page.goto("/en/academic/classes", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("classes-manager")).toBeVisible({ timeout: 60000 });
    const searchInput = page.getByRole("textbox", { name: /search/i });
    await searchInput.fill("Class 1");
    await expect(page.getByText("Class 1", { exact: true })).toBeVisible({ timeout: 30000 });
  });

  test("add class dialog opens", async ({ page }) => {
    await page.goto("/en/academic/classes", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("classes-manager")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("add-class-btn").click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole("heading", { name: "Add Class" })).toBeVisible({ timeout: 30000 });
  });

  test("class form shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/en/academic/classes", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("classes-manager")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("add-class-btn").click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 30000 });
    await page.getByRole("button", { name: /submit/i }).click();
    await expect(page.getByText(/at least 2 characters|is required/i).first()).toBeVisible({
      timeout: 30000,
    });
  });

  // ─── Classrooms ───────────────────────────────────────────────────────────

  test("classrooms page loads", async ({ page }) => {
    await page.goto("/en/academic/classrooms", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("classrooms-manager")).toBeVisible({ timeout: 60000 });
  });

  test("classrooms page shows room data", async ({ page }) => {
    await page.goto("/en/academic/classrooms", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("classrooms-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByText("Room 101")).toBeVisible({ timeout: 30000 });
  });

  test("add classroom dialog opens", async ({ page }) => {
    await page.goto("/en/academic/classrooms", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("classrooms-manager")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("add-classroom-btn").click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole("heading", { name: "Add Classroom" })).toBeVisible({ timeout: 30000 });
  });

  // ─── Sections ─────────────────────────────────────────────────────────────

  test("sections page loads", async ({ page }) => {
    await page.goto("/en/academic/sections", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("sections-manager")).toBeVisible({ timeout: 60000 });
  });

  test("sections page shows section data", async ({ page }) => {
    await page.goto("/en/academic/sections", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("sections-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByText("Class 1", { exact: true }).first()).toBeVisible({ timeout: 30000 });
  });

  test("add section dialog opens", async ({ page }) => {
    await page.goto("/en/academic/sections", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("sections-manager")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("add-section-btn").click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole("heading", { name: "Add Section" })).toBeVisible({ timeout: 30000 });
  });

  // ─── Subjects ─────────────────────────────────────────────────────────────

  test("subjects page loads", async ({ page }) => {
    await page.goto("/en/academic/subjects", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("subjects-manager")).toBeVisible({ timeout: 60000 });
  });

  test("subjects page shows subject data", async ({ page }) => {
    await page.goto("/en/academic/subjects", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("subjects-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByText("Mathematics")).toBeVisible({ timeout: 30000 });
  });

  test("add subject dialog opens", async ({ page }) => {
    await page.goto("/en/academic/subjects", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("subjects-manager")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("add-subject-btn").click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole("heading", { name: "Add Subject" })).toBeVisible({ timeout: 30000 });
  });

  // ─── RTL locales ─────────────────────────────────────────────────────────

  test("Arabic classes page renders RTL", async ({ page }) => {
    await page.goto("/ar/academic/classes", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("classes-manager")).toBeVisible({ timeout: 60000 });
    const dir = await page.evaluate(() => document.documentElement.getAttribute("dir"));
    expect(dir).toBe("rtl");
  });

  test("Urdu subjects page renders RTL", async ({ page }) => {
    await page.goto("/ur/academic/subjects", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("subjects-manager")).toBeVisible({ timeout: 60000 });
    const dir = await page.evaluate(() => document.documentElement.getAttribute("dir"));
    expect(dir).toBe("rtl");
  });

  // ─── Responsive ───────────────────────────────────────────────────────────

  test("classes page does not overflow on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/en/academic/classes", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("classes-manager")).toBeVisible({ timeout: 60000 });
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
  });

  // ─── Regression tests (existing routes) ──────────────────────────────────

  test("existing /en/employees still works", async ({ page }) => {
    await page.goto("/en/employees", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("employee-list")).toBeVisible({ timeout: 60000 });
  });

  test("existing /en/hrm/payroll still works", async ({ page }) => {
    await page.goto("/en/hrm/payroll", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("payroll-list")).toBeVisible({ timeout: 60000 });
  });

  test("existing /en/students still works", async ({ page }) => {
    await page.goto("/en/students", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("student-list")).toBeVisible({ timeout: 60000 });
  });

  test("existing /en/teachers still works", async ({ page }) => {
    await page.goto("/en/teachers", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("teacher-list")).toBeVisible({ timeout: 60000 });
  });

  test("existing /en/guardians still works", async ({ page }) => {
    await page.goto("/en/guardians", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("guardian-list")).toBeVisible({ timeout: 60000 });
  });

  test("existing /en/dashboard still works", async ({ page }) => {
    await page.goto("/en/dashboard", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.locator("h1, h2").filter({ hasText: "School Dashboard" })).toBeVisible({ timeout: 60000 });
  });

  test("existing /en/login still works", async ({ page }) => {
    await page.goto("/en/login", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 60000 });
  });
});
