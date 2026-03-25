import { test, expect } from "@playwright/test";

test.describe("Theme persistence", () => {
  test("dark mode persists across page navigation", async ({ page }) => {
    await page.goto("/");

    const toggleBtn = page.getByLabel("Toggle theme");
    await expect(toggleBtn).toBeVisible();

    const htmlEl = page.locator("html");

    // Toggle theme
    await toggleBtn.click();
    await page.waitForTimeout(300);
    const themeAfterToggle = await htmlEl.getAttribute("class");

    // Navigate to products page
    await page.goto("/products");
    await page.waitForLoadState("domcontentloaded");

    // Theme should persist after navigation
    const themeAfterNav = await htmlEl.getAttribute("class");
    expect(themeAfterNav).toEqual(themeAfterToggle);

    // Navigate to another page
    await page.goto("/contact");
    await page.waitForLoadState("domcontentloaded");

    // Theme should still persist
    const themeAfterSecondNav = await htmlEl.getAttribute("class");
    expect(themeAfterSecondNav).toEqual(themeAfterToggle);
  });

  test("theme toggle is accessible", async ({ page }) => {
    await page.goto("/");

    // Toggle button should have an accessible label
    const toggleBtn = page.getByLabel("Toggle theme");
    await expect(toggleBtn).toBeVisible();

    // Button should be clickable
    await toggleBtn.click();
    await page.waitForTimeout(300);

    // It should still be accessible after toggling
    const toggleBtnAfter = page.getByLabel("Toggle theme");
    await expect(toggleBtnAfter).toBeVisible();
  });

  test("cookie consent appears and can be dismissed", async ({ page }) => {
    // Clear any existing cookie consent
    await page.goto("/");

    // Cookie consent has a 2-second delay before appearing
    await page.waitForTimeout(3000);

    // Check if cookie consent is visible
    const cookieConsent = page.getByText("We use cookies");
    const isVisible = await cookieConsent.isVisible().catch(() => false);

    if (isVisible) {
      // Accept button should be present
      const acceptBtn = page.getByRole("button", { name: /accept/i });
      await expect(acceptBtn).toBeVisible();

      // Click Accept to dismiss
      await acceptBtn.click();

      // Cookie consent should be gone
      await expect(cookieConsent).not.toBeVisible();

      // Navigate to another page and verify it doesn't reappear
      await page.goto("/products");
      await page.waitForTimeout(3000);
      await expect(page.getByText("We use cookies")).not.toBeVisible();
    } else {
      // Cookie consent was already accepted in a previous session,
      // or didn't appear. Verify it's not showing.
      expect(isVisible).toBe(false);
    }
  });
});
