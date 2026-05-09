import { test, expect } from "@playwright/test";

// ─── Certificates Module E2E Tests — Phase 21 ───────────────────────────────

test.describe("Certificates Module — Main Page", () => {
  test("certificates page loads (en)", async ({ page }) => {
    await page.goto("/en/certificates", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("certificates-manager")).toBeVisible({ timeout: 60000 });
  });

  test("certificates page shows summary cards", async ({ page }) => {
    await page.goto("/en/certificates", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("certificates-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("certificate-summary-cards")).toBeVisible({ timeout: 30000 });
  });

  test("certificates page shows control panel", async ({ page }) => {
    await page.goto("/en/certificates", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("certificates-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("certificate-control-panel")).toBeVisible({ timeout: 30000 });
  });

  test("certificates page shows preview area", async ({ page }) => {
    await page.goto("/en/certificates", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("certificates-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("certificate-preview")).toBeVisible({ timeout: 30000 });
  });

  test("certificates page shows empty preview state initially", async ({ page }) => {
    await page.goto("/en/certificates", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("certificates-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("certificate-preview-empty")).toBeVisible({ timeout: 30000 });
  });

  test("certificates page shows certificate form", async ({ page }) => {
    await page.goto("/en/certificates", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("certificates-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("certificate-form")).toBeVisible({ timeout: 30000 });
  });

  test("certificates page shows records table", async ({ page }) => {
    await page.goto("/en/certificates", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("certificates-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("certificate-records-table")).toBeVisible({ timeout: 30000 });
  });

  test("certificate records table shows data rows", async ({ page }) => {
    await page.goto("/en/certificates", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("certificate-records-table")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: 60000 });
  });

  test("submitting form without required fields shows validation errors", async ({ page }) => {
    await page.goto("/en/certificates", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("certificate-form")).toBeVisible({ timeout: 60000 });
    // Click generate without filling required combobox fields
    await page.getByRole("button", { name: /generate|preview/i }).click();
    // Validation errors should appear (required fields: template and student)
    await expect(
      page.locator("p.text-destructive, [role='alert'], .text-red-500").first()
    ).toBeVisible({ timeout: 30000 });
  });

  test("date input is present in form", async ({ page }) => {
    await page.goto("/en/certificates", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("certificate-form")).toBeVisible({ timeout: 60000 });
    await expect(page.locator('input[type="date"]').first()).toBeVisible({ timeout: 30000 });
  });
});

// ─── Certificates Module — RTL ────────────────────────────────────────────────

test.describe("Certificates Module — RTL", () => {
  test("certificates page loads RTL (ar)", async ({ page }) => {
    await page.goto("/ar/certificates", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("certificates-manager")).toBeVisible({ timeout: 60000 });
  });

  test("certificates page loads RTL (ur)", async ({ page }) => {
    await page.goto("/ur/certificates", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("certificates-manager")).toBeVisible({ timeout: 60000 });
  });

  test("certificates page (ar) shows control panel", async ({ page }) => {
    await page.goto("/ar/certificates", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("certificate-control-panel")).toBeVisible({ timeout: 60000 });
  });

  test("certificates page (ar) shows records table", async ({ page }) => {
    await page.goto("/ar/certificates", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("certificate-records-table")).toBeVisible({ timeout: 60000 });
  });
});

// ─── Certificates Module — Mobile viewport ───────────────────────────────────

test.describe("Certificates Module — Mobile", () => {
  test("certificates page no horizontal overflow on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/en/certificates", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("certificates-manager")).toBeVisible({ timeout: 60000 });
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
  });
});

// ─── Regression: Pre-existing routes ─────────────────────────────────────────

test.describe("Regression — Phase 21 smoke", () => {
  test("dashboard still loads", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.locator("main, [role='main'], #main-content").first()).toBeVisible({ timeout: 60000 });
  });

  test("students list still loads", async ({ page }) => {
    await page.goto("/en/students", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("student-list")).toBeVisible({ timeout: 60000 });
  });

  test("teachers list still loads", async ({ page }) => {
    await page.goto("/en/teachers", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("teacher-list")).toBeVisible({ timeout: 60000 });
  });

  test("library books page still loads", async ({ page }) => {
    await page.goto("/en/library/books", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("books-manager")).toBeVisible({ timeout: 60000 });
  });

  test("exams page still loads", async ({ page }) => {
    await page.goto("/en/exams", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("exams-manager")).toBeVisible({ timeout: 60000 });
  });

  test("fees collect page still loads", async ({ page }) => {
    await page.goto("/en/fees/collect", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("fee-collection-manager")).toBeVisible({ timeout: 60000 });
  });
});
