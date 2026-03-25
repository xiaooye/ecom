import { test, expect } from "@playwright/test";

test.describe("Scroll behavior", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("scroll to top button appears after scrolling down", async ({
    page,
  }) => {
    // The ScrollToTop button should not be visible initially
    const scrollBtn = page.getByLabel("Scroll to top");
    await expect(scrollBtn).not.toBeVisible();

    // Scroll down past the 400px threshold
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(500);

    // The scroll-to-top button should now be visible
    await expect(scrollBtn).toBeVisible({ timeout: 5000 });
  });

  test("clicking scroll-to-top scrolls to top", async ({ page }) => {
    // Scroll down first
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);

    const scrollBtn = page.getByLabel("Scroll to top");
    await expect(scrollBtn).toBeVisible({ timeout: 5000 });

    // Click the scroll-to-top button
    await scrollBtn.click();

    // Wait for the smooth scroll to complete
    await page.waitForTimeout(1000);

    // Verify we are back at the top
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(50);
  });

  test("scroll progress bar is visible", async ({ page }) => {
    // The ScrollProgress component renders a fixed div at top with bg-primary
    const progressBar = page.locator(".fixed.left-0.right-0.top-0.bg-primary");
    await expect(progressBar).toBeAttached();

    // Scroll down to generate some progress
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(500);

    // The progress bar element should still be in the DOM
    await expect(progressBar).toBeAttached();
  });

  test("header hides on scroll down", async ({ page }) => {
    const header = page.locator("header").first();
    await expect(header).toBeVisible();

    // Scroll down past the 150px threshold to trigger hide
    // We need to simulate gradual scrolling to trigger the motion event
    await page.evaluate(async () => {
      // Scroll in steps to trigger the direction detection
      for (let i = 0; i <= 600; i += 50) {
        window.scrollTo(0, i);
        await new Promise((r) => setTimeout(r, 50));
      }
    });

    await page.waitForTimeout(500);

    // The header should be hidden (translated up by -100% via framer-motion)
    // Check that the header's transform contains a negative Y translation
    const transform = await header.evaluate(
      (el) => getComputedStyle(el).transform
    );

    // A translated-away header will have a non-identity matrix or translateY
    // If fully visible, transform would be "none" or translate(0)
    // We verify the header is no longer at its default position
    const isHidden =
      transform !== "none" &&
      transform !== "matrix(1, 0, 0, 1, 0, 0)";
    expect(isHidden).toBeTruthy();
  });
});
