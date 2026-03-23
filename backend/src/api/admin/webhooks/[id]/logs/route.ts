import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { WEBHOOK_MODULE } from "../../../../../modules/webhook";

// GET /admin/webhooks/:id/logs — list delivery logs for a webhook
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const webhookService = req.scope.resolve(WEBHOOK_MODULE);
  const { id } = req.params;

  const logs = await webhookService.listWebhookLogs(
    { webhook_id: id },
    { order: { created_at: "DESC" }, take: 50 }
  );

  return res.json({ logs });
}
