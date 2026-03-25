import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

/**
 * Logs product view events for analytics.
 * Can be extended to track popular products, view counts, etc.
 */
export default async function productViewHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productId = event.data.id;

  if (productId) {
    logger.info(`Product viewed: ${productId}`);
    // TODO: Increment view counter in a custom analytics module
  }
}

export const config: SubscriberConfig = {
  event: ["product.retrieved"],
};
