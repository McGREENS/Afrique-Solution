import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrderStatus, getUser } from "@/lib/db/queries";
import { sendText } from "@/lib/whatsapp/sender";
import { t } from "@/lib/whatsapp/messages";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  // Verify Flutterwave signature
  const signature = req.headers.get("verif-hash");
  if (signature !== process.env.FLUTTERWAVE_WEBHOOK_HASH) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { status, tx_ref, id: flw_transaction_id } = body.data ?? {};

  if (!tx_ref) return NextResponse.json({ ok: true });

  // Verify the transaction with Flutterwave
  const verifyRes = await fetch(
    `https://api.flutterwave.com/v3/transactions/${flw_transaction_id}/verify`,
    {
      headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` },
    }
  );
  const verify = await verifyRes.json();
  const verified = verify.status === "success" && verify.data?.status === "successful";

  const order = await getOrderById(tx_ref);
  if (!order) return NextResponse.json({ ok: true });

  if (verified) {
    await updateOrderStatus(tx_ref, "paid");

    // Notify user on WhatsApp
    const phone = order.user_id as string;
    const session = await getUser(phone);
    const lang = session?.language ?? "fr";

    await sendText(phone, t("done", lang));
    await updateOrderStatus(tx_ref, "paid");
  } else {
    await updateOrderStatus(tx_ref, "failed");

    const phone = order.user_id as string;
    const session = await getUser(phone);
    const lang = session?.language ?? "fr";

    await sendText(
      phone,
      lang === "fr"
        ? "Votre paiement a échoué. Tapez *menu* pour réessayer."
        : "Your payment failed. Type *menu* to try again."
    );
  }

  return NextResponse.json({ ok: true });
}
