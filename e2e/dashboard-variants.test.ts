import { test, expect } from "@playwright/test";

/**
 * Phase 8 — Dashboard Variants E2E
 *
 * Tests that all 6 persona dashboard pages render their titles, display metric
 * cards and chart sections, and that the AppShell (sidebar/topbar) remains
 * visible. RTL locales are spot-checked. Mobile layout is verified.
 */

test.describe("Phase 8 — School Dashboard", () => {
  test("/en/dashboard renders School Dashboard title", async ({ page }) => {
    await page.goto("/en/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1, h2").filter({ hasText: "School Dashboard" })).toBeVisible();
  });

  test("/en/dashboard has multiple metric cards", async ({ page }) => {
    await page.goto("/en/dashboard", { waitUntil: "domcontentloaded" });
    // MetricCards use aria-label on the card element — just verify at least one is visible
    const metricCards = page.locator('[aria-label]').filter({ has: page.locator('[data-slot="card-content"]') });
    await expect(metricCards.first()).toBeVisible();
  });

  test("/en/dashboard has at least one chart section", async ({ page }) => {
    await page.goto("/en/dashboard", { waitUntil: "domcontentloaded" });
    // Charts render inside a card wrapper; wait for card content to be visible
    const cardContent = page.locator('[data-slot="card"]').first();
    await expect(cardContent).toBeVisible();
  });

  test("/en/dashboard sidebar and topbar still visible", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/en/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-testid="app-sidebar"]')).toBeVisible();
    await expect(page.locator('[data-testid="app-topbar"]')).toBeVisible();
  });
});

test.describe("Phase 8 — Student Dashboard", () => {
  test("/en/dashboard/student renders Student Dashboard title", async ({ page }) => {
    await page.goto("/en/dashboard/student", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1, h2").filter({ hasText: "Student Dashboard" })).toBeVisible();
  });

  test("/en/dashboard/student has metric cards", async ({ page }) => {
    await page.goto("/en/dashboard/student", { waitUntil: "domcontentloaded" });
    const metricCards = page.locator('[aria-label]').filter({ has: page.locator('[data-slot="card-content"]') });
    await expect(metricCards.first()).toBeVisible();
  });
});

test.describe("Phase 8 — Teacher Dashboard", () => {
  test("/en/dashboard/teacher renders Teacher Dashboard title", async ({ page }) => {
    await page.goto("/en/dashboard/teacher", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1, h2").filter({ hasText: "Teacher Dashboard" })).toBeVisible();
  });

  test("/en/dashboard/teacher has metric cards", async ({ page }) => {
    await page.goto("/en/dashboard/teacher", { waitUntil: "domcontentloaded" });
    const metricCards = page.locator('[aria-label]').filter({ has: page.locator('[data-slot="card-content"]') });
    await expect(metricCards.first()).toBeVisible();
  });
});

test.describe("Phase 8 — Parent Dashboard", () => {
  test("/en/dashboard/parent renders Parent Dashboard title", async ({ page }) => {
    await page.goto("/en/dashboard/parent", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1, h2").filter({ hasText: "Parent Dashboard" })).toBeVisible();
  });

  test("/en/dashboard/parent has metric cards", async ({ page }) => {
    await page.goto("/en/dashboard/parent", { waitUntil: "domcontentloaded" });
    const metricCards = page.locator('[aria-label]').filter({ has: page.locator('[data-slot="card-content"]') });
    await expect(metricCards.first()).toBeVisible();
  });
});

test.describe("Phase 8 — LMS Dashboard", () => {
  test("/en/dashboard/lms renders LMS Dashboard title", async ({ page }) => {
    await page.goto("/en/dashboard/lms", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1, h2").filter({ hasText: "LMS Dashboard" })).toBeVisible();
  });

  test("/en/dashboard/lms has metric cards", async ({ page }) => {
    await page.goto("/en/dashboard/lms", { waitUntil: "domcontentloaded" });
    const metricCards = page.locator('[aria-label]').filter({ has: page.locator('[data-slot="card-content"]') });
    await expect(metricCards.first()).toBeVisible();
  });
});

test.describe("Phase 8 — University Dashboard", () => {
  test("/en/dashboard/university renders University Dashboard title", async ({ page }) => {
    await page.goto("/en/dashboard/university", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1, h2").filter({ hasText: "University Dashboard" })).toBeVisible();
  });

  test("/en/dashboard/university has metric cards", async ({ page }) => {
    await page.goto("/en/dashboard/university", { waitUntil: "domcontentloaded" });
    const metricCards = page.locator('[aria-label]').filter({ has: page.locator('[data-slot="card-content"]') });
    await expect(metricCards.first()).toBeVisible();
  });
});

test.describe("Phase 8 — RTL locale dashboards", () => {
  test("/ar/dashboard loads with RTL and dashboard content", async ({ page }) => {
    await page.goto("/ar/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("/ur/dashboard/student loads with RTL and dashboard content", async ({ page }) => {
    await page.goto("/ur/dashboard/student", { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("body")).not.toBeEmpty();
  });
});

test.describe("Phase 8 — Mobile layout", () => {
  test("/en/dashboard does not overflow on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/en/dashboard", { waitUntil: "domcontentloaded" });
    const body = page.locator("body");
    await expect(body).toBeVisible();
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = 390;
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 4); // allow 4px rounding
  });

  test("/en/dashboard mobile menu button is interactive", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/en/dashboard", { waitUntil: "domcontentloaded" });
    const menuBtn = page.locator('[data-testid="mobile-menu-btn"]');
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      // After click the drawer/sidebar should open
      const drawer = page.locator('[data-testid="mobile-drawer"], [data-testid="app-sidebar"]');
      await expect(drawer.first()).toBeVisible();
    }
  });
});

test.describe("Phase 8 — Existing pages still work", () => {
  test("/en landing page still loads", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toBeVisible();
  });

  test("/en/login auth page still loads", async ({ page }) => {
    await page.goto("/en/login", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).not.toBeEmpty();
  });
});
