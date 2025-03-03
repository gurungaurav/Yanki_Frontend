import { lazy } from "react";
const AboutUsPage = lazy(() => import("../pages/aboutUs"));
const Home = lazy(() => import("../pages/home"));
const ProductPage = lazy(() => import("../pages/product/specificProduct"));
const CartPage = lazy(() => import("../pages/product/cart"));
const ContactPage = lazy(() => import("../pages/contactUs"));
const FilterProductsPage = lazy(() =>
  import("../pages/product/filterProducts")
);
const ProfileDetails = lazy(() => import("../pages/profile/profileDetails"));
const CheckOutPage = lazy(() => import("../pages/product/checkOut"));
const OrderDetailsPage = lazy(() => import("../pages/product/orderDetails"));
const OrderListPage = lazy(() => import("../pages/product/orderLists"));
const EditProfilePage = lazy(() => import("../pages/profile/editProfile"));
const EditPasswordPage = lazy(() => import("../pages/profile/editPassword"));

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
  {
    id: "profile",
    path: "/profile",
    element: ProfileDetails,
    hasHomeLayout: true,
  },
  {
    id: "profile",
    path: "/product/check-out",
    element: CheckOutPage,
    hasHomeLayout: true,
  },
  {
    id: "profile",
    path: "/product/order-details",
    element: OrderDetailsPage,
    hasHomeLayout: true,
  },
  {
    id: "profile",
    path: "/product/order-list",
    element: OrderListPage,
    hasHomeLayout: true,
  },
  {
    id: "editProfile",
    path: "/profile/edit-profile",
    element: EditProfilePage,
    hasHomeLayout: true,
  },
  {
    id: "editProfile",
    path: "/profile/edit-password",
    element: EditPasswordPage,
    hasHomeLayout: true,
  },
];
