import {
	PERMISSIONS,
	taxRateInputSchema,
	updateStoreSettingsSchema,
} from "@prettyfull/contracts";
import { Hono } from "hono";
import { z } from "zod";
import { recordAudit } from "../../lib/audit.js";
import { currentUser, requirePermission } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import type { AppEnv } from "../../middleware/request-context.js";
import * as service from "./service.js";

const idParam = z.object({ id: z.uuid() });

/** Module « Paramètres généraux » du back-office (§4.9). */
export const adminSettingsRoutes = new Hono<AppEnv>();

adminSettingsRoutes.get(
	"/settings",
	requirePermission(PERMISSIONS.settings.read),
	async (c) => c.json(await service.getStoreSettings()),
);

adminSettingsRoutes.patch(
	"/settings",
	requirePermission(PERMISSIONS.settings.write),
	validate("json", updateStoreSettingsSchema),
	async (c) => {
		const input = c.req.valid("json");
		const updated = await service.updateStoreSettings(input, currentUser(c).sub);

		await recordAudit(c, {
			action: "settings.updated",
			resourceType: "settings",
			resourceId: "store",
			changes: input,
		});

		return c.json(updated);
	},
);

adminSettingsRoutes.get(
	"/tax-rates",
	requirePermission(PERMISSIONS.settings.read),
	async (c) => c.json(await service.listTaxRates()),
);

adminSettingsRoutes.post(
	"/tax-rates",
	requirePermission(PERMISSIONS.settings.write),
	validate("json", taxRateInputSchema),
	async (c) => {
		const created = await service.createTaxRate(c.req.valid("json"));

		await recordAudit(c, {
			action: "tax_rate.created",
			resourceType: "tax_rate",
			resourceId: created.id,
			changes: { name: created.name, rateBasisPoints: created.rateBasisPoints },
		});

		return c.json(created, 201);
	},
);

adminSettingsRoutes.patch(
	"/tax-rates/:id",
	requirePermission(PERMISSIONS.settings.write),
	validate("param", idParam),
	validate("json", taxRateInputSchema.partial()),
	async (c) => {
		const { id } = c.req.valid("param");
		const updated = await service.updateTaxRate(id, c.req.valid("json"));

		await recordAudit(c, {
			action: "tax_rate.updated",
			resourceType: "tax_rate",
			resourceId: id,
			changes: c.req.valid("json"),
		});

		return c.json(updated);
	},
);

adminSettingsRoutes.delete(
	"/tax-rates/:id",
	requirePermission(PERMISSIONS.settings.write),
	validate("param", idParam),
	async (c) => {
		const { id } = c.req.valid("param");
		await service.deleteTaxRate(id);

		await recordAudit(c, {
			action: "tax_rate.deleted",
			resourceType: "tax_rate",
			resourceId: id,
		});

		return c.json({ success: true });
	},
);
