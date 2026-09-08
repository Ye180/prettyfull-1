import { PERMISSIONS, dashboardQuerySchema } from "@prettyfull/contracts";
import { Hono } from "hono";
import { requirePermission } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { getDashboard } from "./service.js";
/** Tableau de bord du back-office (§4.1). */
export const adminDashboardRoutes = new Hono();
adminDashboardRoutes.get("/dashboard", requirePermission(PERMISSIONS.dashboard.read), validate("query", dashboardQuerySchema), async (c) => c.json(await getDashboard(c.req.valid("query").period)));
//# sourceMappingURL=routes.js.map