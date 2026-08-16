import { Link } from "react-router-dom";
import {
  ArrowRight,
  Target,
  Award,
  Headset,
  Sparkles,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import Seo from "../components/seo";
import heroPic from "../assets/trimmers.jpg";

const MISSION_POINTS = [
  {
    icon: Sparkles,
    title: "A comprehensive range",
    body: "Clippers, trimmers, shavers, shears and the accessories that keep them running — in one place.",
  },
  {
    icon: Headset,
    title: "Expert advice",
    body: "Straight answers about which tool fits how you actually work, not whichever has the biggest margin.",
  },
  {
    icon: Target,
    title: "Current with the craft",
    body: "We follow what professionals are reaching for and keep the range moving with it.",
  },
  {
    icon: Award,
    title: "Pros and enthusiasts alike",
    body: "The same equipment and the same support whether you run a shop or cut at home.",
  },
];

const REASONS = [
  { icon: Award, label: "Curated selection of trusted brands" },
  { icon: Wallet, label: "Competitive prices and regular promotions" },
  { icon: Headset, label: "Responsive support from people who know the tools" },
  { icon: ShieldCheck, label: "100% genuine products, every order" },
];

export default function AboutUsPage() {
  return (
    <div className="bg-white">
      <Seo
        title="About Us"
        description="Yanki supplies professional barbers with premium clippers, trimmers, shavers and grooming equipment. Learn about our story and what we stand for."
        path="/about-us"
      />

      {/* Intro */}
      <section className="relative overflow-hidden bg-ink-950 py-20 lg:py-28">
        <img
          src={heroPic}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/90 to-ink-950/60"
        />
        <div className="container-page relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
            About us
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.95] tracking-wide text-white sm:text-6xl lg:text-7xl">
            Great haircuts start
            <span className="block text-brand-500">with great tools</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-200">
            Yanki is your one-stop shop for premium barbershop equipment and
            supplies — carefully chosen so you never have to wonder whether a
            tool will hold up.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="container-page py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h2 className="font-display text-3xl tracking-wide text-ink-950 sm:text-4xl">
              Our story
            </h2>
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-gray-700 lg:col-span-2">
            <p>
              Founded in 2010, we&apos;ve been passionate about providing
              barbers and hairstylists with the highest quality tools to perfect
              their craft. Our journey began with a simple idea: to make
              professional-grade barbering equipment accessible to everyone,
              from seasoned pros to enthusiastic beginners.
            </p>
            <p>
              {/* This paragraph used to say "BarberSupply Co." — a leftover
                  from a template that contradicted the brand everywhere else. */}
              At Yanki, we believe that great hair starts with great tools.
              That&apos;s why we carefully curate our selection of clippers,
              trimmers, scissors and other essential barber items, so you have
              access to the best in the business.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="container-page">
          <h2 className="font-display text-3xl tracking-wide text-ink-950 sm:text-4xl">
            Our mission
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-gray-600">
            To empower barbers and hairstylists with equipment that enhances
            their skills and elevates their craft.
          </p>

          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {MISSION_POINTS.map(({ icon: Icon, title, body }) => (
              <li
                key={title}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <Icon
                  className="h-6 w-6 text-brand-600"
                  aria-hidden="true"
                />
                <h3 className="mt-4 text-lg font-semibold text-ink-950">
                  {title}
                </h3>
                <p className="mt-2 leading-relaxed text-gray-600">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why us */}
      <section className="container-page py-16 lg:py-24">
        <h2 className="font-display text-3xl tracking-wide text-ink-950 sm:text-4xl">
          Why choose us
        </h2>
        <ul className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {REASONS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-start gap-3">
              <Icon
                className="mt-0.5 h-5 w-5 shrink-0 text-brand-600"
                aria-hidden="true"
              />
              <span className="text-gray-700">{label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA — the old page ended on a bulleted list with nowhere to go. */}
      <section className="bg-ink-950">
        <div className="container-page py-16 text-center lg:py-20">
          <h2 className="font-display text-4xl tracking-wide text-white sm:text-5xl">
            Ready to elevate your craft?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-300">
            Explore the full range of professional barbering equipment.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink-950 transition-colors hover:bg-brand-400"
            >
              Shop now
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/contact-us"
              className="inline-flex items-center justify-center rounded-lg border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
