import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

/**
 * POST /store/back-in-stock
 * Register email for back-in-stock notification.
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);
  const { email, variant_id, product_id } = req.body as {
    email: string;
    variant_id?: string;
    product_id: string;
  };

  if (!email || !product_id) {
    return res.status(400).json({ message: "email and product_id required" });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  logger.info(
    `Back-in-stock notification: ${email} for product ${product_id}${
      variant_id ? ` variant ${variant_id}` : ""
    }`
  );

  // TODO: Store in database and trigger when inventory is restored

  return res.json({ success: true, message: "You'll be notified when back in stock" });
}
