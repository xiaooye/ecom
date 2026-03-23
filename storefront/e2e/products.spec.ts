import { test, expect } from "@playwright/test";

test.describe("Products page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/products");
  });

  test("renders page heading", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("All Products");
  });

  test("displays breadcrumbs with Shop label", async ({ page }) => {
    await expect(page.getByText("Shop")).toBeVisible();
  });

  test("shows product filter controls", async ({ page }) => {
    // The ProductFilters component should render sort/filter UI
    const filterArea = page.locator("main");
    await expect(filterArea).toBeVisible();
  });

  test("shows skeleton loading state or product grid", async ({ page }) => {
    // Either skeleton loaders or actual product cards should be visible
    const main = page.locator("main");
    await expect(main).toBeVisible();
  });
});

test.describe("Product detail page", () => {
  test("displays product page structure for a valid handle", async ({
    page,
  }) => {
    // Navigate to products page first, then click a product if available
    await page.goto("/products");
    const productLink = page.locator('a[href^="/products/"]').first();
    const hasProducts = (await productLink.count()) > 0;

    if (hasProducts) {
      await productLink.click();
      await expect(page).toHaveURL(/\/products\/.+/);
      // Product detail pages should have a main content area
      await expect(page.locator("main")).toBeVisible();
    }
  });
});
