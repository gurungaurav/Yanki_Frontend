import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Calendar, ShoppingBag, ChevronRight } from "lucide-react";
import { Badge } from "../../components/badge";
import { getSpecificUserOrders } from "../../api/order.api";
import useUserStore from "../../store/useUserStore";
import Seo from "../../components/seo";
import { formatNPR } from "../../lib/constants";

export default function OrderListPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const loggedUser = useUserStore((state) => state.user);
  const jwt = loggedUser?.token;
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const fetchOrders = async () => {
      if (!loggedUser) {
        toast.error("You need to log in to view your orders");
        navigate("/login", { state: { from: "/product/order-list" } });
        return;
      }

      try {
        const response = await getSpecificUserOrders(jwt);
        if (!cancelled) setOrders(response.data ?? []);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOrders();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-page py-10 lg:py-16">
      <Seo title="My orders" path="/product/order-list" noIndex />

      <header className="mb-8">
        <h1 className="font-display text-4xl tracking-wide text-ink-950 sm:text-5xl">
          My orders
        </h1>
        <p className="mt-2 text-gray-600">
          {loading
            ? "Loading your orders…"
            : orders.length
            ? `${orders.length} ${orders.length === 1 ? "order" : "orders"}`
            : "Track and manage your orders"}
        </p>
      </header>

      {loading ? (
        <div className="grid animate-pulse grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-56 rounded-xl bg-gray-200" />
          ))}
        </div>
      ) : !orders.length ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <ShoppingBag
            className="mx-auto h-12 w-12 text-gray-300"
            aria-hidden="true"
          />
          <h2 className="mt-6 text-xl font-semibold text-ink-950">
            No orders yet
          </h2>
          <p className="mt-2 text-gray-600">
            Once you place an order, you&apos;ll be able to track it here.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-brand-500 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink-950 transition-colors hover:bg-brand-400"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            /* key was order?.id — orders carry orderId, so every key was
               undefined and React had nothing stable to track. */
            <OrderCard key={order?.orderId} order={order} />
          ))}
        </ul>
      )}
    </div>
  );
}

function OrderCard({ order }) {
  return (
    <li className="group relative flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Order
          </p>
          <h2 className="truncate font-semibold text-ink-950">
            #{order?.orderId}
          </h2>
        </div>
        <Badge status={order?.orderStatus} />
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
          {new Date(order?.orderDate).toLocaleDateString()}
        </span>
        <span className="flex items-center gap-1.5">
          <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden="true" />
          {order?.ordersCount} {order?.ordersCount === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="mt-4 rounded-lg bg-gray-50 p-3">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
          Total amount
        </p>
        <p className="mt-1 text-xl font-bold text-ink-950">
          {formatNPR(order?.totalAmount)}
        </p>
      </div>

      <Link
        to={`/product/order-details?purchase_order_id=${order?.orderId}`}
        className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-ink-950 after:absolute after:inset-0 hover:underline"
      >
        View details
        <ChevronRight
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    </li>
  );
}
