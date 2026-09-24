import {
	PERMISSIONS,
	auditLogListQuerySchema,
	createStaffSchema,
	updateStaffSchema,
	userListQuerySchema,
} from "@prettyfull/contracts";
import { Hono } from "hono";
import { z } from "zod";
import { recordAudit } from "../../lib/audit.js";
import { currentUser, requirePermission } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import type { AppEnv } from "../../middleware/request-context.js";
import * as service from "./service.js";
import { listAuditLogs } from "./audit-service.js";

const idParam = z.object({ id: z.uuid() });

/**
 * Module « Utilisateurs & rôles » du back-office (§4.8) et fiches clientes
 * (§4.5). Chaque route déclare la permission qu'elle exige : c'est le point
 * de contrôle unique du critère d'acceptation §7.
 */
export const adminUsersRoutes = new Hono<AppEnv>();

// --- Comptes back-office ---------------------------------------------------

adminUsersRoutes.get(
	"/staff",
	requirePermission(PERMISSIONS.staff.read),
	validate("query", userListQuerySchema),
	async (c) => c.json(await service.listUsers({ ...c.req.valid("query"), kind: "staff" })),
);

adminUsersRoutes.get("/roles", requirePermission(PERMISSIONS.staff.read), async (c) =>
	c.json(await service.listRoles()),
);

adminUsersRoutes.post(
	"/staff",
	requirePermission(PERMISSIONS.staff.write),
	validate("json", createStaffSchema),
	async (c) => {
		const created = await service.createStaff(c.req.valid("json"));

		await recordAudit(c, {
			action: "staff.created",
			resourceType: "user",
			resourceId: created.id,
			changes: { email: created.email, roles: created.roles },
		});

		return c.json(created, 201);
	},
);

adminUsersRoutes.get(
	"/staff/:id",
	requirePermission(PERMISSIONS.staff.read),
	validate("param", idParam),
	async (c) => c.json(await service.getUser(c.req.valid("param").id)),
);

adminUsersRoutes.patch(
	"/staff/:id",
	requirePermission(PERMISSIONS.staff.write),
	validate("param", idParam),
	validate("json", updateStaffSchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const input = c.req.valid("json");

		const updated = await service.updateStaff(id, input, currentUser(c).sub);

		await recordAudit(c, {
			action: "staff.updated",
			resourceType: "user",
			resourceId: id,
			changes: input,
		});

		return c.json(updated);
	},
);

adminUsersRoutes.delete(
	"/staff/:id",
	requirePermission(PERMISSIONS.staff.write),
	validate("param", idParam),
	async (c) => {
		const { id } = c.req.valid("param");

		await service.deactivateStaff(id, currentUser(c).sub);
		await recordAudit(c, {
			action: "staff.deleted",
			resourceType: "user",
			resourceId: id,
		});

		return c.json({ success: true });
	},
);

// --- Fiches clientes (§4.5) ------------------------------------------------

adminUsersRoutes.get(
	"/customers",
	requirePermission(PERMISSIONS.customers.read),
	validate("query", userListQuerySchema),
	async (c) => c.json(await service.listUsers({ ...c.req.valid("query"), kind: "customer" })),
);

adminUsersRoutes.get(
	"/customers/:id",
	requirePermission(PERMISSIONS.customers.read),
	validate("param", idParam),
	async (c) => c.json(await service.getUser(c.req.valid("param").id)),
);

// --- Journal d'activité (§2.7, §5) -----------------------------------------

adminUsersRoutes.get(
	"/audit-logs",
	requirePermission(PERMISSIONS.audit.read),
	validate("query", auditLogListQuerySchema),
	async (c) => c.json(await listAuditLogs(c.req.valid("query"))),
);
