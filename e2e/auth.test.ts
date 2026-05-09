import { test, expect } from "@playwright/test";

// ─── Login page ───────────────────────────────────────────────────────────────

test.describe("Phase 5 Auth — Login page", () => {
  test("/en/login loads the login form", async ({ page }) => {
    await page.goto("/en/login", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("/ar/login loads with RTL direction", async ({ page }) => {
    await page.goto("/ar/login", { waitUntil: "domcontentloaded" });
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("/ur/login loads with RTL direction", async ({ page }) => {
    await page.goto("/ur/login", { waitUntil: "domcontentloaded" });
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("login page shows demo role buttons", async ({ page }) => {
    await page.goto("/en/login", { waitUntil: "domcontentloaded" });
    // Wait for page to be ready
    await page.waitForLoadState("networkidle");
    const buttons = page.locator("button").filter({ hasText: /Admin|Teacher|Student/i });
    await expect(buttons.first()).toBeVisible();
  });

  test("login page has show/hide password toggle", async ({ page }) => {
    await page.goto("/en/login", { waitUntil: "domcontentloaded" });
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    // Click the eye toggle
    // Check by aria-label presence
    await expect(page.locator('button[aria-label*="assword"]')).toBeVisible();
  });

  test("login form shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/en/login", { waitUntil: "domcontentloaded" });
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('[role="alert"]').first()).toBeVisible();
  });

  test("login form pre-fills credentials on demo role click", async ({ page }) => {
    await page.goto("/en/login", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");
    // Click the first demo role button
    const adminBtn = page.getByRole("button", { name: /Admin/i }).first();
    await adminBtn.click();
    const emailInput = page.locator('input[type="email"]');
    const emailValue = await emailInput.inputValue();
    expect(emailValue).toContain("@demo.eduvanta.com");
  });
});

// ─── Register page ────────────────────────────────────────────────────────────

test.describe("Phase 5 Auth — Register page", () => {
  test("/en/register loads the register form", async ({ page }) => {
    await page.goto("/en/register", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('input[autocomplete="email"]')).toBeVisible();
  });

  test("/ar/register loads with RTL direction", async ({ page }) => {
    await page.goto("/ar/register", { waitUntil: "domcontentloaded" });
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("register form shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/en/register", { waitUntil: "domcontentloaded" });
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('[role="alert"]').first()).toBeVisible();
  });

  test("register form has terms checkbox", async ({ page }) => {
    await page.goto("/en/register", { waitUntil: "domcontentloaded" });
    const checkbox = page.locator('[data-slot="checkbox"]').first();
    await expect(checkbox).toBeVisible();
  });
});

// ─── Forgot password page ─────────────────────────────────────────────────────

test.describe("Phase 5 Auth — Forgot password page", () => {
  test("/en/forgot-password loads the forgot password form", async ({ page }) => {
    await page.goto("/en/forgot-password", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test("/ar/forgot-password loads with RTL direction", async ({ page }) => {
    await page.goto("/ar/forgot-password", { waitUntil: "domcontentloaded" });
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("forgot password shows success state after submit", async ({ page }) => {
    await page.goto("/en/forgot-password", { waitUntil: "domcontentloaded" });
    await page.locator('input[type="email"]').fill("user@school.com");
    await page.locator('button[type="submit"]').click();
    // Success state — check for back to login link
    await expect(page.locator("a[href*='login']")).toBeVisible({ timeout: 30000 });
  });
});

// ─── Reset password page ──────────────────────────────────────────────────────

test.describe("Phase 5 Auth — Reset password page", () => {
  test("/en/reset-password loads the reset password form", async ({ page }) => {
    await page.goto("/en/reset-password", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toBeVisible();
    // Should have two password fields
    const passwordInputs = page.locator('input[type="password"]');
    await expect(passwordInputs).toHaveCount(2);
  });

  test("/ar/reset-password loads with RTL direction", async ({ page }) => {
    await page.goto("/ar/reset-password", { waitUntil: "domcontentloaded" });
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("reset password form shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/en/reset-password", { waitUntil: "domcontentloaded" });
    // Wait for both password inputs to be visible (confirms form is rendered and reactive)
    // Note: do NOT use waitForLoadState("networkidle") — HMR WebSocket in dev mode
    // causes networkidle to resolve at an inconsistent point relative to React hydration
    // in Firefox, leading to native form submit before react-hook-form attaches.
    const passwordInputs = page.locator('input[type="password"]');
    await expect(passwordInputs).toHaveCount(2);
    await expect(passwordInputs.first()).toBeVisible();
    // Submit the empty form — react-hook-form validates and shows errors
    await page.locator('button[type="submit"]').click();
    // At least one validation error (passwordMin for empty password field) should appear
    await expect(page.locator('[role="alert"]').first()).toBeVisible({ timeout: 30000 });
  });
});

// ─── Auth layout shell ────────────────────────────────────────────────────────

test.describe("Phase 5 Auth — Layout shell", () => {
  test("auth pages have locale switcher in header", async ({ page }) => {
    await page.goto("/en/login", { waitUntil: "domcontentloaded" });
    // The locale switcher trigger should be visible
    await expect(page.locator('[data-slot="select-trigger"]').first()).toBeVisible();
  });

  test("auth pages have navigation header", async ({ page }) => {
    await page.goto("/en/login", { waitUntil: "domcontentloaded" });
    await expect(page.locator("header")).toBeVisible();
  });
});
