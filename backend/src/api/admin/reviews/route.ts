import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { REVIEW_MODULE } from "../../../modules/review";

// GET /admin/reviews — list all reviews (all statuses)
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const reviewModuleService = req.scope.resolve(REVIEW_MODULE);
  const status = req.query.status as string | undefined;

  const filters: Record<string, string> = {};
  if (status) filters.status = status;

  const reviews = await reviewModuleService.listReviews(
    filters,
    { order: { created_at: "DESC" } }
  );

  return res.json({ reviews });
}
