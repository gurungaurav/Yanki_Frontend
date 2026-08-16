import { useEffect, useState, useRef, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ShoppingCart,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Check,
  Minus,
  Plus,
  X,
  ZoomIn,
} from "lucide-react";
import { FaEdit, FaStar, FaTrash } from "react-icons/fa";
import { getAllProducts, getSpecificProduct } from "../../api/product.api";
import {
  addProductReviews,
  getProductReviews,
  softDeleteProductReviews,
  updateProductReviews,
} from "../../api/reviews.api";
import useCartStore from "../../store/useCartStore";
import { toast } from "react-toastify";
import ProductCard from "../../components/productCard";
import ProductCardSkeleton from "../../components/productCardSkeleton";
import useUserStore from "../../store/useUserStore";
import { Modal } from "../../components/modal";
import Seo from "../../components/seo";
import { cn } from "../../lib/utils";
import { formatNPR } from "../../lib/constants";

const SITE_URL = "https://yanki.com";
const REVIEWS_PER_PAGE = 5;

const BUY_ASSURANCES = [
  { icon: RotateCcw, label: "7-day easy returns" },
  { icon: ShieldCheck, label: "100% genuine product" },
];

/** Shared add-to-cart rules so the inline button and the sticky bar agree. */
function useAddToCart(product) {
  const addItems = useCartStore((state) => state.addToCart);
  const existedQuantity = useCartStore(
    (state) => state.cart.find((item) => item.id === product?._id)?.quantity
  );

  return (quantity = 1) => {
    if (!product || product.stockQuantity <= 0) {
      toast.error("This product is out of stock");
      return false;
    }

    if (existedQuantity && quantity + existedQuantity > product.stockQuantity) {
      const remaining = product.stockQuantity - existedQuantity;
      toast.error(
        remaining > 0
          ? `Only ${remaining} more available — you already have ${existedQuantity} in your cart.`
          : "You already have all available stock in your cart."
      );
      return false;
    }

    addItems({
      id: product._id,
      name: product.name,
      price: product.price,
      availableQuantity: product.stockQuantity,
      imageUrl: product.images?.[0]?.imageUrl,
      quantity,
    });
    toast.success("Added to cart!");
    return true;
  };
}

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewSummary, setReviewSummary] = useState(null);

  const buyBoxRef = useRef(null);
  const [buyBoxVisible, setBuyBoxVisible] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getSpecificProduct(params?.id)
      .then((res) => {
        if (!cancelled) setProduct(res.data);
      })
      .catch((error) => {
        console.error("Failed to load product:", error);
        if (!cancelled) setProduct(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [params?.id]);

  // Show the sticky bar only once the real buy button has scrolled away.
  useEffect(() => {
    const node = buyBoxRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setBuyBoxVisible(entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [product]);

  if (loading) return <ProductPageSkeleton />;

  if (!product) {
    return (
      <div className="container-page py-24 text-center">
        <Seo title="Product not found" noIndex />
        <h1 className="font-display text-4xl tracking-wide text-ink-950">
          Product not found
        </h1>
        <p className="mt-3 text-gray-600">
          It may have been removed or the link is incorrect.
        </p>
        <Link
          to="/products"
          className="mt-8 inline-block rounded-lg bg-ink-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-800"
        >
          Browse all products
        </Link>
      </div>
    );
  }

  const inStock = product.stockQuantity > 0;
  // Prefer the live count from the review list once it loads; the product
  // endpoint returns NaN for rating when there are no reviews.
  const ratingValue = reviewSummary?.average ?? product.rating;
  const ratingCount = reviewSummary?.count ?? product.reviewCount;
  const hasRating = ratingCount > 0 && !Number.isNaN(ratingValue);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images?.map((img) => img.imageUrl) ?? [],
    sku: product._id,
    category: product.categoryId?.name,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product._id}`,
      priceCurrency: "NPR",
      price: product.price,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Yanki" },
    },
    ...(hasRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: Number(ratingValue.toFixed(1)),
        reviewCount: ratingCount,
      },
    }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${SITE_URL}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${SITE_URL}/product/${product._id}`,
      },
    ],
  };

  return (
    /* Bottom padding leaves room for the sticky mobile bar. */
    <div className="bg-white pb-24 lg:pb-0">
      <Seo
        title={product.name}
        description={product.description?.slice(0, 155)}
        path={`/product/${product._id}`}
        image={product.images?.[0]?.imageUrl}
        jsonLd={[productJsonLd, breadcrumbJsonLd]}
      />

      <div className="container-page py-6 lg:py-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
            <li>
              <Link to="/" className="hover:text-ink-950">
                Home
              </Link>
            </li>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <li>
              <Link to="/products" className="hover:text-ink-950">
                Products
              </Link>
            </li>
            {product.categoryId?.name && (
              <>
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                <li>
                  <Link
                    to={`/products?category=${product.categoryId._id}`}
                    className="hover:text-ink-950"
                  >
                    {product.categoryId.name}
                  </Link>
                </li>
              </>
            )}
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <li aria-current="page" className="font-medium text-ink-950">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductGallery images={product.images} productName={product.name} />

          <div>
            {product.categoryId?.name && (
              <Link
                to={`/products?category=${product.categoryId._id}`}
                className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-600 hover:text-brand-500"
              >
                {product.categoryId.name}
              </Link>
            )}

            <h1 className="font-display text-4xl leading-[1.05] tracking-wide text-ink-950 sm:text-5xl">
              {product.name}
            </h1>

            {hasRating ? (
              /* Jumps to the reviews rather than being decoration. */
              <a
                href="#reviews"
                className="mt-3 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-ink-950"
              >
                <Stars value={ratingValue} />
                <span className="underline-offset-4 hover:underline">
                  {ratingValue.toFixed(1)} ({ratingCount}{" "}
                  {ratingCount === 1 ? "review" : "reviews"})
                </span>
              </a>
            ) : (
              <a
                href="#reviews"
                className="mt-3 inline-block text-sm text-gray-500 underline-offset-4 hover:text-ink-950 hover:underline"
              >
                Be the first to review this
              </a>
            )}

            <p className="mt-6 flex items-baseline gap-3">
              <span className="text-4xl font-bold tracking-tight text-ink-950">
                {formatNPR(product.price)}
              </span>
              <span className="text-sm text-gray-500">incl. all taxes</span>
            </p>

            <p
              className={cn(
                "mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
                inStock ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              )}
            >
              {inStock ? (
                <>
                  <Check className="h-4 w-4" aria-hidden="true" />
                  In stock
                  {product.stockQuantity <= 5 &&
                    ` — only ${product.stockQuantity} left`}
                </>
              ) : (
                "Out of stock"
              )}
            </p>

            {product.description && (
              <p className="mt-6 whitespace-pre-line leading-relaxed text-gray-700">
                {product.description}
              </p>
            )}

            <div ref={buyBoxRef}>
              <AddToCartSection product={product} />
            </div>

            {/* Dark band ties the buy box back to the site's brand palette
                and separates assurances from the description above. */}
            <ul className="mt-8 divide-y divide-white/10 rounded-xl bg-ink-950 p-5">
              {BUY_ASSURANCES.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 py-2.5 text-sm text-ink-200 first:pt-0 last:pb-0"
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

        <ReviewSection
          productId={params?.id}
          onSummaryChange={setReviewSummary}
        />
        <RelatedProducts
          categoryId={product.categoryId?._id}
          productId={product._id}
        />
      </div>

      <StickyBuyBar product={product} hidden={buyBoxVisible} />
    </div>
  );
}

