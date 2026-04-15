export const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

export const DEFAULT_REGION = "us";

export const STORE_NAME = "THREAD";

export const ITEMS_PER_PAGE = 12;

export const DEMO_MODE =
  !process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  process.env.NEXT_PUBLIC_DEMO_MODE === "true";
