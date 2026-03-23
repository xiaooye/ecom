import crypto from "crypto";

interface WebhookPayload {
  event: string;
  data: Record<string, unknown>;
  timestamp: string;
}

interface DispatchResult {
  success: boolean;
  statusCode?: number;
  responseBody?: string;
  error?: string;
  attempt: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 5000, 15000]; // 1s, 5s, 15s

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Send a single webhook request with HMAC-SHA256 signing.
 */
async function sendWebhook(
  url: string,
  body: string,
  headers: Record<string, string>
): Promise<{ ok: boolean; status: number; body: string }> {
  const response = await fetch(url, {
    method: "POST",
    headers,
    body,
    signal: AbortSignal.timeout(10000),
  });

  const responseBody = await response.text().catch(() => "");
  return { ok: response.ok, status: response.status, body: responseBody };
}

/**
 * Dispatch a webhook event with automatic retry on failure.
 * Signs the payload with HMAC-SHA256 if a secret is provided.
 */
export async function dispatchWebhook(
  url: string,
  payload: WebhookPayload,
  secret?: string | null
): Promise<DispatchResult> {
  const body = JSON.stringify(payload);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Webhook-Event": payload.event,
    "X-Webhook-Timestamp": payload.timestamp,
    "X-Webhook-Delivery-Id": crypto.randomUUID(),
  };

  if (secret) {
    const signature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");
    headers["X-Webhook-Signature"] = `sha256=${signature}`;
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await sendWebhook(url, body, headers);

      if (result.ok) {
        return {
          success: true,
          statusCode: result.status,
          responseBody: result.body,
          attempt,
        };
      }

      // 4xx errors are not retryable (client error)
      if (result.status >= 400 && result.status < 500) {
        return {
          success: false,
          statusCode: result.status,
          responseBody: result.body,
          attempt,
        };
      }

      // 5xx errors — retry
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAYS[attempt - 1]);
      } else {
        return {
          success: false,
          statusCode: result.status,
          responseBody: result.body,
          attempt,
        };
      }
    } catch (error) {
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAYS[attempt - 1]);
      } else {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          attempt,
        };
      }
    }
  }

  return { success: false, error: "Max retries exceeded", attempt: MAX_RETRIES };
}
