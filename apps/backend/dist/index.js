import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "./lib/env.js";
const app = new Hono();
app.use("*", logger());
app.use("*", cors({
    origin: env.CORS_ORIGINS,
    credentials: true,
}));
app.get("/health", (c) => c.json({ status: "ok" }));
// Monter ici les routes métier : app.route("/products", productsRoutes)
serve({ fetch: app.fetch, port: env.PORT }, ({ port }) => {
    console.log(`backend listening on http://localhost:${port}`);
});
export default app;
//# sourceMappingURL=index.js.map