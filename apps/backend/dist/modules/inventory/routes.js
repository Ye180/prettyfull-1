import {
	PERMISSIONS,
	bulkStockAdjustmentSchema,
	inventoryListQuerySchema,
	stockAdjustmentSchema,
	stockMovementListQuerySchema,
	stockSetSchema,
	updateInventorySettingsSchema,
} from "@prettyfull/contracts";
import { Hono } from "hono";
import { z } from "zod";
import { recordAudit } from "../../lib/audit.js";
import { currentUser, requirePermission } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import * as service from "./service.js";
const idParam = z.object({ id: z.uuid() });
/** Module « Stocks » du back-office (§4.3). */
export const adminInventoryRoutes = new Hono();
adminInventoryRoutes.get(
	"/inventory",
	requirePermission(PERMISSIONS.inventory.read),
	validate("query", inventoryListQuerySchema),
	async (c) => c.json(await service.listInventory(c.req.valid("query"))),
);
adminInventoryRoutes.get(
	"/inventory/alerts",
	requirePermission(PERMISSIONS.inventory.read),
	validate(
		"query",
		z.object({ limit: z.coerce.number().int().min(1).max(100).default(20) }),
	),
	async (c) =>
		c.json(await service.listLowStockAlerts(c.req.valid("query").limit)),
);
adminInventoryRoutes.get(
	"/inventory/movements",
	requirePermission(PERMISSIONS.inventory.read),
	validate("query", stockMovementListQuerySchema),
	async (c) => c.json(await service.listMovements(c.req.valid("query"))),
);
/**
 * Ajustement manuel (§2.3).
 *
 * Le motif est exigé par le schéma : il n'existe aucun chemin d'écriture
 * permettant de modifier un stock sans en donner la raison - c'est le
 * critère d'acceptation « historisé avec motif et auteur » (§7).
 */
adminInventoryRoutes.post(
	"/inventory/adjust",
	requirePermission(PERMISSIONS.inventory.adjust),
	validate("json", stockAdjustmentSchema),
	async (c) => {
		const input = c.req.valid("json");
		const user = currentUser(c);
		const result = await service.adjustStock({
			...input,
			note: input.note,
			userId: user.sub,
			userLabel: user.email,
		});
		await recordAudit(c, {
			action: "inventory.adjusted",
			resourceType: "inventory_item",
			resourceId: input.inventoryItemId,
			changes: { ...result, delta: input.delta, reason: input.reason },
		});
		return c.json(result);
	},
);
/** Mise à niveau sur inventaire physique : quantité absolue plutôt que delta. */
adminInventoryRoutes.post(
	"/inventory/set",
	requirePermission(PERMISSIONS.inventory.adjust),
	validate("json", stockSetSchema),
	async (c) => {
		const input = c.req.valid("json");
		const user = currentUser(c);
		const result = await service.setStock({
			...input,
			note: input.note,
			userId: user.sub,
			userLabel: user.email,
		});
		await recordAudit(c, {
			action: "inventory.set",
			resourceType: "inventory_item",
			resourceId: input.inventoryItemId,
			changes: { ...result, reason: input.reason },
		});
		return c.json(result);
	},
);
/**
 * Ajustements en lot depuis l'écran d'inventaire.
 *
 * Chaque ligne est traitée dans sa propre transaction : un article en erreur
 * n'annule pas les corrections déjà appliquées, et le rapport indique
 * précisément lesquelles ont échoué.
 */
adminInventoryRoutes.post(
	"/inventory/adjust-bulk",
	requirePermission(PERMISSIONS.inventory.adjust),
	validate("json", bulkStockAdjustmentSchema),
	async (c) => {
		const { adjustments } = c.req.valid("json");
		const user = currentUser(c);
		const applied = [];
		const failed = [];
		for (const adjustment of adjustments) {
			try {
				await service.adjustStock({
					...adjustment,
					note: adjustment.note,
					userId: user.sub,
					userLabel: user.email,
				});
				applied.push(adjustment.inventoryItemId);
			} catch (error) {
				failed.push({
					inventoryItemId: adjustment.inventoryItemId,
					message: error instanceof Error ? error.message : String(error),
				});
			}
		}
		await recordAudit(c, {
			action: "inventory.adjusted_bulk",
			resourceType: "inventory_item",
			changes: { applied: applied.length, failed: failed.length },
		});
		return c.json({ applied: applied.length, failed });
	},
);
adminInventoryRoutes.patch(
	"/inventory/:id/settings",
	requirePermission(PERMISSIONS.inventory.adjust),
	validate("param", idParam),
	validate("json", updateInventorySettingsSchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const input = c.req.valid("json");
		await service.updateInventorySettings(id, input);
		await recordAudit(c, {
			action: "inventory.settings_updated",
			resourceType: "inventory_item",
			resourceId: id,
			changes: input,
		});
		return c.json({ success: true });
	},
);
//# sourceMappingURL=routes.js.map
