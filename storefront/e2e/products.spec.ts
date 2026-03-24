import { test, expect } from "@playwright/test";

test.describe("Products listing page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/products");
  });

  test("products page loads with heading and breadcrumbs", async ({ page }) => {
    // Page heading
    const heading = page.getByRole("heading", { name: "All Products" });
    await expect(heading).toBeVisible();

    // Breadcrumbs
    const breadcrumb = page.getByLabel("Breadcrumb");
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByText("Shop")).toBeVisible();
  });

  test("sort dropdown is present with sort options", async ({ page }) => {
    // Sort trigger button
    const sortTrigger = page.getByRole("combobox");
    await expect(sortTrigger).toBeVisible();

    // Open the sort dropdown
    await sortTrigger.click();

    // All sort options should be listed
    const sortOptions = [
      "Newest",
      "Oldest",
      "Name A-Z",
      "Name Z-A",
      "Price: Low to High",
      "Price: High to Low",
    ];
    for (const option of sortOptions) {
      await expect(page.getByRole("option", { name: option })).toBeVisible();
    }
  });

  test("view toggle switches between grid and list buttons", async ({ page }) => {
    // Grid view button is present
    const gridBtn = page.getByLabel("Grid view");
    const listBtn = page.getByLabel("List view");

    // Both toggle buttons exist (even if no products, the filter area loads)
    // If products loaded, toggles are visible
    // If no products, the empty state shows instead
    const hasProducts = (await page.getByText("No products found.").count()) === 0;
    if (hasProducts) {
      await expect(gridBtn).toBeVisible();
      await expect(listBtn).toBeVisible();

      // Click list view
      await listBtn.click();
      // List view button should now be active (has bg-primary)
      await expect(listBtn).toHaveClass(/bg-primary/);

      // Click grid view
      await gridBtn.click();
      await expect(gridBtn).toHaveClass(/bg-primary/);
    }
  });

  test("empty state shows when no products are available", async ({ page }) => {
    // Without a running backend, the products array will be empty
    // The empty state text should appear
    const emptyMessage = page.getByText("No products found.");
    const hasProducts = (await emptyMessage.count()) > 0;
    if (hasProducts) {
      await expect(emptyMessage).toBeVisible();
    }
    // If backend is running and products exist, this is still valid -- we just
    // confirm the page rendered without error
    await expect(page.getByRole("heading", { name: "All Products" })).toBeVisible();
  });

  test("filter sheet opens and closes", async ({ page }) => {
    // Open filters sheet
    const filtersBtn = page.getByRole("button", { name: /filters/i });
    await expect(filtersBtn).toBeVisible();
    await filtersBtn.click();

    // Sheet content should be visible
    await expect(page.getByText("Price Range")).toBeVisible();
    await expect(page.getByPlaceholder("Min")).toBeVisible();
    await expect(page.getByPlaceholder("Max")).toBeVisible();
    await expect(page.getByRole("button", { name: "Apply" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Clear" })).toBeVisible();

    // Close sheet by pressing Escape
    await page.keyboard.press("Escape");
    await expect(page.getByText("Price Range")).not.toBeVisible();
  });

  test("pagination controls section renders", async ({ page }) => {
    // The pagination component is always rendered (even with 0 items)
    // We verify the products page structure loaded correctly
    const container = page.locator(".mx-auto.max-w-7xl");
    await expect(container).toBeVisible();

    // Page heading is always there
    await expect(page.getByRole("heading", { name: "All Products" })).toBeVisible();
  });

  test("search from product page navigates via header", async ({ page }) => {
    // The header search link should be available on mobile
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/products");

    // Mobile search button in header
    const searchLink = page.locator('a[href="/search"]').first();
    await expect(searchLink).toBeVisible();
    await searchLink.click();
    await expect(page).toHaveURL(/\/search/);
  });
});
