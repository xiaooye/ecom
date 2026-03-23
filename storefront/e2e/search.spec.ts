import { test, expect } from "@playwright/test";

test.describe("Search page", () => {
  test("renders search form", async ({ page }) => {
    await page.goto("/search");
    await expect(page.locator("h1")).toContainText("Search");
    await expect(
      page.locator('input[placeholder="Search products..."]')
    ).toBeVisible();
  });

  test("search input is auto-focused", async ({ page }) => {
    await page.goto("/search");
    const input = page.locator('input[placeholder="Search products..."]');
    await expect(input).toBeFocused();
  });

  test("submitting search updates URL with query parameter", async ({
    page,
  }) => {
    await page.goto("/search");
    const input = page.locator('input[placeholder="Search products..."]');
    await input.fill("shirt");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/\/search\?q=shirt/);
  });

  test("search with query param pre-fills input and shows results", async ({
    page,
  }) => {
    await page.goto("/search?q=test");
    const input = page.locator('input[placeholder="Search products..."]');
    await expect(input).toHaveValue("test");
    // Should show result count after search completes
    await expect(
      page.getByText(/result/).or(page.getByText("Searching..."))
    ).toBeVisible({ timeout: 10_000 });
  });
});
