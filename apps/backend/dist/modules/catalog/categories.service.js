import { and, asc, count, eq, ilike, isNull, like, ne, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import * as t from "../../db/schema/index.js";
import { badRequest, conflict, notFound } from "../../lib/errors.js";
import { paginate, toSqlPagination } from "../../lib/response.js";
/**
 * Arborescence de catégories (§2.1).
 *
 * La hiérarchie est portée par un chemin matérialisé (`path`) plutôt que par
 * une CTE récursive : lire un sous-arbre devient un simple `LIKE 'racine/%'`,
 * indexé. Le coût se déplace sur le déplacement d'une catégorie, qui doit
 * réécrire le chemin de tous ses descendants — opération rare.
 */
/** Profondeur maximale, garde-fou contre les arbres accidentellement infinis. */
const MAX_DEPTH = 5;
const selection = {
    id: t.categories.id,
    parentId: t.categories.parentId,
    name: t.categories.name,
    slug: t.categories.slug,
    description: t.categories.description,
    imageUrl: t.categories.imageUrl,
    bannerUrl: t.categories.bannerUrl,
    status: t.categories.status,
    position: t.categories.position,
    isFeatured: t.categories.isFeatured,
    depth: t.categories.depth,
    path: t.categories.path,
    metaTitle: t.categories.metaTitle,
    metaDescription: t.categories.metaDescription,
    translations: t.categories.translations,
    createdAt: t.categories.createdAt,
    updatedAt: t.categories.updatedAt,
};
const toCategory = (row) => ({
    id: row.id,
    parentId: row.parentId,
    name: row.name,
    slug: row.slug,
    description: row.description,
    imageUrl: row.imageUrl,
    bannerUrl: row.bannerUrl,
    status: row.status,
    position: row.position,
    isFeatured: row.isFeatured,
    depth: row.depth,
    path: row.path,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    translations: row.translations ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
});
const fetchRows = (where) => db
    .select(selection)
    .from(t.categories)
    .where(where)
    .orderBy(asc(t.categories.path), asc(t.categories.position));
/** Vérifie l'unicité du slug parmi les catégories non supprimées. */
const assertSlugAvailable = async (slug, excludeId) => {
    const filters = [eq(t.categories.slug, slug), isNull(t.categories.deletedAt)];
    if (excludeId)
        filters.push(ne(t.categories.id, excludeId));
    const [existing] = await db
        .select({ id: t.categories.id })
        .from(t.categories)
        .where(and(...filters))
        .limit(1);
    if (existing) {
        throw conflict("Ce slug est déjà utilisé par une autre catégorie.", {
            slug: ["Slug déjà pris."],
        });
    }
};
/** Chemin et profondeur d'une catégorie, déduits de son parent. */
const resolvePlacement = async (slug, parentId) => {
    if (!parentId)
        return { path: slug, depth: 0 };
    const [parent] = await db
        .select({ path: t.categories.path, depth: t.categories.depth })
        .from(t.categories)
        .where(and(eq(t.categories.id, parentId), isNull(t.categories.deletedAt)))
        .limit(1);
    if (!parent)
        throw badRequest("Catégorie parente introuvable.", { parentId: ["Inconnue."] });
    if (parent.depth + 1 > MAX_DEPTH) {
        throw badRequest(`Profondeur maximale atteinte (${MAX_DEPTH} niveaux).`, { parentId: ["Arborescence trop profonde."] });
    }
    return { path: `${parent.path}/${slug}`, depth: parent.depth + 1 };
};
export const listCategories = async (query) => {
    const filters = [isNull(t.categories.deletedAt)];
    if (query.parentId)
        filters.push(eq(t.categories.parentId, query.parentId));
    if (query.status)
        filters.push(eq(t.categories.status, query.status));
    if (query.isFeatured !== undefined) {
        filters.push(eq(t.categories.isFeatured, query.isFeatured));
    }
    if (query.q)
        filters.push(ilike(t.categories.name, `%${query.q}%`));
    const where = and(...filters);
    const { limit, offset } = toSqlPagination(query);
    const [rows, [totals]] = await Promise.all([
        fetchRows(where).limit(limit).offset(offset),
        db.select({ total: count() }).from(t.categories).where(where),
    ]);
    return paginate(rows.map(toCategory), query, totals?.total ?? 0);
};
/**
 * Arbre complet, assemblé en mémoire depuis une seule requête à plat.
 *
 * Le tri par `path` garantit qu'un parent est toujours rencontré avant ses
 * enfants, ce qui permet un assemblage en une passe.
 */
export const getCategoryTree = async (options = {}) => {
    const filters = [isNull(t.categories.deletedAt)];
    if (options.activeOnly)
        filters.push(eq(t.categories.status, "active"));
    const rows = await fetchRows(and(...filters));
    const nodes = new Map();
    const roots = [];
    for (const row of rows) {
        nodes.set(row.id, { ...toCategory(row), children: [] });
    }
    for (const row of rows) {
        const node = nodes.get(row.id);
        const parent = row.parentId ? nodes.get(row.parentId) : undefined;
        if (parent)
            parent.children.push(node);
        else
            roots.push(node);
    }
    return roots;
};
export const getCategoryBySlug = async (slug) => {
    const [row] = await fetchRows(and(eq(t.categories.slug, slug), isNull(t.categories.deletedAt))).limit(1);
    if (!row)
        throw notFound("Catégorie");
    return toCategory(row);
};
export const getCategory = async (id) => {
    const [row] = await fetchRows(and(eq(t.categories.id, id), isNull(t.categories.deletedAt))).limit(1);
    if (!row)
        throw notFound("Catégorie");
    return toCategory(row);
};
export const createCategory = async (input) => {
    await assertSlugAvailable(input.slug);
    const placement = await resolvePlacement(input.slug, input.parentId);
    const [created] = await db
        .insert(t.categories)
        .values({
        parentId: input.parentId ?? null,
        name: input.name,
        slug: input.slug,
        description: input.description ?? null,
        imageUrl: input.imageUrl ?? null,
        bannerUrl: input.bannerUrl ?? null,
        status: input.status,
        position: input.position,
        isFeatured: input.isFeatured,
        metaTitle: input.metaTitle ?? null,
        metaDescription: input.metaDescription ?? null,
        translations: input.translations,
        depth: placement.depth,
        path: placement.path,
    })
        .returning({ id: t.categories.id });
    return getCategory(created.id);
};
/**
 * Réécrit le chemin d'une catégorie et de tous ses descendants.
 *
 * Le remplacement porte sur le préfixe : `ancien/x` devient `nouveau/x`. La
 * profondeur se relit directement du nouveau chemin — c'est son nombre de
 * séparateurs, la racine en comptant zéro. Une seule instruction, donc
 * atomique : aucun état intermédiaire incohérent n'est observable.
 */
const rewriteSubtreePaths = async (oldPath, newPath) => {
    if (oldPath === newPath)
        return;
    const rewritten = sql `${newPath} || substring(path from ${oldPath.length + 1})`;
    await db.execute(sql `
		update ${t.categories}
		set path = ${rewritten},
		    depth = length(${rewritten}) - length(replace(${rewritten}, '/', '')),
		    updated_at = now()
		where path = ${oldPath} or path like ${`${oldPath}/%`}
	`);
};
export const updateCategory = async (id, input) => {
    const current = await getCategory(id);
    if (input.slug && input.slug !== current.slug) {
        await assertSlugAvailable(input.slug, id);
    }
    // Une catégorie ne peut pas devenir sa propre descendante : le sous-arbre
    // deviendrait inatteignable et les chemins, incohérents.
    if (input.parentId !== undefined && input.parentId !== current.parentId) {
        if (input.parentId === id) {
            throw badRequest("Une catégorie ne peut pas être son propre parent.", {
                parentId: ["Référence circulaire."],
            });
        }
        if (input.parentId) {
            const [target] = await db
                .select({ path: t.categories.path })
                .from(t.categories)
                .where(eq(t.categories.id, input.parentId))
                .limit(1);
            if (target && (target.path === current.path || target.path.startsWith(`${current.path}/`))) {
                throw badRequest("Impossible de déplacer une catégorie sous l'une de ses descendantes.", { parentId: ["Référence circulaire."] });
            }
        }
    }
    const nextSlug = input.slug ?? current.slug;
    const nextParentId = input.parentId !== undefined ? (input.parentId ?? null) : current.parentId;
    const placement = await resolvePlacement(nextSlug, nextParentId);
    await db
        .update(t.categories)
        .set({
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.slug !== undefined ? { slug: input.slug } : {}),
        ...(input.description !== undefined ? { description: input.description ?? null } : {}),
        ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl ?? null } : {}),
        ...(input.bannerUrl !== undefined ? { bannerUrl: input.bannerUrl ?? null } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.position !== undefined ? { position: input.position } : {}),
        ...(input.isFeatured !== undefined ? { isFeatured: input.isFeatured } : {}),
        ...(input.metaTitle !== undefined ? { metaTitle: input.metaTitle ?? null } : {}),
        ...(input.metaDescription !== undefined
            ? { metaDescription: input.metaDescription ?? null }
            : {}),
        ...(input.translations !== undefined ? { translations: input.translations } : {}),
        parentId: nextParentId,
        path: placement.path,
        depth: placement.depth,
        updatedAt: new Date(),
    })
        .where(eq(t.categories.id, id));
    await rewriteSubtreePaths(current.path, placement.path);
    return getCategory(id);
};
/**
 * Archive une catégorie (§2.1 : suppression logique).
 *
 * Refuse tant qu'elle porte des sous-catégories ou des produits : l'admin
 * doit d'abord les déplacer, sinon ils deviendraient orphelins sans que rien
 * ne le signale.
 */
