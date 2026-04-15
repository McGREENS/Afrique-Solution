import { whatsappWebProvider } from '../messaging/whatsapp-web-instance';

const WA_API_URL = `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
const HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
};

// Helper function to determine which provider to use
function shouldUseWhatsAppWeb(): boolean {
  return whatsappWebProvider.isAvailable();
}

export async function sendText(to: string, body: string) {
  if (shouldUseWhatsAppWeb()) {
    const result = await whatsappWebProvider.send({ to, message: body });
    if (result.success) return;
  }

  // Fallback to WhatsApp Business API
  await fetch(WA_API_URL, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body },
    }),
  });
}

export async function sendButtons(
  to: string,
  body: string,
  buttons: { id: string; title: string }[]
) {
  if (shouldUseWhatsAppWeb()) {
    const success = await whatsappWebProvider.sendButtons(to, body, buttons);
    if (success) return;
  }

  // Fallback to WhatsApp Business API
  await fetch(WA_API_URL, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: body },
        action: {
          buttons: buttons.map((b) => ({
            type: "reply",
            reply: { id: b.id, title: b.title },
          })),
        },
      },
    }),
  });
}

export async function sendList(
  to: string,
  body: string,
  buttonLabel: string,
  sections: { title: string; rows: { id: string; title: string; description?: string }[] }[]
) {
  if (shouldUseWhatsAppWeb()) {
    const success = await whatsappWebProvider.sendList(to, body, buttonLabel, sections);
    if (success) return;
  }

  // Fallback to WhatsApp Business API
  await fetch(WA_API_URL, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "list",
        body: { text: body },
        action: { button: buttonLabel, sections },
      },
    }),
  });
}
