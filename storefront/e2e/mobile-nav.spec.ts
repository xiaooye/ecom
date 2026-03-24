import { test, expect } from "@playwright/test";

test.describe("Mobile navigation", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("bottom nav is visible on mobile", async ({ page }) => {
    const mobileNav = page.locator("nav.fixed.bottom-0");
    await expect(mobileNav).toBeVisible();
  });

  test("bottom nav has 5 items (Home, Search, Wishlist, Cart, Account)", async ({
    page,
  }) => {
    const mobileNav = page.locator("nav.fixed.bottom-0");

    await expect(mobileNav.getByText("Home")).toBeVisible();
    await expect(mobileNav.getByText("Search")).toBeVisible();
    await expect(mobileNav.getByText("Wishlist")).toBeVisible();
    await expect(mobileNav.getByText("Cart")).toBeVisible();
    await expect(mobileNav.getByText("Account")).toBeVisible();

    // Exactly 5 nav links
    const links = mobileNav.locator("a");
    await expect(links).toHaveCount(5);
  });

  test("clicking nav items navigates to correct pages", async ({ page }) => {
    const mobileNav = page.locator("nav.fixed.bottom-0");

    // Navigate to Search
    await mobileNav.getByText("Search").click();
    await expect(page).toHaveURL(/\/search/);

    // Navigate to Wishlist
    await mobileNav.getByText("Wishlist").click();
    await expect(page).toHaveURL(/\/wishlist/);

    // Navigate to Cart
    await mobileNav.getByText("Cart").click();
    await expect(page).toHaveURL(/\/cart/);

    // Navigate to Account
    await mobileNav.getByText("Account").click();
    await expect(page).toHaveURL(/\/account/);

    // Navigate back Home
    await mobileNav.getByText("Home").click();
    await expect(page).toHaveURL("/");
  });

  test("bottom nav hides on desktop viewport", async ({ page }) => {
    // First confirm it is visible at mobile size
    const mobileNav = page.locator("nav.fixed.bottom-0");
    await expect(mobileNav).toBeVisible();

    // Resize to desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(300);

    // Bottom nav should be hidden on desktop (md:hidden class)
    await expect(mobileNav).not.toBeVisible();
  });
});
