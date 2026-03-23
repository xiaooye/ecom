import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { REVIEW_MODULE } from "../../../../modules/review";

// POST /admin/reviews/:id — update review status (approve/reject)
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const reviewModuleService = req.scope.resolve(REVIEW_MODULE);
  const { id } = req.params;
  const { status } = req.body as { status: "approved" | "rejected" };

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const review = await reviewModuleService.updateReviews(id, { status });

  return res.json({ review });
}

// DELETE /admin/reviews/:id
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const reviewModuleService = req.scope.resolve(REVIEW_MODULE);
  const { id } = req.params;

  await reviewModuleService.deleteReviews(id);

  return res.json({ id, deleted: true });
}
