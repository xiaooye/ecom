import { test, expect } from "@playwright/test";

const staticPages = [
  { path: "/about", heading: /about/i },
  { path: "/contact", heading: /contact/i },
  { path: "/faq", heading: /faq/i },
  { path: "/privacy", heading: /privacy/i },
  { path: "/returns-policy", heading: /return/i },
  { path: "/size-guide", heading: /size guide/i },
];

for (const { path, heading } of staticPages) {
  test(`${path} page loads and displays heading`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("h1")).toContainText(heading);
  });
}

test.describe("Contact page", () => {
  test("displays contact information", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByText("support@webstore.com")).toBeVisible();
    await expect(page.getByText("+1 (555) 123-4567")).toBeVisible();
  });

  test("has a contact form", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByText("Send us a message")).toBeVisible();
  });
});