export const archiveCategory = async (id) => {
    const current = await getCategory(id);
    const [children] = await db
        .select({ total: count() })
        .from(t.categories)
        .where(and(eq(t.categories.parentId, id), isNull(t.categories.deletedAt)));
    if ((children?.total ?? 0) > 0) {
        throw conflict(`Cette catégorie contient ${children.total} sous-catégorie(s). Déplacez-les d'abord.`);
    }
    const [products] = await db
        .select({ total: count() })
        .from(t.productCategories)
        .innerJoin(t.products, eq(t.products.id, t.productCategories.productId))
        .where(and(eq(t.productCategories.categoryId, id), isNull(t.products.deletedAt)));
    if ((products?.total ?? 0) > 0) {
        throw conflict(`Cette catégorie contient ${products.total} produit(s). Déplacez-les ou archivez-les d'abord.`);
    }
    await db
        .update(t.categories)
        .set({ deletedAt: new Date(), status: "inactive", updatedAt: new Date() })
        .where(eq(t.categories.id, current.id));
};
/** Réordonnancement en lot, depuis le glisser-déposer du panel. */
export const reorderCategories = async (items) => {
    await db.transaction(async (tx) => {
        for (const item of items) {
            await tx
                .update(t.categories)
                .set({
                position: item.position,
                ...(item.parentId !== undefined ? { parentId: item.parentId ?? null } : {}),
                updatedAt: new Date(),
            })
                .where(eq(t.categories.id, item.id));
        }
    });
};
/** Nombre de produits publiés par catégorie, pour l'affichage des rayons. */
export const countProductsByCategory = async () => {
    const rows = await db
        .select({
        categoryId: t.productCategories.categoryId,
        total: count(t.productCategories.productId),
    })
        .from(t.productCategories)
        .innerJoin(t.products, eq(t.products.id, t.productCategories.productId))
        .where(and(isNull(t.products.deletedAt), eq(t.products.status, "published")))
        .groupBy(t.productCategories.categoryId);
    return new Map(rows.map((row) => [row.categoryId, row.total]));
};
/** Identifiants d'une catégorie et de toutes ses descendantes. */
export const getDescendantIds = async (categoryId) => {
    const [root] = await db
        .select({ path: t.categories.path })
        .from(t.categories)
        .where(eq(t.categories.id, categoryId))
        .limit(1);
    if (!root)
        return [categoryId];
    const rows = await db
        .select({ id: t.categories.id })
        .from(t.categories)
        .where(and(like(t.categories.path, `${root.path}%`), isNull(t.categories.deletedAt)));
    return rows.map((row) => row.id);
};
//# sourceMappingURL=categories.service.js.map