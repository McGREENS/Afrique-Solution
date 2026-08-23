import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/turso";

/**
 * POST /api/payment/callback
 *
 * Receives deposit status callbacks from PawaPay.
 * PawaPay sends this when a payment reaches a final status:
 * COMPLETED, FAILED, or CANCELLED.
 *
 * Payload shape (PawaPay v1 callback):
 * {
 *   depositId:     string,         // our transaction id
 *   status:        string,         // COMPLETED | FAILED | CANCELLED
 *   amount:        string,
 *   currency:      string,
 *   correspondent: string,
 *   payer:         { type: string, address: { value: string } },
 *   customerTimestamp:  string,
 *   statementDescription: string,
 *   created:       string,
 *   depositedAmount?: string,      // present on COMPLETED
 *   failureReason?: {              // present on FAILED/CANCELLED
 *     failureCode:    string,
 *     failureMessage: string,
 *   }
 * }
 *
 * We must respond with HTTP 200 quickly — PawaPay retries on non-200.
 */

// Terminal statuses we accept from PawaPay
const TERMINAL_STATUSES = new Set(["COMPLETED", "FAILED", "CANCELLED"]);

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = await req.json();
  } catch {
    // Malformed body — respond 200 anyway so PawaPay doesn't retry endlessly
    console.error("[callback] Failed to parse request body");
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const depositId = typeof body.depositId === "string" ? body.depositId : null;
  const status    = typeof body.status    === "string" ? body.status.toUpperCase() : null;

  console.log("[callback] Received:", { depositId, status });

  // Validate required fields
  if (!depositId || !status) {
    console.error("[callback] Missing depositId or status:", body);
    return NextResponse.json({ received: true }, { status: 200 });
  }

  // Only process terminal statuses
  if (!TERMINAL_STATUSES.has(status)) {
    // Non-terminal (e.g. ACCEPTED, SUBMITTED) — acknowledge but don't update
    console.log("[callback] Non-terminal status, skipping DB update:", status);
    return NextResponse.json({ received: true }, { status: 200 });
  }

  try {
    await updateOrderStatus(depositId, status);
    console.log("[callback] Updated order", depositId, "→", status);
  } catch (e) {
    // Log but still return 200 — PawaPay should not retry due to our DB errors
    console.error("[callback] DB update failed for", depositId, e);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

// PawaPay may send a HEAD request to verify the URL is reachable
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
