import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  RotateCcw,
  Headset,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  ArrowRight,
} from "lucide-react";
import yanki from "../assets/yanki-.png";

const TRUST_POINTS = [
  { icon: RotateCcw, title: "7-day returns", note: "No-hassle refunds" },
  { icon: ShieldCheck, title: "Secure checkout", note: "Encrypted payments" },
  { icon: Headset, title: "Expert support", note: "Sun–Fri, 10am–6pm" },
];

const SHOP_LINKS = [
  { label: "All products", to: "/products" },
  { label: "Clippers", to: "/products?search=clipper" },
  { label: "Trimmers", to: "/products?search=trimmer" },
  { label: "Shavers", to: "/products?search=shaver" },
  { label: "Shears & scissors", to: "/products?search=shear" },
];

const COMPANY_LINKS = [
  { label: "About Yanki", to: "/about-us" },
  { label: "Contact us", to: "/contact-us" },
  { label: "My orders", to: "/product/order-list" },
  { label: "My account", to: "/profile" },
];

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/yanki", icon: Instagram },
  { label: "Facebook", href: "https://facebook.com/yanki", icon: Facebook },
  { label: "YouTube", href: "https://youtube.com/@yanki", icon: Youtube },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    // TODO: POST to the newsletter endpoint once it exists.
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-ink-950 text-ink-300">
      {/* Trust strip — reassurance right where people hesitate. */}
      <div className="border-y border-white/5 bg-ink-900">
        <ul className="container-page grid grid-cols-2 gap-6 py-8 lg:grid-cols-3">
          {TRUST_POINTS.map(({ icon: Icon, title, note }) => (
            <li key={title} className="flex items-start gap-3">
              <Icon
                className="mt-0.5 h-5 w-5 shrink-0 text-brand-500"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs text-ink-400">{note}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Newsletter */}
      <div className="border-b border-white/5">
        <div className="container-page flex flex-col gap-6 py-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-md">
            <h2 className="text-xl font-bold text-white">
              Get NPR 500 off your first order
            </h2>
            <p className="mt-1 text-sm text-ink-400">
              Join the Yanki list for new tool drops, restocks and barber-only
              deals.
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="w-full max-w-md"
            aria-live="polite"
          >
            {subscribed ? (
              <p className="rounded-lg border border-brand-500/30 bg-brand-500/10 px-4 py-3 text-sm font-medium text-brand-300">
                You&apos;re on the list — check your inbox for the code.
              </p>
            ) : (
              <>
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    id="newsletter-email"
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-ink-400 transition-colors focus:border-brand-500/50 focus:bg-white/10"
                  />
                  <button
                    type="submit"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-3 text-sm font-semibold text-ink-950 transition-colors hover:bg-brand-400"
                  >
                    Subscribe
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <p className="mt-2 text-xs text-ink-400">
                  No spam. Unsubscribe anytime.
                </p>
              </>
            )}
          </form>
        </div>
      </div>

      {/* Link columns */}
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link to="/" aria-label="Yanki — home" className="inline-block">
            <img
              src={yanki}
              alt="Yanki"
              width="120"
              height="40"
              className="h-10 w-auto object-contain brightness-0 invert"
            />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
            Professional barber supplies — precision clippers, trimmers, shavers
            and shears trusted by working barbers.
          </p>
          <ul className="mt-5 flex gap-2">
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`Yanki on ${label}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-ink-300 transition-colors hover:border-brand-500/40 hover:bg-white/5 hover:text-brand-500"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <FooterColumn title="Shop" links={SHOP_LINKS} />
        <FooterColumn title="Company" links={COMPANY_LINKS} />

        {/* Contact */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
            Get in touch
          </h2>
          <address className="mt-4 space-y-3 text-sm not-italic">
            <a
              href="mailto:hello@yanki.com"
              className="flex items-start gap-3 text-ink-400 transition-colors hover:text-white"
            >
              <Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              hello@yanki.com
            </a>
            <a
              href="tel:+9779800000000"
              className="flex items-start gap-3 text-ink-400 transition-colors hover:text-white"
            >
              <Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              +977 980-000-0000
            </a>
            <p className="flex items-start gap-3 text-ink-400">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              New Road, Kathmandu, Nepal
            </p>
          </address>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="container-page flex flex-col items-center gap-4 py-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-ink-400">
            © {new Date().getFullYear()} Yanki. All rights reserved.
          </p>

          <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {[
              { label: "Privacy Policy", to: "/privacy-policy" },
              { label: "Terms of Service", to: "/terms" },
              { label: "Shipping & Returns", to: "/shipping-returns" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-xs text-ink-400 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <ul className="flex gap-2" aria-label="Accepted payment methods">
            {["Khalti", "Cash on delivery"].map((method) => (
              <li
                key={method}
                className="rounded border border-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink-400"
              >
                {method}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
        {title}
      </h2>
      <ul className="mt-4 space-y-3 text-sm">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="text-ink-400 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
