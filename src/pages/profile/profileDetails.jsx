import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Pencil, KeyRound, Package } from "lucide-react";
import { getUserDetailById } from "../../api/user.api";
import useUserStore from "../../store/useUserStore";
import Seo from "../../components/seo";

export default function ProfileDetails() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const loggedUser = useUserStore((state) => state.user);
  const token = loggedUser?.token;

  useEffect(() => {
    let cancelled = false;

    const fetchUserDetails = async () => {
      if (!token) {
        toast.error("You need to log in to view your profile");
        navigate("/login", { state: { from: "/profile" } });
        return;
      }
      try {
        const data = await getUserDetailById(token);
        if (!cancelled) setUser(data.data);
      } catch (error) {
        toast.error(error.response?.data?.message ?? "Could not load profile");
        navigate("/login");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchUserDetails();
    return () => {
      cancelled = true;
    };
  }, [token, navigate]);

  const fields = [
    { label: "First name", value: user?.firstName },
    { label: "Last name", value: user?.lastName },
    { label: "Email", value: user?.email },
    { label: "Username", value: user?.username },
    { label: "Phone number", value: user?.phoneNumber },
    { label: "Address", value: user?.address },
  ];

  return (
    <div className="container-page py-10 lg:py-16">
      <Seo title="My profile" path="/profile" noIndex />

      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl tracking-wide text-ink-950 sm:text-5xl">
            My profile
          </h1>
          <p className="mt-2 text-gray-600">
            Your account details and delivery information.
          </p>
        </div>

        {/* The page previously had no route back to orders. */}
        <Link
          to="/product/order-list"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-gray-50"
        >
          <Package className="h-4 w-4" aria-hidden="true" />
          My orders
        </Link>
      </header>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        {loading ? (
          <div className="grid animate-pulse gap-6 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.label}>
                <div className="h-3 w-24 rounded bg-gray-200" />
                <div className="mt-2 h-5 w-40 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : (
          <dl className="grid gap-6 sm:grid-cols-2">
            {fields.map(({ label, value }) => (
              <div key={label}>
                <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {label}
                </dt>
                <dd className="mt-1 break-words text-ink-950">
                  {value || <span className="text-gray-400">Not set</span>}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-8 flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row">
          <Link
            to="/profile/edit-profile"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-800"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Update profile
          </Link>
          <Link
            to="/profile/edit-password"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-ink-950 transition-colors hover:bg-gray-50"
          >
            <KeyRound className="h-4 w-4" aria-hidden="true" />
            Change password
          </Link>
        </div>
      </div>
    </div>
  );
}