/** Mobile-only bar that keeps the price and CTA reachable while scrolling. */
function StickyBuyBar({ product, hidden }) {
  const addToCart = useAddToCart(product);
  const outOfStock = product.stockQuantity <= 0;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 p-3 backdrop-blur transition-transform duration-300 lg:hidden",
        hidden ? "translate-y-full" : "translate-y-0"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-gray-500">{product.name}</p>
          <p className="font-bold text-ink-950">{formatNPR(product.price)}</p>
        </div>
        <button
          type="button"
          onClick={() => addToCart(1)}
          disabled={outOfStock}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-brand-500 px-5 py-3 text-sm font-bold uppercase tracking-wide text-ink-950 transition-colors hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
        >
          <ShoppingCart size={16} aria-hidden="true" />
          {outOfStock ? "Out of stock" : "Add"}
        </button>
      </div>
    </div>
  );
}

function Stars({ value, size = 16 }) {
  return (
    <span
      className="flex"
      role="img"
      aria-label={`${value.toFixed(1)} out of 5 stars`}
    >
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          size={size}
          className={i < Math.round(value) ? "text-brand-500" : "text-gray-300"}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function ProductPageSkeleton() {
  return (
    <div className="container-page animate-pulse py-10">
      <div className="mb-6 h-4 w-64 rounded bg-gray-200" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="h-96 rounded-lg bg-gray-200 lg:h-[35rem]" />
        <div className="space-y-4">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="h-8 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-40 rounded bg-gray-200" />
          <div className="h-10 w-48 rounded bg-gray-200" />
          <div className="h-24 w-full rounded bg-gray-200" />
          <div className="h-12 w-full rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

function ReviewSection({ productId, onSummaryChange }) {
  const [reviews, setReview] = useState([]);
  const [visibleCount, setVisibleCount] = useState(REVIEWS_PER_PAGE);

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [editReviewId, setEditReviewId] = useState(null);
  const [editingReview, setEditingReview] = useState({});

  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);

  const userStore = useUserStore((state) => state?.user);
  const token = userStore?.token;

  const getReview = async () => {
    try {
      const response = await getProductReviews(productId, false);
      setReview(response.data ?? []);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    }
  };

  useEffect(() => {
    getReview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // Rating breakdown, used for the summary panel and lifted to the parent so
  // the header and JSON-LD stay in step with the visible reviews.
  const summary = useMemo(() => {
    const count = reviews.length;
    if (!count) return { count: 0, average: 0, distribution: [0, 0, 0, 0, 0] };

    const distribution = [0, 0, 0, 0, 0];
    let total = 0;
    for (const review of reviews) {
      const stars = Math.min(5, Math.max(1, Math.round(review.rating || 0)));
      distribution[stars - 1] += 1;
      total += review.rating || 0;
    }
    return { count, average: total / count, distribution };
  }, [reviews]);

  useEffect(() => {
    onSummaryChange?.(summary);
  }, [summary, onSummaryChange]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      return toast.error("You need to log in to add a review");
    }
    // The form used to submit happily with a 0-star rating.
    if (rating < 1) {
      return toast.error("Please choose a star rating");
    }

    setSubmitting(true);
    try {
      const response = await addProductReviews(
        { productId, review: reviewText, rating },
        token
      );
      toast.success(response.message);
      setReviewText("");
      setRating(0);
      getReview();
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Could not add your review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = (review) => {
    setEditReviewId(review._id);
    setEditingReview(review);
    setNewReview(review.review);
    setNewRating(review.rating);
    setShowModal(true);
  };

  const handleDeleteReview = (reviewId) => {
    setEditReviewId(reviewId);
    setShowDeleteCategoryModal(true);
  };

  const updateReview = async () => {
    try {
      const response = await updateProductReviews(
        editReviewId,
        { review: newReview, rating: newRating },
        token
      );
      toast.success(response.message);
      setShowModal(false);
      setReviewText("");
      setRating(0);
      getReview();
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Could not update review");
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      const response = await softDeleteProductReviews(reviewId);
      toast.success(response.message);
      getReview();
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Could not delete review");
    }
  };

  return (
    <section id="reviews" className="my-16 border-t border-gray-200 pt-12">
      <h2 className="mb-8 font-display text-3xl tracking-wide text-ink-950">Customer reviews</h2>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Summary */}
        <div className="lg:col-span-1">
          {summary.count > 0 ? (
            <div className="rounded-xl border border-gray-200 p-5">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-ink-950">
                  {summary.average.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">out of 5</span>
              </div>
              <div className="mt-2">
                <Stars value={summary.average} size={18} />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Based on {summary.count}{" "}
                {summary.count === 1 ? "review" : "reviews"}
              </p>

              <ul className="mt-5 space-y-1.5">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = summary.distribution[stars - 1];
                  const percent = summary.count
                    ? (count / summary.count) * 100
                    : 0;
                  return (
                    <li key={stars} className="flex items-center gap-2 text-xs">
                      <span className="w-8 shrink-0 text-gray-600">
                        {stars} ★
                      </span>
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                        <span
                          className="block h-full rounded-full bg-brand-500"
                          style={{ width: `${percent}%` }}
                        />
                      </span>
                      <span className="w-6 shrink-0 text-right text-gray-500">
                        {count}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <p className="text-gray-600">
              No reviews yet — be the first to review this product.
            </p>
          )}
        </div>

        {/* List + form */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {reviews.slice(0, visibleCount).map((review) => (
              <article
                key={review?._id}
                className="border-b border-gray-200 pb-5 last:border-0"
              >
                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <span className="text-sm font-semibold text-ink-950 sm:mr-2 sm:text-base">
                    {review?.userId?.username}
                  </span>
                  <div className="flex items-center gap-2">
                    <Stars value={review?.rating ?? 0} size={14} />
                    <span className="text-xs text-gray-500 sm:text-sm">
                      {new Date(review?.reviewDate).toLocaleDateString()}
                    </span>
                    {review?.userId?._id === userStore?.id && (
                      <div className="ml-2 flex gap-2 sm:ml-4">
                        <button
                          type="button"
                          onClick={() => handleEditReview(review)}
                          aria-label="Edit your review"
                        >
                          <FaEdit className="cursor-pointer text-sm text-blue-500" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(review._id)}
                          aria-label="Delete your review"
                        >
                          <FaTrash className="cursor-pointer text-sm text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-700 sm:text-base">
                  {review?.review}
                </p>
              </article>
            ))}
          </div>

          {/* Long review lists used to render in full, pushing related
              products far down the page. */}
          {visibleCount < reviews.length && (
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + REVIEWS_PER_PAGE)}
              className="mt-6 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-gray-50"
            >
              Show more reviews ({reviews.length - visibleCount} left)
            </button>
          )}

          <h3 className="mb-4 mt-10 text-lg font-bold text-ink-950">
            Write a review
          </h3>
          <form onSubmit={handleReviewSubmit} className="max-w-xl space-y-4">
            <div>
              <span className="block text-sm font-medium text-gray-700">
                Rating
              </span>
              <div className="mt-1 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    aria-label={`Rate ${i + 1} out of 5`}
                    aria-pressed={rating === i + 1}
                  >
                    <FaStar
                      size={22}
                      className={cn(
                        "cursor-pointer transition-colors",
                        i < rating ? "text-brand-500" : "text-gray-300"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label
                htmlFor="review-text"
                className="block text-sm font-medium text-gray-700"
              >
                Review
              </label>
              <textarea
                id="review-text"
                className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-sm"
                rows="4"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="cursor-pointer rounded-lg bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit review"}
            </button>
          </form>
        </div>
      </div>

      <Modal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditReviewId(null);
        }}
        onConfirm={updateReview}
        message={`Are you sure you want to update the review?`}
        disableConfirm={
          newReview === editingReview?.review &&
          newRating === editingReview?.rating
        }
      >
        <form className="space-y-4">
          <div>
            <span className="block text-sm font-medium text-gray-700">
              Rating
            </span>
            <div className="mt-1 flex items-center">
              {[...Array(5)].map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setNewRating(i + 1)}
                  aria-label={`Rate ${i + 1} out of 5`}
                >
                  <FaStar
                    size={22}
                    className={cn(
                      "cursor-pointer",
                      i < newRating ? "text-brand-500" : "text-gray-300"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label
              htmlFor="edit-review-text"
              className="block text-sm font-medium text-gray-700"
            >
              Review
            </label>
            <textarea
              id="edit-review-text"
              className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-sm"
              rows="4"
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              required
            ></textarea>
          </div>
        </form>
      </Modal>

      <Modal
        show={showDeleteCategoryModal}
        onClose={() => {
          setShowDeleteCategoryModal(false);
          setEditReviewId(null);
        }}
        onConfirm={() => deleteReview(editReviewId)}
        message={"Are you sure you want to delete this review?"}
      ></Modal>
    </section>
  );
}

function RelatedProducts({ productId, categoryId }) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;
    let cancelled = false;
    setLoading(true);

    getAllProducts({ categoryId, productId, limit: 4 })
      .then((res) => {
        if (!cancelled) setRelatedProducts(res.data ?? []);
      })
      .catch((error) =>
        console.error("Failed to load related products:", error)
      )
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId, categoryId]);

  if (!loading && !relatedProducts.length) return null;

  return (
    <section className="mb-16 border-t border-gray-200 pt-12">
      <h2 className="mb-8 font-display text-3xl tracking-wide text-ink-950">
        You might also like
      </h2>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
        {loading
          ? [0, 1, 2, 3].map((i) => <ProductCardSkeleton key={i} />)
          : relatedProducts.map((product) => (
              <ProductCard key={product._id} {...product} />
            ))}
      </div>
    </section>
  );
}

function ProductGallery({ images, productName }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  useEffect(() => {
    if (!zoomOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && setZoomOpen(false);
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [zoomOpen]);

  const mainImage = images?.[activeIndex]?.imageUrl;

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      {images?.length > 1 && (
        <div className="order-2 flex gap-2 overflow-x-auto sm:order-1 sm:w-20 sm:flex-col sm:gap-3 sm:overflow-visible md:w-24">
          {images.map((image, index) => (
            <button
              key={image._id ?? index}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1} of ${productName}`}
              aria-pressed={index === activeIndex}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-gray-50 transition-all md:h-20 md:w-20",
                index === activeIndex
                  ? "border-ink-950 shadow-md"
                  : "border-gray-200 hover:border-gray-400"
              )}
            >
              <img
                src={image.imageUrl}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain"
              />
            </button>
          ))}
        </div>
      )}

      <div className="order-1 flex-1 sm:order-2">
        <button
          type="button"
          onClick={() => setZoomOpen(true)}
          aria-label={`Zoom in on ${productName}`}
          className="group relative block h-80 w-full overflow-hidden rounded-lg bg-gray-50 sm:h-96 lg:h-[35rem]"
        >
          <img
            src={mainImage || "/placeholder.svg"}
            alt={productName}
            fetchPriority="high"
            decoding="async"
            /* object-contain throughout: object-cover was cropping the
               edges off product photography on desktop. */
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-ink-950 opacity-0 transition-opacity group-hover:opacity-100">
            <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
            Zoom
          </span>
        </button>
      </div>

      {/* Lightbox */}
      {zoomOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} enlarged`}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/95 p-4"
          onClick={() => setZoomOpen(false)}
        >
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            aria-label="Close zoom"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          <img
            src={mainImage || "/placeholder.svg"}
            alt={productName}
            className="max-h-full max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

function AddToCartSection({ product }) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useAddToCart(product);

  const { stockQuantity } = product;
  const outOfStock = stockQuantity <= 0;

  const decreaseQuantity = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQuantity = () =>
    setQuantity((q) => Math.min(stockQuantity, q + 1));

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch">
      <div className="flex w-fit items-center rounded-lg border border-gray-300">
        <button
          type="button"
          onClick={decreaseQuantity}
          disabled={outOfStock || quantity <= 1}
          aria-label="Decrease quantity"
          className="px-3 py-3 text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <span
          aria-live="polite"
          className="w-12 text-center text-sm font-semibold"
        >
          {quantity}
        </span>
        <button
          type="button"
          onClick={increaseQuantity}
          disabled={outOfStock || quantity >= stockQuantity}
          aria-label="Increase quantity"
          className="px-3 py-3 text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => addToCart(quantity)}
        disabled={outOfStock}
        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-ink-950 transition-colors hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
      >
        <ShoppingCart size={18} aria-hidden="true" />
        {outOfStock ? "Out of stock" : "Add to cart"}
      </button>
    </div>
  );
}
