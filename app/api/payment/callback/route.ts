import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrderStatus, getUser } from "@/lib/db/queries";
import { sendText } from "@/lib/whatsapp/sender";
import { t } from "@/lib/whatsapp/messages";

// PawaPay sends deposit callbacks with:
// { depositId, status: "COMPLETED" | "FAILED", clientReferenceId, ... }
export async function POST(req: NextRequest) {
  const body = await req.json();

  const { status, clientReferenceId } = body;

  if (!clientReferenceId) return NextResponse.json({ ok: true });

  const order = await getOrderById(clientReferenceId);
  if (!order) return NextResponse.json({ ok: true });

  const phone = order.user_id as string;
  const session = await getUser(phone);
  const lang = session?.language ?? "fr";

  if (status === "COMPLETED") {
    await updateOrderStatus(clientReferenceId, "paid");
    await sendText(phone, t("done", lang));
  } else if (status === "FAILED") {
    await updateOrderStatus(clientReferenceId, "failed");
    await sendText(
      phone,
      lang === "fr"
        ? "Votre paiement a échoué. Tapez *menu* pour réessayer."
        : "Your payment failed. Type *menu* to try again."
    );
    await getUser(phone) && await import("@/lib/db/queries").then(q =>
      q.upsertUser({ phone, step: "choose_payment" })
    );
  }

  return NextResponse.json({ ok: true });
}
