import { test, expect } from "@playwright/test";

// ─── Guardians Module E2E Tests ───────────────────────────────────────────────

test.describe("Guardians Module", () => {
  // ─── List page ──────────────────────────────────────────────────────────────

  test("guardians list page loads", async ({ page }) => {
    await page.goto("/en/guardians", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("guardian-list")).toBeVisible();
  });

  test("guardian list shows Add Guardian link", async ({ page }) => {
    await page.goto("/en/guardians", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("link", { name: /add guardian/i })
    ).toBeVisible({ timeout: 30000 });
  });

  test("guardian list shows summary cards", async ({ page }) => {
    await page.goto("/en/guardians", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByText("Total Guardians", { exact: true })
    ).toBeVisible({ timeout: 30000 });
    await expect(
      page.getByText("Emergency Contacts", { exact: true })
    ).toBeVisible({ timeout: 30000 });
  });

  test("guardian list shows Tariq Khan (first guardian)", async ({ page }) => {
    await page.goto("/en/guardians", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Tariq Khan")).toBeVisible({ timeout: 30000 });
  });

  test("guardian table search filters rows", async ({ page }) => {
    await page.goto("/en/guardians", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("guardian-list")).toBeVisible();
    await expect(page.getByText("Tariq Khan")).toBeVisible({ timeout: 30000 });
    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill("Saira");
    await expect(page.getByText("Saira Ali")).toBeVisible({ timeout: 30000 });
  });

  // ─── Add guardian page ───────────────────────────────────────────────────────

  test("add guardian page loads", async ({ page }) => {
    await page.goto("/en/guardians/new", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("add-guardian-page")).toBeVisible();
  });

  test("add guardian form shows validation errors on empty submit", async ({
    page,
  }) => {
    await page.goto("/en/guardians/new", { waitUntil: "domcontentloaded" });
    // Wait for network to settle so React is fully hydrated before interacting with the form
    await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
    await expect(page.getByTestId("add-guardian-page")).toBeVisible();
    const addBtn = page.getByRole("button", { name: /add guardian/i });
    await expect(addBtn).toBeEnabled();
    await addBtn.click();
    await expect(page.getByText(/at least 2 characters/i).first()).toBeVisible({
      timeout: 30000,
    });
  });

  // ─── Detail page ─────────────────────────────────────────────────────────────

  test("guardian detail page loads", async ({ page }) => {
    await page.goto("/en/guardians/guardian-001", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("guardian-detail-page")).toBeVisible({
      timeout: 30000,
    });
  });

  test("guardian detail shows profile header", async ({ page }) => {
    await page.goto("/en/guardians/guardian-001", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("guardian-profile-header")).toBeVisible({
      timeout: 30000,
    });
  });

  test("guardian detail shows linked students tab", async ({ page }) => {
    await page.goto("/en/guardians/guardian-001", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("guardian-detail-page")).toBeVisible({
      timeout: 30000,
    });
    // Click linked students tab
    await page.getByRole("tab", { name: /linked students/i }).click();
    await expect(page.getByTestId("linked-students-section")).toBeVisible({
      timeout: 30000,
    });
  });

  test("guardian detail has back to guardians link", async ({ page }) => {
    await page.goto("/en/guardians/guardian-001", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("guardian-detail-page")).toBeVisible({
      timeout: 30000,
    });
    await expect(
      page.getByRole("link", { name: /back to guardians/i })
    ).toBeVisible({ timeout: 30000 });
  });

  // ─── Edit page ───────────────────────────────────────────────────────────────

  test("edit guardian page loads", async ({ page }) => {
    await page.goto("/en/guardians/guardian-001/edit", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("edit-guardian-page")).toBeVisible({
      timeout: 30000,
    });
  });

  test("edit guardian form is pre-populated", async ({ page }) => {
    await page.goto("/en/guardians/guardian-001/edit", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("edit-guardian-page")).toBeVisible({
      timeout: 30000,
    });
    const firstNameInput = page.getByLabel(/first name/i);
    await expect(firstNameInput).toHaveValue("Tariq", { timeout: 30000 });
  });

  // ─── RTL / i18n ──────────────────────────────────────────────────────────────

  test("Arabic guardians list page renders RTL", async ({ page }) => {
    await page.goto("/ar/guardians", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
    await expect(page.getByTestId("guardian-list")).toBeVisible({
      timeout: 30000,
    });
  });

  test("Urdu guardian detail page renders RTL", async ({ page }) => {
    await page.goto("/ur/guardians/guardian-001", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
    await expect(page.getByTestId("guardian-detail-page")).toBeVisible({
      timeout: 30000,
    });
  });

  // ─── Mobile viewport ─────────────────────────────────────────────────────────

  test("mobile viewport guardians list does not overflow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/en/guardians", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("guardian-list")).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5);
  });

  // ─── Regression — existing pages still work ──────────────────────────────────

  test("students list still works", async ({ page }) => {
    await page.goto("/en/students", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("student-list")).toBeVisible();
  });

  test("teachers list still works", async ({ page }) => {
    await page.goto("/en/teachers", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("teacher-list")).toBeVisible();
  });

  test("dashboard still works", async ({ page }) => {
    await page.goto("/en/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toBeVisible();
  });

  test("login page still works", async ({ page }) => {
    await page.goto("/en/login", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toBeVisible();
  });
});
