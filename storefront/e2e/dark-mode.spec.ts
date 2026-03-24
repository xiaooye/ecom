import { test, expect } from "@playwright/test";

test.describe("Dark mode", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("page loads with a theme applied to the html element", async ({ page }) => {
    const htmlEl = page.locator("html");
    const classAttr = await htmlEl.getAttribute("class");
    // next-themes sets class="light" or class="dark" on <html>
    expect(classAttr).toBeTruthy();
  });

  test("theme toggle switches to dark mode", async ({ page }) => {
    const toggleBtn = page.getByLabel("Toggle theme");
    await expect(toggleBtn).toBeVisible();

    const htmlEl = page.locator("html");
    const classBefore = await htmlEl.getAttribute("class");

    // Click toggle to change theme
    await toggleBtn.click();
    await page.waitForTimeout(300);

    const classAfter = await htmlEl.getAttribute("class");
    // The class should have changed
    expect(classAfter).not.toEqual(classBefore);
  });

  test("dark mode class is applied to html element", async ({ page }) => {
    const htmlEl = page.locator("html");
    const toggleBtn = page.getByLabel("Toggle theme");

    // Determine current state and toggle until we get dark
    const initialClass = await htmlEl.getAttribute("class");
    await toggleBtn.click();
    await page.waitForTimeout(300);

    const afterFirstToggle = await htmlEl.getAttribute("class");

    // One of the two states should be "dark"
    const hasDark =
      initialClass?.includes("dark") || afterFirstToggle?.includes("dark");
    expect(hasDark).toBeTruthy();

    // When dark mode is active, the html element has class="dark"
    if (afterFirstToggle?.includes("dark")) {
      expect(afterFirstToggle).toContain("dark");
    } else {
      // Toggle once more to get dark
      await toggleBtn.click();
      await page.waitForTimeout(300);
      const afterSecondToggle = await htmlEl.getAttribute("class");
      expect(afterSecondToggle).toContain("dark");
    }
  });

  test("theme persists after navigation", async ({ page }) => {
    const toggleBtn = page.getByLabel("Toggle theme");
    const htmlEl = page.locator("html");

    // Toggle theme
    await toggleBtn.click();
    await page.waitForTimeout(300);
    const themeAfterToggle = await htmlEl.getAttribute("class");

    // Navigate to a different page
    await page.goto("/products");
    await page.waitForLoadState("domcontentloaded");

    // Theme should persist
    const themeAfterNav = await htmlEl.getAttribute("class");
    expect(themeAfterNav).toEqual(themeAfterToggle);
  });
});
