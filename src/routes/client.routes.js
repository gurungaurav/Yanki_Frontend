import { lazy } from "react";
const AboutUsPage = lazy(() => import("../pages/aboutUs"));
const Home = lazy(() => import("../pages/home"));
const ProductPage = lazy(() =>
  import("../pages/client/product/specificProduct")
);
const CartPage = lazy(() => import("../pages/client/product/cart"));
const ContactPage = lazy(() => import("../pages/contactUs"));
const FilterProductsPage = lazy(() =>
  import("../pages/client/product/filterProducts")
);

export const clientRoutes = [
  {
    id: "home",
    path: "/",
    element: Home,
    hasHomeLayout: true,
  },

  {
    id: "product",
    path: "/product/:id",
    element: ProductPage,
    hasHomeLayout: true,
  },
  {
    id: "filterProducts",
    path: "/products",
    element: FilterProductsPage,
    hasHomeLayout: true,
  },
  {
    id: "cart",
    path: "/product/cart",
    element: CartPage,
    hasHomeLayout: true,
  },
  {
    id: "cart",
    path: "/about-us",
    element: AboutUsPage,
    hasHomeLayout: true,
  },
  {
    id: "contact",
    path: "/contact-us",
    element: ContactPage,
    hasHomeLayout: true,
  },
];
