import { test, expect } from "@playwright/test";

test.describe("Keyboard shortcuts", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("Shift+? opens shortcuts help dialog", async ({ page }) => {
    // Press Shift+? (which is Shift+/)
    await page.keyboard.press("Shift+/");

    // The dialog heading should appear
    const heading = page.getByRole("heading", {
      name: /keyboard shortcuts/i,
    });
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test("Escape closes the shortcuts dialog", async ({ page }) => {
    // Open the dialog first
    await page.keyboard.press("Shift+/");

    const heading = page.getByRole("heading", {
      name: /keyboard shortcuts/i,
    });
    await expect(heading).toBeVisible({ timeout: 5000 });

    // Press Escape to close
    await page.keyboard.press("Escape");

    // Dialog should be gone
    await expect(heading).not.toBeVisible({ timeout: 5000 });
  });

  test("Help dialog shows shortcut list", async ({ page }) => {
    await page.keyboard.press("Shift+/");

    const heading = page.getByRole("heading", {
      name: /keyboard shortcuts/i,
    });
    await expect(heading).toBeVisible({ timeout: 5000 });

    // Verify some shortcut descriptions are listed
    await expect(page.getByText("Open search dialog")).toBeVisible();
    await expect(page.getByText("Go to home")).toBeVisible();
    await expect(page.getByText("Go to cart")).toBeVisible();
    await expect(page.getByText("Show shortcuts")).toBeVisible();

    // Verify kbd elements are present for shortcuts
    const kbdElements = page.locator("kbd");
    const kbdCount = await kbdElements.count();
    expect(kbdCount).toBeGreaterThan(0);
  });
});
