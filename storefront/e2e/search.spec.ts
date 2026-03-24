import { test, expect } from "@playwright/test";

test.describe("Search page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/search");
  });

  test("search page renders with heading and input", async ({ page }) => {
    // Heading
    await expect(
      page.getByRole("heading", { name: "Search" })
    ).toBeVisible();

    // Search input
    const searchInput = page.getByPlaceholder("Search products...");
    await expect(searchInput).toBeVisible();

    // Search submit button
    const submitBtn = page.getByRole("button", { name: "Search" });
    await expect(submitBtn).toBeVisible();

    // Breadcrumb
    const breadcrumb = page.getByLabel("Breadcrumb");
    await expect(breadcrumb).toBeVisible();
  });

  test("search input accepts text and submits form", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search products...");
    await searchInput.fill("shirt");

    // Submit the form
    await page.getByRole("button", { name: "Search" }).click();

    // URL should update with search query
    await expect(page).toHaveURL(/[?&]q=shirt/);
  });

  test("search results area shows after search", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search products...");
    await searchInput.fill("test");
    await page.getByRole("button", { name: "Search" }).click();

    // Wait for search to complete
    await page.waitForTimeout(2000);

    // Results area should show (either results count or empty grid)
    const resultsText = page.getByText(/result/i);
    await expect(resultsText.first()).toBeVisible();
  });

  test("search input is auto-focused on page load", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search products...");
    await expect(searchInput).toBeFocused();
  });

  test("empty search does not submit", async ({ page }) => {
    const currentUrl = page.url();
    // Click search with empty input
    await page.getByRole("button", { name: "Search" }).click();

    // URL should not change (form submission is prevented for empty query)
    expect(page.url()).toBe(currentUrl);
  });
});

test.describe("Search dialog (Cmd+K)", () => {
  test("Cmd+K keyboard shortcut opens search dialog", async ({ page }) => {
    await page.goto("/");

    // Press Ctrl+K (or Cmd+K on Mac)
    await page.keyboard.press("Control+k");

    // Command dialog should open with search input
    const dialogInput = page.getByPlaceholder("Search products...");
    await expect(dialogInput).toBeVisible();
  });

  test("search dialog closes on Escape", async ({ page }) => {
    await page.goto("/");

    // Open dialog
    await page.keyboard.press("Control+k");
    const dialogInput = page.getByPlaceholder("Search products...");
    await expect(dialogInput).toBeVisible();

    // Close with Escape
    await page.keyboard.press("Escape");
    await expect(dialogInput).not.toBeVisible();
  });

  test("search dialog shows search all option after typing", async ({ page }) => {
    await page.goto("/");

    // Open dialog
    await page.keyboard.press("Control+k");
    const dialogInput = page.getByPlaceholder("Search products...");
    await expect(dialogInput).toBeVisible();

    // Type a query (minimum 2 chars to trigger search)
    await dialogInput.fill("sh");

    // "Search all" option should appear
    await expect(page.getByText(/search all for/i)).toBeVisible();
  });
});
