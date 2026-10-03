import { db } from "../db/index.js";
import { auditLogs } from "../db/schema/index.js";
export const recordAudit = async (c, entry) => {
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
    }
    catch (error) {
        console.error("[audit] écriture impossible", entry.action, error);
    }
};
/**
 * Ne conserve que les champs réellement modifiés, avant/après.
 *
 * Stocker la charge utile complète noierait la lecture du journal et
 * dupliquerait des secrets ; ce diff garde la trace exploitable.
 */
export const diffChanges = (before, after) => {
    const changes = {};
    for (const [key, nextValue] of Object.entries(after)) {
        if (nextValue === undefined)
            continue;
        const previousValue = before[key];
        if (JSON.stringify(previousValue) === JSON.stringify(nextValue))
            continue;
        changes[key] = { before: previousValue, after: nextValue };
    }
    return changes;
};
//# sourceMappingURL=audit.js.map