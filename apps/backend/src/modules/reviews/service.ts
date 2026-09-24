import type { Review, ReviewInput, ReviewSummary, Paginated } from "@prettyfull/contracts";
import { and, count, desc, eq, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { db } from "../../db/index.js";
import * as t from "../../db/schema/index.js";
import { notFound } from "../../lib/errors.js";
import { paginate, toSqlPagination } from "../../lib/response.js";

const toReview = (row: typeof t.reviews.$inferSelect): Review => ({
	id: row.id,
	productId: row.productId,
	rating: row.rating,
	authorName: row.authorName,
	body: row.body,
	photoUrls: row.photoUrls,
	status: row.status,
	createdAt: row.createdAt.toISOString(),
});

/**
 * Enregistre un avis reçu du storefront.
 *
 * Statut `draft` par défaut : rien n'est visible avant modération par le
 * staff, même posture que les messages de contact.
 */
export const createReview = async (
	input: ReviewInput,
	context: { ipAddress: string | null; userAgent: string | null },
): Promise<{ id: string }> => {
	const [created] = await db
		.insert(t.reviews)
		.values({
			productId: input.productId,
			authorName: input.authorName,
			authorEmail: input.authorEmail,
			rating: input.rating,
			body: input.body,
			photoUrls: input.photoUrls,
			ipAddress: context.ipAddress,
			userAgent: context.userAgent?.slice(0, 500) ?? null,
		})
		.returning({ id: t.reviews.id });

	return { id: created!.id };
};

/** Avis publiés d'un produit, pour le storefront. */
export const listReviews = async (query: {
	productId: string;
	page: number;
	limit: number;
}): Promise<Paginated<Review>> => {
	const where = and(eq(t.reviews.productId, query.productId), eq(t.reviews.status, "published"));
	const { limit, offset } = toSqlPagination(query);

	const [rows, [totals]] = await Promise.all([
		db
			.select()
			.from(t.reviews)
			.where(where)
			.orderBy(desc(t.reviews.createdAt))
			.limit(limit)
			.offset(offset),
		db.select({ total: count() }).from(t.reviews).where(where),
	]);

	return paginate(rows.map(toReview), query, totals?.total ?? 0);
};

/** Moyenne et nombre d'avis publiés - calculés à la volée, pas de colonne dénormalisée. */
export const getReviewSummary = async (productId: string): Promise<ReviewSummary> => {
	const [row] = await db
		.select({
			average: sql<string | null>`avg(${t.reviews.rating})`,
			count: count(),
		})
		.from(t.reviews)
		.where(and(eq(t.reviews.productId, productId), eq(t.reviews.status, "published")));

	return {
		average: row?.average ? Math.round(Number(row.average) * 10) / 10 : 0,
		count: row?.count ?? 0,
	};
};

/** Tous statuts confondus, pour la modération back-office. */
export const listReviewsAdmin = async (query: {
	page: number;
	limit: number;
	productId?: string;
	status?: (typeof t.contentStatusEnum.enumValues)[number];
}): Promise<Paginated<Review>> => {
	const filters: SQL[] = [];
	if (query.productId) filters.push(eq(t.reviews.productId, query.productId));
	if (query.status) filters.push(eq(t.reviews.status, query.status));

	const where = filters.length > 0 ? and(...filters) : undefined;
	const { limit, offset } = toSqlPagination(query);

	const [rows, [totals]] = await Promise.all([
		db
			.select()
			.from(t.reviews)
			.where(where)
			.orderBy(desc(t.reviews.createdAt))
			.limit(limit)
			.offset(offset),
		db.select({ total: count() }).from(t.reviews).where(where),
	]);

	return paginate(rows.map(toReview), query, totals?.total ?? 0);
};

export const updateReviewStatus = async (
	id: string,
	status: (typeof t.contentStatusEnum.enumValues)[number],
): Promise<Review> => {
	const [updated] = await db
		.update(t.reviews)
		.set({ status, updatedAt: new Date() })
		.where(eq(t.reviews.id, id))
		.returning();

	if (!updated) throw notFound("Avis");
	return toReview(updated);
};
