import { ROLE_KEYS, } from "@prettyfull/contracts";
import { and, count, desc, eq, ilike, inArray, isNull, or, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import * as t from "../../db/schema/index.js";
import { badRequest, conflict, forbidden, notFound } from "../../lib/errors.js";
import { hashPassword } from "../../lib/password.js";
import { paginate, toSqlPagination } from "../../lib/response.js";
const selectUser = {
    id: t.users.id,
    email: t.users.email,
    firstName: t.users.firstName,
    lastName: t.users.lastName,
    phone: t.users.phone,
    kind: t.users.kind,
    status: t.users.status,
    lastLoginAt: t.users.lastLoginAt,
    createdAt: t.users.createdAt,
};
/**
 * Charge les rôles de plusieurs comptes en une requête.
 *
 * Évite le N+1 sur les listes : sans cela, afficher 50 comptes déclencherait
 * 50 requêtes de rôles.
 */
const loadRolesFor = async (userIds) => {
    if (userIds.length === 0)
        return new Map();
    const rows = await db
        .select({ userId: t.userRoles.userId, roleKey: t.roles.key })
        .from(t.userRoles)
        .innerJoin(t.roles, eq(t.roles.id, t.userRoles.roleId))
        .where(inArray(t.userRoles.userId, userIds));
    const byUser = new Map();
    for (const row of rows) {
        const list = byUser.get(row.userId) ?? [];
        list.push(row.roleKey);
        byUser.set(row.userId, list);
    }
    return byUser;
};
const toUser = (row, roles) => ({
    id: row.id,
    email: row.email,
    firstName: row.firstName,
    lastName: row.lastName,
    phone: row.phone,
    kind: row.kind,
    status: row.status,
    roles: roles,
    // Les permissions effectives ne sont pas dépliées dans les listes : elles
    // se déduisent des rôles, et les recalculer par ligne serait coûteux.
    permissions: [],
    lastLoginAt: row.lastLoginAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
});
export const listUsers = async (query) => {
    const filters = [isNull(t.users.deletedAt)];
    if (query.kind)
        filters.push(eq(t.users.kind, query.kind));
    if (query.status)
        filters.push(eq(t.users.status, query.status));
    if (query.q) {
        const pattern = `%${query.q}%`;
        const search = or(ilike(t.users.email, pattern), ilike(t.users.firstName, pattern), ilike(t.users.lastName, pattern));
        if (search)
            filters.push(search);
    }
    if (query.role) {
        filters.push(sql `exists (
				select 1 from ${t.userRoles}
				inner join ${t.roles} on ${t.roles.id} = ${t.userRoles.roleId}
				where ${t.userRoles.userId} = ${t.users.id} and ${t.roles.key} = ${query.role}
			)`);
    }
    const where = and(...filters);
    const { limit, offset } = toSqlPagination(query);
    const [rows, [totals]] = await Promise.all([
        db
            .select(selectUser)
            .from(t.users)
            .where(where)
            .orderBy(desc(t.users.createdAt))
            .limit(limit)
            .offset(offset),
        db.select({ total: count() }).from(t.users).where(where),
    ]);
    const rolesByUser = await loadRolesFor(rows.map((row) => row.id));
    return paginate(rows.map((row) => toUser(row, rolesByUser.get(row.id) ?? [])), query, totals?.total ?? 0);
};
export const getUser = async (userId) => {
    const [row] = await db
        .select(selectUser)
        .from(t.users)
        .where(and(eq(t.users.id, userId), isNull(t.users.deletedAt)))
        .limit(1);
    if (!row)
        throw notFound("Utilisateur");
    const rolesByUser = await loadRolesFor([userId]);
    return toUser(row, rolesByUser.get(userId) ?? []);
};
/** Remplace intégralement les rôles d'un compte. */
const setRoles = async (userId, roleKeys) => {
    const rows = await db
        .select({ id: t.roles.id, key: t.roles.key })
        .from(t.roles)
        .where(inArray(t.roles.key, roleKeys));
    if (rows.length !== roleKeys.length) {
        const known = new Set(rows.map((row) => row.key));
        throw badRequest("Rôle inconnu.", {
            roles: roleKeys.filter((key) => !known.has(key)),
        });
    }
    await db.delete(t.userRoles).where(eq(t.userRoles.userId, userId));
    await db.insert(t.userRoles).values(rows.map((row) => ({ userId, roleId: row.id })));
};
export const createStaff = async (input) => {
    const [existing] = await db
        .select({ id: t.users.id })
        .from(t.users)
        .where(and(sql `lower(${t.users.email}) = ${input.email}`, isNull(t.users.deletedAt)))
        .limit(1);
    if (existing) {
        throw conflict("Un compte existe déjà avec cette adresse e-mail.", {
            email: ["Cette adresse est déjà utilisée."],
        });
    }
    const [created] = await db
        .insert(t.users)
        .values({
        email: input.email,
        passwordHash: await hashPassword(input.password),
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone ?? null,
        kind: "staff",
        status: input.status,
    })
        .returning(selectUser);
    await setRoles(created.id, input.roles);
    return toUser(created, input.roles);
};
/**
 * Met à jour un compte back-office.
 *
 * `actingUserId` protège l'administrateur contre lui-même : il ne peut ni se
 * désactiver, ni se retirer ses propres rôles - un back-office sans
 * super-administrateur joignable serait irrécupérable sans intervention en base.
 */
export const updateStaff = async (userId, input, actingUserId) => {
    const [target] = await db
        .select({ id: t.users.id, kind: t.users.kind })
        .from(t.users)
        .where(and(eq(t.users.id, userId), isNull(t.users.deletedAt)))
        .limit(1);
    if (!target)
        throw notFound("Utilisateur");
    if (target.kind !== "staff")
        throw badRequest("Ce compte n'est pas un compte back-office.");
    if (userId === actingUserId) {
        if (input.status && input.status !== "active") {
            throw forbidden("Vous ne pouvez pas désactiver votre propre compte.");
        }
        if (input.roles && !input.roles.includes("super_admin")) {
            throw forbidden("Vous ne pouvez pas retirer votre propre rôle de super administrateur.");
        }
    }
    const { roles, ...fields } = input;
    if (Object.keys(fields).length > 0) {
        await db
            .update(t.users)
            .set({ ...fields, updatedAt: new Date() })
            .where(eq(t.users.id, userId));
    }
    if (roles)
        await setRoles(userId, roles);
    return getUser(userId);
};
/**
 * Suppression logique d'un compte back-office (§2.1 : archivage plutôt que
 * suppression physique). Les sessions actives sont révoquées immédiatement.
 */
export const deactivateStaff = async (userId, actingUserId) => {
    if (userId === actingUserId) {
        throw forbidden("Vous ne pouvez pas supprimer votre propre compte.");
    }
    const [target] = await db
        .select({ id: t.users.id, kind: t.users.kind })
        .from(t.users)
        .where(and(eq(t.users.id, userId), isNull(t.users.deletedAt)))
        .limit(1);
    if (!target)
        throw notFound("Utilisateur");
    if (target.kind !== "staff")
        throw badRequest("Ce compte n'est pas un compte back-office.");
    // Le dernier super-administrateur actif ne peut pas être supprimé.
    const [remaining] = await db
        .select({ total: count() })
        .from(t.users)
        .innerJoin(t.userRoles, eq(t.userRoles.userId, t.users.id))
        .innerJoin(t.roles, eq(t.roles.id, t.userRoles.roleId))
        .where(and(eq(t.roles.key, "super_admin"), eq(t.users.status, "active"), isNull(t.users.deletedAt), sql `${t.users.id} <> ${userId}`));
    if ((remaining?.total ?? 0) === 0) {
        throw forbidden("Impossible de supprimer le dernier super administrateur actif.");
    }
    const now = new Date();
    await db
        .update(t.users)
        .set({ status: "inactive", deletedAt: now, updatedAt: now })
        .where(eq(t.users.id, userId));
    await db
        .update(t.refreshTokens)
        .set({ revokedAt: now })
        .where(and(eq(t.refreshTokens.userId, userId), isNull(t.refreshTokens.revokedAt)));
};
/** Rôles disponibles avec leurs permissions, pour l'écran §4.8. */
export const listRoles = async () => {
    const rows = await db
        .select({
        key: t.roles.key,
        name: t.roles.name,
        description: t.roles.description,
        isSystem: t.roles.isSystem,
        permissionKey: t.permissions.key,
    })
        .from(t.roles)
        .leftJoin(t.rolePermissions, eq(t.rolePermissions.roleId, t.roles.id))
        .leftJoin(t.permissions, eq(t.permissions.id, t.rolePermissions.permissionId));
    const byKey = new Map();
    for (const row of rows) {
        const entry = byKey.get(row.key) ?? {
            key: row.key,
            name: row.name,
            description: row.description,
            isSystem: row.isSystem,
            permissions: [],
        };
        if (row.permissionKey)
            entry.permissions.push(row.permissionKey);
        byKey.set(row.key, entry);
    }
    // Ordre stable : celui déclaré dans les contrats, du plus large au plus étroit.
    return ROLE_KEYS.flatMap((key) => {
        const entry = byKey.get(key);
        return entry ? [entry] : [];
    });
};
//# sourceMappingURL=service.js.map