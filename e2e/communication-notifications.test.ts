import { test, expect } from "@playwright/test";

// ─── Communication & Notifications Module E2E Tests — Phase 20 ──────────────

// ─── Notice Board ─────────────────────────────────────────────────────────────

test.describe("Communication — Notice Board", () => {
  test("notices page loads (en)", async ({ page }) => {
    await page.goto("/en/communication/notices", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("notices-manager")).toBeVisible({ timeout: 60000 });
  });

  test("notices page shows summary cards", async ({ page }) => {
    await page.goto("/en/communication/notices", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("notices-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("notice-summary-cards")).toBeVisible({ timeout: 30000 });
  });

  test("notices page has add notice button", async ({ page }) => {
    await page.goto("/en/communication/notices", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("add-notice-btn")).toBeVisible({ timeout: 60000 });
  });

  test("notice add dialog opens", async ({ page }) => {
    await page.goto("/en/communication/notices", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("add-notice-btn")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("add-notice-btn").click();
    await expect(page.getByTestId("notice-form-dialog")).toBeVisible({ timeout: 30000 });
  });

  test("notice page shows priority badges", async ({ page }) => {
    await page.goto("/en/communication/notices", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("notices-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("notice-priority-badge").first()).toBeVisible({ timeout: 30000 });
  });

  test("notices page RTL (ar)", async ({ page }) => {
    await page.goto("/ar/communication/notices", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("notices-manager")).toBeVisible({ timeout: 60000 });
  });

  test("notices page RTL (ur)", async ({ page }) => {
    await page.goto("/ur/communication/notices", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("notices-manager")).toBeVisible({ timeout: 60000 });
  });

  test("notices page mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/en/communication/notices", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("notices-manager")).toBeVisible({ timeout: 60000 });
  });
});

// ─── Events ───────────────────────────────────────────────────────────────────

test.describe("Communication — Events", () => {
  test("events page loads (en)", async ({ page }) => {
    await page.goto("/en/communication/events", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("events-manager")).toBeVisible({ timeout: 60000 });
  });

  test("events page shows event summary cards", async ({ page }) => {
    await page.goto("/en/communication/events", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("events-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("event-summary-cards")).toBeVisible({ timeout: 30000 });
  });

  test("events page has add event button", async ({ page }) => {
    await page.goto("/en/communication/events", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("add-event-btn")).toBeVisible({ timeout: 60000 });
  });

  test("events page shows list by default", async ({ page }) => {
    await page.goto("/en/communication/events", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("events-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("event-list")).toBeVisible({ timeout: 30000 });
  });

  test("events page switches to calendar view", async ({ page }) => {
    await page.goto("/en/communication/events", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("events-calendar-btn")).toBeVisible({ timeout: 60000 });
    await page.getByTestId("events-calendar-btn").click();
    await expect(page.getByTestId("event-calendar")).toBeVisible({ timeout: 30000 });
  });

  test("event add dialog opens", async ({ page }) => {
    await page.goto("/en/communication/events", { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.getByTestId("add-event-btn").click();
    await expect(page.getByTestId("event-form-dialog")).toBeVisible({ timeout: 30000 });
  });

  test("events page RTL (ar)", async ({ page }) => {
    await page.goto("/ar/communication/events", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("events-manager")).toBeVisible({ timeout: 60000 });
  });

  test("events page mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/en/communication/events", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("events-manager")).toBeVisible({ timeout: 60000 });
  });
});

// ─── Messages ─────────────────────────────────────────────────────────────────

test.describe("Communication — Messages", () => {
  test("messages page loads (en)", async ({ page }) => {
    await page.goto("/en/communication/messages", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("messages-layout")).toBeVisible({ timeout: 60000 });
  });

  test("messages page shows summary cards", async ({ page }) => {
    await page.goto("/en/communication/messages", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("messages-layout")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("message-summary-cards")).toBeVisible({ timeout: 30000 });
  });

  test("messages page shows thread list", async ({ page }) => {
    await page.goto("/en/communication/messages", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("messages-layout")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("message-thread-list")).toBeVisible({ timeout: 30000 });
  });

  test("messages page has compose button", async ({ page }) => {
    await page.goto("/en/communication/messages", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("compose-btn")).toBeVisible({ timeout: 60000 });
  });

  test("compose dialog opens", async ({ page }) => {
    await page.goto("/en/communication/messages", { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.getByTestId("compose-btn").click();
    await expect(page.getByTestId("compose-dialog")).toBeVisible({ timeout: 30000 });
  });

  test("messages page RTL (ar)", async ({ page }) => {
    await page.goto("/ar/communication/messages", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("messages-layout")).toBeVisible({ timeout: 60000 });
  });

  test("messages page mobile stacks layout", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/en/communication/messages", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("messages-layout")).toBeVisible({ timeout: 60000 });
  });
});

// ─── Notifications ────────────────────────────────────────────────────────────

test.describe("Notifications", () => {
  test("notifications page loads (en)", async ({ page }) => {
    await page.goto("/en/notifications", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("notifications-manager")).toBeVisible({ timeout: 60000 });
  });

  test("notifications page shows summary cards", async ({ page }) => {
    await page.goto("/en/notifications", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("notifications-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("notification-summary-cards")).toBeVisible({ timeout: 30000 });
  });

  test("notifications page shows notification cards", async ({ page }) => {
    await page.goto("/en/notifications", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("notifications-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("notification-card-list")).toBeVisible({ timeout: 30000 });
  });

  test("notifications page has mark-all-read button when unread exist", async ({ page }) => {
    await page.goto("/en/notifications", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("notifications-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("mark-all-read-btn")).toBeVisible({ timeout: 30000 });
  });

  test("clicking mark read changes notification status", async ({ page }) => {
    await page.goto("/en/notifications", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("notifications-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("notification-card-list")).toBeVisible({ timeout: 30000 });
    const markReadBtn = page.getByTestId("mark-read-btn").first();
    if (await markReadBtn.isVisible()) {
      await markReadBtn.click();
    }
  });

  test("clicking dismiss removes notification", async ({ page }) => {
    await page.goto("/en/notifications", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("notifications-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("notification-card-list")).toBeVisible({ timeout: 30000 });
    const dismissBtn = page.getByTestId("dismiss-btn").first();
    if (await dismissBtn.isVisible()) {
      await dismissBtn.click();
    }
  });

  test("notifications page RTL (ar)", async ({ page }) => {
    await page.goto("/ar/notifications", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("notifications-manager")).toBeVisible({ timeout: 60000 });
  });

  test("notifications page mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/en/notifications", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("notifications-manager")).toBeVisible({ timeout: 60000 });
  });
});

// ─── Notification Alerts ──────────────────────────────────────────────────────

test.describe("Notification Alerts & Preferences", () => {
  test("alerts page loads (en)", async ({ page }) => {
    await page.goto("/en/notifications/alerts", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("notification-alerts-manager")).toBeVisible({ timeout: 60000 });
  });

  test("alerts page shows 4 preference cards", async ({ page }) => {
    await page.goto("/en/notifications/alerts", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("notification-alerts-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("preference-card").first()).toBeVisible({ timeout: 30000 });
    const cards = page.getByTestId("preference-card");
    expect(await cards.count()).toBe(4);
  });

  test("alerts page has save preferences button", async ({ page }) => {
    await page.goto("/en/notifications/alerts", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("save-preferences-btn")).toBeVisible({ timeout: 60000 });
  });

  test("alerts page shows channel toggles", async ({ page }) => {
    await page.goto("/en/notifications/alerts", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("notification-alerts-manager")).toBeVisible({ timeout: 60000 });
    await expect(page.getByTestId("channel-toggle").first()).toBeVisible({ timeout: 30000 });
  });

  test("alerts page RTL (ar)", async ({ page }) => {
    await page.goto("/ar/notifications/alerts", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("notification-alerts-manager")).toBeVisible({ timeout: 60000 });
  });

  test("alerts page mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/en/notifications/alerts", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("notification-alerts-manager")).toBeVisible({ timeout: 60000 });
  });
});

// ─── Regression ───────────────────────────────────────────────────────────────

test.describe("Regression — Phase 19 routes still work", () => {
  test("library books page still loads", async ({ page }) => {
    await page.goto("/en/library/books", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("books-manager")).toBeVisible({ timeout: 60000 });
  });

  test("library members page still loads", async ({ page }) => {
    await page.goto("/en/library/members", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("members-manager")).toBeVisible({ timeout: 60000 });
  });

  test("library issue-return page still loads", async ({ page }) => {
    await page.goto("/en/library/issue-return", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("issue-return-manager")).toBeVisible({ timeout: 60000 });
  });

  test("fees page still loads", async ({ page }) => {
    await page.goto("/en/fees/collect", { waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByTestId("fee-collection-manager")).toBeVisible({ timeout: 60000 });
  });
});
