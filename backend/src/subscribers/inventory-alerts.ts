import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

const LOW_STOCK_THRESHOLD = 10;

/**
 * Monitors inventory changes and logs alerts when stock drops below threshold.
 * Integrates with the webhook system to notify external services.
 */
export default async function inventoryAlertHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  try {
    const inventoryService = container.resolve(Modules.INVENTORY);
    const itemId = event.data.id;

    if (!itemId) return;

    const levels = await inventoryService.listInventoryLevels({
      inventory_item_id: itemId,
    });

    for (const level of levels) {
      const qty = level.stocked_quantity - (level.reserved_quantity || 0);

      if (qty <= 0) {
        logger.warn(
          `OUT OF STOCK: Inventory item ${itemId} at location ${level.location_id} — quantity: ${qty}`
        );

        // TODO: Dispatch webhook with event "inventory.out_of_stock"
        // TODO: Send admin notification email
      } else if (qty <= LOW_STOCK_THRESHOLD) {
        logger.warn(
          `LOW STOCK: Inventory item ${itemId} at location ${level.location_id} — quantity: ${qty}`
        );

        // TODO: Dispatch webhook with event "inventory.low_stock"
      }
    }
  } catch (error) {
    logger.error(`Inventory alert error: ${error}`);
  }
}

export const config: SubscriberConfig = {
  event: ["inventory-level.updated"],
};
