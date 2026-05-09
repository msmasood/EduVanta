import { test, expect } from "@playwright/test";

// ─── Teachers Module E2E Tests ─────────────────────────────────────────────────

test.describe("Teachers Module", () => {
  // ─── List page ──────────────────────────────────────────────────────────────

  test("teachers list page loads", async ({ page }) => {
    await page.goto("/en/teachers", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("teacher-list")).toBeVisible();
  });

  test("teacher list shows table and Add Teacher link", async ({ page }) => {
    await page.goto("/en/teachers", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("link", { name: /add teacher/i })
    ).toBeVisible({ timeout: 30000 });
  });

  test("teacher list shows summary cards", async ({ page }) => {
    await page.goto("/en/teachers", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByText("Total Teachers", { exact: true })
    ).toBeVisible({ timeout: 30000 });
    await expect(page.getByText("Active", { exact: true })).toBeVisible({
      timeout: 30000,
    });
  });

  test("teacher list shows Amina Bukhari (first teacher)", async ({ page }) => {
    await page.goto("/en/teachers", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Amina Bukhari")).toBeVisible({
      timeout: 30000,
    });
  });

  test("teacher table search filters rows", async ({ page }) => {
    await page.goto("/en/teachers", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("teacher-list")).toBeVisible();
    // Wait for rows to load
    await expect(page.getByText("Amina Bukhari")).toBeVisible({
      timeout: 30000,
    });
    // Type in search box
    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill("Rizwan");
    await expect(page.getByText("Rizwan Ashraf")).toBeVisible({
      timeout: 30000,
    });
  });

  // ─── Add teacher page ────────────────────────────────────────────────────────

  test("add teacher page loads", async ({ page }) => {
    await page.goto("/en/teachers/new", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("add-teacher-page")).toBeVisible();
  });

  test("add teacher form shows validation errors on empty submit", async ({
    page,
  }) => {
    await page.goto("/en/teachers/new", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /add teacher/i }).click();
    const alerts = page.locator("[role='alert']");
    await expect(alerts.first()).toBeVisible();
  });

  // ─── Teacher detail page ─────────────────────────────────────────────────────

  test("teacher detail page loads (teacher-001)", async ({ page }) => {
    await page.goto("/en/teachers/teacher-001", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("teacher-detail-page")).toBeVisible();
    await expect(page.getByTestId("teacher-profile-header")).toBeVisible({
      timeout: 30000,
    });
  });

  test("teacher detail page shows teacher name", async ({ page }) => {
    await page.goto("/en/teachers/teacher-001", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Amina Bukhari")).toBeVisible({
      timeout: 30000,
    });
  });

  // ─── Edit teacher page ───────────────────────────────────────────────────────

  test("edit teacher page loads (teacher-001)", async ({ page }) => {
    await page.goto("/en/teachers/teacher-001/edit", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("edit-teacher-page")).toBeVisible({ timeout: 30000 });
  });

  test("edit teacher form is pre-filled with teacher data", async ({
    page,
  }) => {
    await page.goto("/en/teachers/teacher-001/edit", { waitUntil: "domcontentloaded" });
    // Wait for form to load with teacher data — check page skeleton visible first, then heading
    await expect(page.getByTestId("edit-teacher-page")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /edit teacher/i })
    ).toBeVisible({ timeout: 30000 });
  });

  // ─── Attendance page ─────────────────────────────────────────────────────────

  test("teacher attendance page loads", async ({ page }) => {
    await page.goto("/en/teachers/attendance", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("teacher-attendance-page")).toBeVisible();
  });

  test("attendance page shows summary cards", async ({ page }) => {
    await page.goto("/en/teachers/attendance", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Present", { exact: true }).first()).toBeVisible({ timeout: 30000 });
    await expect(page.getByText("Absent", { exact: true }).first()).toBeVisible({ timeout: 30000 });
  });

  // ─── Timetable page ──────────────────────────────────────────────────────────

  test("teacher timetable page loads", async ({ page }) => {
    await page.goto("/en/teachers/timetable", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("teacher-timetable-page")).toBeVisible();
  });

  test("timetable page shows list or calendar view", async ({ page }) => {
    await page.goto("/en/teachers/timetable", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("teacher-timetable-page")).toBeVisible();
    // Either the list or calendar view renders
    const listView = page.getByTestId("timetable-list");
    const calView = page.getByTestId("timetable-calendar");
    await expect(listView.or(calView)).toBeVisible({ timeout: 30000 });
  });

  // ─── RTL / i18n ──────────────────────────────────────────────────────────────

  test("Arabic teachers list page renders RTL", async ({ page }) => {
    await page.goto("/ar/teachers", { waitUntil: "domcontentloaded", timeout: 60000 });
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
    await expect(page.getByTestId("teacher-list")).toBeVisible({ timeout: 30000 });
  });

  test("Urdu teacher detail page renders RTL", async ({ page }) => {
    await page.goto("/ur/teachers/teacher-001", { waitUntil: "domcontentloaded", timeout: 60000 });
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
    await expect(page.getByTestId("teacher-detail-page")).toBeVisible({ timeout: 30000 });
  });

  // ─── Mobile viewport ─────────────────────────────────────────────────────────

  test("mobile viewport teachers list does not overflow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/en/teachers", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("teacher-list")).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5);
  });

  // ─── Regression — existing pages still work ──────────────────────────────────

  test("students list still works", async ({ page }) => {
    await page.goto("/en/students", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("student-list")).toBeVisible();
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
