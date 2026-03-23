import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { WEBHOOK_MODULE } from "../modules/webhook";
import { dispatchWebhook } from "../modules/webhook/dispatcher";

/**
 * Universal webhook dispatcher subscriber.
 * Listens to key commerce events and fires registered webhooks.
 */
export default async function webhookDispatcherHandler({
  event,
  container,
}: SubscriberArgs<Record<string, unknown>>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  let webhookService;
  try {
    webhookService = container.resolve(WEBHOOK_MODULE);
  } catch {
    // Webhook module not loaded yet (e.g., during migrations)
    return;
  }

  const eventName = (event as { name?: string }).name || "unknown";

  // Find all active webhooks subscribed to this event
  const webhooks = await webhookService.listWebhooks({ active: true });
  const matching = webhooks.filter((wh: { events: string[] }) =>
    wh.events.includes(eventName) || wh.events.includes("*")
  );

  if (matching.length === 0) return;

  const payload = {
    event: eventName,
    data: event.data as Record<string, unknown>,
    timestamp: new Date().toISOString(),
  };

  logger.info(
    `Dispatching ${eventName} to ${matching.length} webhook(s)`
  );

  // Fire all webhooks concurrently
  const results = await Promise.allSettled(
    matching.map((wh: { url: string; secret?: string | null; id: string }) =>
      dispatchWebhook(wh.url, payload, wh.secret).then((result) => {
        if (!result.success) {
          logger.warn(
            `Webhook ${wh.id} to ${wh.url} failed: ${result.statusCode || result.error}`
          );
        }
        return result;
      })
    )
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  logger.info(
    `Webhook dispatch complete: ${succeeded}/${matching.length} succeeded`
  );
}

export const config: SubscriberConfig = {
  event: [
    "order.placed",
    "order.canceled",
    "order.completed",
    "product.created",
    "product.updated",
    "product.deleted",
    "customer.created",
    "customer.updated",
    "hosting.deployment",
  ],
};
