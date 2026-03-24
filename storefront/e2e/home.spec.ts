import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("hero section renders with title and CTA buttons", async ({ page }) => {
    // Hero heading
    const heading = page.getByRole("heading", { name: /new season/i });
    await expect(heading).toBeVisible();

    // Season subtitle
    await expect(page.getByText("Spring / Summer 2026")).toBeVisible();

    // CTA buttons
    const shopNow = page.getByRole("link", { name: /shop now/i });
    await expect(shopNow).toBeVisible();
    await expect(shopNow).toHaveAttribute("href", "/products");

    const browseCollection = page.getByRole("link", { name: /browse collection/i });
    await expect(browseCollection).toBeVisible();
    await expect(browseCollection).toHaveAttribute("href", "/categories/shirts");
  });

  test("category grid shows all 4 categories", async ({ page }) => {
    await expect(page.getByText("Shop by Category")).toBeVisible();

    const categories = ["Shirts", "Sweatshirts", "Pants", "Merch"];
    for (const cat of categories) {
      await expect(page.getByRole("heading", { name: cat, exact: true })).toBeVisible();
    }

    // Each category has a "Shop now" link
    const shopNowLinks = page.getByText("Shop now");
    await expect(shopNowLinks).toHaveCount(4);
  });

  test("trust badges section is visible", async ({ page }) => {
    const badges = [
      "Free Shipping",
      "Secure Checkout",
      "Easy Returns",
      "24/7 Support",
    ];
    for (const badge of badges) {
      await expect(page.getByText(badge, { exact: true })).toBeVisible();
    }

    // Badge descriptions
    await expect(page.getByText("On orders over $50")).toBeVisible();
    await expect(page.getByText("SSL encrypted payment")).toBeVisible();
    await expect(page.getByText("30-day return policy")).toBeVisible();
    await expect(page.getByText("Dedicated customer care")).toBeVisible();
  });

  test("footer renders with all links and social icons", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    // Brand name
    await expect(footer.getByText("WebStore")).toBeVisible();

    // Section headings
    await expect(footer.getByText("Shop", { exact: true })).toBeVisible();
    await expect(footer.getByText("Support", { exact: true })).toBeVisible();
    await expect(footer.getByText("Company", { exact: true })).toBeVisible();

    // Shop links
    await expect(footer.getByRole("link", { name: "All Products" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Shirts" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Pants" })).toBeVisible();

    // Support links
    await expect(footer.getByRole("link", { name: "Contact Us" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Size Guide" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Returns & Exchanges" })).toBeVisible();

    // Company links
    await expect(footer.getByRole("link", { name: "About Us" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Privacy Policy" })).toBeVisible();

    // Social icons
    await expect(footer.getByLabel("Instagram")).toBeVisible();
    await expect(footer.getByLabel("Twitter / X")).toBeVisible();
    await expect(footer.getByLabel("Facebook")).toBeVisible();

    // Payment badges
    for (const method of ["Visa", "MC", "Amex", "Stripe"]) {
      await expect(footer.getByText(method)).toBeVisible();
    }

    // Copyright
    await expect(footer.getByText(/all rights reserved/i)).toBeVisible();
  });

  test("announcement bar is visible and dismissible", async ({ page }) => {
    // Announcement bar is present with one of the rotating messages
    const bar = page.locator(".bg-primary").first();
    await expect(bar).toBeVisible();

    // Dismiss button exists with correct aria-label
    const dismissBtn = page.getByLabel("Dismiss");
    await expect(dismissBtn).toBeVisible();

    // Click dismiss and verify bar disappears
    await dismissBtn.click();
    await expect(bar).not.toBeVisible();
  });

  test("mobile nav renders on small viewport", async ({ page, browserName }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    // Mobile bottom nav should be visible
    const mobileNav = page.locator("nav.fixed.bottom-0");
    await expect(mobileNav).toBeVisible();

    // All nav items present
    await expect(mobileNav.getByText("Home")).toBeVisible();
    await expect(mobileNav.getByText("Search")).toBeVisible();
    await expect(mobileNav.getByText("Wishlist")).toBeVisible();
    await expect(mobileNav.getByText("Cart")).toBeVisible();
    await expect(mobileNav.getByText("Account")).toBeVisible();
  });

  test("dark mode toggle switches theme", async ({ page }) => {
    // The toggle button exists
    const toggleBtn = page.getByLabel("Toggle theme");
    await expect(toggleBtn).toBeVisible();

    // Click to toggle theme
    const htmlEl = page.locator("html");
    await toggleBtn.click();

    // After toggling, the html element should have a class change
    // next-themes sets class="dark" or class="light" on <html>
    const classAfterToggle = await htmlEl.getAttribute("class");
    expect(classAfterToggle).toBeTruthy();

    // Toggle back
    await toggleBtn.click();
    const classAfterSecondToggle = await htmlEl.getAttribute("class");
    // Theme should have changed back
    expect(classAfterSecondToggle).not.toEqual(classAfterToggle);
  });

  test("scroll-to-top button appears after scrolling", async ({ page }) => {
    // Initially not visible
    const scrollBtn = page.getByLabel("Scroll to top");
    await expect(scrollBtn).not.toBeVisible();

    // Scroll down past threshold (400px)
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);

    // Should now appear
    await expect(scrollBtn).toBeVisible();

    // Click it and verify scroll position returns to top
    await scrollBtn.click();
    await page.waitForTimeout(500);
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThanOrEqual(10);
  });
});
