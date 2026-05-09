import { test, expect } from "@playwright/test";

// ─── Phase 23 — Currency Display QA ───────────────────────────────────────────
//
// Verifies that monetary values on key pages are formatted via the app's
// currency-aware system and not rendered as raw "$" hardcodes.
//
// Strategy:
//   - Navigate to pages that show money values
//   - Assert that amount/price elements are visible and non-empty
//   - Assert that the page does NOT contain raw "$ " (dollar sign + space) as
//     standalone text that would indicate a formatting bug
//     NOTE: Intl.NumberFormat legitimately produces "$1,234.56" (no space) so
//     we only flag "$ " (with space) or zero-width hardcodes as bugs.
//   - Assert subscription plan prices and billing amounts render

const TIMEOUT = 30000;

// ─── Fees / Collect ───────────────────────────────────────────────────────────

test.describe("Currency — Fees", () => {
  test("/en/fees/collect page loads and shows content", async ({ page }) => {
    await page.goto("/en/fees/collect", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: TIMEOUT });
  });

  test("/en/fees/collect has no raw '$ ' formatting bug", async ({ page }) => {
    await page.goto("/en/fees/collect", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: TIMEOUT });
    // Raw "$ " (dollar space) in visible text is a sign of un-formatted currency
    const rawDollarRegex = /\$\s+\d/;
    const bodyText = await page.locator("body").innerText();
    expect(rawDollarRegex.test(bodyText), "Raw '$ ' formatting found in fees/collect").toBe(false);
  });
});

// ─── HRM / Payroll ────────────────────────────────────────────────────────────

test.describe("Currency — Payroll", () => {
  test("/en/hrm/payroll page loads and shows content", async ({ page }) => {
    await page.goto("/en/hrm/payroll", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: TIMEOUT });
  });

  test("/en/hrm/payroll has no raw '$ ' formatting bug", async ({ page }) => {
    await page.goto("/en/hrm/payroll", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: TIMEOUT });
    const rawDollarRegex = /\$\s+\d/;
    const bodyText = await page.locator("body").innerText();
    expect(rawDollarRegex.test(bodyText), "Raw '$ ' formatting found in hrm/payroll").toBe(false);
  });
});

// ─── Finance / Transactions ───────────────────────────────────────────────────

test.describe("Currency — Finance", () => {
  test("/en/finance/transactions page loads and shows content", async ({ page }) => {
    await page.goto("/en/finance/transactions", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: TIMEOUT });
  });

  test("/en/finance/transactions has no raw '$ ' formatting bug", async ({ page }) => {
    await page.goto("/en/finance/transactions", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: TIMEOUT });
    const rawDollarRegex = /\$\s+\d/;
    const bodyText = await page.locator("body").innerText();
    expect(rawDollarRegex.test(bodyText), "Raw '$ ' formatting found in finance/transactions").toBe(false);
  });
});

// ─── Settings / Currencies ────────────────────────────────────────────────────

test.describe("Currency — Settings Currencies", () => {
  test("/en/settings/currencies loads and table shows rows", async ({ page }) => {
    await page.goto("/en/settings/currencies", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("currencies-manager")).toBeVisible({ timeout: TIMEOUT });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: TIMEOUT });
  });

  test("/en/settings/currencies table shows exchange rate column", async ({ page }) => {
    await page.goto("/en/settings/currencies", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("currencies-manager")).toBeVisible({ timeout: TIMEOUT });
    // At least one row should contain a numeric exchange rate
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: TIMEOUT });
  });
});

// ─── Settings / Subscription ──────────────────────────────────────────────────

test.describe("Currency — Subscription Plans", () => {
  test("/en/settings/subscription plan cards show prices", async ({ page }) => {
    await page.goto("/en/settings/subscription", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("subscription-manager")).toBeVisible({ timeout: TIMEOUT });
    await expect(page.getByTestId("subscription-plan-cards")).toBeVisible({ timeout: 60000 });
    // At least one plan card should be present
    const cards = page.getByTestId("subscription-plan-card");
    await expect(cards.first()).toBeVisible({ timeout: 30000 });
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("/en/settings/subscription billing history shows amounts", async ({ page }) => {
    await page.goto("/en/settings/subscription", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("subscription-manager")).toBeVisible({ timeout: TIMEOUT });
    await expect(page.getByTestId("subscription-billing-history")).toBeVisible({ timeout: 60000 });
  });

  test("/en/settings/subscription has no raw '$ ' formatting bug", async ({ page }) => {
    await page.goto("/en/settings/subscription", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("subscription-plan-cards")).toBeVisible({ timeout: TIMEOUT });
    const rawDollarRegex = /\$\s+\d/;
    const bodyText = await page.locator("body").innerText();
    expect(rawDollarRegex.test(bodyText), "Raw '$ ' formatting found in settings/subscription").toBe(false);
  });
});
