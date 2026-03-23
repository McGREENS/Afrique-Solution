import { Language } from "@/types";

const messages = {
  welcome: {
    en: "👋 Welcome to *Afrique Solution*!\nChoose your language:",
    fr: "👋 Bienvenue sur *Afrique Solution*!\nChoisissez votre langue :",
  },
  choose_service: {
    en: "What service do you need?",
    fr: "Quel service souhaitez-vous ?",
  },
  choose_region: {
    en: "Select your country:",
    fr: "Sélectionnez votre pays :",
  },
  choose_action: {
    en: "What would you like to do?",
    fr: "Que souhaitez-vous faire ?",
  },
  choose_product: {
    en: "Choose a package:",
    fr: "Choisissez un forfait :",
  },
  enter_decoder: {
    en: "Please enter your decoder number / client ID:",
    fr: "Veuillez entrer votre numéro de décodeur / ID client :",
  },
  choose_payment: {
    en: "Choose your payment method:",
    fr: "Choisissez votre mode de paiement :",
  },
  awaiting_payment: {
    en: "⏳ Your order is being processed. Please complete the payment and we will confirm shortly.",
    fr: "⏳ Votre commande est en cours de traitement. Veuillez effectuer le paiement, nous confirmerons bientôt.",
  },
  done: {
    en: "✅ Payment confirmed! Your subscription is now active. Thank you for choosing Afrique Solution.",
    fr: "✅ Paiement confirmé ! Votre abonnement est maintenant actif. Merci de choisir Afrique Solution.",
  },
  invalid: {
    en: "❌ Invalid option. Please try again.",
    fr: "❌ Option invalide. Veuillez réessayer.",
  },
  assistance: {
    en: "🙋 Our team will contact you shortly. For urgent help, call: +243 XXX XXX XXX",
    fr: "🙋 Notre équipe vous contactera bientôt. Pour une aide urgente, appelez : +243 XXX XXX XXX",
  },
};

export function t(key: keyof typeof messages, lang: Language): string {
  return messages[key][lang] ?? messages[key]["fr"];
}
