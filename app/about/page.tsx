"use client";

import { MapPin, Phone, Mail, MessageCircle, Tv2, Signal, Globe, Satellite, Smartphone, CheckCircle } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+243822100111";
const WA_LINK   = `https://wa.me/${WA_NUMBER.replace(/\D/g, "")}`;

const copy = {
  hero: {
    badge:  { fr: "À propos",          en: "About us" },
    title:  { fr: "Une plateforme\nconstruite pour\nl'Afrique Centrale", en: "A platform\nbuilt for\nCentral Africa" },
    sub:    { fr: "Afri Sol – La Divinité LTD est une entreprise digitale spécialisée dans la recharge d'abonnements TV et télécom via mobile, opérant en RD Congo, Rwanda et Burundi.", en: "Afri Sol – La Divinité LTD is a digital company specialised in TV and telecom subscription recharges via mobile, operating in DR Congo, Rwanda and Burundi." },
  },
  mission: {
    badge:  { fr: "Notre mission",      en: "Our mission" },
    title:  { fr: "Rendre les services numériques accessibles à tous", en: "Making digital services accessible to everyone" },
    body:   { fr: "Notre mission est de simplifier l'accès aux services TV et télécom pour les populations d'Afrique Centrale — en éliminant les déplacements, les files d'attente et les intermédiaires. Avec notre application mobile Afrisol et notre service WhatsApp, vous pouvez recharger n'importe quel forfait en moins de 5 minutes, depuis n'importe où.", en: "Our mission is to simplify access to TV and telecom services for people across Central Africa — eliminating travel, queues and middlemen. With our Afrisol mobile app and WhatsApp service, you can recharge any package in under 5 minutes, from anywhere." },
  },
  services: {
    badge:  { fr: "Nos services",       en: "Our services" },
    title:  { fr: "Tout ce dont vous avez besoin", en: "Everything you need" },
    items: [
      { icon: Tv2,       label: { fr: "Canal+",    en: "Canal+" },    desc: { fr: "Abonnement, réactivation, changement de bouquet", en: "Subscription, reactivation, package change" } },
      { icon: Satellite, label: { fr: "DStv",      en: "DStv" },      desc: { fr: "Recharge et gestion de compte DStv", en: "DStv account recharge and management" } },
      { icon: Tv2,       label: { fr: "StarTimes",  en: "StarTimes" }, desc: { fr: "Abonnements StarTimes toutes formules", en: "StarTimes subscriptions, all packages" } },
      { icon: Signal,    label: { fr: "Vodacom",   en: "Vodacom" },    desc: { fr: "Unités et data Vodacom M-Pesa", en: "Vodacom M-Pesa units and data" } },
      { icon: Signal,    label: { fr: "Airtel",    en: "Airtel" },     desc: { fr: "Recharge Airtel Money et data", en: "Airtel Money and data recharge" } },
      { icon: Globe,     label: { fr: "Orange",    en: "Orange" },     desc: { fr: "Crédit et internet Orange", en: "Orange credit and internet" } },
    ],
  },
  values: {
    badge:  { fr: "Nos valeurs",        en: "Our values" },
    items: [
      { fr: "Rapidité — activation en moins de 5 minutes", en: "Speed — activation in under 5 minutes" },
      { fr: "Fiabilité — paiements sécurisés via PawaPay", en: "Reliability — secure payments via PawaPay" },
      { fr: "Accessibilité — app mobile et WhatsApp",      en: "Accessibility — mobile app and WhatsApp" },
      { fr: "Transparence — aucun frais caché",            en: "Transparency — no hidden fees" },
      { fr: "Support 24h/7j — toujours disponible",       en: "24/7 support — always available" },
    ],
  },
  coverage: {
    badge:  { fr: "Couverture",         en: "Coverage" },
    title:  { fr: "Pays desservis",     en: "Countries served" },
    items: [
      { flag: "🇨🇩", name: "RD Congo",  status: { fr: "Actif",   en: "Live" },   live: true,  desc: { fr: "Airtel Money · M-Pesa · Orange Money", en: "Airtel Money · M-Pesa · Orange Money" } },
      { flag: "🇷🇼", name: "Rwanda",    status: { fr: "Actif",   en: "Live" },   live: true,  desc: { fr: "MTN MoMo · Airtel Money",              en: "MTN MoMo · Airtel Money" } },
      { flag: "🇧🇮", name: "Burundi",   status: { fr: "Bientôt", en: "Soon" },   live: false, desc: { fr: "Airtel Money · Orange Money",           en: "Airtel Money · Orange Money" } },
    ],
  },
  company: {
    badge:  { fr: "Informations légales", en: "Legal information" },
    title:  { fr: "Afri Sol – La Divinité LTD", en: "Afri Sol – La Divinité LTD" },
    address: { fr: "Siège social",        en: "Registered office" },
    addressVal: "Gisenyi, Rubavu, Rwanda — Nyarubande, Mbugangari, Iburengerazuba",
    phone:   { fr: "Téléphone",           en: "Phone" },
    email:   { fr: "Email",              en: "Email" },
  },
  cta: {
    title:  { fr: "Prêt à commencer ?",  en: "Ready to start?" },
    body:   { fr: "Téléchargez l'app Afrisol ou envoyez-nous un message WhatsApp.", en: "Download the Afrisol app or send us a WhatsApp message." },
    wa:     { fr: "Démarrer sur WhatsApp", en: "Start on WhatsApp" },
    app:    { fr: "Voir l'application",    en: "See the app" },
  },
};

