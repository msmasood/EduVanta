import { test, expect } from "@playwright/test";

// ─── Exams Module E2E Tests — Phase 15 ───────────────────────────────────────

test.describe("Exams Module", () => {
  // ─── Exams Page ───────────────────────────────────────────────────────────

  test("exams page loads", async ({ page }) => {
    await page.goto("/en/exams", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("exams-manager")).toBeVisible({ timeout: 60000 });
  });

  test("exams page has table, search, and add button", async ({ page }) => {
    await page.goto("/en/exams", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("exams-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("textbox", { name: /search/i })).toBeVisible({ timeout: 30000 });
    await expect(page.getByTestId("add-exam-btn")).toBeVisible({ timeout: 30000 });
  });

  test("exams table shows existing exam data", async ({ page }) => {
    await page.goto("/en/exams", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("exams-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByText("First Term Examination")).toBeVisible({ timeout: 30000 });
  });

  test("add exam dialog opens", async ({ page }) => {
    await page.goto("/en/exams", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("exams-manager")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("add-exam-btn").click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole("heading", { name: "Add Exam" })).toBeVisible({ timeout: 30000 });
  });

  test("exam form shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/en/exams", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("exams-manager")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("add-exam-btn").click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 30000 });
    await page.getByRole("button", { name: /submit/i }).click();
    await expect(page.getByText(/at least 2 characters|is required/i).first()).toBeVisible({
      timeout: 30000,
    });
  });

  // ─── Exam Schedule Page ───────────────────────────────────────────────────

  test("exam schedule page loads", async ({ page }) => {
    await page.goto("/en/exams/schedule", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("exam-schedule-manager")).toBeVisible({ timeout: 60000 });
  });

  test("exam schedule page has table, search, and add button", async ({ page }) => {
    await page.goto("/en/exams/schedule", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("exam-schedule-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("textbox", { name: /search/i })).toBeVisible({ timeout: 30000 });
    await expect(page.getByTestId("add-schedule-btn")).toBeVisible({ timeout: 30000 });
  });

  test("exam schedule table shows subject data", async ({ page }) => {
    await page.goto("/en/exams/schedule", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("exam-schedule-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByText("Mathematics").first()).toBeVisible({ timeout: 30000 });
  });

  test("add schedule dialog opens", async ({ page }) => {
    await page.goto("/en/exams/schedule", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("exam-schedule-manager")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("add-schedule-btn").click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole("heading", { name: "Add Schedule" })).toBeVisible({ timeout: 30000 });
  });

  test("schedule form shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/en/exams/schedule", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("exam-schedule-manager")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("add-schedule-btn").click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 30000 });
    await page.getByRole("button", { name: /submit/i }).click();
    await expect(page.getByText(/is required/i).first()).toBeVisible({ timeout: 30000 });
  });

  // ─── Exam Results Page ────────────────────────────────────────────────────

  test("exam results page loads", async ({ page }) => {
    await page.goto("/en/exams/results", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("exam-results-manager")).toBeVisible({ timeout: 60000 });
  });

  test("exam results page has table, search, and add button", async ({ page }) => {
    await page.goto("/en/exams/results", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("exam-results-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("textbox", { name: /search/i })).toBeVisible({ timeout: 30000 });
    await expect(page.getByTestId("add-result-btn")).toBeVisible({ timeout: 30000 });
  });

  test("exam results table shows student data", async ({ page }) => {
    await page.goto("/en/exams/results", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("exam-results-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByText("Ahmed Khan").first()).toBeVisible({ timeout: 30000 });
  });

  test("add result dialog opens", async ({ page }) => {
    await page.goto("/en/exams/results", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("exam-results-manager")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("add-result-btn").click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole("heading", { name: "Add Result" })).toBeVisible({ timeout: 30000 });
  });

  test("result form shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/en/exams/results", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("exam-results-manager")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("add-result-btn").click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 30000 });
    await page.getByRole("button", { name: /submit/i }).click();
    await expect(page.getByText(/is required/i).first()).toBeVisible({ timeout: 30000 });
  });

  // ─── RTL / i18n ───────────────────────────────────────────────────────────

  test("Arabic exams page loads", async ({ page }) => {
    await page.goto("/ar/exams", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("exams-manager")).toBeVisible({ timeout: 60000 });
  });

  test("Urdu exam results page loads", async ({ page }) => {
    await page.goto("/ur/exams/results", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("exam-results-manager")).toBeVisible({ timeout: 60000 });
  });

  // ─── Mobile / Layout ──────────────────────────────────────────────────────

  test("exams page has no horizontal overflow on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/en/exams", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("exams-manager")).toBeVisible({ timeout: 60000 });
    const body = await page.$("body");
    const bodyWidth = await body?.evaluate((el) => el.scrollWidth);
    const viewportWidth = page.viewportSize()?.width;
    expect(bodyWidth).toBeLessThanOrEqual((viewportWidth ?? 375) + 10);
  });

  // ─── Regression Tests ─────────────────────────────────────────────────────

  test("regression: academic classes page still works", async ({ page }) => {
    await page.goto("/en/academic/classes", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("classes-manager")).toBeVisible({ timeout: 60000 });
  });

  test("regression: students page still works", async ({ page }) => {
    await page.goto("/en/students", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("student-list")).toBeVisible({ timeout: 60000 });
  });

  test("regression: teachers page still works", async ({ page }) => {
    await page.goto("/en/teachers", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("teacher-list")).toBeVisible({ timeout: 60000 });
  });

  test("regression: employees page still works", async ({ page }) => {
    await page.goto("/en/employees", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("employee-list")).toBeVisible({ timeout: 60000 });
  });

  test("regression: guardians page still works", async ({ page }) => {
    await page.goto("/en/guardians", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("guardian-list")).toBeVisible({ timeout: 60000 });
  });

  test("regression: dashboard still loads", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByRole("heading", { level: 1 }).or(page.getByRole("heading", { level: 2 })).first()).toBeVisible({ timeout: 60000 });
  });

  test("regression: login page still loads", async ({ page }) => {
    await page.goto("/en/login", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.locator("input[type='email']")).toBeVisible({ timeout: 30000 });
  });
});
