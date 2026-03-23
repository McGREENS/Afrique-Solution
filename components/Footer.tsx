"use client";

import { MessageCircle } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+243000000000";
const WA_LINK = `https://wa.me/${WA_NUMBER.replace(/\D/g, "")}`;

const navItems = {
  fr: [
    { label: "Services",           href: "#services" },
    { label: "Comment ça marche",  href: "#how" },
    { label: "Pays",               href: "#countries" },
    { label: "Contact",            href: "#contact" },
  ],
  en: [
    { label: "Services",    href: "#services" },
    { label: "How it works", href: "#how" },
    { label: "Countries",   href: "#countries" },
    { label: "Contact",     href: "#contact" },
  ],
};

const copy = {
  contact:    { fr: "Contact :",              en: "Contact:" },
  startNow:   { fr: "Démarrez maintenant",    en: "Start now" },
  rights:     { fr: "© 2025 Afrique Solution. Tous droits réservés.", en: "© 2025 Afrique Solution. All rights reserved." },
  privacy:    { fr: "Politique de confidentialité", en: "Privacy Policy" },
};

export default function Footer() {
  const { lang } = useLang();
  const t = (obj: { fr: string; en: string }) => obj[lang];

  return (
    <footer id="contact" className="overflow-hidden rounded-t-[42px] bg-[#161a2a] px-8 py-10 text-white md:px-14 md:py-12">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="text-[23px] leading-none">✦</span>
          <span className="text-[32px] font-medium tracking-tight">Afrique Solution</span>
        </div>
        <nav className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[18px] text-white/90 underline underline-offset-4">
          {navItems[lang].map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>
      </div>

      <div className="mb-8 grid gap-8 md:grid-cols-[1fr_1.45fr] md:items-center">
        <div>
          <span className="mb-5 inline-block rounded-md bg-[#b4f75f] px-2 py-1 text-[22px] font-medium text-[#161a2a]">
            {t(copy.contact)}
          </span>
          <p className="mb-3 text-[22px] text-white/90">
            WhatsApp :{" "}
            <a href={WA_LINK} className="underline underline-offset-4">{WA_NUMBER}</a>
          </p>
          <p className="mb-3 text-[22px] text-white/90">Email : contact@afriquesolution.site</p>
          <p className="text-[20px] text-white/70">DRC · Rwanda · Burundi</p>
        </div>

        <div className="rounded-2xl bg-[#292c3a] p-6 md:p-8">
          <p className="mb-4 text-[20px] text-white/80">{t(copy.startNow)}</p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-2xl bg-[#25D366] px-8 py-4 text-[22px] font-medium text-white transition-opacity hover:opacity-90"
          >
            <MessageCircle size={22} strokeWidth={2} />
            WhatsApp
          </a>
        </div>
      </div>

      <div className="my-8 h-px w-full bg-white/35" />

      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[20px] text-white/90">
        <span>{t(copy.rights)}</span>
        <a href="#" className="underline underline-offset-4">{t(copy.privacy)}</a>
      </div>
    </footer>
  );
}
