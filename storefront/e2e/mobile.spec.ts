import { test, expect } from "@playwright/test";

// These tests use the mobile-chrome project defined in playwright.config.ts
test.describe("Mobile responsiveness", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("header shows mobile menu button", async ({ page }) => {
    await page.goto("/");
    const menuButton = page.locator("header button").filter({
      has: page.locator(".sr-only", { hasText: "Toggle menu" }),
    });
    await expect(menuButton).toBeVisible();
  });

  test("desktop nav links are hidden on mobile", async ({ page }) => {
    await page.goto("/");
    const desktopNav = page.locator("header nav.hidden");
    await expect(desktopNav).toBeHidden();
  });

  test("mobile menu opens and shows navigation links", async ({ page }) => {
    await page.goto("/");
    const menuButton = page.locator("header button").filter({
      has: page.locator(".sr-only", { hasText: "Toggle menu" }),
    });
    await menuButton.click();

    // Sheet should open with nav links
    await expect(page.locator('a[href="/products"]')).toBeVisible();
  });

  test("products page is responsive", async ({ page }) => {
    await page.goto("/products");
    await expect(page.locator("h1")).toContainText("All Products");
    // Page should not overflow horizontally
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });
});
