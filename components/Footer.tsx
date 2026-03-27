"use client";

import { MessageCircle, Mail, MapPin, Phone } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+243000000000";
const WA_LINK = `https://wa.me/${WA_NUMBER.replace(/\D/g, "")}`;

const copy = {
  tagline: {
    fr: "La plateforme digitale de recharge TV et télécom pour l'Afrique Centrale.",
    en: "The digital recharge platform for TV and telecom in Central Africa.",
  },
  colServices: { fr: "Services", en: "Services" },
  colCompany:  { fr: "Entreprise", en: "Company" },
  colContact:  { fr: "Contact", en: "Contact" },
  startNow:    { fr: "Démarrer sur WhatsApp", en: "Start on WhatsApp" },
  rights:      { fr: "© 2025 Afrique Solution. Tous droits réservés.", en: "© 2025 Afrique Solution. All rights reserved." },
  privacy:     { fr: "Politique de confidentialité", en: "Privacy Policy" },
  terms:       { fr: "Conditions d'utilisation", en: "Terms of use" },
};

const services = {
  fr: ["Canal+", "DStv", "Vodacom", "Airtel", "Orange", "Internet"],
  en: ["Canal+", "DStv", "Vodacom", "Airtel", "Orange", "Internet"],
};

const company = {
  fr: [
    { label: "À propos",         href: "#" },
    { label: "Comment ça marche", href: "#how" },
    { label: "Pays couverts",    href: "#countries" },
    { label: "Contact",          href: "#contact" },
  ],
  en: [
    { label: "About us",    href: "#" },
    { label: "How it works", href: "#how" },
    { label: "Countries",   href: "#countries" },
    { label: "Contact",     href: "#contact" },
  ],
};

const operators = ["Canal+", "DStv", "Vodacom", "Airtel", "Orange"];

export default function Footer() {
  const { lang } = useLang();
  const t = (obj: { fr: string; en: string }) => obj[lang];

  return (
    <footer id="contact" className="bg-[#0f1220] text-white rounded-t-[42px] overflow-hidden">

      {/* ── MAIN GRID ── */}
      <div className="mx-auto max-w-[1440px] px-8 py-16 md:px-14">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr]">

          {/* Brand column */}
          <div>
            <div className="mb-5 flex items-center gap-2">
              <span className="text-[22px] leading-none text-[#b4f75f]">✦</span>
              <span className="text-[26px] font-medium tracking-tight">Afrique Solution</span>
            </div>
            <p className="mb-8 max-w-[300px] text-[15px] leading-[1.7] text-white/60">
              {t(copy.tagline)}
            </p>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle size={18} strokeWidth={2} />
              {t(copy.startNow)}
            </a>
          </div>

          {/* Services column */}
          <div>
            <h4 className="mb-5 text-[13px] font-semibold uppercase tracking-widest text-[#b4f75f]">
              {t(copy.colServices)}
            </h4>
            <ul className="flex flex-col gap-3">
              {services[lang].map((s) => (
                <li key={s}>
                  <a href="#services" className="text-[15px] text-white/65 transition-colors hover:text-white">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h4 className="mb-5 text-[13px] font-semibold uppercase tracking-widest text-[#b4f75f]">
              {t(copy.colCompany)}
            </h4>
            <ul className="flex flex-col gap-3">
              {company[lang].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-[15px] text-white/65 transition-colors hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="mb-5 text-[13px] font-semibold uppercase tracking-widest text-[#b4f75f]">
              {t(copy.colContact)}
            </h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MessageCircle size={17} strokeWidth={1.8} className="mt-0.5 shrink-0 text-[#b4f75f]" />
                <a href={WA_LINK} className="text-[15px] text-white/65 transition-colors hover:text-white">
                  {WA_NUMBER}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={17} strokeWidth={1.8} className="mt-0.5 shrink-0 text-[#b4f75f]" />
                <a href="mailto:contact@afriquesolution.site" className="text-[15px] text-white/65 transition-colors hover:text-white">
                  contact@afriquesolution.site
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={17} strokeWidth={1.8} className="mt-0.5 shrink-0 text-[#b4f75f]" />
                <span className="text-[15px] text-white/65">DRC · Rwanda · Burundi</span>
              </li>
            </ul>

            {/* Operator tags */}
            <div className="mt-8">
              <p className="mb-3 text-[12px] uppercase tracking-widest text-white/35">Partners</p>
              <div className="flex flex-wrap gap-2">
                {operators.map((op) => (
                  <span
                    key={op}
                    className="rounded-lg border border-white/10 px-3 py-1 text-[12px] font-medium text-white/50"
                  >
                    {op}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-8 py-5 md:px-14">
          <span className="text-[13px] text-white/40">{t(copy.rights)}</span>
          <div className="flex items-center gap-6 text-[13px] text-white/40">
            <a href="#" className="transition-colors hover:text-white">{t(copy.privacy)}</a>
            <a href="#" className="transition-colors hover:text-white">{t(copy.terms)}</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
