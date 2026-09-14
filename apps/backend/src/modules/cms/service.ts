import type {
	Banner,
	BannerInput,
	ContactMessage,
	ContactMessageInput,
	FeaturedEntry,
	FeaturedEntryInput,
	Paginated,
	StaticPage,
	StaticPageInput,
} from "@prettyfull/contracts";
import { and, asc, count, desc, eq, gt, isNull, ilike, lte, or, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { db } from "../../db/index.js";
import * as t from "../../db/schema/index.js";
import { conflict, notFound } from "../../lib/errors.js";
import { paginate, toSqlPagination } from "../../lib/response.js";

/** CMS léger (§2.6) : bannières, pages statiques, mises en avant. */

const toBanner = (row: typeof t.banners.$inferSelect): Banner => ({
	id: row.id,
	title: row.title,
	subtitle: row.subtitle,
	imageUrl: row.imageUrl,
	mobileImageUrl: row.mobileImageUrl,
	linkUrl: row.linkUrl,
	ctaLabel: row.ctaLabel,
	placement: row.placement,
	status: row.status,
	position: row.position,
	startsAt: row.startsAt?.toISOString() ?? null,
	endsAt: row.endsAt?.toISOString() ?? null,
	translations: row.translations ?? undefined,
	createdAt: row.createdAt.toISOString(),
	updatedAt: row.updatedAt.toISOString(),
});

export const listBanners = async (query: {
	page: number;
	limit: number;
	placement?: (typeof t.bannerPlacementEnum.enumValues)[number];
	status?: (typeof t.contentStatusEnum.enumValues)[number];
}): Promise<Paginated<Banner>> => {
	const filters: SQL[] = [];
	if (query.placement) filters.push(eq(t.banners.placement, query.placement));
	if (query.status) filters.push(eq(t.banners.status, query.status));

	const where = filters.length > 0 ? and(...filters) : undefined;
	const { limit, offset } = toSqlPagination(query);

	const [rows, [totals]] = await Promise.all([
		db
			.select()
			.from(t.banners)
			.where(where)
			.orderBy(asc(t.banners.placement), asc(t.banners.position))
			.limit(limit)
			.offset(offset),
		db.select({ total: count() }).from(t.banners).where(where),
	]);

	return paginate(rows.map(toBanner), query, totals?.total ?? 0);
};

/**
 * Bannières servies au storefront : publiées, et dont la fenêtre de diffusion
 * couvre l'instant présent. Une bannière programmée pour plus tard reste
 * invisible sans intervention.
 */
export const listPublicBanners = async (
	placement?: (typeof t.bannerPlacementEnum.enumValues)[number],
): Promise<Banner[]> => {
	const now = new Date();

	const filters: SQL[] = [
		eq(t.banners.status, "published"),
		or(isNull(t.banners.startsAt), lte(t.banners.startsAt, now))!,
		or(isNull(t.banners.endsAt), gt(t.banners.endsAt, now))!,
	];

	if (placement) filters.push(eq(t.banners.placement, placement));

	const rows = await db
		.select()
		.from(t.banners)
		.where(and(...filters))
		.orderBy(asc(t.banners.placement), asc(t.banners.position));

	return rows.map(toBanner);
};

export const createBanner = async (input: BannerInput): Promise<Banner> => {
	const [created] = await db
		.insert(t.banners)
		.values({
			title: input.title ?? null,
			subtitle: input.subtitle ?? null,
			imageUrl: input.imageUrl,
			mobileImageUrl: input.mobileImageUrl ?? null,
			linkUrl: input.linkUrl ?? null,
			ctaLabel: input.ctaLabel ?? null,
			placement: input.placement,
			status: input.status,
			position: input.position,
			startsAt: input.startsAt ? new Date(input.startsAt) : null,
			endsAt: input.endsAt ? new Date(input.endsAt) : null,
			translations: input.translations,
		})
		.returning();

	return toBanner(created!);
};

export const updateBanner = async (
	id: string,
	input: Partial<BannerInput>,
): Promise<Banner> => {
	const { startsAt, endsAt, ...fields } = input;

	const [current] = await db
		.select({ startsAt: t.banners.startsAt, endsAt: t.banners.endsAt })
		.from(t.banners)
		.where(eq(t.banners.id, id))
		.limit(1);

	if (!current) throw notFound("Bannière");

	// Fenêtre de diffusion revalidée après fusion : la base porte bien la
	// contrainte `banners_schedule_order`, mais la laisser échouer produirait
	// une 500 illisible au lieu d'une erreur de formulaire exploitable.
	const nextStart = startsAt !== undefined ? (startsAt ? new Date(startsAt) : null) : current.startsAt;
	const nextEnd = endsAt !== undefined ? (endsAt ? new Date(endsAt) : null) : current.endsAt;

	if (nextStart && nextEnd && nextEnd <= nextStart) {
		throw conflict("La date de fin doit être postérieure à la date de début.", {
			endsAt: ["Doit suivre la date de début."],
		});
	}

	const patch = Object.fromEntries(
		Object.entries(fields).filter(([, value]) => value !== undefined),
	);

	const [updated] = await db
		.update(t.banners)
		.set({
			...patch,
			...(startsAt !== undefined ? { startsAt: startsAt ? new Date(startsAt) : null } : {}),
			...(endsAt !== undefined ? { endsAt: endsAt ? new Date(endsAt) : null } : {}),
			updatedAt: new Date(),
		})
		.where(eq(t.banners.id, id))
		.returning();

	if (!updated) throw notFound("Bannière");
	return toBanner(updated);
};

export const deleteBanner = async (id: string): Promise<void> => {
	const [deleted] = await db
		.delete(t.banners)
		.where(eq(t.banners.id, id))
		.returning({ id: t.banners.id });

	if (!deleted) throw notFound("Bannière");
};

// --- Pages statiques -------------------------------------------------------

const toPage = (row: typeof t.staticPages.$inferSelect): StaticPage => ({
	id: row.id,
	slug: row.slug,
	title: row.title,
	content: row.content,
	excerpt: row.excerpt,
	status: row.status,
	metaTitle: row.metaTitle,
	metaDescription: row.metaDescription,
	translations: row.translations ?? undefined,
	publishedAt: row.publishedAt?.toISOString() ?? null,
	createdAt: row.createdAt.toISOString(),
	updatedAt: row.updatedAt.toISOString(),
});

export const listStaticPages = async (query: {
	page: number;
	limit: number;
	q?: string;
	status?: (typeof t.contentStatusEnum.enumValues)[number];
}): Promise<Paginated<StaticPage>> => {
	const filters: SQL[] = [];
	if (query.status) filters.push(eq(t.staticPages.status, query.status));
	if (query.q) filters.push(ilike(t.staticPages.title, `%${query.q}%`));

	const where = filters.length > 0 ? and(...filters) : undefined;
	const { limit, offset } = toSqlPagination(query);

	const [rows, [totals]] = await Promise.all([
		db
			.select()
			.from(t.staticPages)
			.where(where)
			.orderBy(desc(t.staticPages.updatedAt))
			.limit(limit)
			.offset(offset),
		db.select({ total: count() }).from(t.staticPages).where(where),
	]);

	return paginate(rows.map(toPage), query, totals?.total ?? 0);
};

export const getStaticPageBySlug = async (
	slug: string,
	options: { publishedOnly?: boolean } = {},
): Promise<StaticPage> => {
	const filters: SQL[] = [eq(t.staticPages.slug, slug)];
	if (options.publishedOnly) filters.push(eq(t.staticPages.status, "published"));

	const [row] = await db
		.select()
		.from(t.staticPages)
		.where(and(...filters))
		.limit(1);

	if (!row) throw notFound("Page");
	return toPage(row);
};

export const createStaticPage = async (
	input: StaticPageInput,
	userId: string,
): Promise<StaticPage> => {
	const [existing] = await db
		.select({ id: t.staticPages.id })
		.from(t.staticPages)
		.where(eq(t.staticPages.slug, input.slug))
		.limit(1);

	if (existing) {
		throw conflict("Ce slug est déjà utilisé par une autre page.", {
			slug: ["Slug déjà pris."],
		});
	}

	const [created] = await db
		.insert(t.staticPages)
		.values({
			slug: input.slug,
			title: input.title,
			content: input.content,
			excerpt: input.excerpt ?? null,
			status: input.status,
			metaTitle: input.metaTitle ?? null,
			metaDescription: input.metaDescription ?? null,
			translations: input.translations,
			publishedAt: input.status === "published" ? new Date() : null,
			updatedBy: userId,
		})
		.returning();

	return toPage(created!);
};

export const updateStaticPage = async (
	id: string,
	input: Partial<StaticPageInput>,
	userId: string,
): Promise<StaticPage> => {
	const [current] = await db
		.select({ publishedAt: t.staticPages.publishedAt })
		.from(t.staticPages)
		.where(eq(t.staticPages.id, id))
		.limit(1);

	if (!current) throw notFound("Page");

	const patch = Object.fromEntries(
		Object.entries(input).filter(([, value]) => value !== undefined),
	);

	const [updated] = await db
		.update(t.staticPages)
		.set({
			...patch,
			// La première publication horodate la mise en ligne ; les suivantes
			// ne la réécrivent pas.
			...(input.status === "published" && !current.publishedAt
				? { publishedAt: new Date() }
				: {}),
			updatedBy: userId,
			updatedAt: new Date(),
		})
		.where(eq(t.staticPages.id, id))
		.returning();

	return toPage(updated!);
};

export const deleteStaticPage = async (id: string): Promise<void> => {
	const [deleted] = await db
		.delete(t.staticPages)
		.where(eq(t.staticPages.id, id))
		.returning({ id: t.staticPages.id });

	if (!deleted) throw notFound("Page");
};

// --- Mises en avant --------------------------------------------------------

export const listFeaturedEntries = async (
	sectionKey?: string,
	options: { resolve?: boolean } = {},
): Promise<FeaturedEntry[]> => {
	const filters: SQL[] = [eq(t.featuredEntries.isActive, true)];
	if (sectionKey) filters.push(eq(t.featuredEntries.sectionKey, sectionKey));

	const rows = await db
		.select()
		.from(t.featuredEntries)
		.where(and(...filters))
		.orderBy(asc(t.featuredEntries.sectionKey), asc(t.featuredEntries.position));

	if (!options.resolve) {
		return rows.map((row) => ({
			id: row.id,
			kind: row.kind,
			productId: row.productId,
			categoryId: row.categoryId,
			sectionKey: row.sectionKey,
			position: row.position,
			isActive: row.isActive,
		}));
	}

	// Résolution en deux requêtes groupées plutôt qu'une par entrée.
	const productIds = rows.flatMap((row) => (row.productId ? [row.productId] : []));
	const categoryIds = rows.flatMap((row) => (row.categoryId ? [row.categoryId] : []));

	const [products, categories] = await Promise.all([
		productIds.length > 0
			? db
					.select({
						id: t.products.id,
						name: t.products.name,
						slug: t.products.slug,
						basePrice: t.products.basePrice,
						currency: t.products.currency,
						thumbnail: sql<string | null>`(
							select ${t.productImages.url} from ${t.productImages}
							where ${t.productImages.productId} = ${t.products.id}
							order by ${t.productImages.position} limit 1
						)`,
					})
					.from(t.products)
					.where(
						and(
							sql`${t.products.id} in ${productIds}`,
							eq(t.products.status, "published"),
							isNull(t.products.deletedAt),
						),
					)
			: Promise.resolve([]),
		categoryIds.length > 0
			? db
					.select({
						id: t.categories.id,
						name: t.categories.name,
						slug: t.categories.slug,
						imageUrl: t.categories.imageUrl,
					})
					.from(t.categories)
					.where(
						and(sql`${t.categories.id} in ${categoryIds}`, isNull(t.categories.deletedAt)),
					)
			: Promise.resolve([]),
	]);

	const productById = new Map(products.map((row) => [row.id, row]));
	const categoryById = new Map(categories.map((row) => [row.id, row]));

	return rows.flatMap((row) => {
		const target = row.productId
			? productById.get(row.productId)
			: row.categoryId
				? categoryById.get(row.categoryId)
				: null;

		// Une mise en avant dont la cible a été dépubliée est simplement omise.
		if (!target) return [];

		return [
			{
				id: row.id,
				kind: row.kind,
				productId: row.productId,
				categoryId: row.categoryId,
				sectionKey: row.sectionKey,
				position: row.position,
				isActive: row.isActive,
				target: target as unknown as Record<string, unknown>,
			},
		];
	});
};

export const createFeaturedEntry = async (
	input: FeaturedEntryInput,
): Promise<FeaturedEntry> => {
	const [created] = await db
		.insert(t.featuredEntries)
		.values({
			kind: input.kind,
			productId: input.productId ?? null,
			categoryId: input.categoryId ?? null,
			sectionKey: input.sectionKey,
			position: input.position,
			isActive: input.isActive,
		})
		.returning();

	return {
		id: created!.id,
		kind: created!.kind,
		productId: created!.productId,
		categoryId: created!.categoryId,
		sectionKey: created!.sectionKey,
		position: created!.position,
		isActive: created!.isActive,
	};
};

export const deleteFeaturedEntry = async (id: string): Promise<void> => {
	const [deleted] = await db
		.delete(t.featuredEntries)
		.where(eq(t.featuredEntries.id, id))
		.returning({ id: t.featuredEntries.id });

	if (!deleted) throw notFound("Mise en avant");
};

// --- Messages de contact ---------------------------------------------------

const toContactMessage = (
	row: typeof t.contactMessages.$inferSelect,
): ContactMessage => ({
	id: row.id,
	name: row.name,
	email: row.email,
	phone: row.phone,
	subject: row.subject,
	message: row.message,
	status: row.status,
	createdAt: row.createdAt.toISOString(),
});

/**
 * Enregistre un message du formulaire de contact.
 *
 * L'adresse IP et l'agent sont conservés : ce sont les seuls éléments
 * permettant de repérer un envoi automatisé si le champ leurre venait à être
 * contourné.
 */
export const createContactMessage = async (
	input: ContactMessageInput,
	context: { ipAddress: string | null; userAgent: string | null },
): Promise<{ id: string }> => {
	const [created] = await db
		.insert(t.contactMessages)
		.values({
			name: input.name,
			email: input.email,
			phone: input.phone ?? null,
			subject: input.subject ?? null,
			message: input.message,
			ipAddress: context.ipAddress,
			userAgent: context.userAgent?.slice(0, 500) ?? null,
		})
		.returning({ id: t.contactMessages.id });

	return { id: created!.id };
};

export const listContactMessages = async (query: {
	page: number;
	limit: number;
	status?: (typeof t.contactMessageStatusEnum.enumValues)[number];
}): Promise<Paginated<ContactMessage>> => {
	const where = query.status ? eq(t.contactMessages.status, query.status) : undefined;
	const { limit, offset } = toSqlPagination(query);

	const [rows, [totals]] = await Promise.all([
		db
			.select()
			.from(t.contactMessages)
			.where(where)
			.orderBy(desc(t.contactMessages.createdAt))
			.limit(limit)
			.offset(offset),
		db.select({ total: count() }).from(t.contactMessages).where(where),
	]);

	return paginate(rows.map(toContactMessage), query, totals?.total ?? 0);
};

/** Nombre de messages non lus, pour la pastille du panel. */
export const countNewContactMessages = async (): Promise<number> => {
	const [row] = await db
		.select({ total: count() })
		.from(t.contactMessages)
		.where(eq(t.contactMessages.status, "new"));

	return row?.total ?? 0;
};

export const updateContactMessageStatus = async (
	id: string,
	status: (typeof t.contactMessageStatusEnum.enumValues)[number],
): Promise<ContactMessage> => {
	const [updated] = await db
		.update(t.contactMessages)
		.set({ status, updatedAt: new Date() })
		.where(eq(t.contactMessages.id, id))
		.returning();

	if (!updated) throw notFound("Message");
	return toContactMessage(updated);
};
