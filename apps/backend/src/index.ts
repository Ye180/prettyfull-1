import { serve } from "@hono/node-server";
import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { openApiDocument } from "./docs/openapi.js";
import { env, isProduction } from "./lib/env.js";
import { requireAuth, requireKind } from "./middleware/auth.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import { requestContext, type AppEnv } from "./middleware/request-context.js";
import { storeAddressRoutes } from "./modules/auth/addresses.js";
import { adminAuthRoutes, storeAuthRoutes } from "./modules/auth/routes.js";
import { storeCartRoutes } from "./modules/cart/routes.js";
import { adminCatalogRoutes } from "./modules/catalog/routes.js";
import { storeCatalogRoutes } from "./modules/catalog/store-routes.js";
import { adminCmsRoutes, storeCmsRoutes } from "./modules/cms/routes.js";
import { adminDashboardRoutes } from "./modules/dashboard/routes.js";
import { adminIntegrationsRoutes } from "./modules/integrations/routes.js";
import { adminInventoryRoutes } from "./modules/inventory/routes.js";
import {
	adminOrdersRoutes,
	storeOrderConfirmationRoutes,
	storeOrdersRoutes,
} from "./modules/orders/routes.js";
import { adminPromotionsRoutes } from "./modules/promotions/routes.js";
import { adminReviewRoutes, storeReviewRoutes } from "./modules/reviews/routes.js";
import { adminSettingsRoutes } from "./modules/settings/routes.js";
import { storeMiscRoutes } from "./modules/store/routes.js";
import {
	adminUploadRoutes,
	uploadthingRoutes,
} from "./modules/uploads/routes.js";
import { adminUsersRoutes } from "./modules/users/routes.js";
import { webhookRoutes } from "./modules/webhooks/routes.js";
import { startReservationSweeper } from "./tasks/reservation-sweeper.js";

const app = new Hono<AppEnv>();

app.use("*", requestContext);
app.use("*", logger());
app.use("*", secureHeaders());

// 2 Mio : large pour du JSON de catalogue, trop étroit pour servir de vecteur
// de saturation mémoire. Les téléversements de fichiers auront leur limite.
app.use("*", bodyLimit({ maxSize: 2 * 1024 * 1024 }));

/**
 * `credentials: true` est indispensable : les jetons de rafraîchissement
 * circulent en cookie `httpOnly`, jamais dans le corps des réponses.
 */
app.use(
	"*",
	cors({
		origin: env.CORS_ORIGINS,
		credentials: true,
		allowHeaders: [
			"Content-Type",
			"Authorization",
			"X-Request-Id",
			// Requis par le client UploadThing.
			"X-Uploadthing-Package",
			"X-Uploadthing-Version",
			// Propagation de trace ajoutée automatiquement par Next.js aux
			// requêtes fetch (W3C Trace Context et B3).
			"traceparent",
			"tracestate",
			"b3",
		],
		allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
		exposeHeaders: ["X-Request-Id"],
		maxAge: 86_400,
	}),
);

/**
 * Documentation de l'API (§5).
 *
 * `/docs` sert une interface de lecture, `/openapi.json` le document brut -
 * exploitable par un générateur de client ou un outil de test.
 */
app.get("/openapi.json", (c) => c.json(openApiDocument));

app.get(
	"/docs",
	Scalar({
		url: "/openapi.json",
		pageTitle: "API PrettyFull",
		theme: "default",
	}),
);

app.get("/health", (c) =>
	c.json({
		status: "ok",
		environment: env.NODE_ENV,
		timestamp: new Date().toISOString(),
	}),
);

/**
 * Trois surfaces d'API distinctes.
 *
 * `/api/store` est publique et sert le storefront ; `/api/admin` exige un
 * jeton de compte back-office et vérifie les permissions route par route ;
 * `/api/webhooks` n'est authentifiée que par la signature du prestataire.
 *
 * Les webhooks et l'authentification admin sont montés **avant** le garde
 * global : sans cela, un prestataire devrait présenter un jeton, et
 * `/api/admin/auth/login` exigerait d'être déjà connecté.
 */
app.route("/api/webhooks", webhookRoutes);

/**
 * Téléversement des visuels.
 *
 * Monté hors du garde `/api/admin/*` : UploadThing pilote lui-même l'échange
 * (négociation, callback de fin) et vérifie le jeton du back-office dans le
 * middleware de sa propre route.
 */
app.route("/api/uploadthing", uploadthingRoutes);

app.route("/api/store/auth", storeAuthRoutes);
app.route("/api/store", storeOrderConfirmationRoutes);
app.route("/api/store", storeCatalogRoutes);
app.route("/api/store", storeCartRoutes);
app.route("/api/store", storeCmsRoutes);
app.route("/api/store", storeMiscRoutes);
/**
 * Montées avant les routes ci-dessous : `storeOrdersRoutes` et
 * `storeAddressRoutes` posent chacune un garde `use("*", requireAuth, ...)`
 * sur leur propre routeur, qui - une fois aplati par `.route()` sous le même
 * préfixe `/api/store` - devient un middleware `/api/store/*` s'appliquant à
 * toute route montée après lui, avis compris. Les monter avant évite que les
 * routes publiques héritent d'un garde qui ne les concerne pas.
 */
app.route("/api/store", storeReviewRoutes);
app.route("/api/store", storeOrdersRoutes);
app.route("/api/store", storeAddressRoutes);

app.route("/api/admin/auth", adminAuthRoutes);

app.use("/api/admin/*", requireAuth, requireKind("staff"));
app.route("/api/admin", adminDashboardRoutes);
app.route("/api/admin", adminUsersRoutes);
app.route("/api/admin", adminCatalogRoutes);
app.route("/api/admin", adminInventoryRoutes);
app.route("/api/admin", adminOrdersRoutes);
app.route("/api/admin", adminIntegrationsRoutes);
app.route("/api/admin", adminCmsRoutes);
app.route("/api/admin", adminPromotionsRoutes);
app.route("/api/admin", adminReviewRoutes);
app.route("/api/admin", adminSettingsRoutes);
app.route("/api/admin", adminUploadRoutes);

app.onError(errorHandler);
app.notFound(notFoundHandler);

serve({ fetch: app.fetch, port: env.PORT }, ({ port }) => {
	console.log(`API PrettyFull à l'écoute sur http://localhost:${port}`);
	if (!isProduction) {
		console.log(`  origines CORS autorisées : ${env.CORS_ORIGINS.join(", ")}`);
	}

	startReservationSweeper();
});

export type AppType = typeof app;
export default app;
