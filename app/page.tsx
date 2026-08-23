"use client";

import Image from "next/image";
import {
  Tv2, Satellite, Signal, Wifi, Globe, Zap,
  MessageCircle, LayoutList, CreditCard, CheckCircle,
  ArrowUpRight, Smartphone, Star,
} from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+243822100111";
const WA_LINK = `https://wa.me/${WA_NUMBER.replace(/\D/g, "")}`;

const services = [
  { id: "canal",     label: "Canal+",    dark: false, Icon: Tv2 },
  { id: "dstv",      label: "DStv",      dark: true,  Icon: Satellite },
  { id: "startimes", label: "StarTimes", dark: false, Icon: Tv2 },
  { id: "vodacom",   label: "Vodacom",   dark: true,  Icon: Signal },
  { id: "airtel",    label: "Airtel",    dark: false, Icon: Signal },
  { id: "orange",    label: "Orange",    dark: true,  Icon: Globe },
];

const steps = [
  { fr: "Téléchargez l'app Afrisol",        en: "Download the Afrisol app",         Icon: Smartphone },
  { fr: "Choisissez votre service et forfait", en: "Choose your service & package",  Icon: LayoutList },
  { fr: "Payez via Mobile Money",             en: "Pay via Mobile Money",            Icon: CreditCard },
  { fr: "Activation immédiate confirmée",     en: "Instant activation confirmed",    Icon: CheckCircle },
];

const countries = [
  { flag: "🇨🇩", name: "RD Congo",  payments: "Airtel Money · M-Pesa · Orange Money", live: true },
  { flag: "🇷🇼", name: "Rwanda",    payments: "MTN MoMo · Airtel Money",               live: true },
  { flag: "🇧🇮", name: "Burundi",   payments: "Airtel Money · Orange Money",           live: false },
];

const stats = [
  { value: "3",    label: { fr: "Pays couverts",      en: "Countries covered" } },
  { value: "6+",   label: { fr: "Services disponibles", en: "Services available" } },
  { value: "24/7", label: { fr: "Support client",      en: "Customer support" } },
  { value: "< 5m", label: { fr: "Activation",          en: "Activation time" } },
];

