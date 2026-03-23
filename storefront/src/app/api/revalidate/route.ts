import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/revalidate
 *
 * On-demand ISR revalidation endpoint.
 * Called by Medusa backend when products/categories change.
 *
 * Body: { tag: "products" | "categories", secret: string }
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { tag, secret } = body as { tag?: string; secret?: string };

  // Verify secret
  const expectedSecret = process.env.REVALIDATE_SECRET;
  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json(
      { message: "Invalid revalidation secret" },
      { status: 401 }
    );
  }

  if (!tag) {
    return NextResponse.json(
      { message: "Missing tag parameter" },
      { status: 400 }
    );
  }

  try {
    revalidateTag(tag);
    return NextResponse.json({
      revalidated: true,
      tag,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error revalidating", error: String(error) },
      { status: 500 }
    );
  }
}
