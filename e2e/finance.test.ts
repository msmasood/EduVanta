import { test, expect } from "@playwright/test";

// ─── Finance Module E2E Tests — Phase 17 ────────────────────────────────────

test.describe("Finance Module", () => {
  // ─── Income Heads ────────────────────────────────────────────────────────

  test("income heads page loads (en)", async ({ page }) => {
    await page.goto("/en/finance/income-heads", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("income-heads-manager")).toBeVisible({ timeout: 60000 });
  });

  test("income heads page shows head summary cards", async ({ page }) => {
    await page.goto("/en/finance/income-heads", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("income-heads-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("head-summary-cards")).toBeVisible({ timeout: 30000 });
  });

  test("income heads page has add button", async ({ page }) => {
    await page.goto("/en/finance/income-heads", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("income-heads-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("add-income-head-btn")).toBeVisible({ timeout: 30000 });
  });

  test("income heads add dialog opens", async ({ page }) => {
    await page.goto("/en/finance/income-heads", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("add-income-head-btn")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("add-income-head-btn").click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 30000 });
  });

  test("income heads add form shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/en/finance/income-heads", { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.getByTestId("add-income-head-btn").click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 30000 });
    await page.getByRole("button", { name: /save|create|add|submit/i }).click();
    // Validation error should appear
    await expect(page.locator("p.text-destructive, [role='alert']").first()).toBeVisible({ timeout: 30000 });
  });

  // ─── Income ─────────────────────────────────────────────────────────────

  test("income page loads (en)", async ({ page }) => {
    await page.goto("/en/finance/income", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("income-manager")).toBeVisible({ timeout: 60000 });
  });

  test("income page shows finance summary cards", async ({ page }) => {
    await page.goto("/en/finance/income", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("income-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("finance-summary-cards")).toBeVisible({ timeout: 30000 });
  });

  test("income page has add button", async ({ page }) => {
    await page.goto("/en/finance/income", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("income-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("add-income-btn")).toBeVisible({ timeout: 30000 });
  });

  test("income page shows data rows", async ({ page }) => {
    await page.goto("/en/finance/income", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("income-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: 60000 });
  });

  test("income add dialog opens", async ({ page }) => {
    await page.goto("/en/finance/income", { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.getByTestId("add-income-btn").click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 30000 });
  });

  test("income page RTL (ar)", async ({ page }) => {
    await page.goto("/ar/finance/income", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("income-manager")).toBeVisible({ timeout: 60000 });
  });

  // ─── Expense Heads ───────────────────────────────────────────────────────

  test("expense heads page loads (en)", async ({ page }) => {
    await page.goto("/en/finance/expense-heads", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("expense-heads-manager")).toBeVisible({ timeout: 60000 });
  });

  test("expense heads page shows head summary cards", async ({ page }) => {
    await page.goto("/en/finance/expense-heads", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("expense-heads-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("head-summary-cards")).toBeVisible({ timeout: 30000 });
  });

  test("expense heads page has add button", async ({ page }) => {
    await page.goto("/en/finance/expense-heads", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("expense-heads-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("add-expense-head-btn")).toBeVisible({ timeout: 30000 });
  });

  test("expense heads add dialog opens", async ({ page }) => {
    await page.goto("/en/finance/expense-heads", { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.getByTestId("add-expense-head-btn").click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 30000 });
  });

  // ─── Expenses ────────────────────────────────────────────────────────────

  test("expenses page loads (en)", async ({ page }) => {
    await page.goto("/en/finance/expenses", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("expenses-manager")).toBeVisible({ timeout: 60000 });
  });

  test("expenses page shows finance summary cards", async ({ page }) => {
    await page.goto("/en/finance/expenses", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("expenses-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("finance-summary-cards")).toBeVisible({ timeout: 30000 });
  });

  test("expenses page has add button", async ({ page }) => {
    await page.goto("/en/finance/expenses", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("expenses-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("add-expense-btn")).toBeVisible({ timeout: 30000 });
  });

  test("expenses page shows data rows", async ({ page }) => {
    await page.goto("/en/finance/expenses", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("expenses-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: 60000 });
  });

  test("expenses add dialog opens", async ({ page }) => {
    await page.goto("/en/finance/expenses", { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.getByTestId("add-expense-btn").click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 30000 });
  });

  test("expenses page RTL (ur)", async ({ page }) => {
    await page.goto("/ur/finance/expenses", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("expenses-manager")).toBeVisible({ timeout: 60000 });
  });

  // ─── Transactions ─────────────────────────────────────────────────────────

  test("transactions page loads (en)", async ({ page }) => {
    await page.goto("/en/finance/transactions", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("transactions-manager")).toBeVisible({ timeout: 60000 });
  });

  test("transactions page shows summary cards", async ({ page }) => {
    await page.goto("/en/finance/transactions", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("transactions-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("transaction-summary-cards")).toBeVisible({ timeout: 30000 });
  });

  test("transactions page shows data rows", async ({ page }) => {
    await page.goto("/en/finance/transactions", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("transactions-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: 60000 });
  });

  test("transactions detail dialog opens on view", async ({ page }) => {
    await page.goto("/en/finance/transactions", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("transactions-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: 30000 });
    await page.getByRole("button", { name: /view transaction/i }).first().click();
    await expect(page.getByTestId("transaction-detail-dialog")).toBeVisible({ timeout: 30000 });
  });

  test("transactions page RTL (ar)", async ({ page }) => {
    await page.goto("/ar/finance/transactions", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("transactions-manager")).toBeVisible({ timeout: 60000 });
  });

  test("transactions page mobile viewport (en)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/en/finance/transactions", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("transactions-manager")).toBeVisible({ timeout: 60000 });
    // No horizontal overflow
    const overflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });

  // ─── Regression — existing modules still work ─────────────────────────────

  test("regression: fees collect page still loads", async ({ page }) => {
    await page.goto("/en/fees/collect", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("fee-collection-manager")).toBeVisible({ timeout: 60000 });
  });

  test("regression: academic classes page still loads", async ({ page }) => {
    await page.goto("/en/academic/classes", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.locator("[data-testid]").first()).toBeVisible({ timeout: 60000 });
  });

  test("regression: exams page still loads", async ({ page }) => {
    await page.goto("/en/exams", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.locator("[data-testid]").first()).toBeVisible({ timeout: 60000 });
  });

  test("regression: dashboard still loads", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.locator("[data-testid]").first()).toBeVisible({ timeout: 60000 });
  });

  test("regression: students page still loads", async ({ page }) => {
    await page.goto("/en/students", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.locator("[data-testid]").first()).toBeVisible({ timeout: 60000 });
  });

  test("regression: teachers page still loads", async ({ page }) => {
    await page.goto("/en/teachers", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.locator("[data-testid]").first()).toBeVisible({ timeout: 60000 });
  });

  test("regression: employees page still loads", async ({ page }) => {
    await page.goto("/en/employees", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.locator("[data-testid]").first()).toBeVisible({ timeout: 60000 });
  });

  test("regression: hrm payroll page still loads", async ({ page }) => {
    await page.goto("/en/hrm/payroll", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.locator("[data-testid]").first()).toBeVisible({ timeout: 60000 });
  });

  test("regression: guardians page still loads", async ({ page }) => {
    await page.goto("/en/guardians", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.locator("[data-testid]").first()).toBeVisible({ timeout: 60000 });
  });
});
