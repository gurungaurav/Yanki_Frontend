import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Lock, Truck, Wallet, CreditCard, ShoppingBag } from "lucide-react";
import TextInput from "../../components/textInput";
import Seo from "../../components/seo";
import useCartStore from "../../store/useCartStore";
import useUserStore from "../../store/useUserStore";
import { getUserDetailById } from "../../api/user.api";
import { placeOrder } from "../../api/order.api";
import { cn } from "../../lib/utils";
import { formatNPR, cartItemCount, cartSubtotal } from "../../lib/constants";

const PAYMENT_METHODS = [
  {
    value: "online",
    label: "Pay online",
    note: "Secure payment via Khalti",
    icon: CreditCard,
  },
  {
    value: "cod",
    label: "Cash on delivery",
    note: "Pay when your order arrives",
    icon: Wallet,
  },
];

export default function CheckOutPage() {
  const cartItems = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const navigate = useNavigate();
  const loggedUser = useUserStore((state) => state.user);

  const subtotal = cartSubtotal(cartItems);
  const itemCount = cartItemCount(cartItems);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      address: "",
      // Was 0, which rendered a literal "0" in the empty phone field.
      phoneNumber: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      address: Yup.string().required("Address is required"),
      phoneNumber: Yup.string()
        .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
        .required("Phone number is required"),
    }),
    onSubmit: async (values) => {
      await handleSubmit(values);
    },
  });

  const fetchUserDetails = async () => {
    if (!loggedUser) {
      toast.error("You need to log in to order products");
      navigate("/login");
      return;
    }
    try {
      const data = await getUserDetailById(loggedUser.token);
      formik.setFieldValue("firstName", data.data.firstName);
      formik.setFieldValue("lastName", data.data.lastName);
      formik.setFieldValue("phoneNumber", data.data.phoneNumber ?? "");
      formik.setFieldValue("address", data.data.address);
    } catch (error) {
      toast.error(error.response?.data?.message);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUser]);

  const handleSubmit = async (values) => {
    // Without this an empty cart could still be submitted as a zero-item order.
    if (!cartItems.length) {
      toast.error("Your cart is empty");
      navigate("/product/cart");
      return;
    }

    try {
      const payload = {
        userDetails: { ...values },
        orderItems: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        paymentMethod,
        totalPrice: subtotal,
        // Was hardcoded to http://localhost:5000, which breaks the payment
        // redirect anywhere but that exact dev port.
        website_url: window.location.origin,
      };

      const data = await placeOrder(payload, loggedUser.token);
      clearCart();

      if (paymentMethod === "cod") {
        toast.success(data.message);
        navigate(`/product/order-details?purchase_order_id=${data.data.orderId}`);
        return;
      }

      window.location.href = data.data.payment_url;
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Could not place your order");
    }
  };

  if (!cartItems.length) {
    return (
      <div className="container-page py-20">
        <Seo title="Checkout" path="/product/check-out" noIndex />
        <div className="mx-auto max-w-md text-center">
          <ShoppingBag
            className="mx-auto h-12 w-12 text-gray-300"
            aria-hidden="true"
          />
          <h1 className="mt-6 font-display text-4xl tracking-wide text-ink-950">
            Nothing to check out
          </h1>
          <p className="mt-3 text-gray-600">
            Your cart is empty, so there&apos;s no order to place yet.
          </p>
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
    <div className="bg-gray-50">
      <Seo title="Checkout" path="/product/check-out" noIndex />

      <div className="container-page py-8 lg:py-12">
        <header className="mb-8">
          <h1 className="font-display text-4xl tracking-wide text-ink-950 sm:text-5xl">
            Checkout
          </h1>
          <p className="mt-2 text-gray-600">
            Confirm your delivery details and payment method.
          </p>
        </header>

        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            <div className="space-y-6 lg:col-span-2">
              {/* Delivery details first — payment choice makes more sense
                  once people know where it's going. */}
              <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
                <h2 className="mb-5 text-lg font-semibold text-ink-950">
                  Delivery details
                </h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <TextInput
                      name="firstName"
                      label="First name"
                      placeholder="Enter your first name"
                      type="text"
                      formik={formik}
                    />
                    <TextInput
                      name="lastName"
                      label="Last name"
                      placeholder="Enter your last name"
                      type="text"
                      formik={formik}
                    />
                  </div>

                  <TextInput
                    name="address"
                    label="Delivery address"
                    placeholder="Street, area, city"
                    type="text"
                    formik={formik}
                  />

                  {/* tel, not number: number strips leading zeros and shows
                      useless spinners on a phone field. */}
                  <TextInput
                    name="phoneNumber"
                    label="Phone number"
                    placeholder="98XXXXXXXX"
                    type="tel"
                    formik={formik}
                  />
                </div>
              </section>

              <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
                <h2 className="mb-5 text-lg font-semibold text-ink-950">
                  Payment method
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {PAYMENT_METHODS.map(({ value, label, note, icon: Icon }) => {
                    const selected = paymentMethod === value;
                    return (
                      <label
                        key={value}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors",
                          selected
                            ? "border-ink-950 bg-gray-50 ring-1 ring-ink-950"
                            : "border-gray-300 hover:border-gray-400"
                        )}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={value}
                          checked={selected}
                          onChange={() => setPaymentMethod(value)}
                          className="mt-1 h-4 w-4 accent-ink-950"
                        />
                        <span className="flex-1">
                          <span className="flex items-center gap-2 font-medium text-ink-950">
                            <Icon className="h-4 w-4" aria-hidden="true" />
                            {label}
                          </span>
                          <span className="mt-0.5 block text-sm text-gray-500">
                            {note}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
                <h2 className="mb-4 border-b border-gray-200 pb-4 text-lg font-semibold text-ink-950">
                  Order summary
                </h2>

                {/*
                  Deliberately not links: tapping through to a product from
                  here abandons checkout and loses everything typed above.
                */}
                <ul className="max-h-72 space-y-4 overflow-y-auto">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex items-start gap-3">
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        loading="lazy"
                        className="h-16 w-16 shrink-0 rounded-md bg-gray-100 object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink-950">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          Qty {item.quantity} × {formatNPR(item.price)}
                        </p>
                      </div>
                      <p className="whitespace-nowrap text-sm font-semibold text-ink-950">
                        {formatNPR(item.price * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>

                <dl className="mt-5 space-y-2 border-t border-gray-200 pt-4 text-sm">
                  <div className="flex justify-between">
                    {/* Counts units, not cart lines — 3 of one item is 3. */}
                    <dt className="text-gray-600">
                      Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}
                      )
                    </dt>
                    <dd className="font-medium text-ink-950">
                      {formatNPR(subtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="flex items-center gap-1.5 text-gray-600">
                      <Truck className="h-4 w-4" aria-hidden="true" />
                      Delivery
                    </dt>
                    <dd className="font-medium text-ink-950">
                      Charged on delivery
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                  <span className="font-semibold text-ink-950">Total</span>
                  <span className="text-xl font-bold text-ink-950">
                    {formatNPR(subtotal)}
                  </span>
                </div>

                {/* Disabled while submitting: a second click would place a
                    second order. */}
                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="mt-5 w-full rounded-lg bg-brand-500 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-ink-950 transition-colors hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
                >
                  {formik.isSubmitting
                    ? "Placing order…"
                    : paymentMethod === "cod"
                    ? "Place order"
                    : "Continue to payment"}
                </button>

                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-500">
                  <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                  Encrypted checkout · 7-day returns
                </p>

                <Link
                  to="/product/cart"
                  className="mt-4 block text-center text-sm font-medium text-gray-600 transition-colors hover:text-ink-950"
                >
                  Back to cart
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
