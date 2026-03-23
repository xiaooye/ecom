import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("header links navigate to correct pages", async ({ page }) => {
    await page.goto("/");

    // Navigate to products
    await page.locator('header a[href="/products"]').first().click();
    await expect(page).toHaveURL(/\/products/);

    // Navigate back home via logo
    await page.locator('header a[href="/"]').click();
    await expect(page).toHaveURL("/");
  });

  test("cart icon navigates to cart page", async ({ page }) => {
    await page.goto("/");
    await page.locator('header a[href="/cart"]').click();
    await expect(page).toHaveURL(/\/cart/);
  });

  test("account icon redirects to login when not authenticated", async ({
    page,
  }) => {
    await page.goto("/account");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("breadcrumbs appear on inner pages", async ({ page }) => {
    await page.goto("/products");
    await expect(page.locator("nav").filter({ hasText: "Shop" })).toBeVisible();
  });

  test("404 page shown for non-existent routes", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
  });
});
