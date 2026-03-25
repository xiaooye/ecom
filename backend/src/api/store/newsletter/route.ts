import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

/**
 * POST /store/newsletter
 * Subscribe email to newsletter.
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);
  const { email } = req.body as { email: string };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Valid email is required" });
  }

  logger.info(`Newsletter subscription: ${email}`);

  // TODO: Integrate with email service (Resend, Mailchimp, etc.)

  return res.json({ success: true, message: "Subscribed successfully" });
}
