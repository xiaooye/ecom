import { test, expect } from "@playwright/test";

test.describe("Performance and SEO basics", () => {
  test("page loads within 5 seconds", async ({ page }) => {
    const start = Date.now();
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const loadTime = Date.now() - start;

    expect(loadTime).toBeLessThan(5000);
  });

  test("images have width and height attributes", async ({ page }) => {
    await page.goto("/");

    const images = page.locator("img");
    const count = await images.count();

    // Only check if there are images on the page
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        // Next.js Image component always sets width and height
        const width = await img.getAttribute("width");
        const height = await img.getAttribute("height");

        // Images should have explicit dimensions (set by element or style)
        // Next/Image sets width/height attributes or uses fill mode with sized parent
        const style = await img.getAttribute("style");
        const hasDimensions =
          (width !== null && height !== null) ||
          (style !== null &&
            (style.includes("width") || style.includes("height")));

        expect(hasDimensions).toBeTruthy();
      }
    }
  });

  test("no console errors on homepage", async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Filter out known benign errors (e.g., favicon 404, third-party scripts)
    const criticalErrors = consoleErrors.filter(
      (err) =>
        !err.includes("favicon") &&
        !err.includes("Failed to load resource") &&
        !err.includes("third-party")
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test("Next.js metadata is present", async ({ page }) => {
    await page.goto("/");

    // Page should have a title
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);

    // Meta description should be present
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toBeAttached();
    const descContent = await metaDescription.getAttribute("content");
    expect(descContent).toBeTruthy();

    // Viewport meta tag
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toBeAttached();

    // Charset
    const charset = page.locator("meta[charset]");
    await expect(charset).toBeAttached();
  });
});
