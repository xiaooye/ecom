import { test, expect } from "@playwright/test";

test.describe("Responsive layout", () => {
  test("homepage renders correctly on mobile (375px)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    // Page should load and have content
    await expect(page.locator("body")).toBeVisible();

    // Mobile bottom nav should be visible
    const mobileNav = page.locator("nav.fixed.bottom-0");
    await expect(mobileNav).toBeVisible();

    // Header should still be visible
    const header = page.locator("header");
    await expect(header).toBeVisible();
  });

  test("homepage renders correctly on tablet (768px)", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");

    // Page should load
    await expect(page.locator("body")).toBeVisible();

    // Header should be visible
    const header = page.locator("header");
    await expect(header).toBeVisible();

    // Footer should be visible when scrolling down
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });

  test("homepage renders correctly on desktop (1280px)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    // Page should load
    await expect(page.locator("body")).toBeVisible();

    // Header should be visible
    const header = page.locator("header");
    await expect(header).toBeVisible();

    // Desktop nav links should be visible
    await expect(page.getByRole("link", { name: "Shop All" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Shirts" }).first()).toBeVisible();

    // Footer should be visible
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });

  test("mobile menu opens on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    // Mobile bottom nav should be visible
    const mobileNav = page.locator("nav.fixed.bottom-0");
    await expect(mobileNav).toBeVisible();

    // Verify nav items are there
    await expect(mobileNav.getByText("Home")).toBeVisible();
    await expect(mobileNav.getByText("Search")).toBeVisible();
    await expect(mobileNav.getByText("Cart")).toBeVisible();
  });

  test("desktop nav visible on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    // Desktop navigation links in header should be visible
    const header = page.locator("header");
    await expect(header).toBeVisible();

    // Navigation links
    await expect(page.getByRole("link", { name: "Shop All" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Pants" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Sweatshirts" }).first()).toBeVisible();

    // Mobile bottom nav should be hidden on desktop
    const mobileNav = page.locator("nav.fixed.bottom-0");
    await expect(mobileNav).not.toBeVisible();
  });
});
