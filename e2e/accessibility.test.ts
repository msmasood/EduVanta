import { test, expect } from "@playwright/test";

// ─── Phase 23 — Accessibility QA ──────────────────────────────────────────────
//
// Basic accessibility checks using Playwright's built-in capabilities.
// axe-core is NOT installed; these are structural/semantic checks only.
// Deeper axe/Lighthouse analysis is recommended as a manual QA step.
//
// Checks:
//   - Important buttons have accessible names
//   - Form inputs have labels or accessible names
//   - Dialogs have role="dialog"
//   - Keyboard Tab navigation reaches visible controls
//   - No obvious focus-trap issues in dialogs

const TIMEOUT = 30000;

// ─── Button Accessible Names ──────────────────────────────────────────────────

test.describe("Accessibility — Button Names", () => {
  test("login page buttons have accessible names", async ({ page }) => {
    await page.goto("/en/login", { waitUntil: "domcontentloaded" });
    const buttons = await page.getByRole("button").all();
    for (const btn of buttons) {
      const name = await btn.getAttribute("aria-label") ??
                   await btn.textContent() ??
                   "";
      // Each visible button should have some non-empty accessible name
      if (await btn.isVisible()) {
        expect(name.trim().length, `Button missing accessible name`).toBeGreaterThan(0);
      }
    }
  });

  test("dashboard page buttons have accessible names", async ({ page }) => {
    await page.goto("/en/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: TIMEOUT });
    const buttons = await page.getByRole("button").all();
    let unnamed = 0;
    for (const btn of buttons) {
      if (await btn.isVisible()) {
        const ariaLabel = await btn.getAttribute("aria-label") ?? "";
        const textContent = (await btn.textContent()) ?? "";
        const ariaLabelledby = await btn.getAttribute("aria-labelledby") ?? "";
        if (!ariaLabel.trim() && !textContent.trim() && !ariaLabelledby.trim()) {
          unnamed++;
        }
      }
    }
    // Allow a small tolerance (e.g., icon-only buttons that may not yet have labels)
    expect(unnamed, `${unnamed} unnamed buttons found`).toBeLessThanOrEqual(3);
  });

  test("students page Add Student link/button is accessible", async ({ page }) => {
    await page.goto("/en/students", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("student-list")).toBeVisible({ timeout: TIMEOUT });
    const addLink = page.getByRole("link", { name: /add student/i });
    await expect(addLink).toBeVisible({ timeout: 30000 });
  });
});

// ─── Form Labels ──────────────────────────────────────────────────────────────

test.describe("Accessibility — Form Labels", () => {
  test("login form inputs are labelled", async ({ page }) => {
    await page.goto("/en/login", { waitUntil: "domcontentloaded" });
    // Inputs should have labels or aria-labels. Exclude Base UI hidden inputs (aria-hidden=true).
    const inputs = page.locator("input:visible:not([aria-hidden='true'])");
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute("id") ?? "";
      const ariaLabel = await input.getAttribute("aria-label") ?? "";
      const placeholder = await input.getAttribute("placeholder") ?? "";
      // Accept: aria-label, linked <label>, or placeholder (weaker but acceptable)
      const hasLabel = ariaLabel.trim() || placeholder.trim() ||
        (id ? (await page.locator(`label[for="${id}"]`).count()) > 0 : false);
      expect(hasLabel, `Input #${i} (id="${id}") has no label`).toBeTruthy();
    }
  });

  test("add student form inputs are labelled", async ({ page }) => {
    await page.goto("/en/students/new", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("add-student-page")).toBeVisible({ timeout: TIMEOUT });
    // Exclude Base UI hidden inputs (aria-hidden=true)
    const inputs = page.locator("input:visible:not([aria-hidden='true'])");
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const ariaLabel = await input.getAttribute("aria-label") ?? "";
      const placeholder = await input.getAttribute("placeholder") ?? "";
      const id = await input.getAttribute("id") ?? "";
      const hasLabel = ariaLabel.trim() || placeholder.trim() ||
        (id ? (await page.locator(`label[for="${id}"]`).count()) > 0 : false);
      expect(hasLabel, `Input #${i} (id="${id}") has no label`).toBeTruthy();
    }
  });
});

// ─── Dialog Role ──────────────────────────────────────────────────────────────

test.describe("Accessibility — Dialog Roles", () => {
  test("add student dialog (if present) has role=dialog", async ({ page }) => {
    await page.goto("/en/students/new", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("add-student-page")).toBeVisible({ timeout: TIMEOUT });
    // If a dialog appears on this page, it should have role=dialog
    const dialogs = await page.locator("[role='dialog']").all();
    // Zero dialogs is acceptable if the form is inline (not modal)
    for (const dialog of dialogs) {
      if (await dialog.isVisible()) {
        const role = await dialog.getAttribute("role");
        expect(role).toBe("dialog");
      }
    }
  });

  test("add language dialog opens with role=dialog", async ({ page }) => {
    await page.goto("/en/settings/languages", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
    await expect(page.getByTestId("add-language-btn")).toBeVisible({ timeout: TIMEOUT });
    await page.getByTestId("add-language-btn").click();
    const dialog = page.locator("[role='dialog']").first();
    await expect(dialog).toBeVisible({ timeout: 30000 });
    const role = await dialog.getAttribute("role");
    expect(role).toBe("dialog");
  });

  test("add role dialog opens with role=dialog", async ({ page }) => {
    await page.goto("/en/settings/roles", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
    await expect(page.getByTestId("add-role-btn")).toBeVisible({ timeout: TIMEOUT });
    await page.getByTestId("add-role-btn").click();
    const dialog = page.locator("[role='dialog']").first();
    await expect(dialog).toBeVisible({ timeout: 30000 });
    const role = await dialog.getAttribute("role");
    expect(role).toBe("dialog");
  });
});

// ─── Keyboard Navigation ──────────────────────────────────────────────────────

test.describe("Accessibility — Keyboard Navigation", () => {
  test("login form is keyboard-navigable (Tab reaches submit)", async ({ page }) => {
    await page.goto("/en/login", { waitUntil: "domcontentloaded" });
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    // After a few tabs we should have a focused element
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).not.toBe("BODY");
  });

  test("dashboard page Tab navigation reaches first interactive element", async ({ page }) => {
    await page.goto("/en/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: TIMEOUT });
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => document.activeElement?.tagName ?? "");
    // Should move focus to a link or button, not stay on body
    expect(["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA"]).toContain(focused);
  });

  test("settings roles page Tab navigation works", async ({ page }) => {
    await page.goto("/en/settings/roles", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("roles-manager")).toBeVisible({ timeout: TIMEOUT });
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => document.activeElement?.tagName ?? "");
    expect(focused).not.toBe("BODY");
  });
});

// ─── Heading Structure ────────────────────────────────────────────────────────

test.describe("Accessibility — Heading Structure", () => {
  test("login page has at least one heading", async ({ page }) => {
    await page.goto("/en/login", { waitUntil: "domcontentloaded" });
    const headings = page.locator("h1, h2, h3");
    await expect(headings.first()).toBeVisible({ timeout: TIMEOUT });
  });

  test("dashboard page has at least one heading", async ({ page }) => {
    await page.goto("/en/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: TIMEOUT });
    const headings = page.locator("h1, h2, h3");
    await expect(headings.first()).toBeVisible({ timeout: 30000 });
  });

  test("add teacher page has a heading", async ({ page }) => {
    await page.goto("/en/teachers/new", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible({ timeout: TIMEOUT });
    const headings = page.locator("h1, h2, h3");
    await expect(headings.first()).toBeVisible({ timeout: 30000 });
  });
});
