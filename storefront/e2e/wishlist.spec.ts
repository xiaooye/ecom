import { test, expect } from "@playwright/test";

test.describe("Wishlist page", () => {
  test("empty wishlist shows empty state", async ({ page }) => {
    await page.goto("/wishlist");

    // Heading
    await expect(
      page.getByRole("heading", { name: /your wishlist is empty/i })
    ).toBeVisible();

    // Description
    await expect(
      page.getByText(/save items you love for later/i)
    ).toBeVisible();

    // CTA button
    const browseLink = page.getByRole("link", { name: /browse products/i });
    await expect(browseLink).toBeVisible();
    await expect(browseLink).toHaveAttribute("href", "/products");
  });

  test("empty wishlist CTA navigates to products page", async ({ page }) => {
    await page.goto("/wishlist");

    await page.getByRole("link", { name: /browse products/i }).click();
    await expect(page).toHaveURL(/\/products/);
  });

  test("adding a product shows it in wishlist", async ({ page }) => {
    // Pre-populate the wishlist zustand store via localStorage
    await page.goto("/");
    await page.evaluate(() => {
      const wishlistItem = {
        id: "prod_test_1",
        title: "Test Shirt",
        handle: "test-shirt",
        thumbnail: null,
      };
      localStorage.setItem(
        "wishlist-store",
        JSON.stringify({
          state: { items: [wishlistItem] },
          version: 0,
        })
      );
    });

    await page.goto("/wishlist");

    // Should show the wishlist with the item
    await expect(
      page.getByRole("heading", { name: /wishlist \(1\)/i })
    ).toBeVisible();

    // Product title should be visible
    await expect(page.getByText("Test Shirt")).toBeVisible();
  });

  test("removing a product removes it from wishlist", async ({ page }) => {
    // Pre-populate wishlist
    await page.goto("/");
    await page.evaluate(() => {
      const wishlistItem = {
        id: "prod_test_2",
        title: "Test Pants",
        handle: "test-pants",
        thumbnail: null,
      };
      localStorage.setItem(
        "wishlist-store",
        JSON.stringify({
          state: { items: [wishlistItem] },
          version: 0,
        })
      );
    });

    await page.goto("/wishlist");

    // Verify product is visible
    await expect(page.getByText("Test Pants")).toBeVisible();

    // The WishlistButton with variant="icon" has aria-label "Remove from wishlist"
    const removeBtn = page.getByLabel("Remove from wishlist");
    await expect(removeBtn).toBeVisible();
    await removeBtn.click();

    // After removal, the empty state should appear
    await expect(
      page.getByRole("heading", { name: /your wishlist is empty/i })
    ).toBeVisible();
  });

  test("wishlist breadcrumb is visible", async ({ page }) => {
    await page.goto("/wishlist");
    const breadcrumb = page.getByLabel("Breadcrumb");
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByText("Wishlist")).toBeVisible();
  });
});
