"use client";

import { MessageCircle, Mail, MapPin, Phone, Smartphone } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+243822100111";
const WA_LINK   = `https://wa.me/${WA_NUMBER.replace(/\D/g, "")}`;

const copy = {
  tagline:    { fr: "La plateforme digitale de recharge TV et télécom pour l'Afrique Centrale.", en: "The digital recharge platform for TV and telecom in Central Africa." },
  colServices: { fr: "Services",    en: "Services" },
  colCompany:  { fr: "Entreprise",  en: "Company" },
  colApp:      { fr: "Application", en: "App" },
  colContact:  { fr: "Contact",     en: "Contact" },
  startWA:     { fr: "Démarrer sur WhatsApp", en: "Start on WhatsApp" },
  appSoon:     { fr: "Bientôt disponible",    en: "Coming soon" },
  appDesc:     { fr: "Téléchargez l'app Afrisol pour payer vos abonnements directement depuis votre téléphone.", en: "Download the Afrisol app to pay your subscriptions directly from your phone." },
  appStore:    { fr: "App Store — Bientôt",    en: "App Store — Soon" },
  playStore:   { fr: "Google Play — Bientôt",  en: "Google Play — Soon" },
  rights:      { fr: "© 2025 Afri Sol – La Divinité LTD. Tous droits réservés.", en: "© 2025 Afri Sol – La Divinité LTD. All rights reserved." },
  privacy:     { fr: "Politique de confidentialité", en: "Privacy Policy" },
  terms:       { fr: "Conditions d'utilisation",     en: "Terms of use" },
  poweredBy:   { fr: "Paiements via",                en: "Payments via" },
};

const services = ["Canal+", "DStv", "StarTimes", "Vodacom", "Airtel", "Orange"];

const company = {
  fr: [
    { label: "Accueil",            href: "/" },
    { label: "À propos",           href: "/about" },
    { label: "Comment ça marche",  href: "#how" },
    { label: "Pays couverts",      href: "#countries" },
  ],
  en: [
    { label: "Home",        href: "/" },
    { label: "About us",    href: "/about" },
    { label: "How it works", href: "#how" },
    { label: "Countries",   href: "#countries" },
  ],
};

export default function Footer() {
  const { lang } = useLang();
  const t = (obj: { fr: string; en: string }) => obj[lang];

  return (
    <footer id="contact" className="overflow-hidden rounded-t-[42px] bg-[#0f1220] text-white">

      {/* ── MAIN GRID ── */}
      <div className="mx-auto max-w-[1440px] px-8 py-16 md:px-14">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1.4fr]">

          {/* Brand column */}
          <div>
            <div className="mb-5 flex items-center gap-2">
              <span className="text-[22px] leading-none text-[#b4f75f]">✦</span>
              <span className="text-[22px] font-medium tracking-tight">Afrique Solution</span>
            </div>
            <p className="mb-8 max-w-[280px] text-[14px] leading-[1.75] text-white/55">
              {t(copy.tagline)}
            </p>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle size={16} strokeWidth={2} />
              {t(copy.startWA)}
            </a>

            {/* Powered by PawaPay */}
            <div className="mt-8">
              <p className="mb-2 text-[11px] uppercase tracking-widest text-white/30">
                {t(copy.poweredBy)}
              </p>
              <span className="inline-block rounded-lg border border-white/15 px-3 py-1.5 text-[13px] font-semibold text-white/60">
                PawaPay
              </span>
            </div>
          </div>

          {/* Services column */}
          <div>
            <h4 className="mb-5 text-[11px] font-semibold uppercase tracking-widest text-[#b4f75f]">
              {t(copy.colServices)}
            </h4>
            <ul className="flex flex-col gap-3">
              {services.map((s) => (
                <li key={s}>
                  <a href="#services" className="text-[14px] text-white/55 transition-colors hover:text-white">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h4 className="mb-5 text-[11px] font-semibold uppercase tracking-widest text-[#b4f75f]">
              {t(copy.colCompany)}
            </h4>
            <ul className="flex flex-col gap-3">
              {company[lang].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-[14px] text-white/55 transition-colors hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* App column */}
          <div>
            <h4 className="mb-5 text-[11px] font-semibold uppercase tracking-widest text-[#b4f75f]">
              {t(copy.colApp)}
            </h4>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#b4f75f]/40 bg-[#b4f75f]/10 px-3 py-1 text-[12px] font-semibold text-[#b4f75f]">
              <Smartphone size={12} strokeWidth={2.5} />
              {t(copy.appSoon)}
            </div>
            <p className="mb-5 text-[13px] leading-[1.7] text-white/45">
              {t(copy.appDesc)}
            </p>
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[13px] text-white/40">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                {t(copy.appStore)}
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[13px] text-white/40">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0"><path d="M3.18 23.76c.3.17.64.19.96.07l12.43-7.17-2.63-2.63-10.76 9.73zM.44 1.06C.17 1.4 0 1.89 0 2.53v18.94c0 .64.17 1.13.44 1.47l.08.07 10.61-10.61v-.25L.52.99l-.08.07zM20.35 10.32l-2.98-1.72-2.93 2.93 2.93 2.93 2.98-1.72c.85-.49.85-1.93 0-2.42zM3.18.24l12.43 7.17-2.63 2.63L2.22.31C2.54.19 2.88.07 3.18.24z"/></svg>
                {t(copy.playStore)}
              </span>
            </div>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="mb-5 text-[11px] font-semibold uppercase tracking-widest text-[#b4f75f]">
              {t(copy.colContact)}
            </h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <Phone size={15} strokeWidth={1.8} className="mt-0.5 shrink-0 text-[#b4f75f]" />
                <a href="tel:+243822100111" className="text-[14px] text-white/55 transition-colors hover:text-white">
                  +243 822 100 111
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle size={15} strokeWidth={1.8} className="mt-0.5 shrink-0 text-[#b4f75f]" />
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] text-white/55 transition-colors hover:text-white"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={15} strokeWidth={1.8} className="mt-0.5 shrink-0 text-[#b4f75f]" />
                <a href="mailto:info@afriquesolution.site" className="text-[14px] text-white/55 transition-colors hover:text-white">
                  info@afriquesolution.site
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} strokeWidth={1.8} className="mt-0.5 shrink-0 text-[#b4f75f]" />
                <span className="text-[14px] leading-[1.6] text-white/55">
                  Gisenyi, Rubavu, Rwanda
                </span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-8 py-5 md:px-14">
          <span className="text-[13px] text-white/35">{t(copy.rights)}</span>
          <div className="flex items-center gap-6 text-[13px] text-white/35">
            <a href="/privacy" className="transition-colors hover:text-white">{t(copy.privacy)}</a>
            <a href="#"        className="transition-colors hover:text-white">{t(copy.terms)}</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
