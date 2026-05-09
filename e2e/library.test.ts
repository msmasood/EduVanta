import { test, expect } from "@playwright/test";

// ─── Library Module E2E Tests — Phase 19 ────────────────────────────────────

test.describe("Library Module — Books", () => {
  test("books page loads (en)", async ({ page }) => {
    await page.goto("/en/library/books", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("books-manager")).toBeVisible({ timeout: 60000 });
  });

  test("books page shows book summary cards", async ({ page }) => {
    await page.goto("/en/library/books", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("books-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("book-summary-cards")).toBeVisible({ timeout: 30000 });
  });

  test("books page has add book button", async ({ page }) => {
    await page.goto("/en/library/books", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("books-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("add-book-btn")).toBeVisible({ timeout: 30000 });
  });

  test("books page shows data rows", async ({ page }) => {
    await page.goto("/en/library/books", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("books-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: 60000 });
  });

  test("book add dialog opens", async ({ page }) => {
    await page.goto("/en/library/books", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("add-book-btn")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("add-book-btn").click();
    await expect(page.getByTestId("book-form-dialog")).toBeVisible({ timeout: 30000 });
  });

  test("book add form shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/en/library/books", { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.getByTestId("add-book-btn").click();
    await expect(page.getByTestId("book-form-dialog")).toBeVisible({ timeout: 30000 });
    await page.getByRole("button", { name: /save|create|add|submit/i }).click();
    await expect(page.locator("p.text-destructive, [role='alert']").first()).toBeVisible({ timeout: 30000 });
  });

  test("books page RTL (ar)", async ({ page }) => {
    await page.goto("/ar/library/books", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("books-manager")).toBeVisible({ timeout: 60000 });
  });

  test("books page RTL (ur)", async ({ page }) => {
    await page.goto("/ur/library/books", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("books-manager")).toBeVisible({ timeout: 60000 });
  });
});

// ─── Library Module — Issue & Return ────────────────────────────────────────

test.describe("Library Module — Issue & Return", () => {
  test("issue-return page loads (en)", async ({ page }) => {
    await page.goto("/en/library/issue-return", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("issue-return-manager")).toBeVisible({ timeout: 60000 });
  });

  test("issue-return page shows issue summary cards", async ({ page }) => {
    await page.goto("/en/library/issue-return", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("issue-return-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("issue-summary-cards")).toBeVisible({ timeout: 30000 });
  });

  test("issue-return page has issue book button", async ({ page }) => {
    await page.goto("/en/library/issue-return", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("issue-return-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("issue-book-btn")).toBeVisible({ timeout: 30000 });
  });

  test("issue-return page has return book button", async ({ page }) => {
    await page.goto("/en/library/issue-return", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("issue-return-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("return-book-btn")).toBeVisible({ timeout: 30000 });
  });

  test("issue book dialog opens", async ({ page }) => {
    await page.goto("/en/library/issue-return", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("issue-book-btn")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("issue-book-btn").click();
    await expect(page.getByTestId("issue-book-dialog")).toBeVisible({ timeout: 30000 });
  });

  test("return book dialog opens", async ({ page }) => {
    await page.goto("/en/library/issue-return", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("return-book-btn")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("return-book-btn").click();
    await expect(page.getByTestId("return-book-dialog")).toBeVisible({ timeout: 30000 });
  });

  test("issue-return page shows data rows", async ({ page }) => {
    await page.goto("/en/library/issue-return", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("issue-return-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: 60000 });
  });

  test("issue-return page RTL (ar)", async ({ page }) => {
    await page.goto("/ar/library/issue-return", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("issue-return-manager")).toBeVisible({ timeout: 60000 });
  });
});

// ─── Library Module — Members ────────────────────────────────────────────────

test.describe("Library Module — Members", () => {
  test("members page loads (en)", async ({ page }) => {
    await page.goto("/en/library/members", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("members-manager")).toBeVisible({ timeout: 60000 });
  });

  test("members page shows member summary cards", async ({ page }) => {
    await page.goto("/en/library/members", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("members-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("member-summary-cards")).toBeVisible({ timeout: 30000 });
  });

  test("members page has add member button", async ({ page }) => {
    await page.goto("/en/library/members", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("members-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("add-member-btn")).toBeVisible({ timeout: 30000 });
  });

  test("members page shows data rows", async ({ page }) => {
    await page.goto("/en/library/members", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("members-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: 60000 });
  });

  test("member add dialog opens", async ({ page }) => {
    await page.goto("/en/library/members", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("add-member-btn")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("add-member-btn").click();
    await expect(page.getByTestId("member-form-dialog")).toBeVisible({ timeout: 30000 });
  });

  test("members page RTL (ar)", async ({ page }) => {
    await page.goto("/ar/library/members", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("members-manager")).toBeVisible({ timeout: 60000 });
  });

  test("members page RTL (ur)", async ({ page }) => {
    await page.goto("/ur/library/members", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("members-manager")).toBeVisible({ timeout: 60000 });
  });
});

// ─── Library Module — Member Detail ─────────────────────────────────────────

test.describe("Library Module — Member Detail", () => {
  test("member detail page loads (en)", async ({ page }) => {
    await page.goto("/en/library/members/library-member-001", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("member-profile-header")).toBeVisible({ timeout: 60000 });
  });

  test("member detail shows borrowing history", async ({ page }) => {
    await page.goto("/en/library/members/library-member-001", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("member-profile-header")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("member-borrowing-history")).toBeVisible({ timeout: 30000 });
  });

  test("member detail RTL (ur)", async ({ page }) => {
    await page.goto("/ur/library/members/library-member-001", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("member-profile-header")).toBeVisible({ timeout: 60000 });
  });
});

// ─── Regression — Other modules unaffected ──────────────────────────────────

test.describe("Regression — Core modules", () => {
  test("dashboard loads after library changes", async ({ page }) => {
    await page.goto("/en/dashboard", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.locator("main, [role='main'], .dashboard-content, [data-testid]").first()).toBeVisible({ timeout: 60000 });
  });

  test("students list unaffected", async ({ page }) => {
    await page.goto("/en/students", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: 60000 });
  });

  test("teachers list unaffected", async ({ page }) => {
    await page.goto("/en/teachers", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: 60000 });
  });

  test("finance transactions unaffected", async ({ page }) => {
    await page.goto("/en/finance/transactions", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.locator("[data-testid]").first()).toBeVisible({ timeout: 60000 });
  });
});
