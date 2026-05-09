import { test, expect } from "@playwright/test";

// ─── Fees Module E2E Tests — Phase 16 ────────────────────────────────────────

test.describe("Fees Module", () => {
  // ─── Fees Collection Page ─────────────────────────────────────────────────

  test("fees collect page loads (en)", async ({ page }) => {
    await page.goto("/en/fees/collect", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("fee-collection-manager")).toBeVisible({ timeout: 60000 });
  });

  test("fees collect page shows summary cards", async ({ page }) => {
    await page.goto("/en/fees/collect", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("fee-collection-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("fee-summary-cards")).toBeVisible({ timeout: 30000 });
  });

  test("fees collect page shows export button", async ({ page }) => {
    await page.goto("/en/fees/collect", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("fee-collection-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("export-invoices-btn")).toBeVisible({ timeout: 30000 });
  });

  test("fees collect page shows invoice data", async ({ page }) => {
    await page.goto("/en/fees/collect", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("fee-collection-manager")).toBeVisible({ timeout: 60000 });
    // Mock data includes INV-2024-001
    await expect(page.getByText(/INV-2024/i).first()).toBeVisible({ timeout: 30000 });
  });

  test("fees collect page RTL (ar)", async ({ page }) => {
    await page.goto("/ar/fees/collect", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("fee-collection-manager")).toBeVisible({ timeout: 60000 });
  });

  // ─── Fee Groups Page ──────────────────────────────────────────────────────

  test("fee groups page loads (en)", async ({ page }) => {
    await page.goto("/en/fees/groups", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("fee-groups-manager")).toBeVisible({ timeout: 60000 });
  });

  test("fee groups page has add button", async ({ page }) => {
    await page.goto("/en/fees/groups", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("fee-groups-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("add-fee-group-btn")).toBeVisible({ timeout: 30000 });
  });

  test("fee groups table shows existing groups", async ({ page }) => {
    await page.goto("/en/fees/groups", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("fee-groups-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByText("Tuition").first()).toBeVisible({ timeout: 30000 });
  });

  test("add fee group dialog opens", async ({ page }) => {
    await page.goto("/en/fees/groups", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("fee-groups-manager")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("add-fee-group-btn").click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole("heading", { name: "Add Fee Group" })).toBeVisible({ timeout: 30000 });
  });

  test("fee group form shows validation on empty submit", async ({ page }) => {
    await page.goto("/en/fees/groups", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("fee-groups-manager")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("add-fee-group-btn").click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 30000 });
    await page.getByRole("button", { name: /submit/i }).click();
    await expect(page.getByText(/at least 2 characters|is required/i).first()).toBeVisible({ timeout: 30000 });
  });

  test("fee groups page RTL (ur)", async ({ page }) => {
    await page.goto("/ur/fees/groups", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("fee-groups-manager")).toBeVisible({ timeout: 60000 });
  });

  // ─── Fee Types Page ───────────────────────────────────────────────────────

  test("fee types page loads (en)", async ({ page }) => {
    await page.goto("/en/fees/types", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("fee-types-manager")).toBeVisible({ timeout: 60000 });
  });

  test("fee types page has add button", async ({ page }) => {
    await page.goto("/en/fees/types", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("fee-types-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("add-fee-type-btn")).toBeVisible({ timeout: 30000 });
  });

  test("fee types table shows existing types", async ({ page }) => {
    await page.goto("/en/fees/types", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("fee-types-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByText("Monthly Tuition (Primary)").first()).toBeVisible({ timeout: 30000 });
  });

  test("add fee type dialog opens", async ({ page }) => {
    await page.goto("/en/fees/types", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("fee-types-manager")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("add-fee-type-btn").click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole("heading", { name: "Add Fee Type" })).toBeVisible({ timeout: 30000 });
  });

  test("fee type form shows validation on empty submit", async ({ page }) => {
    await page.goto("/en/fees/types", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("fee-types-manager")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("add-fee-type-btn").click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 30000 });
    await page.getByRole("button", { name: /submit/i }).click();
    await expect(page.getByText(/at least 2 characters|is required/i).first()).toBeVisible({ timeout: 30000 });
  });

  test("fee types page RTL (ar)", async ({ page }) => {
    await page.goto("/ar/fees/types", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("fee-types-manager")).toBeVisible({ timeout: 60000 });
  });

  // ─── Fee Discounts Page ───────────────────────────────────────────────────

  test("fee discounts page loads (en)", async ({ page }) => {
    await page.goto("/en/fees/discounts", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("fee-discounts-manager")).toBeVisible({ timeout: 60000 });
  });

  test("fee discounts page has add button", async ({ page }) => {
    await page.goto("/en/fees/discounts", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("fee-discounts-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("add-fee-discount-btn")).toBeVisible({ timeout: 30000 });
  });

  test("fee discounts table shows existing discounts", async ({ page }) => {
    await page.goto("/en/fees/discounts", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("fee-discounts-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByText("Scholarship 100%").first()).toBeVisible({ timeout: 30000 });
  });

  test("add fee discount dialog opens", async ({ page }) => {
    await page.goto("/en/fees/discounts", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("fee-discounts-manager")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("add-fee-discount-btn").click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole("heading", { name: "Add Fee Discount" })).toBeVisible({ timeout: 30000 });
  });

  test("fee discount form shows validation on empty submit", async ({ page }) => {
    await page.goto("/en/fees/discounts", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("fee-discounts-manager")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("add-fee-discount-btn").click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 30000 });
    await page.getByRole("button", { name: /submit/i }).click();
    await expect(page.getByText(/at least 2 characters|is required/i).first()).toBeVisible({ timeout: 30000 });
  });

  test("fee discounts page RTL (ur)", async ({ page }) => {
    await page.goto("/ur/fees/discounts", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("fee-discounts-manager")).toBeVisible({ timeout: 60000 });
  });

  // ─── Regression: Previous modules still load ──────────────────────────────

  test("students page still loads (regression)", async ({ page }) => {
    await page.goto("/en/students", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("student-list")).toBeVisible({ timeout: 60000 });
  });

  test("teachers page still loads (regression)", async ({ page }) => {
    await page.goto("/en/teachers", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("teacher-list")).toBeVisible({ timeout: 60000 });
  });

  test("exams page still loads (regression)", async ({ page }) => {
    await page.goto("/en/exams", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("exams-manager")).toBeVisible({ timeout: 60000 });
  });
});
