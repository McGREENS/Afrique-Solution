import { UserSession, Step, Language, Service, Region, Action, PaymentMethod } from "@/types";
import { upsertUser, createOrder } from "@/lib/db/queries";
import { getProducts as getCatalogProducts, CatalogService, CatalogRegion } from "@/lib/services/catalog";
import { sendText, sendButtons, sendList } from "@/lib/whatsapp/sender";
import { t } from "@/lib/whatsapp/messages";

export async function processMessage(session: UserSession, incoming: string) {
  const lang = session.language ?? "fr";
  const msg = incoming.trim().toLowerCase();

  switch (session.step as Step) {
    case "choose_language":
      return handleChooseLanguage(session, msg);

    case "choose_service":
      return handleChooseService(session, msg, lang);

    case "choose_region":
      return handleChooseRegion(session, msg, lang);

    case "choose_action":
      return handleChooseAction(session, msg, lang);

    case "choose_product":
      return handleChooseProduct(session, msg, lang);

    case "enter_decoder":
      return handleEnterDecoder(session, incoming, lang);

    case "choose_payment":
      return handleChoosePayment(session, msg, lang);

    default:
      await sendText(session.phone, t("invalid", lang));
  }
}

async function handleChooseLanguage(session: UserSession, msg: string) {
  if (msg === "en" || msg === "english") {
    await upsertUser({ phone: session.phone, language: "en", step: "choose_service" });
    await sendServiceMenu(session.phone, "en");
  } else if (msg === "fr" || msg === "français" || msg === "francais") {
    await upsertUser({ phone: session.phone, language: "fr", step: "choose_service" });
    await sendServiceMenu(session.phone, "fr");
  } else {
    await sendButtons(session.phone, t("welcome", "fr"), [
      { id: "en", title: "English" },
      { id: "fr", title: "Français" },
    ]);
  }
}

async function sendServiceMenu(phone: string, lang: Language) {
  await sendList(phone, t("choose_service", lang), lang === "fr" ? "Voir services" : "View services", [
    {
      title: "TV",
      rows: [
        { id: "canal", title: "Canal+" },
        { id: "dstv", title: "DSTV" },
      ],
    },
    {
      title: lang === "fr" ? "Télécom" : "Telecom",
      rows: [
        { id: "vodacom", title: "Vodacom" },
        { id: "airtel", title: "Airtel" },
        { id: "orange", title: "Orange" },
      ],
    },
    {
      title: "Internet",
      rows: [
        { id: "internet", title: "Internet" },
        { id: "assistance", title: lang === "fr" ? "Assistance" : "Assistance" },
      ],
    },
  ]);
}

async function handleChooseService(session: UserSession, msg: string, lang: Language) {
  const validServices: Service[] = ["canal", "dstv", "vodacom", "airtel", "orange", "internet", "assistance"];
  if (!validServices.includes(msg as Service)) {
    await sendText(session.phone, t("invalid", lang));
    return;
  }

  if (msg === "assistance") {
    await sendText(session.phone, t("assistance", lang));
    await upsertUser({ phone: session.phone, step: "done" });
    return;
  }

  await upsertUser({ phone: session.phone, selected_service: msg as Service, step: "choose_region" });
  await sendButtons(session.phone, t("choose_region", lang), [
    { id: "drc", title: "DRC 🇨🇩" },
    { id: "rwanda", title: "Rwanda 🇷🇼" },
    { id: "burundi", title: "Burundi 🇧🇮" },
  ]);
}

async function handleChooseRegion(session: UserSession, msg: string, lang: Language) {
  const validRegions: Region[] = ["drc", "rwanda", "burundi"];
  if (!validRegions.includes(msg as Region)) {
    await sendText(session.phone, t("invalid", lang));
    return;
  }

  const service = session.selected_service;
  const isTelecom = ["vodacom", "airtel", "orange"].includes(service ?? "");

  if (isTelecom) {
    // Telecom goes straight to product selection
    await upsertUser({ phone: session.phone, selected_region: msg as Region, step: "choose_product" });
    const products = getCatalogProducts(service as CatalogService, msg as CatalogRegion);
    await sendProductList(session.phone, lang, products);
  } else {
    await upsertUser({ phone: session.phone, selected_region: msg as Region, step: "choose_action" });
    await sendButtons(session.phone, t("choose_action", lang), [
      { id: "subscribe", title: lang === "fr" ? "Abonnement" : "Subscribe" },
      { id: "reactivate", title: lang === "fr" ? "Réactivation" : "Reactivate" },
      { id: "modify", title: lang === "fr" ? "Modifier forfait" : "Modify Package" },
    ]);
  }
}

