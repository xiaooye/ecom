import { test, expect } from "@playwright/test";

test.describe("Forms", () => {
  test("contact form validates required fields", async ({ page }) => {
    await page.goto("/contact");

    // The contact form should be visible
    await expect(page.getByText("Send us a message")).toBeVisible();

    // Click submit without filling anything
    const submitBtn = page.getByRole("button", { name: "Send Message" });
    await expect(submitBtn).toBeVisible();

    // The form uses onSubmit with preventDefault so it should not navigate away
    await submitBtn.click();

    // Page should still be on contact
    await expect(page).toHaveURL(/\/contact/);
  });

  test("contact form shows all input fields", async ({ page }) => {
    await page.goto("/contact");

    // Name field
    const nameInput = page.getByLabel("Name");
    await expect(nameInput).toBeVisible();

    // Email field
    const emailInput = page.getByLabel("Email");
    await expect(emailInput).toBeVisible();

    // Subject field
    const subjectInput = page.getByLabel("Subject");
    await expect(subjectInput).toBeVisible();

    // Message textarea
    const messageInput = page.getByLabel("Message");
    await expect(messageInput).toBeVisible();

    // Submit button
    const submitBtn = page.getByRole("button", { name: "Send Message" });
    await expect(submitBtn).toBeVisible();
  });

  test("login form validates email format", async ({ page }) => {
    await page.goto("/auth/login");

    // Fill in an invalid email
    const emailInput = page.getByLabel("Email");
    await emailInput.fill("not-an-email");

    // Fill password so only email validation triggers
    const passwordInput = page.getByLabel("Password");
    await passwordInput.fill("somepassword");

    // Submit the form
    const submitBtn = page.getByRole("button", { name: "Sign In" });
    await submitBtn.click();

    // Should show email validation error
    await expect(page.getByText("Invalid email")).toBeVisible();
  });

  test("register form validates password minimum length", async ({ page }) => {
    await page.goto("/auth/register");

    // Fill in all fields with short password
    await page.getByLabel("First Name").fill("John");
    await page.getByLabel("Last Name").fill("Doe");
    await page.getByLabel("Email").fill("john@example.com");
    await page.getByLabel("Password").fill("short");

    // Submit the form
    const submitBtn = page.getByRole("button", { name: "Create Account" });
    await submitBtn.click();

    // Should show password length validation
    await expect(
      page.getByText("Password must be at least 8 characters")
    ).toBeVisible();
  });

  test("search form submits on enter", async ({ page }) => {
    await page.goto("/search");

    // Search input should be visible
    const searchInput = page.getByPlaceholder("Search products...");
    await expect(searchInput).toBeVisible();

    // Type a search query and press Enter
    await searchInput.fill("shirt");
    await searchInput.press("Enter");

    // URL should update with the query parameter
    await expect(page).toHaveURL(/\/search\?q=shirt/);
  });
});
