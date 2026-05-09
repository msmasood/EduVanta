import { test, expect } from "@playwright/test";

// ─── Phase 23 — Responsive QA ─────────────────────────────────────────────────
//
// Tests representative pages at mobile (375×812), tablet (768×1024), and
// desktop (1440×900). Checks:
//   - page loads and main content is visible
//   - no horizontal overflow beyond a small tolerance (< 5 px)
//   - primary data/UI element is visible

const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 },
};

const TIMEOUT = 30000;

// Pages to test: [route, testId or selector to assert visible]
const PAGES: Array<{ route: string; selector: string }> = [
  { route: "/en", selector: "h1" },
  { route: "/en/login", selector: "body" },
  { route: "/en/dashboard", selector: "#main-content" },
  { route: "/en/students", selector: "[data-testid='student-list']" },
  { route: "/en/teachers", selector: "#main-content" },
  { route: "/en/employees", selector: "#main-content" },
  { route: "/en/fees/collect", selector: "#main-content" },
  { route: "/en/finance/transactions", selector: "#main-content" },
  { route: "/en/library/books", selector: "#main-content" },
  { route: "/en/communication/messages", selector: "#main-content" },
  { route: "/en/certificates", selector: "#main-content" },
  { route: "/en/settings/roles", selector: "[data-testid='roles-manager']" },
  { route: "/en/settings/subscription", selector: "[data-testid='subscription-manager']" },
];

// Helper: check that body scroll width does not exceed viewport width
async function assertNoHorizontalOverflow(
  page: import("@playwright/test").Page,
  tolerancePx = 5
) {
  const overflow = await page.evaluate(() => {
    return document.body.scrollWidth - window.innerWidth;
  });
  expect(overflow, `Horizontal overflow: ${overflow}px`).toBeLessThanOrEqual(tolerancePx);
}

// ─── Mobile ───────────────────────────────────────────────────────────────────

test.describe("Responsive — Mobile (375px)", () => {
  for (const { route, selector } of PAGES) {
    test(`${route} loads on mobile`, async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const el = selector === "h1"
        ? page.locator("h1").first()
        : page.locator(selector).first();
      await expect(el).toBeVisible({ timeout: TIMEOUT });
      await assertNoHorizontalOverflow(page);
    });
  }
});

// ─── Tablet ────────────────────────────────────────────────────────────────────

test.describe("Responsive — Tablet (768px)", () => {
  for (const { route, selector } of PAGES) {
    test(`${route} loads on tablet`, async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const el = selector === "h1"
        ? page.locator("h1").first()
        : page.locator(selector).first();
      await expect(el).toBeVisible({ timeout: TIMEOUT });
      await assertNoHorizontalOverflow(page);
    });
  }
});

// ─── Desktop ───────────────────────────────────────────────────────────────────

test.describe("Responsive — Desktop (1440px)", () => {
  for (const { route, selector } of PAGES) {
    test(`${route} loads on desktop`, async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const el = selector === "h1"
        ? page.locator("h1").first()
        : page.locator(selector).first();
      await expect(el).toBeVisible({ timeout: TIMEOUT });
      await assertNoHorizontalOverflow(page);
    });
  }
});

// ─── Mobile sidebar behavior ───────────────────────────────────────────────────

test.describe("Responsive — Mobile sidebar", () => {
  test("dashboard sidebar is not layout-breaking on mobile", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto("/en/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: TIMEOUT });
    // The topbar should be visible on mobile
    const topbar = page.locator("[data-testid='app-topbar']");
    await expect(topbar).toBeVisible({ timeout: TIMEOUT });
    await assertNoHorizontalOverflow(page);
  });

  test("student list tables scroll on mobile without breaking viewport", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto("/en/students", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("student-list")).toBeVisible({ timeout: TIMEOUT });
    await assertNoHorizontalOverflow(page);
  });
});
