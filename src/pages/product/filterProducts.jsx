import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, Search } from "lucide-react";
import Seo from "../../components/seo";
import ProductCard from "../../components/productCard";
import ProductCardSkeleton from "../../components/productCardSkeleton";
import { getAllProducts } from "../../api/product.api";
import { getCategories } from "../../api/category.api";
import { cn } from "../../lib/utils";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name-asc", label: "Name: A to Z" },
];

export default function FilterProductsPage() {
  // Filters live in the URL so results are shareable, linkable and crawlable.
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sort = searchParams.get("sort") || "newest";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Local mirror of the search box so typing doesn't fire a request per keystroke.
  const [searchInput, setSearchInput] = useState(search);

  const updateParam = (key, value) => {
    setSearchParams(
      (params) => {
        if (!value || value === "All") params.delete(key);
        else params.set(key, value);
        return params;
      },
      { replace: true }
    );
  };

  // Push the debounced input into the URL.
  useEffect(() => {
    if (searchInput === search) return;
    const timer = setTimeout(() => updateParam("search", searchInput), 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, search]);

  // Pull external changes (the navbar search) back into the input.
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    getCategories({ isDeleted: false })
      .then((res) => setCategories(res.data ?? []))
      .catch((error) => console.error("Failed to fetch categories:", error));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const filters = { isDeleted: false };
    if (category !== "All") filters.categoryId = category;
    if (search.trim()) filters.search = search.trim();
    // Only sent when actually set — a default ceiling would hide every
    // product priced above it.
    if (minPrice !== "") filters.minPrice = minPrice;
    if (maxPrice !== "") filters.maxPrice = maxPrice;

    getAllProducts(filters)
      .then((res) => {
        if (cancelled) return;
        setProducts(res.data ?? []);
        setFailed(false);
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error);
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [search, category, minPrice, maxPrice]);

  // The API always sorts newest-first, so ordering is applied here.
  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sort === "price-asc") return list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return list.sort((a, b) => b.price - a.price);
    if (sort === "name-asc")
      return list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, sort]);

  const activeCategory = categories.find((c) => c._id === category);
  const hasFilters =
    search !== "" || category !== "All" || minPrice !== "" || maxPrice !== "";

  const clearFilters = () => setSearchParams({}, { replace: true });

  const heading = activeCategory
    ? activeCategory.name
    : search
    ? `Results for “${search}”`
    : "All products";

  return (
    <div className="bg-white">
      {/* Canonical drops query params so filter permutations aren't indexed
          as separate thin pages. */}
      <Seo
        title={
          activeCategory
            ? `${activeCategory.name} — Barber Supplies`
            : "Shop All Barber Supplies"
        }
        description="Browse the full Yanki range of professional barber supplies — clippers, trimmers, shavers, shears and grooming essentials. Filter by category and price."
        path="/products"
      />

      <div className="container-page py-10 lg:py-14">
        <header className="mb-8">
          <h1 className="font-display text-4xl tracking-wide text-ink-950 sm:text-5xl">
            {heading}
          </h1>
          <p className="mt-2 text-gray-600">
            {loading
              ? "Loading products…"
              : `${sortedProducts.length} ${
                  sortedProducts.length === 1 ? "product" : "products"
                }`}
          </p>
        </header>

        {/* Category chips — one tap, no dropdown to open. */}
        <div className="mb-8 flex flex-wrap gap-2">
          <CategoryChip
            label="All"
            active={category === "All"}
            onClick={() => updateParam("category", "All")}
          />
          {categories.map((option) => (
            <CategoryChip
              key={option._id}
              label={option.name}
              active={category === option._id}
              onClick={() => updateParam("category", option._id)}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 border-y border-gray-200 py-3">
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            aria-expanded={filtersOpen}
            aria-controls="filter-panel"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-950 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filters
          </button>

          <div className="ml-auto flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-gray-600">
              Sort
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-10 py-8 lg:grid-cols-4">
          {/* Filters */}
          <aside
            id="filter-panel"
            className={cn(
              "space-y-8 lg:col-span-1 lg:block",
              filtersOpen ? "block" : "hidden"
            )}
          >
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-950">
                Search
              </h2>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <label htmlFor="product-search" className="sr-only">
                  Search products
                </label>
                <input
                  id="product-search"
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search products"
                  className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm"
                />
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-950">
                Price (NPR)
              </h2>
              <div className="flex items-center gap-2">
                <label htmlFor="min-price" className="sr-only">
                  Minimum price
                </label>
                <input
                  id="min-price"
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(e) => updateParam("minPrice", e.target.value)}
                  placeholder="Min"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm"
                />
                <span className="text-gray-400">–</span>
                <label htmlFor="max-price" className="sr-only">
                  Maximum price
                </label>
                <input
                  id="max-price"
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => updateParam("maxPrice", e.target.value)}
                  placeholder="Max"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm"
                />
              </div>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-ink-950"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                Clear all filters
              </button>
            )}
          </aside>

          {/* Results */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 gap-6 lg:grid-cols-3 md:gap-8">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : sortedProducts.length ? (
              <div className="grid grid-cols-2 gap-6 lg:grid-cols-3 md:gap-8">
                {sortedProducts.map((product) => (
                  <ProductCard key={product._id} {...product} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <p className="text-lg font-semibold text-ink-950">
                  {failed
                    ? "We couldn't load products just now"
                    : "No products match those filters"}
                </p>
                <p className="mt-2 text-gray-600">
                  {failed
                    ? "Please refresh the page and try again."
                    : "Try widening your price range or clearing the search."}
                </p>
                {hasFilters && !failed && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 rounded-lg bg-ink-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-800"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-ink-950 bg-ink-950 text-white"
          : "border-gray-300 text-gray-700 hover:border-ink-950 hover:text-ink-950"
      )}
    >
      {label}
    </button>
  );
}
