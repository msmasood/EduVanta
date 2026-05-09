import { test, expect } from "@playwright/test";

test.describe("Phase 2 Foundation Smoke Tests", () => {
  test("/ redirects to /en", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/en/);
  });

  test("/en loads and shows app content", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL("/en");
    // Page should contain something meaningful — not a 404
    await expect(page.locator("body")).not.toBeEmpty();
    await expect(page.locator("h1")).toBeVisible();
  });

  test("/ar loads (Arabic RTL locale)", async ({ page }) => {
    await page.goto("/ar", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL("/ar");
    await expect(page.locator("body")).not.toBeEmpty();
    // HTML element should have dir="rtl"
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
  });

  test("/ur loads (Urdu RTL locale)", async ({ page }) => {
    await page.goto("/ur", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL("/ur");
    await expect(page.locator("body")).not.toBeEmpty();
    // HTML element should have dir="rtl"
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
  });

  test("/en has lang=en attribute", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "en");
  });

  test("/ar has lang=ar attribute", async ({ page }) => {
    await page.goto("/ar", { waitUntil: "domcontentloaded" });
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "ar");
  });
});
