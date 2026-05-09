import { test, expect } from "@playwright/test";

test.describe("Phase 3 App Shell — /en/dashboard", () => {
  test("/en/dashboard loads with app shell", async ({ page }) => {
    await page.goto("/en/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL("/en/dashboard");
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("/en/dashboard has sidebar on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/en/dashboard", { waitUntil: "domcontentloaded" });
    const sidebar = page.locator('[data-testid="app-sidebar"]');
    await expect(sidebar).toBeVisible();
  });

  test("/en/dashboard has topbar", async ({ page }) => {
    await page.goto("/en/dashboard", { waitUntil: "domcontentloaded" });
    const topbar = page.locator('[data-testid="app-topbar"]');
    await expect(topbar).toBeVisible();
  });

  test("/en/dashboard has main content area", async ({ page }) => {
    await page.goto("/en/dashboard", { waitUntil: "domcontentloaded" });
    const main = page.locator("#main-content");
    await expect(main).toBeVisible();
  });
});

test.describe("Phase 3 App Shell — RTL locales", () => {
  test("/ar/dashboard has dir=rtl", async ({ page }) => {
    await page.goto("/ar/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL("/ar/dashboard");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
  });

  test("/ur/dashboard has dir=rtl", async ({ page }) => {
    await page.goto("/ur/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL("/ur/dashboard");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
  });

  test("/ar/dashboard has app shell visible", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/ar/dashboard", { waitUntil: "domcontentloaded" });
    const topbar = page.locator('[data-testid="app-topbar"]');
    await expect(topbar).toBeVisible();
  });
});

test.describe("Phase 3 App Shell — dashboard sub-routes", () => {
  const subRoutes = ["student", "teacher", "parent", "lms", "university"];

  for (const sub of subRoutes) {
    test(`/en/dashboard/${sub} loads`, async ({ page }) => {
      await page.goto(`/en/dashboard/${sub}`, { waitUntil: "domcontentloaded" });
      await expect(page).toHaveURL(`/en/dashboard/${sub}`);
      await expect(page.locator("#main-content")).toBeVisible();
    });
  }
});

test.describe("Phase 3 — Phase 2 foundation still works", () => {
  test("/en foundation page still loads", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL("/en");
    // Foundation page should NOT have the app-topbar (not a dashboard page)
    await expect(page.locator('[data-testid="app-topbar"]')).not.toBeVisible();
  });
});
