import { and, count, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "../../db/index.js";
import * as t from "../../db/schema/index.js";
import { paginate, toSqlPagination } from "../../lib/response.js";
export const listAuditLogs = async (query) => {
    const filters = [];
    if (query.userId)
        filters.push(eq(t.auditLogs.userId, query.userId));
    if (query.action)
        filters.push(eq(t.auditLogs.action, query.action));
    if (query.resourceType)
        filters.push(eq(t.auditLogs.resourceType, query.resourceType));
    if (query.resourceId)
        filters.push(eq(t.auditLogs.resourceId, query.resourceId));
    if (query.from)
        filters.push(gte(t.auditLogs.createdAt, new Date(query.from)));
    if (query.to)
        filters.push(lte(t.auditLogs.createdAt, new Date(query.to)));
    const where = filters.length > 0 ? and(...filters) : undefined;
    const { limit, offset } = toSqlPagination(query);
    const [rows, [totals]] = await Promise.all([
        db
            .select({
            id: t.auditLogs.id,
            userId: t.auditLogs.userId,
            userLabel: t.auditLogs.userLabel,
            action: t.auditLogs.action,
            resourceType: t.auditLogs.resourceType,
            resourceId: t.auditLogs.resourceId,
            changes: t.auditLogs.changes,
            ipAddress: t.auditLogs.ipAddress,
            userAgent: t.auditLogs.userAgent,
            createdAt: t.auditLogs.createdAt,
        })
            .from(t.auditLogs)
            .where(where)
            .orderBy(desc(t.auditLogs.createdAt))
            .limit(limit)
            .offset(offset),
        db.select({ total: count() }).from(t.auditLogs).where(where),
    ]);
    return paginate(rows.map((row) => ({
        id: row.id,
        userId: row.userId,
        userName: row.userLabel,
        action: row.action,
        resourceType: row.resourceType,
        resourceId: row.resourceId,
        changes: row.changes ?? null,
        ipAddress: row.ipAddress,
        userAgent: row.userAgent,
        createdAt: row.createdAt.toISOString(),
    })), query, totals?.total ?? 0);
};
//# sourceMappingURL=audit-service.js.map