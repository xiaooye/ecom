import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function orderPlacedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const orderService = container.resolve(Modules.ORDER);

  const orderId = event.data.id;
  logger.info(`Order placed: ${orderId}`);

  try {
    const order = await orderService.retrieveOrder(orderId);
    logger.info(
      `Order #${order.display_id} confirmed for ${order.email}. Total: ${order.total}`
    );

    // TODO: Integrate Resend email service
    // await resend.emails.send({
    //   from: 'WebStore <orders@webstore.com>',
    //   to: order.email,
    //   subject: `Order #${order.display_id} Confirmed`,
    //   html: orderConfirmationTemplate(order),
    // });
  } catch (error) {
    logger.error(`Failed to process order placed event: ${error}`);
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
};
