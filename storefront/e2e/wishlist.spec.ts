import { test, expect } from "@playwright/test";

test.describe("Wishlist page", () => {
  test("loads wishlist page", async ({ page }) => {
    await page.goto("/wishlist");
    await expect(page.locator("main")).toBeVisible();
  });
});

test.describe("Compare page", () => {
  test("loads compare page", async ({ page }) => {
    await page.goto("/compare");
    await expect(page.locator("main")).toBeVisible();
  });
});
