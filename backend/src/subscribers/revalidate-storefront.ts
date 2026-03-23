import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

/**
 * Triggers Next.js on-demand ISR revalidation when products or categories
 * are created, updated, or deleted in Medusa admin.
 */
export default async function revalidateStorefrontHandler({
  event,
  container,
}: SubscriberArgs<Record<string, unknown>>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  const storefrontUrl = process.env.STOREFRONT_URL;
  const revalidateSecret = process.env.STOREFRONT_REVALIDATE_SECRET;

  if (!storefrontUrl) {
    logger.warn("STOREFRONT_URL not set, skipping ISR revalidation");
    return;
  }

  const eventName = (event as { name?: string }).name || "";

  // Determine which cache tag to revalidate
  let tag: string;
  if (eventName.startsWith("product.")) {
    tag = "products";
  } else if (eventName.startsWith("product_category.")) {
    tag = "categories";
  } else {
    return;
  }

  try {
    const response = await fetch(`${storefrontUrl}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag, secret: revalidateSecret }),
    });

    if (response.ok) {
      logger.info(`ISR revalidated tag "${tag}" on storefront`);
    } else {
      const text = await response.text();
      logger.warn(
        `ISR revalidation failed (${response.status}): ${text}`
      );
    }
  } catch (error) {
    logger.error(`ISR revalidation error: ${error}`);
  }
}

export const config: SubscriberConfig = {
  event: [
    "product.created",
    "product.updated",
    "product.deleted",
    "product_category.created",
    "product_category.updated",
    "product_category.deleted",
  ],
};
