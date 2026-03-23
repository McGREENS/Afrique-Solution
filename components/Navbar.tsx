"use client";

import { useEffect, useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+243000000000";
const WA_LINK = `https://wa.me/${WA_NUMBER.replace(/\D/g, "")}`;

const navItems = {
  fr: [
    { label: "Services", href: "#services" },
    { label: "Comment ça marche", href: "#how" },
    { label: "Pays", href: "#countries" },
    { label: "Contact", href: "#contact" },
  ],
  en: [
    { label: "Services", href: "#services" },
    { label: "How it works", href: "#how" },
    { label: "Countries", href: "#countries" },
    { label: "Contact", href: "#contact" },
  ],
};

export default function Navbar() {
  const { lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const close = () => setOpen(false);
  const items = navItems[lang];

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || open
          ? "bg-[#f3f3f3]/95 backdrop-blur-md shadow-sm"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 md:px-12">

        {/* Logo */}
        <a href="#" className="flex items-center gap-2" onClick={close}>
          <span className="text-[22px] leading-none">✦</span>
          <span className="text-[24px] font-medium tracking-tight text-[#11111a]">
            Afrique Solution
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-[16px] md:flex">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[#11111a] transition-opacity hover:opacity-60"
            >
              {item.label}
            </a>
          ))}

          {/* Language toggle */}
          <div className="flex items-center rounded-xl border border-[#d0d0d0] overflow-hidden text-[14px] font-medium">
            <button
              onClick={() => setLang("fr")}
              className={[
                "px-3 py-2 transition-colors",
                lang === "fr"
                  ? "bg-[#11111a] text-white"
                  : "text-[#11111a] hover:bg-black/5",
              ].join(" ")}
            >
              FR
            </button>
            <button
              onClick={() => setLang("en")}
              className={[
                "px-3 py-2 transition-colors",
                lang === "en"
                  ? "bg-[#11111a] text-white"
                  : "text-[#11111a] hover:bg-black/5",
              ].join(" ")}
            >
              EN
            </button>
          </div>

          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl border border-[#303030] px-5 py-2.5 text-[15px] text-[#11111a] transition-colors hover:bg-[#303030] hover:text-white"
          >
            <MessageCircle size={16} strokeWidth={2} />
            WhatsApp
          </a>
        </nav>

        {/* Mobile: language toggle + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <div className="flex items-center rounded-xl border border-[#d0d0d0] overflow-hidden text-[14px] font-medium">
            <button
              onClick={() => setLang("fr")}
              className={[
                "px-3 py-1.5 transition-colors",
                lang === "fr"
                  ? "bg-[#11111a] text-white"
                  : "text-[#11111a] hover:bg-black/5",
              ].join(" ")}
            >
              FR
            </button>
            <button
              onClick={() => setLang("en")}
              className={[
                "px-3 py-1.5 transition-colors",
                lang === "en"
                  ? "bg-[#11111a] text-white"
                  : "text-[#11111a] hover:bg-black/5",
              ].join(" ")}
            >
              EN
            </button>
          </div>

          <button
            className="flex items-center justify-center rounded-xl p-2 text-[#11111a] transition-colors hover:bg-black/10"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {open ? <X size={26} strokeWidth={2} /> : <Menu size={26} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-black/10 bg-[#f3f3f3] px-6 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={close}
                className="rounded-xl px-4 py-3 text-[18px] font-medium text-[#11111a] transition-colors hover:bg-black/5"
              >
                {item.label}
              </a>
            ))}
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 py-3 text-[18px] font-medium text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle size={20} strokeWidth={2} />
              WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