async function handleChooseAction(session: UserSession, msg: string, lang: Language) {
  const validActions: Action[] = ["subscribe", "reactivate", "modify"];
  if (!validActions.includes(msg as Action)) {
    await sendText(session.phone, t("invalid", lang));
    return;
  }

  await upsertUser({ phone: session.phone, selected_action: msg as Action, step: "choose_product" });
  const products = getCatalogProducts(session.selected_service as CatalogService, session.selected_region as CatalogRegion);
  await sendProductList(session.phone, lang, products);
}

async function sendProductList(phone: string, lang: Language, products: { id: string; name: string; price: number }[]) {
  if (!products.length) {
    await sendText(phone, lang === "fr" ? "Aucun forfait disponible pour cette région." : "No packages available for this region.");
    return;
  }
  await sendList(phone, t("choose_product", lang), lang === "fr" ? "Choisir" : "Choose", [
    {
      title: lang === "fr" ? "Forfaits disponibles" : "Available packages",
      rows: products.map((p) => ({
        id: p.id,
        title: p.name,
        description: `$${p.price}`,
      })),
    },
  ]);
}

async function handleChooseProduct(session: UserSession, msg: string, lang: Language) {
  await upsertUser({ phone: session.phone, selected_product_id: msg, step: "enter_decoder" });
  await sendText(session.phone, t("enter_decoder", lang));
}

async function handleEnterDecoder(session: UserSession, raw: string, lang: Language) {
  await upsertUser({ phone: session.phone, decoder_number: raw.trim(), step: "choose_payment" });

  const region = session.selected_region ?? "drc";
  const buttons: { id: string; title: string }[] = [];

  if (region === "drc") {
    buttons.push(
      { id: "airtel_money", title: "Airtel Money" },
      { id: "mpesa", title: "Vodacom M-Pesa" },
      { id: "orange_money", title: "Orange Money" }
    );
  } else if (region === "rwanda") {
    buttons.push(
      { id: "airtel_money", title: "Airtel Money" },
      { id: "mpesa", title: "MTN MoMo" }
    );
  } else {
    buttons.push({ id: "airtel_money", title: "Airtel Money" });
  }

  await sendButtons(session.phone, t("choose_payment", lang), buttons);
}

async function handleChoosePayment(session: UserSession, msg: string, lang: Language) {
  const validMethods: PaymentMethod[] = ["airtel_money", "mpesa", "orange_money"];
  if (!validMethods.includes(msg as PaymentMethod)) {
    await sendText(session.phone, t("invalid", lang));
    return;
  }

  await upsertUser({ phone: session.phone, payment_method: msg as PaymentMethod, step: "awaiting_payment" });

  const orderId = await createOrder({
    user_id: session.phone,
    product_id: session.selected_product_id!,
    decoder_number: session.decoder_number!,
    payment_method: msg,
  });

  const allProducts = getCatalogProducts(
    session.selected_service as CatalogService,
    session.selected_region as CatalogRegion
  );
  const product = allProducts.find((p) => p.id === session.selected_product_id);

  const paymentNumbers: Record<PaymentMethod, string> = {
    airtel_money: "+250796552804",
    mpesa:        "+250780115764", 
    orange_money: "+250796552804",
  };

  const paymentLabels: Record<PaymentMethod, string> = {
    airtel_money: "Airtel Money",
    mpesa:        "Vodacom M-Pesa",
    orange_money: "Orange Money",
  };

  const number = paymentNumbers[msg as PaymentMethod];
  const label  = paymentLabels[msg as PaymentMethod];

  const instructions = lang === "fr"
    ? `✅ *Commande reçue !*\n\n` +
      `📦 *Forfait :* ${product?.name ?? session.selected_product_id}\n` +
      `💰 *Montant :* $${product?.price ?? "—"}\n` +
      `📟 *Décodeur :* ${session.decoder_number}\n` +
      `🆔 *Référence :* ${orderId.slice(0, 8).toUpperCase()}\n\n` +
      `👉 Envoyez *$${product?.price ?? "—"}* via *${label}* au numéro :\n` +
      `*${number}*\n\n` +
      `Mentionnez la référence *${orderId.slice(0, 8).toUpperCase()}* dans le commentaire.\n\n` +
      `⏳ Votre abonnement sera activé dans les *30 minutes* après confirmation du paiement.`
    : `✅ *Order received!*\n\n` +
      `📦 *Package:* ${product?.name ?? session.selected_product_id}\n` +
      `💰 *Amount:* $${product?.price ?? "—"}\n` +
      `📟 *Decoder:* ${session.decoder_number}\n` +
      `🆔 *Reference:* ${orderId.slice(0, 8).toUpperCase()}\n\n` +
      `👉 Send *$${product?.price ?? "—"}* via *${label}* to:\n` +
      `*${number}*\n\n` +
      `Include reference *${orderId.slice(0, 8).toUpperCase()}* in the comment.\n\n` +
      `⏳ Your subscription will be activated within *30 minutes* after payment confirmation.`;

  await sendText(session.phone, instructions);
}
