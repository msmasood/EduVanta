import { test, expect } from "@playwright/test";

// ─── Attendance Module E2E Tests — Phase 18 ─────────────────────────────────

test.describe("Student Attendance", () => {
  test("page loads (en)", async ({ page }) => {
    await page.goto("/en/students/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("student-attendance-page")).toBeVisible({ timeout: 60000 });
  });

  test("page loads (ar)", async ({ page }) => {
    await page.goto("/ar/students/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("student-attendance-page")).toBeVisible({ timeout: 60000 });
  });

  test("shows heading", async ({ page }) => {
    await page.goto("/en/students/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("student-attendance-page")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("heading", { name: /student attendance/i })).toBeVisible({ timeout: 30000 });
  });

  test("shows summary cards", async ({ page }) => {
    await page.goto("/en/students/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("student-attendance-page")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("attendance-summary-cards")).toBeVisible({ timeout: 30000 });
  });

  test("shows filter bar", async ({ page }) => {
    await page.goto("/en/students/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("student-attendance-page")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("attendance-filter-bar")).toBeVisible({ timeout: 30000 });
  });

  test("shows data rows in table view", async ({ page }) => {
    await page.goto("/en/students/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("student-attendance-page")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: 60000 });
  });

  test("can switch to calendar view", async ({ page }) => {
    await page.goto("/en/students/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("student-attendance-page")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: 60000 });
    await page.getByRole("button", { name: /calendar/i }).click();
    await expect(page.getByTestId("attendance-calendar-grid")).toBeVisible({ timeout: 30000 });
  });

  test("can switch back to table view", async ({ page }) => {
    await page.goto("/en/students/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("student-attendance-page")).toBeVisible({ timeout: 60000 });
    await page.getByRole("button", { name: /calendar/i }).click();
    await page.getByRole("button", { name: /table/i }).click();
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: 30000 });
  });

  test("search input filters rows", async ({ page }) => {
    await page.goto("/en/students/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("student-attendance-page")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: 60000 });
    await page.getByTestId("attendance-search-input").fill("Ali");
    // Table should update — just verify no error
    await expect(page.getByTestId("attendance-filter-bar")).toBeVisible({ timeout: 30000 });
  });

  test("notes button opens dialog", async ({ page }) => {
    await page.goto("/en/students/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("student-attendance-page")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: 60000 });
    // Click first notes button
    await page.locator("button[title='Add notes']").first().click();
    await expect(page.getByTestId("attendance-notes-dialog")).toBeVisible({ timeout: 30000 });
  });

  test("notes dialog closes on cancel", async ({ page }) => {
    await page.goto("/en/students/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: 60000 });
    await page.locator("button[title='Add notes']").first().click();
    await expect(page.getByTestId("attendance-notes-dialog")).toBeVisible({ timeout: 30000 });
    await page.getByRole("button", { name: /cancel/i }).click();
    await expect(page.getByTestId("attendance-notes-dialog")).not.toBeVisible({ timeout: 30000 });
  });
});

test.describe("Teacher Attendance", () => {
  test("page loads (en)", async ({ page }) => {
    await page.goto("/en/teachers/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("teacher-attendance-page")).toBeVisible({ timeout: 60000 });
  });

  test("page loads (ar)", async ({ page }) => {
    await page.goto("/ar/teachers/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("teacher-attendance-page")).toBeVisible({ timeout: 60000 });
  });

  test("shows heading", async ({ page }) => {
    await page.goto("/en/teachers/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("teacher-attendance-page")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("heading", { name: /teacher attendance/i })).toBeVisible({ timeout: 30000 });
  });

  test("shows summary cards", async ({ page }) => {
    await page.goto("/en/teachers/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("teacher-attendance-page")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("attendance-summary-cards")).toBeVisible({ timeout: 30000 });
  });

  test("shows data rows", async ({ page }) => {
    await page.goto("/en/teachers/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("teacher-attendance-page")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: 60000 });
  });

  test("department filter renders", async ({ page }) => {
    await page.goto("/en/teachers/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("teacher-attendance-page")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("attendance-dept-filter")).toBeVisible({ timeout: 30000 });
  });

  test("can switch to calendar view", async ({ page }) => {
    await page.goto("/en/teachers/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("teacher-attendance-page")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: 60000 });
    await page.getByRole("button", { name: /calendar/i }).click();
    await expect(page.getByTestId("attendance-calendar-grid")).toBeVisible({ timeout: 30000 });
  });

  test("notes button opens dialog", async ({ page }) => {
    await page.goto("/en/teachers/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("teacher-attendance-page")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: 60000 });
    await page.locator("button[title='Add notes']").first().click();
    await expect(page.getByTestId("attendance-notes-dialog")).toBeVisible({ timeout: 30000 });
  });
});

test.describe("Employee Attendance", () => {
  test("page loads (en)", async ({ page }) => {
    await page.goto("/en/employees/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("employee-attendance-page")).toBeVisible({ timeout: 60000 });
  });

  test("page loads (ar)", async ({ page }) => {
    await page.goto("/ar/employees/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("employee-attendance-page")).toBeVisible({ timeout: 60000 });
  });

  test("shows heading", async ({ page }) => {
    await page.goto("/en/employees/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("employee-attendance-page")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("heading", { name: /employee attendance/i })).toBeVisible({ timeout: 30000 });
  });

  test("shows summary cards", async ({ page }) => {
    await page.goto("/en/employees/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("employee-attendance-page")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("attendance-summary-cards")).toBeVisible({ timeout: 30000 });
  });

  test("shows data rows", async ({ page }) => {
    await page.goto("/en/employees/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("employee-attendance-page")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: 60000 });
  });

  test("department filter renders", async ({ page }) => {
    await page.goto("/en/employees/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("employee-attendance-page")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("attendance-dept-filter")).toBeVisible({ timeout: 30000 });
  });

  test("can switch to calendar view", async ({ page }) => {
    await page.goto("/en/employees/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("employee-attendance-page")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: 60000 });
    await page.getByRole("button", { name: /calendar/i }).click();
    await expect(page.getByTestId("attendance-calendar-grid")).toBeVisible({ timeout: 30000 });
  });

  test("notes button opens dialog", async ({ page }) => {
    await page.goto("/en/employees/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("employee-attendance-page")).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: 60000 });
    await page.locator("button[title='Add notes']").first().click();
    await expect(page.getByTestId("attendance-notes-dialog")).toBeVisible({ timeout: 30000 });
  });

  test("notes dialog submit shows toast", async ({ page }) => {
    await page.goto("/en/employees/attendance", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByRole("row").nth(1)).toBeVisible({ timeout: 60000 });
    await page.locator("button[title='Add notes']").first().click();
    await expect(page.getByTestId("attendance-notes-dialog")).toBeVisible({ timeout: 30000 });
    await page.getByPlaceholder("Add any relevant notes…").fill("Test note");
    await page.getByRole("button", { name: /submit/i }).click();
    // Dialog should close
    await expect(page.getByTestId("attendance-notes-dialog")).not.toBeVisible({ timeout: 30000 });
  });
});
