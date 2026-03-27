import { NextRequest, NextResponse } from "next/server";
import { getUser, upsertUser, isMessageProcessed, markMessageProcessed } from "@/lib/db/queries";
import { processMessage } from "@/lib/flow/engine";
import { sendButtons } from "@/lib/whatsapp/sender";
import { t } from "@/lib/whatsapp/messages";

// Webhook verification (Meta challenge)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

// Incoming messages
export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const entry = body?.entry?.[0];
    const change = entry?.changes?.[0];
    const message = change?.value?.messages?.[0];

    if (!message) return NextResponse.json({ status: "no_message" });

    // Deduplicate — ignore already processed message IDs
    const messageId = message.id as string;
    if (await isMessageProcessed(messageId)) {
      return NextResponse.json({ status: "duplicate" });
    }
    await markMessageProcessed(messageId);

    const phone = message.from as string;
    const text: string =
      message.type === "interactive"
        ? (message.interactive?.button_reply?.id ?? message.interactive?.list_reply?.id ?? "")
        : (message.text?.body ?? "");

    let session = await getUser(phone);

    if (!session) {
      await upsertUser({ phone, language: "fr", step: "choose_language" });
      session = await getUser(phone);
      await sendButtons(phone, t("welcome", "fr"), [
        { id: "en", title: "English" },
        { id: "fr", title: "Français" },
      ]);
      return NextResponse.json({ status: "ok" });
    }

    // Allow user to restart at any time
    if (text.toLowerCase() === "menu" || text.toLowerCase() === "restart") {
      await upsertUser({ phone, step: "choose_language" });
      await sendButtons(phone, t("welcome", session.language ?? "fr"), [
        { id: "en", title: "English" },
        { id: "fr", title: "Français" },
      ]);
      return NextResponse.json({ status: "ok" });
    }

    await processMessage(session, text);
  } catch (err) {
    console.error("Webhook error:", err);
  }

  return NextResponse.json({ status: "ok" });
}
