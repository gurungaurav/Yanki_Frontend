import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Wallet } from "lucide-react";
import heroPic from "../assets/hero.jpg";

const HERO_TRUST = [
  { icon: ShieldCheck, label: "100% genuine products" },
  { icon: Wallet, label: "Cash on delivery available" },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-[34rem] items-center overflow-hidden bg-ink-950 py-20 lg:min-h-[40rem]">
      {/*
        The hero image is the LCP element, so it is a real <img> with a high
        fetch priority rather than a CSS background — backgrounds are
        discovered late by the preload scanner.
      */}
      <img
        src={heroPic}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Legibility scrims */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/50"
      />

      <div className="container-page relative z-10">
        <div className="max-w-2xl">
          <p
            className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-brand-300"
            style={{ animation: "var(--animate-fade-up)" }}
          >
            Trusted by professional barbers
          </p>

          <h1
            className="mt-6 font-display text-5xl leading-[0.95] tracking-wide text-white sm:text-6xl lg:text-7xl"
            style={{ animation: "var(--animate-fade-up)", animationDelay: "0.1s" }}
          >
            Professional barber tools,
            <span className="block text-brand-500">built to last</span>
          </h1>

          <p
            className="mt-6 max-w-xl text-base leading-relaxed text-ink-200 sm:text-lg"
            style={{ animation: "var(--animate-fade-up)", animationDelay: "0.2s" }}
          >
            Precision clippers, trimmers, shavers and shears from the brands
            working barbers rely on — with fast delivery across Nepal.
          </p>

          <div
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animation: "var(--animate-fade-up)", animationDelay: "0.3s" }}
          >
            <Link
              to="/products"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink-950 transition-colors hover:bg-brand-400"
            >
              Shop all products
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>

            <Link
              to="/products?search=clipper"
              className="inline-flex items-center justify-center rounded-lg border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
            >
              Browse clippers
            </Link>
          </div>

          {/* Objection-handling, right next to the CTA where hesitation happens. */}
          <ul
            className="mt-10 flex flex-wrap gap-x-6 gap-y-3"
            style={{ animation: "var(--animate-fade-up)", animationDelay: "0.4s" }}
          >
            {HERO_TRUST.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 text-xs font-medium text-ink-300 sm:text-sm"
              >
                <Icon
                  className="h-4 w-4 shrink-0 text-brand-500"
                  aria-hidden="true"
                />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
