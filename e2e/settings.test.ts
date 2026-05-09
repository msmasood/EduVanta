import { test, expect } from "@playwright/test";

// ─── Settings Module E2E Tests — Phase 22 ─────────────────────────────────────

// ─── General Settings ─────────────────────────────────────────────────────────

test.describe("Settings — General", () => {
  // These are the first routes compiled in dev mode — allow extra time for cold start.
  test("general settings page loads (en)", async ({ page }) => {
    await page.goto("/en/settings/general", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("general-settings-manager")).toBeVisible({ timeout: 60000 });
  });

  test("general settings form is visible", async ({ page }) => {
    await page.goto("/en/settings/general", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("general-settings-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("general-settings-form")).toBeVisible({ timeout: 60000 });
  });

  test("general settings page loads (ar RTL)", async ({ page }) => {
    await page.goto("/ar/settings/general", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("general-settings-manager")).toBeVisible({ timeout: 60000 });
  });
});

// ─── Languages ────────────────────────────────────────────────────────────────

test.describe("Settings — Languages", () => {
  test("languages page loads (en)", async ({ page }) => {
    await page.goto("/en/settings/languages", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("languages-manager")).toBeVisible({ timeout: 60000 });
  });

  test("languages page shows add button", async ({ page }) => {
    await page.goto("/en/settings/languages", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("languages-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("add-language-btn")).toBeVisible({ timeout: 30000 });
  });

  test("languages page shows data table with rows", async ({ page }) => {
    await page.goto("/en/settings/languages", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("languages-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: 30000 });
  });

  test("click add language opens dialog", async ({ page }) => {
    await page.goto("/en/settings/languages", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("add-language-btn")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("add-language-btn").click();
    await expect(page.getByTestId("language-form-dialog")).toBeVisible({ timeout: 30000 });
  });

  test("language form dialog has form", async ({ page }) => {
    await page.goto("/en/settings/languages", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("add-language-btn")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("add-language-btn").click();
    await expect(page.getByTestId("language-form")).toBeVisible({ timeout: 30000 });
  });
});

// ─── Currencies ───────────────────────────────────────────────────────────────

test.describe("Settings — Currencies", () => {
  test("currencies page loads (en)", async ({ page }) => {
    await page.goto("/en/settings/currencies", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("currencies-manager")).toBeVisible({ timeout: 60000 });
  });

  test("currencies page shows add button", async ({ page }) => {
    await page.goto("/en/settings/currencies", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("currencies-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("add-currency-btn")).toBeVisible({ timeout: 30000 });
  });

  test("currencies page shows data table with rows", async ({ page }) => {
    await page.goto("/en/settings/currencies", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("currencies-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: 30000 });
  });

  test("click add currency opens dialog", async ({ page }) => {
    await page.goto("/en/settings/currencies", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("add-currency-btn")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("add-currency-btn").click();
    await expect(page.getByTestId("currency-form-dialog")).toBeVisible({ timeout: 30000 });
  });

  test("currency form dialog has form", async ({ page }) => {
    await page.goto("/en/settings/currencies", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("add-currency-btn")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("add-currency-btn").click();
    await expect(page.getByTestId("currency-form")).toBeVisible({ timeout: 30000 });
  });
});

// ─── Roles ────────────────────────────────────────────────────────────────────

test.describe("Settings — Roles", () => {
  test("roles page loads (en)", async ({ page }) => {
    await page.goto("/en/settings/roles", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("roles-manager")).toBeVisible({ timeout: 60000 });
  });

  test("roles page shows add button", async ({ page }) => {
    await page.goto("/en/settings/roles", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("roles-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("add-role-btn")).toBeVisible({ timeout: 30000 });
  });

  test("roles page shows data table with rows", async ({ page }) => {
    await page.goto("/en/settings/roles", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("roles-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: 30000 });
  });

  test("click add role opens dialog", async ({ page }) => {
    await page.goto("/en/settings/roles", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("add-role-btn")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("add-role-btn").click();
    await expect(page.getByTestId("role-form-dialog")).toBeVisible({ timeout: 30000 });
  });

  test("role form dialog has form", async ({ page }) => {
    await page.goto("/en/settings/roles", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("add-role-btn")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("add-role-btn").click();
    await expect(page.getByTestId("role-form")).toBeVisible({ timeout: 30000 });
  });

  test("roles page loads (ar RTL)", async ({ page }) => {
    await page.goto("/ar/settings/roles", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("roles-manager")).toBeVisible({ timeout: 60000 });
  });
});

// ─── Assign Roles ─────────────────────────────────────────────────────────────

test.describe("Settings — Assign Roles", () => {
  test("assign roles page loads (en)", async ({ page }) => {
    await page.goto("/en/settings/assign-roles", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("assign-roles-manager")).toBeVisible({ timeout: 60000 });
  });

  test("assign roles page shows assign button", async ({ page }) => {
    await page.goto("/en/settings/assign-roles", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("assign-roles-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("assign-role-btn")).toBeVisible({ timeout: 30000 });
  });

  test("assign roles page shows data table with rows", async ({ page }) => {
    await page.goto("/en/settings/assign-roles", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("assign-roles-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: 30000 });
  });

  test("click assign role opens dialog", async ({ page }) => {
    await page.goto("/en/settings/assign-roles", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("assign-role-btn")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("assign-role-btn").click();
    await expect(page.getByTestId("assign-role-dialog")).toBeVisible({ timeout: 30000 });
  });

  test("assign role dialog has form", async ({ page }) => {
    await page.goto("/en/settings/assign-roles", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("assign-role-btn")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("assign-role-btn").click();
    await expect(page.getByTestId("assign-role-form")).toBeVisible({ timeout: 30000 });
  });
});

// ─── Subscription ─────────────────────────────────────────────────────────────

test.describe("Settings — Subscription", () => {
  test("subscription page loads (en)", async ({ page }) => {
    await page.goto("/en/settings/subscription", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("subscription-manager")).toBeVisible({ timeout: 60000 });
  });

  test("subscription page shows usage card", async ({ page }) => {
    await page.goto("/en/settings/subscription", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("subscription-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("subscription-usage-card")).toBeVisible({ timeout: 30000 });
  });

  test("subscription page shows plan cards", async ({ page }) => {
    await page.goto("/en/settings/subscription", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("subscription-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("subscription-plan-cards")).toBeVisible({ timeout: 30000 });
  });

  test("subscription page shows billing history", async ({ page }) => {
    await page.goto("/en/settings/subscription", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("subscription-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("subscription-billing-history")).toBeVisible({ timeout: 30000 });
  });

  test("subscription page shows billing cycle toggle", async ({ page }) => {
    await page.goto("/en/settings/subscription", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("subscription-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("billing-cycle-toggle")).toBeVisible({ timeout: 30000 });
  });

  test("subscription page shows individual plan cards", async ({ page }) => {
    await page.goto("/en/settings/subscription", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("subscription-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("subscription-plan-cards")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("subscription-plan-card").first()).toBeVisible({ timeout: 30000 });
  });

  test("subscription page loads (ar RTL)", async ({ page }) => {
    await page.goto("/ar/settings/subscription", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("subscription-manager")).toBeVisible({ timeout: 60000 });
  });
});

// ─── Smoke tests — regression checks from prior phases ────────────────────────

test.describe("Regression Smoke Tests", () => {
  test("certificates page still loads", async ({ page }) => {
    await page.goto("/en/certificates", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("certificates-manager")).toBeVisible({ timeout: 60000 });
  });

  test("students page still loads", async ({ page }) => {
    await page.goto("/en/students", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("student-list")).toBeVisible({ timeout: 60000 });
  });

  test("teachers page still loads", async ({ page }) => {
    await page.goto("/en/teachers", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("teacher-list")).toBeVisible({ timeout: 60000 });
  });
});
