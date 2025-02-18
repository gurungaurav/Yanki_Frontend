import { adminRoutes } from "./admin.routes";
import { authRoutes } from "./auth.routes";
import { clientRoutes } from "./client.routes";
import { errorRoutes } from "./error.routes";

export const allRoutes = [
  ...clientRoutes,
  ...adminRoutes,
  ...errorRoutes,
  ...authRoutes,
];
