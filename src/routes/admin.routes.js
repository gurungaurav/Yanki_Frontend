import { lazy } from "react";
const AddProductPage = lazy(() =>
  import("../pages/admin/products/addProducts")
);
const ProductListsPage = lazy(() =>
  import("../pages/admin/products/productLists")
);
const DashbordPage = lazy(() =>
  import("../pages/admin/dashboard/dashbordMain")
);
const ProductReviewListsPage = lazy(() =>
  import("../pages/admin/products/productReviewLists")
);
const UpdateProductPage = lazy(() =>
  import("../pages/admin/products/updateProduct")
);

const CategoryListsPage = lazy(() =>
  import("../pages/admin/products/categoryLists")
);

export const adminRoutes = [
  {
    id: "dashboard",
    path: "/dashboard",
    element: DashbordPage,
    hasAdminLayout: true,
    hasAuth: true,
  },
  {
    id: "productLists",
    path: "/dashboard/products",
    element: ProductListsPage,
    hasAdminLayout: true,
    // hasAuth: true,
  },
  {
    id: "addProducts",
    path: "/dashboard/products/add-product",
    element: AddProductPage,
    hasAdminLayout: true,
    // hasAuth: true,
  },
  {
    id: "productReviewListsPage",
    path: "/dashboard/products/:productId/reviews",
    element: ProductReviewListsPage,
    hasAdminLayout: true,
    // hasAuth: true,
  },
  {
    id: "productReviewListsPage",
    path: "/dashboard/products/:productId/update-product",
    element: UpdateProductPage,
    hasAdminLayout: true,
    // hasAuth: true,
  },

  {
    id: "productReviewListsPage",
    path: "/dashboard/categories",
    element: CategoryListsPage,
    hasAdminLayout: true,
    // hasAuth: true,
  },
];
