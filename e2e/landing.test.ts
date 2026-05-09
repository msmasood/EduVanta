import { test, expect } from "@playwright/test";

test.describe("Phase 4 Landing Page — basic load", () => {
  test("/en loads the landing page with marketing navbar", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL("/en");
    const navbar = page.locator('[data-testid="marketing-navbar"]');
    await expect(navbar).toBeVisible();
  });

  test("/ar loads the landing page with marketing navbar", async ({ page }) => {
    await page.goto("/ar", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL("/ar");
    const navbar = page.locator('[data-testid="marketing-navbar"]');
    await expect(navbar).toBeVisible();
  });

  test("/ur loads the landing page with marketing navbar", async ({ page }) => {
    await page.goto("/ur", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL("/ur");
    const navbar = page.locator('[data-testid="marketing-navbar"]');
    await expect(navbar).toBeVisible();
  });
});

test.describe("Phase 4 Landing Page — RTL support", () => {
  test("/ar has dir=rtl on html element", async ({ page }) => {
    await page.goto("/ar", { waitUntil: "domcontentloaded" });
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
  });

  test("/ur has dir=rtl on html element", async ({ page }) => {
    await page.goto("/ur", { waitUntil: "domcontentloaded" });
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
  });

  test("/en has dir=ltr on html element", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "ltr");
  });
});

test.describe("Phase 4 Landing Page — brand and content", () => {
  test("navbar shows EduVanta brand name", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    const navbar = page.locator('[data-testid="marketing-navbar"]');
    await expect(navbar).toContainText("EduVanta");
  });

  test("hero section is visible", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main")).toBeVisible();
  });

  test("landing page does not show the app topbar (not a dashboard)", async ({
    page,
  }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    const topbar = page.locator('[data-testid="app-topbar"]');
    await expect(topbar).not.toBeVisible();
  });
});

test.describe("Phase 4 Landing Page — CTA navigation", () => {
  test("hero secondary CTA links to /en/dashboard", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    // Find anchor that points to the dashboard
    const dashboardLink = page.locator('a[href*="/en/dashboard"]').first();
    await expect(dashboardLink).toBeVisible();
  });
});

test.describe("Phase 4 — dashboard routes still work", () => {
  test("/en/dashboard still loads with app shell", async ({ page }) => {
    await page.goto("/en/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL("/en/dashboard");
    await expect(page.locator('[data-testid="app-topbar"]')).toBeVisible();
  });

  test("/ar/dashboard still loads with RTL app shell", async ({ page }) => {
    await page.goto("/ar/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL("/ar/dashboard");
    await expect(page.locator('[data-testid="app-topbar"]')).toBeVisible();
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
  });
});
