"use client";

import { useLang } from "@/context/LanguageContext";

const content = {
  title:        { fr: "Politique de Confidentialité", en: "Privacy Policy" },
  updated:      { fr: "Dernière mise à jour : 1er avril 2025", en: "Last updated: April 1, 2025" },

  s1_title:     { fr: "1. Qui sommes-nous ?", en: "1. Who are we?" },
  s1_body:      { fr: "Afrique Solution est une plateforme de recharge de services TV et télécom via WhatsApp, opérant en RD Congo, Rwanda et Burundi. Contact : contact@afriquesolution.site", en: "Afrique Solution is a TV and telecom recharge platform via WhatsApp, operating in DR Congo, Rwanda and Burundi. Contact: contact@afriquesolution.site" },

  s2_title:     { fr: "2. Données collectées", en: "2. Data we collect" },
  s2_body:      { fr: "Nous collectons uniquement les données nécessaires au traitement de vos commandes :\n- Numéro de téléphone WhatsApp\n- Numéro de décodeur / ID client\n- Méthode de paiement choisie\n- Historique des commandes", en: "We only collect data necessary to process your orders:\n- WhatsApp phone number\n- Decoder number / client ID\n- Chosen payment method\n- Order history" },

  s3_title:     { fr: "3. Utilisation des données", en: "3. How we use your data" },
  s3_body:      { fr: "Vos données sont utilisées exclusivement pour :\n- Traiter vos commandes de recharge\n- Vous envoyer des confirmations via WhatsApp\n- Améliorer nos services", en: "Your data is used exclusively to:\n- Process your recharge orders\n- Send you confirmations via WhatsApp\n- Improve our services" },

  s4_title:     { fr: "4. Partage des données", en: "4. Data sharing" },
  s4_body:      { fr: "Nous ne vendons jamais vos données. Elles peuvent être partagées uniquement avec nos partenaires de paiement (PawaPay) pour traiter vos transactions.", en: "We never sell your data. It may only be shared with our payment partners (PawaPay) to process your transactions." },

  s5_title:     { fr: "5. Conservation des données", en: "5. Data retention" },
  s5_body:      { fr: "Vos données sont conservées pendant 12 mois après votre dernière commande, puis supprimées.", en: "Your data is retained for 12 months after your last order, then deleted." },

  s6_title:     { fr: "6. Vos droits", en: "6. Your rights" },
  s6_body:      { fr: "Vous pouvez à tout moment demander l'accès, la correction ou la suppression de vos données en nous contactant à : contact@afriquesolution.site", en: "You can at any time request access, correction or deletion of your data by contacting us at: contact@afriquesolution.site" },

  s7_title:     { fr: "7. Sécurité", en: "7. Security" },
  s7_body:      { fr: "Vos données sont stockées de manière sécurisée dans notre base de données. Nous utilisons des connexions chiffrées (HTTPS) pour toutes les communications.", en: "Your data is stored securely in our database. We use encrypted connections (HTTPS) for all communications." },

  s8_title:     { fr: "8. Contact", en: "8. Contact" },
  s8_body:      { fr: "Pour toute question relative à cette politique, contactez-nous :\nEmail : contact@afriquesolution.site\nWhatsApp : +243 XXX XXX XXX", en: "For any questions regarding this policy, contact us:\nEmail: contact@afriquesolution.site\nWhatsApp: +243 XXX XXX XXX" },
};

export default function PrivacyPage() {
  const { lang } = useLang();
  const t = (obj: { fr: string; en: string }) => obj[lang];

  const sections = [
    { title: content.s1_title, body: content.s1_body },
    { title: content.s2_title, body: content.s2_body },
    { title: content.s3_title, body: content.s3_body },
    { title: content.s4_title, body: content.s4_body },
    { title: content.s5_title, body: content.s5_body },
    { title: content.s6_title, body: content.s6_body },
    { title: content.s7_title, body: content.s7_body },
    { title: content.s8_title, body: content.s8_body },
  ];

  return (
    <main className="bg-[#f3f3f3] px-4 pt-28 pb-16 text-[#11111a] md:px-8">
      <div className="mx-auto max-w-[860px] px-6 md:px-12">

        <h1 className="mb-3 text-[42px] font-medium leading-tight tracking-tight">
          {t(content.title)}
        </h1>
        <p className="mb-12 text-[16px] text-[#666]">{t(content.updated)}</p>

        <div className="flex flex-col gap-10">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="mb-3 text-[22px] font-semibold text-[#11111a]">
                {t(s.title)}
              </h2>
              <p className="whitespace-pre-line text-[17px] leading-[1.7] text-[#444]">
                {t(s.body)}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-16 border-t border-[#ddd] pt-8 text-[15px] text-[#888]">
          © 2025 Afrique Solution
        </div>
      </div>
    </main>
  );
}
