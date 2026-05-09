import { test, expect } from "@playwright/test";

test.describe("Infrastructure Dev Route", () => {
  test("/en/dev/infrastructure loads the page", async ({ page }) => {
    await page.goto("/en/dev/infrastructure", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByTestId("infrastructure-page")
    ).toBeVisible();
  });

  test("page shows DataTable with demo rows", async ({ page }) => {
    await page.goto("/en/dev/infrastructure", { waitUntil: "domcontentloaded" });
    // The table should render names from DEMO_DATA
    await expect(page.getByText("Ahmed Al-Rashidi")).toBeVisible();
    await expect(page.getByText("Sara Johnson")).toBeVisible();
  });

  test("table search filters rows", async ({ page }) => {
    await page.goto("/en/dev/infrastructure", { waitUntil: "domcontentloaded" });
    // Wait for network to settle so React is fully hydrated before interacting
    await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
    // Wait for table data to be rendered before searching
    await expect(page.getByText("Sara Johnson")).toBeVisible();
    // The search input has aria-label="Search" — use that to avoid strict mode violation
    const search = page.getByRole("textbox", { name: /^search/i });
    // Use pressSequentially to fire per-character keyboard events that React's
    // onChange handler can process (fill() may not trigger React synthetic events)
    await search.click();
    await search.pressSequentially("Ahmed");
    // Sara should no longer be visible in the table body.
    // Use 15s timeout — React state update + re-render can take a moment after
    // pressSequentially fires per-character keyboard events.
    await expect(page.getByRole("cell", { name: "Sara Johnson" })).not.toBeVisible({ timeout: 15000 });
    // Ahmed should still be visible
    await expect(page.getByText("Ahmed Al-Rashidi")).toBeVisible({ timeout: 15000 });
  });

  test("table pagination controls exist", async ({ page }) => {
    await page.goto("/en/dev/infrastructure", { waitUntil: "domcontentloaded" });
    // Use .first() because the page may have multiple Next/Previous buttons
    await expect(
      page.getByRole("button", { name: /previous/i }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /next/i }).first()
    ).toBeVisible();
  });

  test("form shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/en/dev/infrastructure", { waitUntil: "domcontentloaded" });
    // Click the submit button without filling in required fields
    await page.getByRole("button", { name: /submit/i }).click();
    // At least one validation alert should appear
    const alerts = page.locator("[role='alert']");
    await expect(alerts.first()).toBeVisible();
  });

  test("/ar/dev/infrastructure renders with dir=rtl", async ({ page }) => {
    await page.goto("/ar/dev/infrastructure", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("infrastructure-page")).toBeVisible();
    // The html element should have dir=rtl for Arabic locale
    const dir = await page.locator("html").getAttribute("dir");
    expect(dir).toBe("rtl");
  });
});
