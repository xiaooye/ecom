import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function customerCreatedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  const customerId = event.data.id;
  logger.info(`New customer registered: ${customerId}`);

  // TODO: Integrate Resend email service
  // await resend.emails.send({
  //   from: 'WebStore <welcome@webstore.com>',
  //   to: customer.email,
  //   subject: 'Welcome to WebStore!',
  //   html: welcomeEmailTemplate(customer),
  // });
}

export const config: SubscriberConfig = {
  event: "customer.created",
};
