import {
	PERMISSIONS,
	shippingRateInputSchema,
	updateShippingRateSchema,
	shippingZoneInputSchema,
	transactionListQuerySchema,
	updateProviderConfigSchema,
} from "@prettyfull/contracts";
import { Hono } from "hono";
import { z } from "zod";
import { recordAudit } from "../../lib/audit.js";
import { requirePermission } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import type { AppEnv } from "../../middleware/request-context.js";
import * as service from "./service.js";

const idParam = z.object({ id: z.uuid() });
const keyParam = z.object({ key: z.string().min(1).max(64) });

/** Module « Agrégateurs » du back-office (§4.6). */
export const adminIntegrationsRoutes = new Hono<AppEnv>();

// --- Paiement --------------------------------------------------------------

adminIntegrationsRoutes.get(
	"/integrations/payment",
	requirePermission(PERMISSIONS.integrations.read),
	async (c) => c.json(await service.listPaymentProviders()),
);

/**
 * Activation / configuration d'un agrégateur (critère §7 : « sans
 * intervention technique »). Les secrets sont audités par leur *nom*, jamais
 * par leur valeur.
 */
adminIntegrationsRoutes.patch(
	"/integrations/payment/:key",
	requirePermission(PERMISSIONS.integrations.write),
	validate("param", keyParam),
	validate("json", updateProviderConfigSchema),
	async (c) => {
		const { key } = c.req.valid("param");
		const input = c.req.valid("json");

		const updated = await service.updatePaymentProvider(key, input);

		await recordAudit(c, {
			action: "integration.payment_updated",
			resourceType: "payment_provider",
			resourceId: key,
			changes: {
				isEnabled: input.isEnabled,
				environment: input.environment,
				credentialsUpdated: Object.keys(input.credentials ?? {}),
			},
		});

		return c.json(updated);
	},
);

adminIntegrationsRoutes.post(
	"/integrations/payment/:key/test",
	requirePermission(PERMISSIONS.integrations.write),
	validate("param", keyParam),
	async (c) => c.json(await service.testPaymentProvider(c.req.valid("param").key)),
);

// --- Livraison -------------------------------------------------------------

adminIntegrationsRoutes.get(
	"/integrations/shipping",
	requirePermission(PERMISSIONS.integrations.read),
	async (c) => c.json(await service.listShippingProviders()),
);

adminIntegrationsRoutes.patch(
	"/integrations/shipping/:key",
	requirePermission(PERMISSIONS.integrations.write),
	validate("param", keyParam),
	validate("json", updateProviderConfigSchema),
	async (c) => {
		const { key } = c.req.valid("param");
		const input = c.req.valid("json");

		const updated = await service.updateShippingProvider(key, input);

		await recordAudit(c, {
			action: "integration.shipping_updated",
			resourceType: "shipping_provider",
			resourceId: key,
			changes: {
				isEnabled: input.isEnabled,
				credentialsUpdated: Object.keys(input.credentials ?? {}),
			},
		});

		return c.json(updated);
	},
);

// --- Zones et tarifs -------------------------------------------------------

adminIntegrationsRoutes.get(
	"/shipping/zones",
	requirePermission(PERMISSIONS.integrations.read),
	async (c) => c.json(await service.listShippingZones()),
);

adminIntegrationsRoutes.post(
	"/shipping/zones",
	requirePermission(PERMISSIONS.integrations.write),
	validate("json", shippingZoneInputSchema),
	async (c) => {
		const created = await service.createShippingZone(c.req.valid("json"));

		await recordAudit(c, {
			action: "shipping.zone_created",
			resourceType: "shipping_zone",
			resourceId: created.id,
			changes: { name: created.name, countryCodes: created.countryCodes },
		});

		return c.json(created, 201);
	},
);

adminIntegrationsRoutes.patch(
	"/shipping/zones/:id",
	requirePermission(PERMISSIONS.integrations.write),
	validate("param", idParam),
	validate("json", shippingZoneInputSchema.partial()),
	async (c) => {
		const { id } = c.req.valid("param");
		const updated = await service.updateShippingZone(id, c.req.valid("json"));

		await recordAudit(c, {
			action: "shipping.zone_updated",
			resourceType: "shipping_zone",
			resourceId: id,
			changes: c.req.valid("json"),
		});

		return c.json(updated);
	},
);

adminIntegrationsRoutes.delete(
	"/shipping/zones/:id",
	requirePermission(PERMISSIONS.integrations.write),
	validate("param", idParam),
	async (c) => {
		const { id } = c.req.valid("param");
		await service.deleteShippingZone(id);

		await recordAudit(c, {
			action: "shipping.zone_deleted",
			resourceType: "shipping_zone",
			resourceId: id,
		});

		return c.json({ success: true });
	},
);

adminIntegrationsRoutes.post(
	"/shipping/rates",
	requirePermission(PERMISSIONS.integrations.write),
	validate("json", shippingRateInputSchema),
	async (c) => {
		const created = await service.createShippingRate(c.req.valid("json"));

		await recordAudit(c, {
			action: "shipping.rate_created",
			resourceType: "shipping_rate",
			resourceId: created.id,
			changes: { name: created.name, amount: created.amount },
		});

		return c.json(created, 201);
	},
);

adminIntegrationsRoutes.patch(
	"/shipping/rates/:id",
	requirePermission(PERMISSIONS.integrations.write),
	validate("param", idParam),
	validate("json", updateShippingRateSchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const updated = await service.updateShippingRate(id, c.req.valid("json"));

		await recordAudit(c, {
			action: "shipping.rate_updated",
			resourceType: "shipping_rate",
			resourceId: id,
			changes: c.req.valid("json"),
		});

		return c.json(updated);
	},
);

adminIntegrationsRoutes.delete(
	"/shipping/rates/:id",
	requirePermission(PERMISSIONS.integrations.write),
	validate("param", idParam),
	async (c) => {
		const { id } = c.req.valid("param");
		await service.deleteShippingRate(id);

		await recordAudit(c, {
			action: "shipping.rate_deleted",
			resourceType: "shipping_rate",
			resourceId: id,
		});

		return c.json({ success: true });
	},
);

// --- Journal des transactions ----------------------------------------------

adminIntegrationsRoutes.get(
	"/transactions",
	requirePermission(PERMISSIONS.integrations.read),
	validate("query", transactionListQuerySchema),
	async (c) => c.json(await service.listTransactions(c.req.valid("query"))),
);
