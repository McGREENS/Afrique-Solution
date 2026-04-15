import { NextRequest, NextResponse } from "next/server";
import { getUser, upsertUser, isMessageProcessed, markMessageProcessed } from "@/lib/db/queries";
import { processMessage } from "@/lib/flow/engine";
import { whatsappWebProvider } from "@/lib/messaging/whatsapp-web-instance";
import { t } from "@/lib/whatsapp/messages";

// Handle incoming messages from WhatsApp Web
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
    const text: string = message.text?.body ?? "";

    let session = await getUser(phone);

    if (!session) {
      await upsertUser({ phone, language: "fr", step: "choose_language" });
      session = await getUser(phone);
      
      // Send welcome message via WhatsApp Web
      await whatsappWebProvider.sendButtons(phone, t("welcome", "fr"), [
        { id: "en", title: "English" },
        { id: "fr", title: "Français" },
      ]);
      return NextResponse.json({ status: "ok" });
    }

    // Allow user to restart at any time
    if (text.toLowerCase() === "menu" || text.toLowerCase() === "restart") {
      await upsertUser({ phone, step: "choose_language" });
      await whatsappWebProvider.sendButtons(phone, t("welcome", session.language ?? "fr"), [
        { id: "en", title: "English" },
        { id: "fr", title: "Français" },
      ]);
      return NextResponse.json({ status: "ok" });
    }

    await processMessage(session, text);
  } catch (err) {
    console.error("WhatsApp Web webhook error:", err);
  }

  return NextResponse.json({ status: "ok" });
}