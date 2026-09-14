import {
	PERMISSIONS,
	reviewInputSchema,
	reviewListQuerySchema,
	updateReviewStatusSchema,
} from "@prettyfull/contracts";
import { Hono } from "hono";
import { z } from "zod";
import { recordAudit } from "../../lib/audit.js";
import { requirePermission } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import type { AppEnv } from "../../middleware/request-context.js";
import * as service from "./service.js";

const idParam = z.object({ id: z.uuid() });
const productQuery = z.object({ productId: z.uuid() });
const adminListQuery = reviewListQuerySchema.pick({ page: true, limit: true, status: true }).extend({
	productId: z.uuid().optional(),
});

/** Avis produit - surface publique du storefront. */
export const storeReviewRoutes = new Hono<AppEnv>();

storeReviewRoutes.get(
	"/reviews",
	validate("query", reviewListQuerySchema),
	async (c) => c.json(await service.listReviews(c.req.valid("query"))),
);

storeReviewRoutes.get(
	"/reviews/summary",
	validate("query", productQuery),
	async (c) => c.json(await service.getReviewSummary(c.req.valid("query").productId)),
);

/**
 * Soumission d'un avis depuis la fiche produit.
 *
 * Publique par nature - voir `POST /contact` pour le même traitement du
 * champ leurre.
 */
storeReviewRoutes.post(
	"/reviews",
	validate("json", reviewInputSchema),
	async (c) => {
		const input = c.req.valid("json");

		if (input.website) return c.json({ success: true }, 201);

		const created = await service.createReview(input, {
			ipAddress: c.get("clientIp"),
			userAgent: c.get("userAgent"),
		});

		return c.json({ success: true, id: created.id }, 201);
	},
);

/** Modération des avis - montée sous `/api/admin`. */
export const adminReviewRoutes = new Hono<AppEnv>();

adminReviewRoutes.get(
	"/reviews",
	requirePermission(PERMISSIONS.content.read),
	validate("query", adminListQuery),
	async (c) => c.json(await service.listReviewsAdmin(c.req.valid("query"))),
);

adminReviewRoutes.patch(
	"/reviews/:id",
	requirePermission(PERMISSIONS.content.write),
	validate("param", idParam),
	validate("json", updateReviewStatusSchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { status } = c.req.valid("json");

		const updated = await service.updateReviewStatus(id, status);

		await recordAudit(c, {
			action: "review.status_changed",
			resourceType: "review",
			resourceId: id,
			changes: { status },
		});

		return c.json(updated);
	},
);