const copy = {
  hero: {
    badge:  { fr: "Application mobile disponible bientôt", en: "Mobile app coming soon" },
    h1_1:  { fr: "Canal+, DStv &",        en: "Canal+, DStv &" },
    h1_2:  { fr: "Télécom",               en: "Telecom" },
    h1_3:  { fr: "en quelques secondes",  en: "in seconds" },
    sub:   { fr: "Rechargez vos abonnements TV et data mobile via notre app ou WhatsApp — DRC, Rwanda, Burundi.", en: "Recharge your TV & mobile data subscriptions via our app or WhatsApp — DRC, Rwanda, Burundi." },
    cta1:  { fr: "Démarrer sur WhatsApp", en: "Start on WhatsApp" },
    cta2:  { fr: "Voir l'app",            en: "See the app" },
  },
  app: {
    badge:  { fr: "Application mobile", en: "Mobile app" },
    title:  { fr: "Payez en quelques\ntouches", en: "Pay in a few\ntaps" },
    sub:    { fr: "L'app Afrisol vous permet de recharger Canal+, DStv, Vodacom, Airtel et Orange directement depuis votre téléphone — sans WhatsApp, sans intermédiaire.", en: "The Afrisol app lets you recharge Canal+, DStv, Vodacom, Airtel and Orange directly from your phone — no WhatsApp, no middleman." },
    feat1:  { fr: "Paiement Mobile Money intégré", en: "Integrated Mobile Money payment" },
    feat2:  { fr: "Historique de toutes vos commandes", en: "Full order history" },
    feat3:  { fr: "RD Congo & Rwanda",              en: "DR Congo & Rwanda" },
    coming: { fr: "Bientôt sur", en: "Coming soon to" },
  },
  services: {
    title: { fr: "Services",    en: "Services" },
    desc:  { fr: "Abonnement, réactivation et modification de forfait — TV satellite et data mobile.",  en: "Subscribe, reactivate or modify packages — satellite TV & mobile data." },
    order: { fr: "Commander",   en: "Order" },
  },
  how: {
    title: { fr: "Comment ça marche", en: "How it works" },
    desc:  { fr: "4 étapes simples",  en: "4 simple steps" },
  },
  stats: {
    title: { fr: "Afrique Solution en chiffres", en: "Afrique Solution by the numbers" },
  },
  cta: {
    title: { fr: "Prêt à commencer ?",  en: "Ready to start?" },
    body:  { fr: "Téléchargez l'app Afrisol ou envoyez-nous un message WhatsApp — votre abonnement sera actif en moins de 5 minutes.", en: "Download the Afrisol app or send us a WhatsApp message — your subscription will be active in under 5 minutes." },
    btn:   { fr: "Démarrer sur WhatsApp", en: "Start on WhatsApp" },
  },
  countries: {
    title: { fr: "Pays",        en: "Countries" },
    desc:  { fr: "Disponible en RD Congo et Rwanda avec paiement Mobile Money local. Burundi à venir.", en: "Available in DR Congo and Rwanda with local Mobile Money payments. Burundi coming soon." },
    live:  { fr: "Actif",       en: "Live" },
    soon:  { fr: "Bientôt",     en: "Soon" },
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
        <section className="mx-auto max-w-[1440px] px-6 pb-10 md:px-12 md:pb-12">

          {/* ── HERO ── */}
          <div className="mb-14 grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
            <div className="max-w-[600px]">

              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#c9c9c9] bg-white px-4 py-2 text-[14px] font-medium text-[#444]">
                <span className="flex h-2 w-2 rounded-full bg-[#b4f75f]" />
                {t(copy.hero.badge)}
              </div>

              <h1 className="mb-7 text-5xl font-medium leading-[1.1] md:text-[68px] md:leading-[1.02]">
                {t(copy.hero.h1_1)}{" "}
                <span className="inline-block rounded-md bg-[#b4f75f] px-2 py-1">
                  {t(copy.hero.h1_2)}
                </span>
                <br />
                {t(copy.hero.h1_3)}
              </h1>

              <p className="mb-10 max-w-[515px] text-[20px] leading-[1.5] text-[#343438]">
                {t(copy.hero.sub)}
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-2xl bg-[#25D366] px-8 py-4 text-[18px] font-medium text-white transition-opacity hover:opacity-90"
                >
                  <MessageCircle size={22} strokeWidth={2} />
                  {t(copy.hero.cta1)}
                </a>
                <a
                  href="#app"
                  className="inline-flex items-center gap-3 rounded-2xl border border-[#303030] px-8 py-4 text-[18px] font-medium text-[#11111a] transition-colors hover:bg-[#11111a] hover:text-white"
                >
                  <Smartphone size={20} strokeWidth={2} />
                  {t(copy.hero.cta2)}
                </a>
              </div>
            </div>

            <div className="justify-self-center lg:justify-self-end">
              <Image
                src="/Hero.png"
                alt="Afrisol app"
                width={818}
                height={600}
                priority
                className="h-auto w-[320px] md:w-[500px] lg:w-[620px]"
              />
            </div>
          </div>

          {/* ── PARTNER STRIP ── */}
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-y border-[#d8d8d8] py-6 text-3xl text-[#262626] md:text-[38px]">
            {["Canal+", "DStv", "StarTimes", "Vodacom", "Airtel", "Orange"].map((item) => (
              <span key={item} className="font-semibold tracking-tight opacity-60">{item}</span>
            ))}
          </div>

          {/* ── STATS ── */}
          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.value} className="rounded-[28px] border border-[#d8d8d8] bg-white px-6 py-7 text-center">
                <p className="mb-1 text-[42px] font-semibold leading-none tracking-tight text-[#11111a]">{s.value}</p>
                <p className="text-[15px] text-[#666]">{t(s.label)}</p>
              </div>
            ))}
          </div>

          {/* ── SERVICES ── */}
          <section id="services" className="mt-20">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
              <h2 className="inline-block w-fit rounded-md bg-[#b4f75f] px-2 py-1 text-4xl font-medium md:text-[42px]">
                {t(copy.services.title)}
              </h2>
              <p className="max-w-[690px] text-[20px] leading-[1.45] text-[#2d2d33]">
                {t(copy.services.desc)}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((svc) => (
                <article
                  key={svc.id}
                  className={[
                    "relative min-h-[220px] overflow-hidden rounded-[40px] border border-[#1f2430] p-8 shadow-[0_4px_0_#1f2430]",
                    svc.dark ? "bg-[#181b2b] text-white" : "bg-[#f3f3f3]",
                  ].join(" ")}
                >
                  <div className="mb-4">
                    <svc.Icon size={40} strokeWidth={1.5} className={svc.dark ? "text-[#b4f75f]" : "text-[#1a1f2d]"} />
                  </div>
                  <h3 className="mb-6 text-[36px] font-medium leading-[1.05] tracking-tight">
                    <span className={["inline-block rounded-md px-2 py-1", svc.dark ? "bg-white text-[#11111a]" : "bg-[#b4f75f]"].join(" ")}>
                      {svc.label}
                    </span>
                  </h3>
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-[20px] font-medium"
                  >
                    <span className={["flex h-9 w-9 items-center justify-center rounded-full", svc.dark ? "bg-white text-[#1a1f2d]" : "bg-[#1a1f2d] text-[#b4f75f]"].join(" ")}>
                      <ArrowUpRight size={18} strokeWidth={2} />
                    </span>
                    <span className={svc.dark ? "text-white" : "text-[#11111a]"}>
                      {t(copy.services.order)}
                    </span>
                  </a>
                </article>
              ))}
            </div>
          </section>

          {/* ── APP TEASER ── */}
          <section id="app" className="mt-20">
            <div className="overflow-hidden rounded-[40px] bg-[#161a2a] text-white">
              <div className="grid items-center gap-10 p-10 md:p-14 lg:grid-cols-[1fr_auto]">

                <div className="max-w-[560px]">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[14px] font-medium text-[#b4f75f]">
                    <Smartphone size={14} strokeWidth={2} />
                    {t(copy.app.badge)}
                  </div>

                  <h2 className="mb-6 whitespace-pre-line text-[42px] font-medium leading-[1.1] md:text-[52px]">
                    {t(copy.app.title)}
                  </h2>
                  <p className="mb-8 text-[18px] leading-[1.6] text-white/70">
                    {t(copy.app.sub)}
                  </p>

                  <ul className="mb-10 flex flex-col gap-3">
                    {[copy.app.feat1, copy.app.feat2, copy.app.feat3].map((feat, i) => (
                      <li key={i} className="flex items-center gap-3 text-[16px] text-white/85">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#b4f75f]">
                          <CheckCircle size={13} strokeWidth={2.5} className="text-[#161a2a]" />
                        </span>
                        {t(feat)}
                      </li>
                    ))}
                  </ul>

                  <div>
                    <p className="mb-3 text-[13px] uppercase tracking-widest text-white/40">{t(copy.app.coming)}</p>
                    <div className="flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-[15px] font-medium text-white/60">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                        App Store
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-[15px] font-medium text-white/60">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M3.18 23.76c.3.17.64.19.96.07l12.43-7.17-2.63-2.63-10.76 9.73zM.44 1.06C.17 1.4 0 1.89 0 2.53v18.94c0 .64.17 1.13.44 1.47l.08.07 10.61-10.61v-.25L.52.99l-.08.07zM20.35 10.32l-2.98-1.72-2.93 2.93 2.93 2.93 2.98-1.72c.85-.49.85-1.93 0-2.42zM3.18.24l12.43 7.17-2.63 2.63L2.22.31C2.54.19 2.88.07 3.18.24z"/></svg>
                        Google Play
                      </span>
                    </div>
                  </div>
                </div>

                {/* Decorative phone mockup */}
                <div className="hidden lg:flex items-center justify-center">
                  <div className="relative h-[380px] w-[190px] rounded-[36px] border-2 border-white/20 bg-[#0d1018] shadow-2xl">
                    <div className="absolute left-1/2 top-4 h-3 w-14 -translate-x-1/2 rounded-full bg-white/10" />
                    <div className="absolute inset-x-3 top-12 bottom-3 rounded-[28px] bg-[#161a2a] overflow-hidden flex flex-col items-center justify-center gap-4 p-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#b4f75f]">
                        <span className="text-[28px] font-bold text-[#161a2a]">A</span>
                      </div>
                      <p className="text-center text-[13px] font-semibold text-white">Afrisol</p>
                      <div className="w-full space-y-2">
                        {["Canal+", "Vodacom", "Airtel"].map((s) => (
                          <div key={s} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                            <span className="text-[11px] text-white/70">{s}</span>
                            <span className="h-2 w-2 rounded-full bg-[#b4f75f]" />
                          </div>
                        ))}
                      </div>
                      <div className="w-full rounded-xl bg-[#b4f75f] py-2 text-center text-[12px] font-semibold text-[#161a2a]">
                        Payer
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* ── HOW IT WORKS ── */}
          <section id="how" className="mt-20">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
              <h2 className="inline-block w-fit rounded-md bg-[#b4f75f] px-2 py-1 text-4xl font-medium md:text-[42px]">
                {t(copy.how.title)}
              </h2>
              <p className="max-w-[500px] text-[20px] leading-[1.45] text-[#2d2d33]">
                {t(copy.how.desc)}
              </p>
            </div>

            <div className="grid overflow-hidden rounded-[34px] bg-[#161a2a] text-white md:grid-cols-4">
              {steps.map((step, i) => (
                <article
                  key={i}
                  className={["px-8 py-10", i < steps.length - 1 ? "border-b border-white/20 md:border-b-0 md:border-r" : ""].join(" ")}
                >
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#b4f75f] text-[#161a2a] font-bold text-[16px]">
                    {i + 1}
                  </div>
                  <div className="mb-4">
                    <step.Icon size={32} strokeWidth={1.5} className="text-[#b4f75f]" />
                  </div>
                  <p className="text-[18px] font-medium leading-[1.4] text-white">
                    {step[lang]}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* ── CTA BANNER ── */}
          <section className="mt-20">
            <div className="relative overflow-hidden rounded-[34px] bg-[#ececec] px-8 py-10 md:px-14 md:py-14">
              <div className="max-w-[540px]">
                <h3 className="mb-5 text-[42px] font-medium leading-[1.05]">
                  {t(copy.cta.title)}
                </h3>
                <p className="mb-8 max-w-[470px] text-[20px] leading-[1.5] text-[#36363f]">
                  {t(copy.cta.body)}
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 rounded-2xl bg-[#25D366] px-8 py-4 text-[18px] font-medium text-white transition-opacity hover:opacity-90"
                  >
                    <MessageCircle size={20} strokeWidth={2} />
                    {t(copy.cta.btn)}
                  </a>
                  <a
                    href="#app"
                    className="inline-flex items-center gap-3 rounded-2xl border border-[#303030] px-8 py-4 text-[18px] font-medium text-[#11111a] transition-colors hover:bg-[#11111a] hover:text-white"
                  >
                    <Smartphone size={20} strokeWidth={2} />
                    App Afrisol
                  </a>
                </div>
              </div>

              {/* decorative */}
              <div className="pointer-events-none absolute right-6 top-4 hidden h-[240px] w-[360px] md:block">
                <div className="absolute right-40 top-32 text-[110px] leading-none text-[#b4f75f]">✦</div>
                <div className="absolute right-10 top-10 text-[120px] leading-none text-[#1f2230]/35">✶</div>
                <div className="absolute right-8 top-28 text-[120px] leading-none text-[#cfd0d5]">✶</div>
                <div className="absolute right-16 top-[4.5rem] h-[4.5rem] w-[11.5rem] rounded-[50%] border border-[#2f3340]/55" />
                <div className="absolute right-16 top-24 h-[4.5rem] w-[11.5rem] rounded-[50%] border border-[#2f3340]/55" />
              </div>
            </div>
          </section>

          {/* ── COUNTRIES ── */}
          <section id="countries" className="mt-20">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
              <h2 className="inline-block w-fit rounded-md bg-[#b4f75f] px-2 py-1 text-4xl font-medium md:text-[42px]">
                {t(copy.countries.title)}
              </h2>
              <p className="max-w-[500px] text-[20px] leading-[1.45] text-[#2d2d33]">
                {t(copy.countries.desc)}
              </p>
            </div>

            <div className="grid overflow-hidden rounded-[34px] bg-[#161a2a] text-white md:grid-cols-3">
              {countries.map((c, i) => (
                <article
                  key={c.name}
                  className={["px-8 py-10 md:px-10 md:py-12", i < countries.length - 1 ? "border-b border-white/25 md:border-b-0 md:border-r" : ""].join(" ")}
                >
                  <div className="mb-4 text-[44px]">{c.flag}</div>
                  <div className="mb-3 flex items-center gap-3">
                    <p className="text-[28px] font-medium text-[#b4f75f]">{c.name}</p>
                    <span className={[
                      "rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                      c.live
                        ? "bg-[#b4f75f]/20 text-[#b4f75f]"
                        : "bg-white/10 text-white/40",
                    ].join(" ")}>
                      {c.live ? t(copy.countries.live) : t(copy.countries.soon)}
                    </span>
                  </div>
                  <p className="text-[16px] leading-[1.6] text-white/65">{c.payments}</p>
                </article>
              ))}
            </div>
          </section>

        </section>
      </main>
      <Footer />
    </>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <Inner />
    </LanguageProvider>
  );
}
