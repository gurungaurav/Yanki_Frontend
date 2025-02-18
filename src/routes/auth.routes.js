import { lazy } from "react";
const LoginPage = lazy(() => import("../pages/auth/login"));
const RegistrationPage = lazy(() => import("../pages/auth/register"));

export const authRoutes = [
  {
    id: "login",
    path: "/login",
    element: LoginPage,
    hasHomeLayout: true,
  },
  {
    id: "register",
    path: "/register",
    element: RegistrationPage,
    hasHomeLayout: true,
  },
];
