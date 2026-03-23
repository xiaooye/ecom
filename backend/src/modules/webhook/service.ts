import { MedusaService } from "@medusajs/framework/utils";
import Webhook from "./models/webhook";

class WebhookModuleService extends MedusaService({
  Webhook,
}) {}

export default WebhookModuleService;
