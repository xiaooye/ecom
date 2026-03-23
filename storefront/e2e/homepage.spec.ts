import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders hero section", async ({ page }) => {
    await expect(page.locator("main")).toBeVisible();
    // Hero section should have a call-to-action link
    const heroLinks = page.locator("main a").first();
    await expect(heroLinks).toBeVisible();
  });

  test("displays header with store name and navigation", async ({ page }) => {
    const header = page.locator("header");
    await expect(header).toBeVisible();
    // Store logo/name link
    await expect(header.locator('a[href="/"]')).toBeVisible();
    // Desktop nav links
    await expect(header.locator('a[href="/products"]')).toBeVisible();
  });

  test("displays footer", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/WebStore/);
  });

  test("has skip-to-content accessibility link", async ({ page }) => {
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();
  });

  test("navigates to products page from header", async ({ page }) => {
    await page.locator('header a[href="/products"]').first().click();
    await expect(page).toHaveURL(/\/products/);
    await expect(page.locator("h1")).toContainText("All Products");
  });
});
