import type { Context } from "hono";
import { db } from "../db/index.js";
import { auditLogs } from "../db/schema/index.js";
import type { AppEnv } from "../middleware/request-context.js";

/**
 * Journal d'audit des actions sensibles (§5 « Traçabilité »).
 *
 * L'écriture est volontairement tolérante aux pannes : une trace qui échoue
 * ne doit jamais faire échouer l'opération métier qui vient de réussir. Les
 * ratés sont signalés dans les logs serveur.
 */
export interface AuditEntry {
	action: string;
	resourceType: string;
	resourceId?: string | null;
	changes?: Record<string, unknown> | null;
}

export const recordAudit = async (
	c: Context<AppEnv>,
	entry: AuditEntry,
): Promise<void> => {
	const auth = c.get("auth");

	try {
		await db.insert(auditLogs).values({
			userId: auth?.sub ?? null,
			userLabel: auth?.email ?? null,
			action: entry.action,
			resourceType: entry.resourceType,
			resourceId: entry.resourceId ?? null,
			changes: entry.changes ?? null,
			ipAddress: c.get("clientIp"),
			userAgent: c.get("userAgent")?.slice(0, 500) ?? null,
		});
	} catch (error) {
		console.error("[audit] écriture impossible", entry.action, error);
	}
};

/**
 * Ne conserve que les champs réellement modifiés, avant/après.
 *
 * Stocker la charge utile complète noierait la lecture du journal et
 * dupliquerait des secrets ; ce diff garde la trace exploitable.
 */
export const diffChanges = <T extends Record<string, unknown>>(
	before: T,
	after: Partial<T>,
): Record<string, { before: unknown; after: unknown }> => {
	const changes: Record<string, { before: unknown; after: unknown }> = {};

	for (const [key, nextValue] of Object.entries(after)) {
		if (nextValue === undefined) continue;
		const previousValue = before[key];
		if (JSON.stringify(previousValue) === JSON.stringify(nextValue)) continue;
		changes[key] = { before: previousValue, after: nextValue };
	}

	return changes;
};
