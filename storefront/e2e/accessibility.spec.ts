import { test, expect } from "@playwright/test";

test.describe("Accessibility", () => {
  test("skip to content link exists and targets #main-content", async ({
    page,
  }) => {
    await page.goto("/");

    // The skip link is sr-only by default, but exists in the DOM
    const skipLink = page.getByRole("link", { name: "Skip to content" });
    await expect(skipLink).toBeAttached();
    await expect(skipLink).toHaveAttribute("href", "#main-content");

    // The main content target exists
    const mainContent = page.locator("#main-content");
    await expect(mainContent).toBeVisible();
    await expect(mainContent).toHaveAttribute("id", "main-content");
  });

  test("skip link becomes visible on focus", async ({ page }) => {
    await page.goto("/");

    // Tab into the page to focus the skip link
    await page.keyboard.press("Tab");

    // The skip link should be visible when focused (via focus:not-sr-only)
    const skipLink = page.getByRole("link", { name: "Skip to content" });
    await expect(skipLink).toBeVisible();
  });

  test("all images on homepage have alt text", async ({ page }) => {
    await page.goto("/");

    // Get all visible images
    const images = page.locator("img");
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute("alt");
      // Every img should have an alt attribute (can be empty for decorative)
      expect(alt).not.toBeNull();
    }
  });

  test("focus ring is visible on tab navigation", async ({ page }) => {
    await page.goto("/");

    // Tab through focusable elements
    await page.keyboard.press("Tab"); // Skip link
    await page.keyboard.press("Tab"); // First interactive element

    // Get the currently focused element
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();

    // Verify focus styling is applied (outline or ring)
    const styles = await focusedElement.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        outline: computed.outline,
        outlineWidth: computed.outlineWidth,
        boxShadow: computed.boxShadow,
      };
    });

    // Should have some visible focus indicator (outline or shadow ring)
    const hasFocusIndicator =
      styles.outlineWidth !== "0px" ||
      styles.boxShadow !== "none";
    expect(hasFocusIndicator).toBeTruthy();
  });

  test("ARIA labels on icon-only buttons in header", async ({ page }) => {
    await page.goto("/");

    // Header icon buttons should have aria-labels or sr-only text
    const header = page.locator("header");

    // Search button (mobile)
    const searchSrText = header.locator("text=Search").first();
    await expect(searchSrText).toBeAttached();

    // Theme toggle
    const themeToggle = header.getByLabel("Toggle theme");
    await expect(themeToggle).toBeAttached();

    // Account button
    const accountSrText = header.locator("text=Account").first();
    await expect(accountSrText).toBeAttached();

    // Cart button
    const cartSrText = header.locator("text=Cart").first();
    await expect(cartSrText).toBeAttached();
  });

  test("main landmark is present", async ({ page }) => {
    await page.goto("/");
    const main = page.getByRole("main");
    await expect(main).toBeVisible();
  });

  test("footer landmark is present", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible();
  });

  test("navigation landmarks exist", async ({ page }) => {
    await page.goto("/");

    // Breadcrumb navigation
    // Footer has nav links
    // Header has desktop nav
    const navs = page.getByRole("navigation");
    const navCount = await navs.count();
    // At least one navigation landmark should exist
    expect(navCount).toBeGreaterThanOrEqual(1);
  });

  test("page has proper lang attribute", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    const lang = await html.getAttribute("lang");
    expect(lang).toBeTruthy();
    // Should be a valid language code
    expect(lang).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/);
  });
});
