import { test, expect } from "@playwright/test";

test.describe("Cart page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/cart");
  });

  test("empty cart shows empty state with CTA", async ({ page }) => {
    // Without a cart in zustand store, the empty state should show
    const heading = page.getByRole("heading", { name: /your cart is empty/i });
    await expect(heading).toBeVisible();

    // Description text
    await expect(
      page.getByText(/haven.t added anything to your cart/i)
    ).toBeVisible();

    // Continue Shopping CTA button
    const ctaLink = page.getByRole("link", { name: /continue shopping/i });
    await expect(ctaLink).toBeVisible();
    await expect(ctaLink).toHaveAttribute("href", "/products");
  });

  test("empty cart CTA navigates to products page", async ({ page }) => {
    const ctaLink = page.getByRole("link", { name: /continue shopping/i });
    await expect(ctaLink).toBeVisible();
    await ctaLink.click();
    await expect(page).toHaveURL(/\/products/);
  });

  test("cart page loads without errors", async ({ page }) => {
    // The page should load successfully regardless of cart state
    // Check that either empty state or cart content is visible
    const emptyHeading = page.getByRole("heading", { name: /your cart is empty/i });
    const cartHeading = page.getByRole("heading", { name: /shopping cart/i });

    const isEmpty = (await emptyHeading.count()) > 0;
    const hasItems = (await cartHeading.count()) > 0;

    // One of these should be true
    expect(isEmpty || hasItems).toBeTruthy();
  });

  test("cart page has correct page structure", async ({ page }) => {
    // Verify the page renders within the max-width container
    const container = page.locator(".mx-auto.max-w-7xl");
    await expect(container.first()).toBeVisible();
  });

  test("cart icon in header links to cart page", async ({ page }) => {
    await page.goto("/");
    const cartLink = page.locator('a[href="/cart"]').first();
    await expect(cartLink).toBeVisible();
    await cartLink.click();
    await expect(page).toHaveURL(/\/cart/);
  });

  test("proceed to checkout link is not visible in empty cart", async ({ page }) => {
    // In empty cart state, there should be no checkout link
    const checkoutLink = page.getByRole("link", { name: /proceed to checkout/i });
    await expect(checkoutLink).not.toBeVisible();
  });
});
