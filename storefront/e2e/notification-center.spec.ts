import { test, expect } from "@playwright/test";

test.describe("Notification center", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("bell icon is visible in header", async ({ page }) => {
    // The NotificationCenter renders a button with a Bell icon in the header
    // It is a ghost button with icon size
    const bellButton = page.locator("header button").filter({
      has: page.locator('svg.lucide-bell'),
    });
    await expect(bellButton.first()).toBeVisible();
  });

  test("clicking bell opens notification panel", async ({ page }) => {
    // Click the bell button
    const bellButton = page.locator("header button").filter({
      has: page.locator("svg.lucide-bell"),
    });
    await bellButton.first().click();

    // The notification panel heading should appear
    const panelHeading = page.getByRole("heading", {
      name: /notifications/i,
    });
    await expect(panelHeading).toBeVisible({ timeout: 5000 });
  });

  test("panel shows notifications", async ({ page }) => {
    const bellButton = page.locator("header button").filter({
      has: page.locator("svg.lucide-bell"),
    });
    await bellButton.first().click();

    // Wait for the panel to be visible
    await expect(
      page.getByRole("heading", { name: /notifications/i })
    ).toBeVisible({ timeout: 5000 });

    // Sample notifications should be visible
    await expect(page.getByText("Spring Sale Live!")).toBeVisible();
    await expect(page.getByText("Order Shipped")).toBeVisible();
    await expect(page.getByText("Welcome to WebStore")).toBeVisible();
  });

  test("mark all read works", async ({ page }) => {
    const bellButton = page.locator("header button").filter({
      has: page.locator("svg.lucide-bell"),
    });
    await bellButton.first().click();

    // Wait for panel
    await expect(
      page.getByRole("heading", { name: /notifications/i })
    ).toBeVisible({ timeout: 5000 });

    // There should be a "Mark all read" button (only visible when there are unread)
    const markAllBtn = page.getByText("Mark all read");
    await expect(markAllBtn).toBeVisible();

    // Click mark all read
    await markAllBtn.click();

    // After marking all as read, the "Mark all read" button should disappear
    await expect(markAllBtn).not.toBeVisible({ timeout: 5000 });

    // The unread badge (count) on the bell icon should also disappear
    // Close and recheck the bell button area
    const unreadBadge = page.locator(
      "header .bg-destructive"
    );
    await expect(unreadBadge).not.toBeVisible({ timeout: 5000 });
  });
});
