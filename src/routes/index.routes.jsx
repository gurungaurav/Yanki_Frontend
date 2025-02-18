import { Fragment, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { allRoutes } from "./all.routes";
import DashboardLayout from "../layout/adminDashboardLayout";
import HomeLayout from "../layout/homeLayout";

function MainWrapper({ route, children }) {
  const HomeLayoutWrapper = route?.hasHomeLayout ? HomeLayout : Fragment;
  const AdminLayoutWrapper = route?.hasAdminLayout ? DashboardLayout : Fragment;

  return (
    <AdminLayoutWrapper>
      <HomeLayoutWrapper>{children}</HomeLayoutWrapper>
    </AdminLayoutWrapper>
  );
}

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>...Loaading</div>}>
        <Routes>
          {allRoutes.map((route) => {
            return (
              <Route
                key={route.id}
                path={route.path}
                element={
                  <MainWrapper route={route}>
                    <route.element />
                  </MainWrapper>
                }
              />
            );
          })}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
