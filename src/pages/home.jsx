import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Hero from "../components/hero";
import Seo from "../components/seo";
import ProductCard from "../components/productCard";
import ProductCardSkeleton from "../components/productCardSkeleton";
import { getAllProducts } from "../api/product.api";
import { getCategories } from "../api/category.api";
import clippersImg from "../assets/clip.png";
import trimmersImg from "../assets/trim.png";
import shaversImg from "../assets/shav.png";
import fallbackImg from "../assets/trimmers.jpg";

const CATEGORY_IMAGES = [
  { match: "clip", image: clippersImg },
  { match: "trim", image: trimmersImg },
  { match: "shav", image: shaversImg },
];

const categoryImage = (name = "") => {
  const key = name.toLowerCase();
  return CATEGORY_IMAGES.find((c) => key.includes(c.match))?.image ?? fallbackImg;
};

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [categoryRes, arrivalsRes] = await Promise.all([
          getCategories({ isDeleted: false }),
          getAllProducts({ limit: 4, isDeleted: false }),
        ]);

        if (cancelled) return;

        const categoryList = categoryRes.data ?? [];
        setCategories(categoryList);
        setNewArrivals(arrivalsRes.data ?? []);

        // Fetch every category row at once — this used to await in a loop,
        // so the last row waited on all the ones before it.
        const rows = await Promise.all(
          categoryList.map(async (category) => {
            const res = await getAllProducts({
              limit: 4,
              isDeleted: false,
              categoryId: category._id,
            });
            return [category._id, res.data ?? []];
          })
        );

        if (cancelled) return;
        setProductsByCategory(Object.fromEntries(rows));
      } catch (error) {
        console.error("Failed to load the homepage:", error);
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Seo
        title="Professional Barber Supplies, Clippers & Trimmers"
        description="Shop professional barber supplies at Yanki — precision clippers, trimmers, shavers and shears trusted by working barbers, with cash on delivery available."
        path="/"
      />

      <Hero />

      {/* Shop by category */}
      <section className="container-page py-16 lg:py-24">
        <SectionHeading
          title="Shop by category"
          subtitle="Find the right tool for the job."
        />

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-xl bg-gray-200 md:h-72"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/products?category=${category._id}`}
                className="group relative block overflow-hidden rounded-xl"
              >
                <div className="h-64 overflow-hidden md:h-72">
                  <img
                    src={categoryImage(category.name)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="text-xl font-bold text-white">
                    {category.name}
                  </h3>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-brand-500">
                    Shop now
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* New arrivals */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="container-page">
          <SectionHeading
            title="New arrivals"
            subtitle="The latest tools to land in stock."
            action={{ label: "View all products", to: "/products" }}
          />
          <ProductGrid
            products={newArrivals}
            loading={loading}
            emptyMessage={
              failed
                ? "We couldn't load products just now. Please refresh."
                : "No products yet — check back soon."
            }
          />
        </div>
      </section>

      {/* One row per category */}
      {categories.map((category) => {
        const products = productsByCategory[category._id];
        if (!loading && !products?.length) return null;

        return (
          <section
            key={category._id}
            id={`category-${category._id}`}
            className="container-page py-16 lg:py-24"
          >
            <SectionHeading
              title={category.name}
              action={{
                label: `All ${category.name.toLowerCase()}`,
                to: `/products?category=${category._id}`,
              }}
            />
            <ProductGrid products={products} loading={loading} />
          </section>
        );
      })}

      {/* Closing CTA */}
      <section className="bg-ink-950">
        <div className="container-page py-16 text-center lg:py-20">
          <h2 className="font-display text-4xl tracking-wide text-white sm:text-5xl">
            Not sure which tool you need?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-300">
            Tell us how you work and we&apos;ll point you to the right kit — no
            hard sell.
          </p>
          <Link
            to="/contact-us"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink-950 transition-colors hover:bg-brand-400"
          >
            Talk to us
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}

function SectionHeading({ title, subtitle, action }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-3xl tracking-wide text-ink-950 sm:text-4xl">
          {title}
        </h2>
        {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
      </div>
      {action && (
        <Link
          to={action.to}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-ink-950 underline-offset-4 hover:underline"
        >
          {action.label}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      )}
    </div>
  );
}

function ProductGrid({ products, loading, emptyMessage }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 md:gap-8">
        {[0, 1, 2, 3].map((i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return <p className="text-gray-600">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 md:gap-8">
      {products.map((product) => (
        <ProductCard key={product._id} {...product} />
      ))}
    </div>
  );
}
