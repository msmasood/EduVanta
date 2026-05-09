import { test, expect } from "@playwright/test";

// ─── Phase 23 — Route Availability / No-404 Smoke Tests ───────────────────────
//
// Each test navigates to a route and asserts that a meaningful page element is
// visible (not a 404 error screen). Tests are grouped by module. All routes are
// English (/en) — RTL locale tests are in rtl.test.ts.
//
// Strategy: assert that the body is non-empty AND that a module-level test-id
// or a heading is visible. We do NOT assert exact text to avoid brittleness.

const FIRST_LOAD_TIMEOUT = 30000;

// ─── Helper ───────────────────────────────────────────────────────────────────

async function assertNoFourOhFour(page: import("@playwright/test").Page) {
  // Playwright's default "404" page contains "This page could not be found"
  const bodyText = await page.locator("body").innerText();
  const lower = bodyText.toLowerCase();
  expect(lower).not.toContain("this page could not be found");
  expect(lower).not.toContain("404");
}

// ─── Auth / Marketing ─────────────────────────────────────────────────────────

test.describe("Routes — Auth & Marketing", () => {
  test("/en loads", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1").first()).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });

  test("/en/login loads", async ({ page }) => {
    await page.goto("/en/login", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).not.toBeEmpty();
    await assertNoFourOhFour(page);
  });

  test("/en/register loads", async ({ page }) => {
    await page.goto("/en/register", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).not.toBeEmpty();
    await assertNoFourOhFour(page);
  });

  test("/en/forgot-password loads", async ({ page }) => {
    await page.goto("/en/forgot-password", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).not.toBeEmpty();
    await assertNoFourOhFour(page);
  });

  test("/en/reset-password loads", async ({ page }) => {
    await page.goto("/en/reset-password", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).not.toBeEmpty();
    await assertNoFourOhFour(page);
  });
});

// ─── Dashboard ────────────────────────────────────────────────────────────────

test.describe("Routes — Dashboard", () => {
  test("/en/dashboard loads", async ({ page }) => {
    await page.goto("/en/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });

  for (const variant of ["student", "teacher", "parent", "lms", "university"]) {
    test(`/en/dashboard/${variant} loads`, async ({ page }) => {
      await page.goto(`/en/dashboard/${variant}`, { waitUntil: "domcontentloaded" });
      await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
      await assertNoFourOhFour(page);
    });
  }
});

// ─── Students ─────────────────────────────────────────────────────────────────

test.describe("Routes — Students", () => {
  test("/en/students loads", async ({ page }) => {
    await page.goto("/en/students", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("student-list")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
  });

  test("/en/students/new loads", async ({ page }) => {
    await page.goto("/en/students/new", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("add-student-page")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
  });

  test("/en/students/student-001 loads", async ({ page }) => {
    await page.goto("/en/students/student-001", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });

  test("/en/students/student-001/edit loads", async ({ page }) => {
    await page.goto("/en/students/student-001/edit", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });

  test("/en/students/attendance loads", async ({ page }) => {
    await page.goto("/en/students/attendance", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });

  test("/en/students/categories loads", async ({ page }) => {
    await page.goto("/en/students/categories", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });

  test("/en/students/suspended loads", async ({ page }) => {
    await page.goto("/en/students/suspended", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });
});

// ─── Teachers ─────────────────────────────────────────────────────────────────

test.describe("Routes — Teachers", () => {
  test("/en/teachers loads", async ({ page }) => {
    await page.goto("/en/teachers", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });

  test("/en/teachers/new loads", async ({ page }) => {
    await page.goto("/en/teachers/new", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });

  test("/en/teachers/teacher-001 loads", async ({ page }) => {
    await page.goto("/en/teachers/teacher-001", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });

  test("/en/teachers/teacher-001/edit loads", async ({ page }) => {
    await page.goto("/en/teachers/teacher-001/edit", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });

  test("/en/teachers/attendance loads", async ({ page }) => {
    await page.goto("/en/teachers/attendance", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });

  test("/en/teachers/timetable loads", async ({ page }) => {
    await page.goto("/en/teachers/timetable", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });
});

// ─── Guardians ────────────────────────────────────────────────────────────────

test.describe("Routes — Guardians", () => {
  test("/en/guardians loads", async ({ page }) => {
    await page.goto("/en/guardians", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });

  test("/en/guardians/new loads", async ({ page }) => {
    await page.goto("/en/guardians/new", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });

  test("/en/guardians/guardian-001 loads", async ({ page }) => {
    await page.goto("/en/guardians/guardian-001", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });

  test("/en/guardians/guardian-001/edit loads", async ({ page }) => {
    await page.goto("/en/guardians/guardian-001/edit", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });
});

// ─── Employees / HRM ──────────────────────────────────────────────────────────

test.describe("Routes — Employees & HRM", () => {
  test("/en/employees loads", async ({ page }) => {
    await page.goto("/en/employees", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });

  test("/en/employees/new loads", async ({ page }) => {
    await page.goto("/en/employees/new", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });

  test("/en/employees/employee-001 loads", async ({ page }) => {
    await page.goto("/en/employees/employee-001", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });

  test("/en/employees/employee-001/edit loads", async ({ page }) => {
    await page.goto("/en/employees/employee-001/edit", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });

  test("/en/employees/attendance loads", async ({ page }) => {
    await page.goto("/en/employees/attendance", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });

  test("/en/employees/leave-requests loads", async ({ page }) => {
    await page.goto("/en/employees/leave-requests", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });

  test("/en/employees/leave-types loads", async ({ page }) => {
    await page.goto("/en/employees/leave-types", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });

  test("/en/hrm/payroll loads", async ({ page }) => {
    await page.goto("/en/hrm/payroll", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });

  test("/en/hrm/departments loads", async ({ page }) => {
    await page.goto("/en/hrm/departments", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });

  test("/en/hrm/designations loads", async ({ page }) => {
    await page.goto("/en/hrm/designations", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });
});

// ─── Academic ─────────────────────────────────────────────────────────────────

test.describe("Routes — Academic", () => {
  for (const sub of ["classes", "classrooms", "sections", "subjects"]) {
    test(`/en/academic/${sub} loads`, async ({ page }) => {
      await page.goto(`/en/academic/${sub}`, { waitUntil: "domcontentloaded" });
      await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
      await assertNoFourOhFour(page);
    });
  }
});

// ─── Exams ────────────────────────────────────────────────────────────────────

test.describe("Routes — Exams", () => {
  for (const sub of ["", "/schedule", "/results"]) {
    test(`/en/exams${sub} loads`, async ({ page }) => {
      await page.goto(`/en/exams${sub}`, { waitUntil: "domcontentloaded" });
      await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
      await assertNoFourOhFour(page);
    });
  }
});

// ─── Fees ─────────────────────────────────────────────────────────────────────

test.describe("Routes — Fees", () => {
  for (const sub of ["collect", "groups", "types", "discounts"]) {
    test(`/en/fees/${sub} loads`, async ({ page }) => {
      await page.goto(`/en/fees/${sub}`, { waitUntil: "domcontentloaded" });
      await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
      await assertNoFourOhFour(page);
    });
  }
});

// ─── Finance ──────────────────────────────────────────────────────────────────

test.describe("Routes — Finance", () => {
  for (const sub of ["income-heads", "income", "expense-heads", "expenses", "transactions"]) {
    test(`/en/finance/${sub} loads`, async ({ page }) => {
      await page.goto(`/en/finance/${sub}`, { waitUntil: "domcontentloaded" });
      await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
      await assertNoFourOhFour(page);
    });
  }
});

// ─── Library ──────────────────────────────────────────────────────────────────

test.describe("Routes — Library", () => {
  test("/en/library/books loads", async ({ page }) => {
    await page.goto("/en/library/books", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });

  test("/en/library/issue-return loads", async ({ page }) => {
    await page.goto("/en/library/issue-return", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });

  test("/en/library/members loads", async ({ page }) => {
    await page.goto("/en/library/members", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });

  test("/en/library/members/library-member-001 loads", async ({ page }) => {
    await page.goto("/en/library/members/library-member-001", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });
});

// ─── Communication & Notifications ────────────────────────────────────────────

test.describe("Routes — Communication & Notifications", () => {
  for (const sub of ["notices", "events", "messages"]) {
    test(`/en/communication/${sub} loads`, async ({ page }) => {
      await page.goto(`/en/communication/${sub}`, { waitUntil: "domcontentloaded" });
      await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
      await assertNoFourOhFour(page);
    });
  }

  test("/en/notifications loads", async ({ page }) => {
    await page.goto("/en/notifications", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });

  test("/en/notifications/alerts loads", async ({ page }) => {
    await page.goto("/en/notifications/alerts", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });
});

// ─── Certificates ─────────────────────────────────────────────────────────────

test.describe("Routes — Certificates", () => {
  test("/en/certificates loads", async ({ page }) => {
    await page.goto("/en/certificates", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
    await assertNoFourOhFour(page);
  });
});

// ─── Settings ─────────────────────────────────────────────────────────────────

test.describe("Routes — Settings", () => {
  for (const sub of ["general", "languages", "currencies", "roles", "assign-roles", "subscription"]) {
    test(`/en/settings/${sub} loads`, async ({ page }) => {
      await page.goto(`/en/settings/${sub}`, { waitUntil: "domcontentloaded" });
      await expect(page.locator("#main-content")).toBeVisible({ timeout: FIRST_LOAD_TIMEOUT });
      await assertNoFourOhFour(page);
    });
  }
});
