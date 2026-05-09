import { test, expect } from "@playwright/test";

// ─── Students list page ────────────────────────────────────────────────────────

test.describe("Students Module", () => {
  test("students list page loads", async ({ page }) => {
    await page.goto("/en/students", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("student-list")).toBeVisible();
  });

  test("student list shows Add Student link", async ({ page }) => {
    await page.goto("/en/students", { waitUntil: "domcontentloaded" });
    // The add student link renders after data loads
    await expect(
      page.getByRole("link", { name: /add student/i })
    ).toBeVisible({ timeout: 30000 });
  });

  test("student list shows data rows", async ({ page }) => {
    await page.goto("/en/students", { waitUntil: "domcontentloaded" });
    // Mock data first student is Ahmed Khan
    await expect(page.getByText("Ahmed Khan")).toBeVisible({ timeout: 30000 });
  });

  test("student list shows summary cards", async ({ page }) => {
    await page.goto("/en/students", { waitUntil: "domcontentloaded" });
    // Wait for data to load, then check summary card labels
    await expect(
      page.getByText("Total Students", { exact: true })
    ).toBeVisible({ timeout: 30000 });
    await expect(page.getByText("Active", { exact: true })).toBeVisible({
      timeout: 30000,
    });
  });

  // ─── Add student page ──────────────────────────────────────────────────────

  test("add student page loads", async ({ page }) => {
    await page.goto("/en/students/new", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("add-student-page")).toBeVisible();
  });

  test("add student page shows form heading", async ({ page }) => {
    await page.goto("/en/students/new", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { name: /add new student/i })
    ).toBeVisible();
  });

  test("add student form shows validation errors on empty submit", async ({
    page,
  }) => {
    await page.goto("/en/students/new", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /add student/i }).click();
    const alerts = page.locator("[role='alert']");
    await expect(alerts.first()).toBeVisible();
  });

  test("add student back link navigates to student list", async ({ page }) => {
    await page.goto("/en/students/new", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: /back to students/i }).click();
    await expect(page).toHaveURL(/\/en\/students$/, { timeout: 30000 });
  });

  // ─── Student detail page ───────────────────────────────────────────────────

  test("student detail page loads for known student", async ({ page }) => {
    await page.goto("/en/students/student-001", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("student-detail-page")).toBeVisible();
  });

  test("student detail shows profile header", async ({ page }) => {
    await page.goto("/en/students/student-001", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("student-profile-header")).toBeVisible();
  });

  test("student detail shows tab navigation", async ({ page }) => {
    await page.goto("/en/students/student-001", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("tab", { name: /overview/i })
    ).toBeVisible({ timeout: 30000 });
    await expect(
      page.getByRole("tab", { name: /academic/i })
    ).toBeVisible({ timeout: 30000 });
    await expect(
      page.getByRole("tab", { name: /guardian/i })
    ).toBeVisible({ timeout: 30000 });
    await expect(
      page.getByRole("tab", { name: /attendance/i })
    ).toBeVisible({ timeout: 30000 });
  });

  test("unknown student id shows not found state", async ({ page }) => {
    await page.goto("/en/students/nonexistent-id-xyz", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/student not found/i)).toBeVisible({
      timeout: 30000,
    });
  });

  // ─── Edit student page ─────────────────────────────────────────────────────

  test("edit student page loads for known student", async ({ page }) => {
    await page.goto("/en/students/student-001/edit", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("edit-student-page")).toBeVisible();
  });

  test("edit student page pre-fills first name", async ({ page }) => {
    await page.goto("/en/students/student-001/edit", { waitUntil: "domcontentloaded" });
    const firstNameInput = page.getByLabel(/first name/i);
    await expect(firstNameInput).not.toHaveValue("");
  });

  // ─── Attendance page ───────────────────────────────────────────────────────

  test("attendance page loads", async ({ page }) => {
    await page.goto("/en/students/attendance", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("attendance-page")).toBeVisible();
  });

  test("attendance page shows summary cards", async ({ page }) => {
    await page.goto("/en/students/attendance", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(/present/i).first()).toBeVisible();
    await expect(page.getByText(/absent/i).first()).toBeVisible();
  });

  // ─── Categories page ───────────────────────────────────────────────────────

  test("categories page loads", async ({ page }) => {
    await page.goto("/en/students/categories", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("categories-page")).toBeVisible();
  });

  test("categories page shows category manager", async ({ page }) => {
    await page.goto("/en/students/categories", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("category-manager")).toBeVisible({
      timeout: 30000,
    });
  });

  test("categories page shows add category button", async ({ page }) => {
    await page.goto("/en/students/categories", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("add-category-btn")).toBeVisible();
  });

  // ─── Suspended students page ───────────────────────────────────────────────

  test("suspended students page loads", async ({ page }) => {
    await page.goto("/en/students/suspended", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("suspended-page")).toBeVisible();
  });

  test("suspended page shows Usman Ghani (suspended student)", async ({
    page,
  }) => {
    await page.goto("/en/students/suspended", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("suspended-page")).toBeVisible();
    await expect(page.getByText("Usman Ghani")).toBeVisible({ timeout: 30000 });
  });

  // ─── RTL ──────────────────────────────────────────────────────────────────

  test("students list page loads in Arabic (RTL)", async ({ page }) => {
    await page.goto("/ar/students", { waitUntil: "domcontentloaded" });
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
    await expect(page.getByTestId("student-list")).toBeVisible();
  });
});
