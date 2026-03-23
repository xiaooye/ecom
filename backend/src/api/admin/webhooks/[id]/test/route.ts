import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { WEBHOOK_MODULE } from "../../../../../modules/webhook";
import { dispatchWebhook } from "../../../../../modules/webhook/dispatcher";

// POST /admin/webhooks/:id/test — send a test ping to the webhook URL
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);
  const webhookService = req.scope.resolve(WEBHOOK_MODULE);
  const { id } = req.params;

  const [webhook] = await webhookService.listWebhooks({ id });
  if (!webhook) {
    return res.status(404).json({ message: "Webhook not found" });
  }

  const result = await dispatchWebhook(
    webhook.url,
    {
      event: "webhook.test",
      data: { message: "This is a test webhook from WebStore" },
      timestamp: new Date().toISOString(),
    },
    webhook.secret
  );

  logger.info(
    `Webhook test to ${webhook.url}: ${result.success ? "OK" : "FAILED"} (${result.statusCode || result.error})`
  );

  return res.json({ result });
}