// ─────────────────────────────────────────────────────────────────────────────

function Inner() {
  const { lang } = useLang();
  const t = (obj: { fr: string; en: string }) => obj[lang];

  return (
    <>
      <Navbar />
      <main className="bg-[#f3f3f3] px-4 pt-28 pb-5 text-[#11111a] md:px-8">
        <div className="mx-auto max-w-[1440px] px-6 pb-10 md:px-12 md:pb-12">

          {/* ── HERO ── */}
          <section className="mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c9c9c9] bg-white px-4 py-2 text-[14px] font-medium text-[#444] mb-7">
              <span className="flex h-2 w-2 rounded-full bg-[#b4f75f]" />
              {t(copy.hero.badge)}
            </div>
            <div className="grid items-end gap-8 lg:grid-cols-[1fr_1fr]">
              <h1 className="whitespace-pre-line text-[52px] font-medium leading-[1.08] tracking-tight md:text-[68px]">
                {t(copy.hero.title)}
              </h1>
              <p className="max-w-[500px] text-[20px] leading-[1.55] text-[#343438] lg:pb-2">
                {t(copy.hero.sub)}
              </p>
            </div>
          </section>

          {/* ── MISSION ── */}
          <section className="mb-16 overflow-hidden rounded-[40px] bg-[#161a2a] px-8 py-12 text-white md:px-14 md:py-14">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[13px] font-semibold text-[#b4f75f]">
              {t(copy.mission.badge)}
            </div>
            <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1fr]">
              <h2 className="text-[34px] font-medium leading-[1.15] md:text-[42px]">
                {t(copy.mission.title)}
              </h2>
              <p className="text-[18px] leading-[1.7] text-white/70 lg:pt-1">
                {t(copy.mission.body)}
              </p>
            </div>
          </section>

          {/* ── SERVICES ── */}
          <section className="mb-16">
            <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
              <h2 className="inline-block w-fit rounded-md bg-[#b4f75f] px-2 py-1 text-4xl font-medium md:text-[42px]">
                {t(copy.services.title)}
              </h2>
              <p className="max-w-[500px] text-[20px] leading-[1.45] text-[#2d2d33]">
                {t(copy.services.badge)}
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {copy.services.items.map((svc, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-[28px] border border-[#d8d8d8] bg-white px-6 py-6"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#b4f75f]">
                    <svc.icon size={22} strokeWidth={1.8} className="text-[#161a2a]" />
                  </div>
                  <div>
                    <p className="mb-1 text-[17px] font-semibold text-[#11111a]">{t(svc.label)}</p>
                    <p className="text-[14px] leading-[1.6] text-[#666]">{t(svc.desc)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── VALUES ── */}
          <section className="mb-16">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#c9c9c9] bg-white px-4 py-2 text-[14px] font-medium text-[#444]">
              <span className="flex h-2 w-2 rounded-full bg-[#b4f75f]" />
              {t(copy.values.badge)}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {copy.values.items.map((v, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-[24px] border border-[#d8d8d8] bg-white px-6 py-5"
                >
                  <CheckCircle size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-[#b4f75f]" />
                  <p className="text-[15px] leading-[1.55] text-[#333]">{t(v)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── COVERAGE ── */}
          <section className="mb-16">
            <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
              <h2 className="inline-block w-fit rounded-md bg-[#b4f75f] px-2 py-1 text-4xl font-medium md:text-[42px]">
                {t(copy.coverage.title)}
              </h2>
              <p className="max-w-[400px] text-[20px] leading-[1.45] text-[#2d2d33]">
                {t(copy.coverage.badge)}
              </p>
            </div>

            <div className="grid overflow-hidden rounded-[34px] bg-[#161a2a] text-white md:grid-cols-3">
              {copy.coverage.items.map((c, i) => (
                <article
                  key={c.name}
                  className={["px-8 py-10 md:px-10 md:py-12", i < copy.coverage.items.length - 1 ? "border-b border-white/25 md:border-b-0 md:border-r" : ""].join(" ")}
                >
                  <div className="mb-4 text-[44px]">{c.flag}</div>
                  <div className="mb-3 flex items-center gap-3">
                    <p className="text-[26px] font-medium text-[#b4f75f]">{c.name}</p>
                    <span className={[
                      "rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                      c.live ? "bg-[#b4f75f]/20 text-[#b4f75f]" : "bg-white/10 text-white/40",
                    ].join(" ")}>
                      {t(c.status)}
                    </span>
                  </div>
                  <p className="text-[15px] leading-[1.6] text-white/60">{t(c.desc)}</p>
                </article>
              ))}
            </div>
          </section>

          {/* ── COMPANY INFO ── */}
          <section className="mb-16">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#c9c9c9] bg-white px-4 py-2 text-[14px] font-medium text-[#444]">
              <span className="flex h-2 w-2 rounded-full bg-[#b4f75f]" />
              {t(copy.company.badge)}
            </div>

            <div className="overflow-hidden rounded-[34px] border border-[#d8d8d8] bg-white">
              <div className="border-b border-[#ebebeb] px-8 py-6 md:px-10">
                <div className="flex items-center gap-3">
                  <span className="text-[20px] leading-none text-[#b4f75f]">✦</span>
                  <h3 className="text-[22px] font-semibold text-[#11111a]">{t(copy.company.title)}</h3>
                </div>
              </div>

              <div className="grid gap-0 md:grid-cols-2">
                {[
                  {
                    icon: MapPin,
                    label: t(copy.company.address),
                    value: copy.company.addressVal,
                    href: null,
                  },
                  {
                    icon: Phone,
                    label: t(copy.company.phone),
                    value: "+243 822 100 111",
                    href: "tel:+243822100111",
                  },
                  {
                    icon: Mail,
                    label: t(copy.company.email),
                    value: "info@afriquesolution.site",
                    href: "mailto:info@afriquesolution.site",
                  },
                  {
                    icon: MessageCircle,
                    label: "WhatsApp",
                    value: WA_NUMBER,
                    href: WA_LINK,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={[
                      "flex items-start gap-4 px-8 py-6 md:px-10",
                      i % 2 === 0 ? "md:border-r border-[#ebebeb]" : "",
                      i < 2 ? "border-b border-[#ebebeb]" : "",
                    ].join(" ")}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f3f3f3]">
                      <item.icon size={18} strokeWidth={1.8} className="text-[#b4f75f]" />
                    </div>
                    <div>
                      <p className="mb-0.5 text-[12px] uppercase tracking-widest text-[#999]">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-[16px] font-medium text-[#11111a] transition-opacity hover:opacity-60">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-[15px] leading-[1.6] text-[#444]">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="overflow-hidden rounded-[34px] bg-[#ececec] px-8 py-10 md:px-14 md:py-12">
            <div className="max-w-[520px]">
              <h3 className="mb-4 text-[38px] font-medium leading-[1.1]">{t(copy.cta.title)}</h3>
              <p className="mb-8 text-[19px] leading-[1.5] text-[#36363f]">{t(copy.cta.body)}</p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-2xl bg-[#25D366] px-7 py-4 text-[17px] font-medium text-white transition-opacity hover:opacity-90"
                >
                  <MessageCircle size={19} strokeWidth={2} />
                  {t(copy.cta.wa)}
                </a>
                <a
                  href="/"
                  className="inline-flex items-center gap-3 rounded-2xl border border-[#303030] px-7 py-4 text-[17px] font-medium text-[#11111a] transition-colors hover:bg-[#11111a] hover:text-white"
                >
                  <Smartphone size={19} strokeWidth={2} />
                  {t(copy.cta.app)}
                </a>
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}

export default function AboutPage() {
  return (
    <LanguageProvider>
      <Inner />
    </LanguageProvider>
  );
}
