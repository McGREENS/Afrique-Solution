"use client";

import Image from "next/image";
import { Tv2, Satellite, Signal, Wifi, Globe, MessageCircle, LayoutList, CreditCard, CheckCircle, ArrowUpRight } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+243000000000";
const WA_LINK = `https://wa.me/${WA_NUMBER.replace(/\D/g, "")}`;

const services = [
  { id: "canal",    label: "Canal+",   dark: false, Icon: Tv2 },
  { id: "dstv",     label: "DStv",     dark: false, Icon: Satellite },
  { id: "vodacom",  label: "Vodacom",  dark: true,  Icon: Signal },
  { id: "airtel",   label: "Airtel",   dark: false, Icon: Signal },
  { id: "orange",   label: "Orange",   dark: true,  Icon: Globe },
  { id: "internet", label: "Internet", dark: false, Icon: Wifi },
];

const steps = [
  { fr: "Envoyez un message sur WhatsApp",    en: "Send a WhatsApp message",        Icon: MessageCircle },
  { fr: "Choisissez votre service et forfait", en: "Choose your service & package",  Icon: LayoutList },
  { fr: "Payez via Mobile Money",              en: "Pay via Mobile Money",           Icon: CreditCard },
  { fr: "Activation immédiate confirmée",      en: "Instant activation confirmed",   Icon: CheckCircle },
];

const countries = [
  { flag: "🇨🇩", name: "RD Congo", payments: "Airtel Money · M-Pesa · Orange Money" },
  { flag: "🇷🇼", name: "Rwanda",   payments: "Airtel Money · M-Pesa" },
  { flag: "🇧🇮", name: "Burundi",  payments: "Airtel Money · Orange Money" },
];

const copy = {
  hero: {
    h1_1:   { fr: "Canal+, DStv &",          en: "Canal+, DStv &" },
    h1_2:   { fr: "Télécom",                  en: "Telecom" },
    h1_3:   { fr: "en quelques secondes",     en: "in seconds" },
    sub:    { fr: "Rechargez vos abonnements TV et data mobile via WhatsApp — DRC, Rwanda, Burundi.", en: "Recharge your TV & mobile data subscriptions via WhatsApp — DRC, Rwanda, Burundi." },
    cta:    { fr: "Démarrer sur WhatsApp",    en: "Start on WhatsApp" },
  },
  services: {
    title:  { fr: "Services",                 en: "Services" },
    desc:   { fr: "Abonnement, réactivation et modification de forfait — TV satellite et data mobile.", en: "Subscribe, reactivate or modify packages — satellite TV & mobile data." },
    order:  { fr: "Commander",                en: "Order" },
  },
  how: {
    title:  { fr: "Comment ça marche",        en: "How it works" },
    desc:   { fr: "4 étapes simples",         en: "4 simple steps" },
  },
  cta: {
    title:  { fr: "Prêt à commencer ?",       en: "Ready to start?" },
    body:   { fr: "Envoyez-nous un message WhatsApp et votre abonnement sera actif en moins de 5 minutes.", en: "Send us a WhatsApp message and your subscription will be active in under 5 minutes." },
    btn:    { fr: "Démarrer maintenant",      en: "Start now" },
  },
  countries: {
    title:  { fr: "Pays",                     en: "Countries" },
    desc:   { fr: "Disponible en RD Congo, Rwanda et Burundi avec paiement Mobile Money local.", en: "Available in DR Congo, Rwanda and Burundi with local Mobile Money payments." },
  },
};

export default function Home() {
  const { lang } = useLang();
  const t = (obj: { fr: string; en: string }) => obj[lang];

  return (
    <main className="bg-[#f3f3f3] px-4 pt-28 pb-5 text-[#11111a] md:px-8">
      <section className="mx-auto max-w-[1440px] px-6 pb-10 md:px-12 md:pb-12">

        {/* ── HERO ── */}
        <div className="mb-14 grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="max-w-[590px]">
            <h1 className="mb-7 text-5xl font-medium leading-[1.1] md:text-[68px] md:leading-[1.02]">
              {t(copy.hero.h1_1)}{" "}
              <span className="inline-block rounded-md bg-[#b4f75f] px-2 py-1">
                {t(copy.hero.h1_2)}
              </span>
              <br />
              {t(copy.hero.h1_3)}
            </h1>
            <p className="mb-10 max-w-[515px] text-[22px] leading-[1.48] text-[#343438]">
              {t(copy.hero.sub)}
            </p>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-2xl bg-[#25D366] px-10 py-5 text-[21px] font-medium text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle size={24} strokeWidth={2} />
              {t(copy.hero.cta)}
            </a>
          </div>

          <div className="justify-self-center lg:justify-self-end">
            <Image
              src="/Hero.png"
              alt="Afrique Solution"
              width={818}
              height={600}
              priority
              className="h-auto w-[320px] md:w-[500px] lg:w-[640px]"
            />
          </div>
        </div>

        {/* ── PARTNER STRIP ── */}
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 text-3xl text-[#262626] md:text-[38px]">
          {["Canal+", "DStv", "Vodacom", "Airtel", "Orange", "Flutterwave"].map((item) => (
            <span key={item} className="font-semibold tracking-tight opacity-70">{item}</span>
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
                  className="flex items-center gap-3 text-[22px] font-medium"
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
                <div className="mb-4">
                  <step.Icon size={36} strokeWidth={1.5} className="text-[#b4f75f]" />
                </div>
                <p className="text-[20px] font-medium leading-[1.4] text-white">
                  {step[lang]}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="mt-20">
          <div className="relative overflow-hidden rounded-[34px] bg-[#ececec] px-8 py-10 md:px-14 md:py-12">
            <div className="max-w-[530px]">
              <h3 className="mb-5 text-[42px] font-medium leading-[1.05]">
                {t(copy.cta.title)}
              </h3>
              <p className="mb-7 max-w-[470px] text-[22px] leading-[1.45] text-[#36363f]">
                {t(copy.cta.body)}
              </p>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-2xl bg-[#25D366] px-8 py-4 text-[22px] font-medium text-white transition-opacity hover:opacity-90"
              >
                <MessageCircle size={22} strokeWidth={2} />
                {t(copy.cta.btn)}
              </a>
            </div>

            {/* decorative */}
            <div className="pointer-events-none absolute right-6 top-4 hidden h-[240px] w-[360px] md:block">
              <div className="absolute right-40 top-32 h-[4.5rem] w-[4.5rem] rotate-12 text-[110px] leading-none text-[#b4f75f]">✦</div>
              <div className="absolute right-10 top-10 h-24 w-24 text-[120px] leading-none text-[#1f2230]/35">✶</div>
              <div className="absolute right-8 top-28 h-24 w-24 text-[120px] leading-none text-[#cfd0d5]">✶</div>
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
                <p className="mb-3 text-[28px] font-medium text-[#b4f75f]">{c.name}</p>
                <p className="text-[18px] leading-[1.5] text-white/75">{c.payments}</p>
              </article>
            ))}
          </div>
        </section>

      </section>
    </main>
  );
}
