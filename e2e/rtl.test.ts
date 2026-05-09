import { test, expect } from "@playwright/test";

// ─── Phase 23 — RTL QA ────────────────────────────────────────────────────────
//
// Tests Arabic (/ar) and Urdu (/ur) route behavior.
// Checks:
//   - html/body has dir="rtl"
//   - main content is visible and usable
//   - no overflow / layout breakage
//   - stable data-testid elements render

const TIMEOUT = 30000;

// ─── Direction Attribute ──────────────────────────────────────────────────────

test.describe("RTL — Direction Attribute", () => {
  test("/ar/dashboard has html dir=rtl", async ({ page }) => {
    await page.goto("/ar/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: TIMEOUT });
    const dir = await page.locator("html").getAttribute("dir");
    expect(dir).toBe("rtl");
  });

  test("/ur/dashboard has html dir=rtl", async ({ page }) => {
    await page.goto("/ur/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: TIMEOUT });
    const dir = await page.locator("html").getAttribute("dir");
    expect(dir).toBe("rtl");
  });

  test("/ar/students has html dir=rtl", async ({ page }) => {
    await page.goto("/ar/students", { waitUntil: "domcontentloaded" });
    const dir = await page.locator("html").getAttribute("dir");
    expect(dir).toBe("rtl");
  });

  test("/ur/teachers has html dir=rtl", async ({ page }) => {
    await page.goto("/ur/teachers", { waitUntil: "domcontentloaded" });
    const dir = await page.locator("html").getAttribute("dir");
    expect(dir).toBe("rtl");
  });
});

// ─── Arabic Routes ────────────────────────────────────────────────────────────

test.describe("RTL — Arabic Routes", () => {
  test("/ar/students loads and main content visible", async ({ page }) => {
    await page.goto("/ar/students", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: TIMEOUT });
  });

  test("/ar/students table has rows", async ({ page }) => {
    await page.goto("/ar/students", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("student-list")).toBeVisible({ timeout: TIMEOUT });
    // At least one data row visible
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: TIMEOUT });
  });

  test("/ar/fees/collect loads and main content visible", async ({ page }) => {
    await page.goto("/ar/fees/collect", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: TIMEOUT });
  });

  test("/ar/finance/transactions loads and main content visible", async ({ page }) => {
    await page.goto("/ar/finance/transactions", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: TIMEOUT });
  });

  test("/ar/communication/messages loads and main content visible", async ({ page }) => {
    await page.goto("/ar/communication/messages", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: TIMEOUT });
  });

  test("/ar/certificates loads and main content visible", async ({ page }) => {
    await page.goto("/ar/certificates", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: TIMEOUT });
  });

  test("/ar/settings/general loads and form visible", async ({ page }) => {
    await page.goto("/ar/settings/general", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("general-settings-manager")).toBeVisible({ timeout: TIMEOUT });
    const dir = await page.locator("html").getAttribute("dir");
    expect(dir).toBe("rtl");
  });
});

// ─── Urdu Routes ──────────────────────────────────────────────────────────────

test.describe("RTL — Urdu Routes", () => {
  test("/ur/teachers loads and main content visible", async ({ page }) => {
    await page.goto("/ur/teachers", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: TIMEOUT });
  });

  test("/ur/teachers table has rows", async ({ page }) => {
    await page.goto("/ur/teachers", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: TIMEOUT });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: TIMEOUT });
  });

  test("/ur/finance/transactions loads and main content visible", async ({ page }) => {
    await page.goto("/ur/finance/transactions", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: TIMEOUT });
  });

  test("/ur/certificates loads and main content visible", async ({ page }) => {
    await page.goto("/ur/certificates", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: TIMEOUT });
  });

  test("/ur/settings/subscription loads and plan cards visible", async ({ page }) => {
    await page.goto("/ur/settings/subscription", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("subscription-manager")).toBeVisible({ timeout: TIMEOUT });
    const dir = await page.locator("html").getAttribute("dir");
    expect(dir).toBe("rtl");
  });
});

// ─── RTL Layout Integrity ─────────────────────────────────────────────────────

test.describe("RTL — Layout Integrity", () => {
  test("/ar/dashboard topbar is visible", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/ar/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-testid='app-topbar']")).toBeVisible({ timeout: TIMEOUT });
  });

  test("/ar/dashboard sidebar is visible on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/ar/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-testid='app-sidebar']")).toBeVisible({ timeout: TIMEOUT });
  });

  test("/ur/dashboard sidebar is visible on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/ur/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-testid='app-sidebar']")).toBeVisible({ timeout: TIMEOUT });
  });
});
