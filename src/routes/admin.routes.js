import { lazy } from "react";

const AddProductPage = lazy(() =>
  import("../pages/admin/products/addProducts")
);
// const Dashboard = lazy(() => import("@/pages/admin/dashboard/index.dashboard"));

export const adminRoutes = [
  // {
  //   id: "dashboard",
  //   path: "/dashboard/admin",
  //   element: Dashboard,
  //   hasAdminLayout: true,
  //   hasAuth: true,
  // },
  // {
  //   id: "addProducts",
  //   path: "/dashboard/products",
  //   element: ProductLists,
  //   hasAdminLayout: true,
  //   hasAuth: true,
  // },
  {
    id: "addProducts",
    path: "/dashboard/products/add-products",
    element: AddProductPage,
    hasAdminLayout: true,
    // hasAuth: true,
  },
];
