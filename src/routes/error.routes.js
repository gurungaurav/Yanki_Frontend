import Error404 from "../pages/error/error404";

export const errorRoutes = [
  {
    id: "error404",
    element: Error404,
    path: "*",
    // Without the layout a mistyped URL left visitors with no nav, no
    // search and no footer — a complete dead end.
    hasHomeLayout: true,
  },
];
