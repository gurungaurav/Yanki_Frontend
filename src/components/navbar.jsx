import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Package,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import useUserStore from "../store/useUserStore";
import useCartStore from "../store/useCartStore";
import { cn } from "../lib/utils";
import yanki from "../assets/yanki-.png";

const NAV_LINKS = [
  { name: "Home", to: "/" },
  { name: "Shop", to: "/products" },
  { name: "About", to: "/about-us" },
  { name: "Contact", to: "/contact-us" },
];

export default function Navbar() {
  const user = useUserStore((state) => state.user);
  const logOutUser = useUserStore((state) => state.deleteUser);
  const cart = useCartStore((state) => state.cart);

  const navigate = useNavigate();
  const location = useLocation();

  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");

  const accountRef = useRef(null);

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  // Collapse the promo bar once the user starts reading the page.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close both menus on navigation.
  useEffect(() => {
    setIsAccountOpen(false);
    setIsMobileOpen(false);
  }, [location.pathname, location.search]);

  // Escape closes whichever menu is open.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      setIsAccountOpen(false);
      setIsMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Click outside closes the account dropdown.
  useEffect(() => {
    if (!isAccountOpen) return;
    const onPointerDown = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [isAccountOpen]);

  // Lock the page behind the mobile drawer.
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = query.trim();
    navigate(
      term ? `/products?search=${encodeURIComponent(term)}` : "/products",
    );
    setQuery("");
  };

  const handleLogout = () => {
    logOutUser();
    setIsAccountOpen(false);
    setIsMobileOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Main bar */}
      <nav
        aria-label="Main"
        className={cn(
          "relative z-50 border-b border-white/5 bg-ink-950 transition-shadow duration-300",
          scrolled &&
            "bg-ink-950/95 shadow-lg shadow-black/40 backdrop-blur-md",
        )}
      >
        <div className="container-page flex h-[var(--nav-h)] items-center gap-3 sm:gap-5">
          {/* Logo */}
          <Link
            to="/"
            aria-label="Yanki — home"
            className="flex shrink-0 items-center"
          >
            <img
              src={yanki}
              alt="Yanki"
              width="120"
              height="40"
              className="h-9 w-auto object-contain brightness-0 invert md:h-10"
            />
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "relative rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200",
                      isActive ? "text-white" : "text-ink-300 hover:text-white",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-500"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop search */}
          <form
            role="search"
            onSubmit={handleSearch}
            className="ml-auto hidden max-w-xs flex-1 md:block"
          >
            <label htmlFor="site-search" className="sr-only">
              Search products
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
                aria-hidden="true"
              />
              <input
                id="site-search"
                type="search"
                name="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search clippers, trimmers…"
                className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-ink-400 transition-colors focus:border-brand-500/50 focus:bg-white/10"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1 md:ml-0 md:gap-2">
            {/* Account */}
            <div className="relative hidden md:block" ref={accountRef}>
              <button
                type="button"
                onClick={() => setIsAccountOpen((open) => !open)}
                aria-expanded={isAccountOpen}
                aria-haspopup="menu"
                className={cn(
                  "flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-sm font-medium transition-colors duration-200",
                  isAccountOpen
                    ? "border-white/20 bg-white/10 text-white"
                    : "border-white/10 text-ink-300 hover:border-white/20 hover:bg-white/5 hover:text-white",
                )}
              >
                {user ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-ink-950">
                    {user.username?.[0]?.toUpperCase()}
                  </span>
                ) : (
                  <User className="h-4 w-4" aria-hidden="true" />
                )}
                <span className="max-w-24 truncate">
                  {user ? user.username : "Account"}
                </span>
              </button>

              {isAccountOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-white/10 bg-ink-900 shadow-2xl shadow-black/50"
                >
                  {user ? (
                    <div className="py-1">
                      <MenuLink to="/profile" icon={User} label="My profile" />
                      <MenuLink
                        to="/product/order-list"
                        icon={Package}
                        label="My orders"
                      />
                      {user.role === "admin" && (
                        <MenuLink
                          to="/dashboard"
                          icon={LayoutDashboard}
                          label="Dashboard"
                        />
                      )}
                      <div className="my-1 h-px bg-white/10" />
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-danger transition-colors hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                        Log out
                      </button>
                    </div>
                  ) : (
                    <div className="p-3">
                      <Link
                        to="/login"
                        role="menuitem"
                        className="block rounded-lg bg-brand-500 px-4 py-2.5 text-center text-sm font-semibold text-ink-950 transition-colors hover:bg-brand-400"
                      >
                        Log in
                      </Link>
                      <Link
                        to="/register"
                        role="menuitem"
                        className="mt-2 block rounded-lg px-4 py-2.5 text-center text-sm font-medium text-ink-200 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        Create an account
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/product/cart"
              aria-label={`Cart, ${cartCount} ${
                cartCount === 1 ? "item" : "items"
              }`}
              className="relative rounded-lg p-2 text-ink-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-ink-950">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setIsMobileOpen((open) => !open)}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              className="rounded-lg p-2 text-ink-300 transition-colors hover:bg-white/5 hover:text-white md:hidden"
            >
              {isMobileOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/60 md:hidden"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-menu"
            className="absolute inset-x-0 z-40 max-h-[calc(100dvh-var(--nav-h))] overflow-y-auto border-b border-white/10 bg-ink-950 px-4 pb-6 pt-4 shadow-2xl shadow-black/50 md:hidden"
          >
            <form role="search" onSubmit={handleSearch} className="mb-5">
              <label htmlFor="mobile-search" className="sr-only">
                Search products
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
                  aria-hidden="true"
                />
                <input
                  id="mobile-search"
                  type="search"
                  name="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search clippers, trimmers…"
                  className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-ink-400 focus:border-brand-500/50"
                />
              </div>
            </form>

            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    className={({ isActive }) =>
                      cn(
                        "block rounded-lg px-4 py-3 text-base font-medium transition-colors",
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-ink-300 hover:bg-white/5 hover:text-white",
                      )
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="mt-5 border-t border-white/10 pt-5">
              {user ? (
                <div className="flex flex-col gap-1">
                  <div className="mb-2 flex items-center gap-3 px-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-ink-950">
                      {user.username?.[0]?.toUpperCase()}
                    </span>
                    <span className="truncate text-sm font-medium text-white">
                      {user.username}
                    </span>
                  </div>
                  <MobileLink to="/profile" icon={User} label="My profile" />
                  <MobileLink
                    to="/product/order-list"
                    icon={Package}
                    label="My orders"
                  />
                  {user.role === "admin" && (
                    <MobileLink
                      to="/dashboard"
                      icon={LayoutDashboard}
                      label="Dashboard"
                    />
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-left text-base font-medium text-danger transition-colors hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Log out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="rounded-lg bg-brand-500 px-4 py-3 text-center text-sm font-semibold text-ink-950 transition-colors hover:bg-brand-400"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-lg border border-white/15 px-4 py-3 text-center text-sm font-medium text-ink-200 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    Create an account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}

function MenuLink({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      role="menuitem"
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-200 transition-colors hover:bg-white/5 hover:text-white"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </Link>
  );
}

function MobileLink({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-ink-300 transition-colors hover:bg-white/5 hover:text-white"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </Link>
  );
}
