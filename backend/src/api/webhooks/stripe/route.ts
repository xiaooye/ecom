import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

/**
 * POST /webhooks/stripe
 *
 * Stripe sends webhook events here for payment lifecycle events.
 * In production, verify the webhook signature using STRIPE_WEBHOOK_SECRET.
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);

  const sig = req.headers["stripe-signature"] as string | undefined;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // In production, verify signature
  if (webhookSecret && !sig) {
    logger.warn("Stripe webhook received without signature");
    return res.status(400).json({ error: "Missing stripe-signature header" });
  }

  // For now, parse the event directly
  // In production: const event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  const event = req.body as {
    id: string;
    type: string;
    data: { object: Record<string, unknown> };
  };

  logger.info(`Stripe webhook received: ${event.type} (${event.id})`);

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      logger.info(
        `Payment succeeded: ${paymentIntent.id} — Amount: ${paymentIntent.amount}`
      );
      // Medusa handles this internally via the Stripe payment provider
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      logger.warn(
        `Payment failed: ${paymentIntent.id} — ${paymentIntent.last_payment_error}`
      );
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object;
      logger.info(
        `Charge refunded: ${charge.id} — Amount refunded: ${charge.amount_refunded}`
      );
      break;
    }

    case "charge.dispute.created": {
      const dispute = event.data.object;
      logger.warn(`Dispute created: ${dispute.id} — Reason: ${dispute.reason}`);
      // TODO: Send alert email to admin
      break;
    }

    default:
      logger.info(`Unhandled Stripe event type: ${event.type}`);
  }

  // Always return 200 to acknowledge receipt
  return res.json({ received: true });
}
