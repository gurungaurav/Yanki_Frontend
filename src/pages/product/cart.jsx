import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import useCartStore from "../../store/useCartStore";
import useUserStore from "../../store/useUserStore";
import Seo from "../../components/seo";
import { formatNPR, cartItemCount, cartSubtotal } from "../../lib/constants";

export default function CartPage() {
  /*
   * Read straight from the store rather than copying it into local state.
   * The old page seeded useState from the store once, so the cart badge in
   * the navbar and this list could drift apart.
   */
  const cartItems = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const subtotal = cartSubtotal(cartItems);
  const itemCount = cartItemCount(cartItems);

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please log in to place your order");
      // Carry the intent through login so checkout resumes afterwards.
      navigate("/login", { state: { from: "/product/check-out" } });
      return;
    }
    navigate("/product/check-out");
  };

  if (!cartItems.length) {
    return (
      <div className="container-page py-20 min-h-screen">
        <Seo title="Your Cart" path="/product/cart" noIndex />
        <div className="mx-auto max-w-md text-center">
          <ShoppingBag
            className="mx-auto h-12 w-12 text-gray-300"
            aria-hidden="true"
          />
          <h1 className="mt-6 font-display text-4xl tracking-wide text-ink-950">
            Your cart is empty
          </h1>
          <p className="mt-3 text-gray-600">
            Once you add tools to your cart, they&apos;ll show up here.
          </p>
          {/* An empty cart used to be a dead end with no way forward. */}
          <Link
            to="/products"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-brand-500 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink-950 transition-colors hover:bg-brand-400"
          >
            Start shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10 lg:py-14 min-h-screen">
      <Seo title="Your Cart" path="/product/cart" noIndex />

      <h1 className="font-display text-4xl tracking-wide text-ink-950 sm:text-5xl">
        Your cart
      </h1>
      <p className="mt-2 text-gray-600">
        {itemCount} {itemCount === 1 ? "item" : "items"}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Line items */}
        <ul className="lg:col-span-2">
          {cartItems.map((item) => {
            const atMax = item.quantity >= item.availableQuantity;

            return (
              <li
                key={item.id}
                className="flex gap-4 border-b border-gray-200 py-5 first:pt-0"
              >
                <Link
                  to={`/product/${item.id}`}
                  className="shrink-0"
                  aria-label={`View ${item.name}`}
                >
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.name}
                    loading="lazy"
                    className="h-24 w-24 rounded-md bg-gray-100 object-cover sm:h-28 sm:w-28"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="truncate font-semibold text-ink-950">
                        <Link
                          to={`/product/${item.id}`}
                          className="hover:underline"
                        >
                          {item.name}
                        </Link>
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {formatNPR(item.price)} each
                      </p>
                      {atMax && (
                        <p className="mt-1 text-xs font-medium text-amber-600">
                          Max available: {item.availableQuantity}
                        </p>
                      )}
                    </div>

                    <p className="whitespace-nowrap font-semibold text-ink-950">
                      {formatNPR(item.price * item.quantity)}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-lg border border-gray-300">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="px-2.5 py-2 text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Minus className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <span
                        aria-live="polite"
                        className="w-10 text-center text-sm font-semibold"
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={atMax}
                        aria-label={`Increase quantity of ${item.name}`}
                        className="px-2.5 py-2 text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="flex items-center gap-1.5 rounded-md p-2 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-ink-950">
              Order summary
            </h2>

            <dl className="mt-5 space-y-2 border-t border-gray-200 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">
                  Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                </dt>
                <dd className="font-medium text-ink-950">
                  {formatNPR(subtotal)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Delivery</dt>
                <dd className="font-medium text-ink-950">
                  Charged on delivery
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex justify-between border-t border-gray-200 pt-4">
              <span className="text-base font-semibold text-ink-950">
                Total
              </span>
              <span className="text-xl font-bold text-ink-950">
                {formatNPR(subtotal)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="mt-5 w-full rounded-lg bg-brand-500 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-ink-950 transition-colors hover:bg-brand-400"
            >
              Proceed to checkout
            </button>

            {!user && (
              <p className="mt-3 text-center text-xs text-gray-500">
                You&apos;ll be asked to log in first.
              </p>
            )}

            <Link
              to="/products"
              className="mt-4 flex items-center justify-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-ink-950"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
