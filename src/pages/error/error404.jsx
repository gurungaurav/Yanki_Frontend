import { Link } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import Seo from "../../components/seo";

const SUGGESTIONS = [
  { label: "All products", to: "/products" },
  { label: "Clippers", to: "/products?search=clipper" },
  { label: "Trimmers", to: "/products?search=trimmer" },
  { label: "Shavers", to: "/products?search=shaver" },
];

export default function Error404() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <Seo
        title="Page not found"
        description="The page you were looking for doesn't exist."
        noIndex
      />

      <p className="font-display text-8xl leading-none tracking-wide text-brand-500 sm:text-9xl">
        404
      </p>

      <h1 className="mt-4 font-display text-4xl tracking-wide text-ink-950 sm:text-5xl">
        Page not found
      </h1>

      <p className="mt-4 max-w-md text-gray-600">
        The page you were looking for has moved or never existed. Here&apos;s
        where to go instead.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/products"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink-950 transition-colors hover:bg-brand-400"
        >
          Shop all products
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-7 py-3.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-gray-50"
        >
          Back to home
        </Link>
      </div>

      <div className="mt-12 w-full max-w-md">
        <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-gray-500">
          <Search className="h-4 w-4" aria-hidden="true" />
          Popular categories
        </p>
        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="inline-block rounded-full border border-gray-300 px-4 py-1.5 text-sm text-gray-700 transition-colors hover:border-ink-950 hover:text-ink-950"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
