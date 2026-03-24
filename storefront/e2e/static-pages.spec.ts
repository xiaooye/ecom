import { test, expect } from "@playwright/test";

test.describe("About page", () => {
  test("renders with heading and content", async ({ page }) => {
    await page.goto("/about");

    await expect(
      page.getByRole("heading", { name: "About Us" })
    ).toBeVisible();

    // Content paragraphs
    await expect(
      page.getByText(/webstore was founded/i)
    ).toBeVisible();

    // Values section
    await expect(
      page.getByRole("heading", { name: "Our Values" })
    ).toBeVisible();

    // Value items
    await expect(page.getByText("Quality First:")).toBeVisible();
    await expect(page.getByText("Fair Pricing:")).toBeVisible();
    await expect(page.getByText("Sustainability:")).toBeVisible();
    await expect(page.getByText("Customer Focus:")).toBeVisible();

    // Breadcrumb
    const breadcrumb = page.getByLabel("Breadcrumb");
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByText("About Us")).toBeVisible();
  });
});

test.describe("Contact page", () => {
  test("renders with form and contact details", async ({ page }) => {
    await page.goto("/contact");

    // Heading
    await expect(
      page.getByRole("heading", { name: "Contact Us" })
    ).toBeVisible();

    // Form section
    await expect(
      page.getByRole("heading", { name: "Send us a message" })
    ).toBeVisible();

    // Form fields
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Subject")).toBeVisible();
    await expect(page.getByLabel("Message")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Send Message" })
    ).toBeVisible();

    // Contact info section
    await expect(
      page.getByRole("heading", { name: "Get in touch" })
    ).toBeVisible();
    await expect(page.getByText("support@webstore.com")).toBeVisible();
    await expect(page.getByText("+1 (555) 123-4567")).toBeVisible();
    await expect(page.getByText("123 Fashion Street")).toBeVisible();
  });

  test("contact form fields accept input", async ({ page }) => {
    await page.goto("/contact");

    await page.getByLabel("Name").fill("Test User");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Subject").fill("Test Subject");
    await page.getByLabel("Message").fill("This is a test message.");

    // Verify values are filled
    await expect(page.getByLabel("Name")).toHaveValue("Test User");
    await expect(page.getByLabel("Email")).toHaveValue("test@example.com");
    await expect(page.getByLabel("Subject")).toHaveValue("Test Subject");
    await expect(page.getByLabel("Message")).toHaveValue("This is a test message.");
  });
});

test.describe("Size guide page", () => {
  test("renders with table and measurement info", async ({ page }) => {
    await page.goto("/size-guide");

    // Heading
    await expect(
      page.getByRole("heading", { name: "Size Guide" })
    ).toBeVisible();

    // Description
    await expect(
      page.getByText(/measurements are in inches/i)
    ).toBeVisible();

    // Table headers
    await expect(page.getByRole("columnheader", { name: "Size" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Chest" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Waist" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Hips" })).toBeVisible();

    // Size rows
    const sizes = ["S", "M", "L", "XL"];
    for (const size of sizes) {
      await expect(page.getByRole("cell", { name: size, exact: true })).toBeVisible();
    }

    // How to Measure section
    await expect(
      page.getByRole("heading", { name: "How to Measure" })
    ).toBeVisible();
  });
});

test.describe("Returns policy page", () => {
  test("renders with all policy sections", async ({ page }) => {
    await page.goto("/returns-policy");

    // Heading
    await expect(
      page.getByRole("heading", { name: "Returns & Exchanges", exact: true }).first()
    ).toBeVisible();

    // Policy sections
    await expect(
      page.getByRole("heading", { name: "Return Policy" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "How to Return" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Exchanges" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Refunds" })
    ).toBeVisible();

    // Content
    await expect(
      page.getByText(/30 days of delivery/i)
    ).toBeVisible();
    await expect(
      page.getByText(/5-7 business days/i)
    ).toBeVisible();

    // Breadcrumb
    const breadcrumb = page.getByLabel("Breadcrumb");
    await expect(breadcrumb).toBeVisible();
  });
});

test.describe("Privacy policy page", () => {
  test("renders with all privacy sections", async ({ page }) => {
    await page.goto("/privacy");

    // Heading
    await expect(
      page.getByRole("heading", { name: "Privacy Policy" })
    ).toBeVisible();

    // Last updated
    await expect(page.getByText("Last updated: March 2026")).toBeVisible();

    // Sections
    await expect(
      page.getByRole("heading", { name: "Information We Collect" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "How We Use Your Information" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Data Security" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Your Rights" })
    ).toBeVisible();

    // Content
    await expect(page.getByText(/SSL\/TLS/)).toBeVisible();
    await expect(page.getByText("privacy@webstore.com")).toBeVisible();
  });
});

test.describe("FAQ page", () => {
  test("renders with accordion items", async ({ page }) => {
    await page.goto("/faq");

    // Heading
    await expect(
      page.getByRole("heading", { name: "Frequently Asked Questions" })
    ).toBeVisible();

    // Subtitle
    await expect(
      page.getByText(/find answers to common questions/i)
    ).toBeVisible();

    // Accordion questions
    const questions = [
      "How do I find my size?",
      "What is your return policy?",
      "How long does shipping take?",
      "Do you ship internationally?",
      "How can I track my order?",
      "What payment methods do you accept?",
      "Can I modify or cancel my order?",
      "How do I care for my clothes?",
    ];

    for (const q of questions) {
      await expect(page.getByText(q)).toBeVisible();
    }
  });

  test("FAQ accordion expands and collapses", async ({ page }) => {
    await page.goto("/faq");

    // Click first question to expand
    const firstQuestion = page.getByText("How do I find my size?");
    await firstQuestion.click();

    // Answer should be visible
    await expect(
      page.getByText(/check our size guide page/i)
    ).toBeVisible();

    // Click again to collapse
    await firstQuestion.click();
    await expect(
      page.getByText(/check our size guide page/i)
    ).not.toBeVisible();
  });
});

test.describe("404 page", () => {
  test("renders for invalid URL", async ({ page }) => {
    await page.goto("/this-page-does-not-exist-at-all");

    // 404 text
    await expect(page.getByText("404")).toBeVisible();

    // Heading
    await expect(
      page.getByRole("heading", { name: "Page not found" })
    ).toBeVisible();

    // Description
    await expect(
      page.getByText(/couldn.t find what you.re looking for/i)
    ).toBeVisible();

    // Search form
    await expect(
      page.getByPlaceholder("Search for products...")
    ).toBeVisible();

    // Navigation buttons
    await expect(
      page.getByRole("link", { name: /go home/i })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /browse all/i })
    ).toBeVisible();

    // Popular categories
    await expect(page.getByText("Popular categories")).toBeVisible();
    const categories = ["Shirts", "Pants", "Sweatshirts", "Accessories"];
    for (const cat of categories) {
      await expect(page.getByRole("link", { name: cat })).toBeVisible();
    }
  });

  test("404 page Go Home button navigates to homepage", async ({ page }) => {
    await page.goto("/this-page-does-not-exist-at-all");
    await page.getByRole("link", { name: /go home/i }).click();
    await expect(page).toHaveURL("/");
  });
});
