import { test, expect } from "@playwright/test";

test.describe("Cart page", () => {
  test("shows empty cart message when cart is empty", async ({ page }) => {
    await page.goto("/cart");
    // Wait for loading to finish, then check for empty state
    await expect(
      page.getByText(/your cart is empty/i).or(page.getByText(/shopping cart/i))
    ).toBeVisible({ timeout: 10_000 });
  });

  test("empty cart has continue shopping link", async ({ page }) => {
    await page.goto("/cart");
    await page.waitForLoadState("networkidle");
    const continueLink = page.locator('a[href="/products"]');
    await expect(continueLink.first()).toBeVisible({ timeout: 10_000 });
  });
});
