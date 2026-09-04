import {
	deriveStockStatus,
	type InventoryRow,
	type ManualStockReason,
	type Paginated,
	type StockMovement,
	type StockMovementReason,
} from "@prettyfull/contracts";
import { and, count, desc, eq, gte, ilike, inArray, isNull, lte, or, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { db, type Transaction } from "../../db/index.js";
import * as t from "../../db/schema/index.js";
import { conflict, insufficientStock, notFound } from "../../lib/errors.js";
import { paginate, toSqlPagination } from "../../lib/response.js";

/**
 * Gestion des stocks (§2.3).
 *
 * Toutes les écritures passent par ce module, jamais par un `update` direct
 * sur `inventory_items` ailleurs dans le code. C'est ce qui garantit les deux
 * invariants du cahier des charges :
 *
 *  1. **Traçabilité** — chaque variation de quantité produit une ligne dans
 *     `stock_movements`, avec motif et auteur (§2.3, critère §7).
 *  2. **Pas de survente** — chaque lecture-écriture est sérialisée par un
 *     `SELECT … FOR UPDATE` sur la ligne de stock, à l'intérieur d'une
 *     transaction (§5 « accès concurrents »).
 */

/** Désignation d'un point de stock, au niveau le plus fin (§2.3). */
export interface InventoryScope {
	productId: string;
	variantId?: string | null;
	sizeId?: string | null;
}

type Executor = Transaction | typeof db;

/**
 * Verrouille une ligne de stock et renvoie son état courant.
 *
 * `FOR UPDATE` bloque toute autre transaction voulant écrire la même ligne
 * jusqu'au commit : deux commandes simultanées sur le dernier article sont
 * donc traitées l'une après l'autre, et la seconde voit le stock déjà
 * décrémenté. Sans ce verrou, les deux liraient « 1 disponible » et
 * vendraient toutes les deux.
 */
const lockInventoryItem = async (
	tx: Transaction,
	inventoryItemId: string,
): Promise<{
	id: string;
	quantity: number;
	reservedQuantity: number;
	lowStockThreshold: number;
	allowBackorder: boolean;
}> => {
	const rows = await tx.execute<{
		id: string;
		quantity: number;
		reserved_quantity: number;
		low_stock_threshold: number;
		allow_backorder: boolean;
	}>(sql`
		select id, quantity, reserved_quantity, low_stock_threshold, allow_backorder
		from ${t.inventoryItems}
		where id = ${inventoryItemId}
		for update
	`);

	const row = rows[0];
	if (!row) throw notFound("Point de stock");

	return {
		id: row.id,
		quantity: row.quantity,
		reservedQuantity: row.reserved_quantity,
		lowStockThreshold: row.low_stock_threshold,
		allowBackorder: row.allow_backorder,
	};
};

/**
 * Applique une variation de stock et journalise le mouvement.
 *
 * Fonction unique de mutation : `delta` positif incrémente (réception,
 * annulation, remboursement), négatif décrémente (commande confirmée, casse).
 * Doit être appelée à l'intérieur d'une transaction.
 */
export const applyMovement = async (
	tx: Transaction,
	params: {
		inventoryItemId: string;
		delta: number;
		reason: StockMovementReason;
		note?: string | null;
		userId?: string | null;
		userLabel?: string | null;
		orderId?: string | null;
	},
): Promise<{ quantityBefore: number; quantityAfter: number }> => {
	if (params.delta === 0) {
		throw conflict("Un mouvement de stock ne peut pas être nul.");
	}

	const item = await lockInventoryItem(tx, params.inventoryItemId);
	const quantityBefore = item.quantity;
	const quantityAfter = quantityBefore + params.delta;

	if (quantityAfter < 0) {
		throw insufficientStock(
			`Stock insuffisant : ${quantityBefore} en stock, ${Math.abs(params.delta)} demandés.`,
			{ available: [String(quantityBefore)] },
		);
	}

	// Le stock physique ne peut pas passer sous ce qui est déjà réservé pour
	// des paiements en cours, sauf si le découvert est explicitement autorisé.
	if (!item.allowBackorder && quantityAfter < item.reservedQuantity) {
		throw insufficientStock(
			`Stock insuffisant : ${item.reservedQuantity} unités sont réservées par des paiements en cours.`,
			{ reserved: [String(item.reservedQuantity)] },
		);
	}

	await tx
		.update(t.inventoryItems)
		.set({ quantity: quantityAfter, updatedAt: new Date() })
		.where(eq(t.inventoryItems.id, params.inventoryItemId));

	await tx.insert(t.stockMovements).values({
		inventoryItemId: params.inventoryItemId,
		direction: params.delta > 0 ? "in" : "out",
		quantity: Math.abs(params.delta),
		quantityBefore,
		quantityAfter,
		reason: params.reason,
		note: params.note ?? null,
		userId: params.userId ?? null,
		userLabel: params.userLabel ?? null,
		orderId: params.orderId ?? null,
	});

	return { quantityBefore, quantityAfter };
};

/**
 * Ajustement manuel par un administrateur (§2.3).
 *
 * Le motif est obligatoire par signature — il n'existe pas de chemin
 * permettant d'ajuster un stock sans en donner la raison (critère §7).
 */
export const adjustStock = async (params: {
	inventoryItemId: string;
	delta: number;
	reason: ManualStockReason;
	note?: string;
	userId: string;
	userLabel: string;
}): Promise<{ quantityBefore: number; quantityAfter: number }> =>
	db.transaction((tx) =>
		applyMovement(tx, {
			inventoryItemId: params.inventoryItemId,
			delta: params.delta,
			reason: params.reason,
			note: params.note ?? null,
			userId: params.userId,
			userLabel: params.userLabel,
		}),
	);

/** Fixe une quantité absolue (inventaire physique) et journalise l'écart. */
export const setStock = async (params: {
	inventoryItemId: string;
	quantity: number;
	reason: ManualStockReason;
	note?: string;
	userId: string;
	userLabel: string;
}): Promise<{ quantityBefore: number; quantityAfter: number }> =>
	db.transaction(async (tx) => {
		const item = await lockInventoryItem(tx, params.inventoryItemId);
		const delta = params.quantity - item.quantity;

		if (delta === 0) {
			return { quantityBefore: item.quantity, quantityAfter: item.quantity };
		}

		return applyMovement(tx, {
			inventoryItemId: params.inventoryItemId,
			delta,
			reason: params.reason,
			note: params.note ?? `Mise à niveau d'inventaire : ${item.quantity} → ${params.quantity}`,
			userId: params.userId,
			userLabel: params.userLabel,
		});
	});

// --- Réservations ----------------------------------------------------------

export interface ReservationRequest {
	inventoryItemId: string;
	quantity: number;
	/** Libellé de l'article, pour un message d'erreur exploitable côté panier. */
	label: string;
}

/**
 * Réserve du stock pendant le paiement (§2.3).
 *
 * Le stock physique n'est pas touché : seule `reservedQuantity` augmente, ce
 * qui retire les unités de la vente sans les consommer. Si le paiement
 * échoue ou est abandonné, la réservation expire et le stock redevient
 * disponible — c'est la règle retenue avec le client : réservation à la
 * commande, décrémentation ferme à la confirmation de paiement.
 *
 * Les lignes sont verrouillées dans un ordre déterministe (tri par
 * identifiant) : deux paniers contenant les mêmes articles dans un ordre
 * différent ne peuvent donc pas s'interbloquer.
 */
export const reserveStock = async (
	tx: Transaction,
	requests: ReservationRequest[],
	context: { orderId?: string | null; cartId?: string | null; expiresAt: Date },
): Promise<void> => {
	const ordered = [...requests].sort((a, b) =>
		a.inventoryItemId.localeCompare(b.inventoryItemId),
	);

	for (const request of ordered) {
		const item = await lockInventoryItem(tx, request.inventoryItemId);
		const available = item.quantity - item.reservedQuantity;

		if (!item.allowBackorder && available < request.quantity) {
			throw insufficientStock(
				available <= 0
					? `« ${request.label} » n'est plus disponible.`
					: `« ${request.label} » : ${available} unité(s) restante(s), ${request.quantity} demandée(s).`,
				{ [request.inventoryItemId]: [String(Math.max(0, available))] },
			);
		}

		await tx
			.update(t.inventoryItems)
			.set({
				reservedQuantity: item.reservedQuantity + request.quantity,
				updatedAt: new Date(),
			})
			.where(eq(t.inventoryItems.id, request.inventoryItemId));

		await tx.insert(t.stockReservations).values({
			inventoryItemId: request.inventoryItemId,
			orderId: context.orderId ?? null,
			cartId: context.cartId ?? null,
			quantity: request.quantity,
			status: "active",
			expiresAt: context.expiresAt,
		});
	}
};

/**
 * Confirme les réservations d'une commande payée : le stock réservé devient
 * une sortie ferme, avec son mouvement au journal.
 */
export const consumeReservations = async (
	tx: Transaction,
	orderId: string,
): Promise<void> => {
	const reservations = await tx
		.select({
			id: t.stockReservations.id,
			inventoryItemId: t.stockReservations.inventoryItemId,
			quantity: t.stockReservations.quantity,
		})
		.from(t.stockReservations)
		.where(
			and(
				eq(t.stockReservations.orderId, orderId),
				eq(t.stockReservations.status, "active"),
			),
		);

	for (const reservation of reservations) {
		const item = await lockInventoryItem(tx, reservation.inventoryItemId);

		await tx
			.update(t.inventoryItems)
			.set({
				reservedQuantity: Math.max(0, item.reservedQuantity - reservation.quantity),
				updatedAt: new Date(),
			})
			.where(eq(t.inventoryItems.id, reservation.inventoryItemId));

		await applyMovement(tx, {
			inventoryItemId: reservation.inventoryItemId,
			delta: -reservation.quantity,
			reason: "order_confirmed",
			orderId,
		});

		await tx
			.update(t.stockReservations)
			.set({ status: "consumed", releasedAt: new Date() })
			.where(eq(t.stockReservations.id, reservation.id));
	}
};

/**
 * Libère les réservations d'une commande ou d'un panier : le stock redevient
 * vendable sans mouvement au journal, puisque le stock physique n'a jamais
 * bougé.
 */
export const releaseReservations = async (
	tx: Transaction,
	target: { orderId?: string; cartId?: string },
	status: "released" | "expired" = "released",
): Promise<number> => {
	const filter = target.orderId
		? eq(t.stockReservations.orderId, target.orderId)
		: target.cartId
			? eq(t.stockReservations.cartId, target.cartId)
			: undefined;

	if (!filter) return 0;

	const reservations = await tx
		.select({
			id: t.stockReservations.id,
			inventoryItemId: t.stockReservations.inventoryItemId,
			quantity: t.stockReservations.quantity,
		})
		.from(t.stockReservations)
		.where(and(filter, eq(t.stockReservations.status, "active")));

	for (const reservation of reservations) {
		const item = await lockInventoryItem(tx, reservation.inventoryItemId);

		await tx
			.update(t.inventoryItems)
			.set({
				reservedQuantity: Math.max(0, item.reservedQuantity - reservation.quantity),
				updatedAt: new Date(),
			})
			.where(eq(t.inventoryItems.id, reservation.inventoryItemId));

		await tx
			.update(t.stockReservations)
			.set({ status, releasedAt: new Date() })
			.where(eq(t.stockReservations.id, reservation.id));
	}

	return reservations.length;
};

/**
 * Purge les réservations expirées (paiements abandonnés).
 *
 * Appelée périodiquement par la tâche de fond ; libère le stock immobilisé
 * par des paniers dont le paiement n'a jamais abouti.
 */
export const expireStaleReservations = async (): Promise<number> => {
	const expired = await db
		.select({
			id: t.stockReservations.id,
			inventoryItemId: t.stockReservations.inventoryItemId,
			quantity: t.stockReservations.quantity,
		})
		.from(t.stockReservations)
		.where(
			and(
				eq(t.stockReservations.status, "active"),
				lte(t.stockReservations.expiresAt, new Date()),
			),
		)
		.limit(500);

	if (expired.length === 0) return 0;

	await db.transaction(async (tx) => {
		for (const reservation of expired) {
			const item = await lockInventoryItem(tx, reservation.inventoryItemId);

			await tx
				.update(t.inventoryItems)
				.set({
					reservedQuantity: Math.max(0, item.reservedQuantity - reservation.quantity),
					updatedAt: new Date(),
				})
				.where(eq(t.inventoryItems.id, reservation.inventoryItemId));

			await tx
				.update(t.stockReservations)
				.set({ status: "expired", releasedAt: new Date() })
				.where(eq(t.stockReservations.id, reservation.id));
		}
	});

	return expired.length;
};

// --- Résolution et création des points de stock ----------------------------

/**
 * Retrouve le point de stock d'un article.
 *
 * Les `null` sont comparés avec `is not distinct from` : en SQL, `variant_id =
 * null` ne renvoie jamais vrai, ce qui ferait échouer la recherche des
 * produits sans déclinaison.
 */
export const findInventoryItem = async (
	scope: InventoryScope,
	executor: Executor = db,
): Promise<{ id: string; quantity: number; reservedQuantity: number } | null> => {
	const rows = await executor
		.select({
			id: t.inventoryItems.id,
			quantity: t.inventoryItems.quantity,
			reservedQuantity: t.inventoryItems.reservedQuantity,
		})
		.from(t.inventoryItems)
		.where(
			and(
				eq(t.inventoryItems.productId, scope.productId),
				sql`${t.inventoryItems.variantId} is not distinct from ${scope.variantId ?? null}`,
				sql`${t.inventoryItems.sizeId} is not distinct from ${scope.sizeId ?? null}`,
			),
		)
		.limit(1);

	return rows[0] ?? null;
};

/** Crée le point de stock d'un article s'il n'existe pas encore. */
export const ensureInventoryItem = async (
	tx: Transaction,
	scope: InventoryScope,
	options: { quantity?: number; lowStockThreshold?: number } = {},
): Promise<string> => {
	const existing = await findInventoryItem(scope, tx);
	if (existing) return existing.id;

	const [created] = await tx
		.insert(t.inventoryItems)
		.values({
			productId: scope.productId,
			variantId: scope.variantId ?? null,
			sizeId: scope.sizeId ?? null,
			quantity: 0,
			lowStockThreshold: options.lowStockThreshold ?? 5,
		})
		.returning({ id: t.inventoryItems.id });

	const inventoryItemId = created!.id;

	// Le stock d'ouverture passe par un mouvement : même la quantité initiale
	// saisie à la création d'un produit apparaît au journal d'audit.
	if (options.quantity && options.quantity > 0) {
		await applyMovement(tx, {
			inventoryItemId,
			delta: options.quantity,
			reason: "supplier_receipt",
			note: "Stock initial à la création de l'article",
		});
	}

	return inventoryItemId;
};

export const updateInventorySettings = async (
	inventoryItemId: string,
	input: { lowStockThreshold?: number; allowBackorder?: boolean },
): Promise<void> => {
	const [updated] = await db
		.update(t.inventoryItems)
		.set({ ...input, updatedAt: new Date() })
		.where(eq(t.inventoryItems.id, inventoryItemId))
		.returning({ id: t.inventoryItems.id });

	if (!updated) throw notFound("Point de stock");
};

// --- Lectures --------------------------------------------------------------

const availableExpression = sql<number>`${t.inventoryItems.quantity} - ${t.inventoryItems.reservedQuantity}`;

const inventorySelection = {
	id: t.inventoryItems.id,
	productId: t.inventoryItems.productId,
	variantId: t.inventoryItems.variantId,
	sizeId: t.inventoryItems.sizeId,
	quantity: t.inventoryItems.quantity,
	reservedQuantity: t.inventoryItems.reservedQuantity,
	lowStockThreshold: t.inventoryItems.lowStockThreshold,
	allowBackorder: t.inventoryItems.allowBackorder,
	updatedAt: t.inventoryItems.updatedAt,
	productName: t.products.name,
	productSlug: t.products.slug,
	variantName: t.productVariants.name,
	sizeLabel: t.sizes.label,
	sku: sql<string | null>`coalesce(${t.sizes.sku}, ${t.productVariants.sku}, ${t.products.sku})`,
	thumbnail: sql<string | null>`(
		select ${t.productImages.url} from ${t.productImages}
		where ${t.productImages.productId} = ${t.products.id}
		order by ${t.productImages.position} limit 1
	)`,
};

const toInventoryRow = (row: {
	id: string;
	productId: string;
	variantId: string | null;
	sizeId: string | null;
	quantity: number;
	reservedQuantity: number;
	lowStockThreshold: number;
	allowBackorder: boolean;
	updatedAt: Date;
	productName: string;
	productSlug: string;
	variantName: string | null;
	sizeLabel: string | null;
	sku: string | null;
	thumbnail: string | null;
}): InventoryRow => {
	const availableQuantity = row.quantity - row.reservedQuantity;
	return {
		id: row.id,
		productId: row.productId,
		variantId: row.variantId,
		sizeId: row.sizeId,
		quantity: row.quantity,
		reservedQuantity: row.reservedQuantity,
		availableQuantity,
		lowStockThreshold: row.lowStockThreshold,
		allowBackorder: row.allowBackorder,
		stockStatus: deriveStockStatus(
			availableQuantity,
			row.lowStockThreshold,
			row.allowBackorder,
		),
		updatedAt: row.updatedAt.toISOString(),
		productName: row.productName,
		productSlug: row.productSlug,
		variantName: row.variantName,
		sizeLabel: row.sizeLabel,
		sku: row.sku,
		thumbnail: row.thumbnail,
	};
};

/** Vue consolidée des stocks (§4.3). */
export const listInventory = async (query: {
	page: number;
	limit: number;
	q?: string;
	productId?: string;
	stockStatus?: "in_stock" | "low_stock" | "out_of_stock";
	lowStockOnly?: boolean;
}): Promise<Paginated<InventoryRow>> => {
	const filters: SQL[] = [isNull(t.products.deletedAt)];

	if (query.productId) filters.push(eq(t.inventoryItems.productId, query.productId));

	if (query.q) {
		const pattern = `%${query.q}%`;
		const search = or(
			ilike(t.products.name, pattern),
			ilike(t.products.sku, pattern),
			ilike(t.productVariants.sku, pattern),
			ilike(t.sizes.sku, pattern),
		);
		if (search) filters.push(search);
	}

	if (query.lowStockOnly) {
		filters.push(sql`${availableExpression} <= ${t.inventoryItems.lowStockThreshold}`);
	}

	if (query.stockStatus === "out_of_stock") {
		filters.push(sql`${availableExpression} <= 0`);
	} else if (query.stockStatus === "low_stock") {
		filters.push(
			sql`${availableExpression} > 0 and ${availableExpression} <= ${t.inventoryItems.lowStockThreshold}`,
		);
	} else if (query.stockStatus === "in_stock") {
		filters.push(sql`${availableExpression} > ${t.inventoryItems.lowStockThreshold}`);
	}

	const where = and(...filters);
	const { limit, offset } = toSqlPagination(query);

	// La chaîne de jointures est répétée plutôt que factorisée derrière un
	// helper générique : Drizzle infère le type des colonnes depuis l'objet de
	// sélection, et un paramètre générique l'effacerait en `unknown`.
	const [rows, [totals]] = await Promise.all([
		db
			.select(inventorySelection)
			.from(t.inventoryItems)
			.innerJoin(t.products, eq(t.products.id, t.inventoryItems.productId))
			.leftJoin(t.productVariants, eq(t.productVariants.id, t.inventoryItems.variantId))
			.leftJoin(t.sizes, eq(t.sizes.id, t.inventoryItems.sizeId))
			.where(where)
			.orderBy(sql`${availableExpression} asc`, t.products.name)
			.limit(limit)
			.offset(offset),
		db
			.select({ total: count() })
			.from(t.inventoryItems)
			.innerJoin(t.products, eq(t.products.id, t.inventoryItems.productId))
			.leftJoin(t.productVariants, eq(t.productVariants.id, t.inventoryItems.variantId))
			.leftJoin(t.sizes, eq(t.sizes.id, t.inventoryItems.sizeId))
			.where(where),
	]);

	return paginate(rows.map(toInventoryRow), query, totals?.total ?? 0);
};

/** Historique des mouvements (§2.3, §4.3). */
export const listMovements = async (query: {
	page: number;
	limit: number;
	inventoryItemId?: string;
	productId?: string;
	orderId?: string;
	userId?: string;
	reason?: StockMovementReason;
	from?: string;
	to?: string;
}): Promise<Paginated<StockMovement>> => {
	const filters: SQL[] = [];

	if (query.inventoryItemId) {
		filters.push(eq(t.stockMovements.inventoryItemId, query.inventoryItemId));
	}
	if (query.productId) filters.push(eq(t.inventoryItems.productId, query.productId));
	if (query.orderId) filters.push(eq(t.stockMovements.orderId, query.orderId));
	if (query.userId) filters.push(eq(t.stockMovements.userId, query.userId));
	if (query.reason) filters.push(eq(t.stockMovements.reason, query.reason));
	if (query.from) filters.push(gte(t.stockMovements.createdAt, new Date(query.from)));
	if (query.to) filters.push(lte(t.stockMovements.createdAt, new Date(query.to)));

	const where = filters.length > 0 ? and(...filters) : undefined;
	const { limit, offset } = toSqlPagination(query);

	const [rows, [totals]] = await Promise.all([
		db
			.select({
				id: t.stockMovements.id,
				inventoryItemId: t.stockMovements.inventoryItemId,
				direction: t.stockMovements.direction,
				quantity: t.stockMovements.quantity,
				quantityBefore: t.stockMovements.quantityBefore,
				quantityAfter: t.stockMovements.quantityAfter,
				reason: t.stockMovements.reason,
				note: t.stockMovements.note,
				orderId: t.stockMovements.orderId,
				userId: t.stockMovements.userId,
				userLabel: t.stockMovements.userLabel,
				createdAt: t.stockMovements.createdAt,
			})
			.from(t.stockMovements)
			.innerJoin(t.inventoryItems, eq(t.inventoryItems.id, t.stockMovements.inventoryItemId))
			.where(where)
			.orderBy(desc(t.stockMovements.createdAt))
			.limit(limit)
			.offset(offset),
		db
			.select({ total: count() })
			.from(t.stockMovements)
			.innerJoin(t.inventoryItems, eq(t.inventoryItems.id, t.stockMovements.inventoryItemId))
			.where(where),
	]);

	return paginate(
		rows.map((row) => ({
			id: row.id,
			inventoryItemId: row.inventoryItemId,
			direction: row.direction,
			quantity: row.quantity,
			quantityBefore: row.quantityBefore,
			quantityAfter: row.quantityAfter,
			reason: row.reason,
			note: row.note,
			orderId: row.orderId,
			userId: row.userId,
			userName: row.userLabel,
			createdAt: row.createdAt.toISOString(),
		})),
		query,
		totals?.total ?? 0,
	);
};

/** Points de stock sous le seuil d'alerte (§2.3, tableau de bord §4.1). */
export const listLowStockAlerts = async (limit = 20) => {
	const rows = await db
		.select({
			inventoryItemId: t.inventoryItems.id,
			productId: t.inventoryItems.productId,
			productName: t.products.name,
			variantName: t.productVariants.name,
			sizeLabel: t.sizes.label,
			availableQuantity: availableExpression,
			lowStockThreshold: t.inventoryItems.lowStockThreshold,
		})
		.from(t.inventoryItems)
		.innerJoin(t.products, eq(t.products.id, t.inventoryItems.productId))
		.leftJoin(t.productVariants, eq(t.productVariants.id, t.inventoryItems.variantId))
		.leftJoin(t.sizes, eq(t.sizes.id, t.inventoryItems.sizeId))
		.where(
			and(
				isNull(t.products.deletedAt),
				eq(t.products.status, "published"),
				sql`${availableExpression} <= ${t.inventoryItems.lowStockThreshold}`,
			),
		)
		.orderBy(sql`${availableExpression} asc`)
		.limit(limit);

	return rows;
};

/** Agrège le stock disponible de plusieurs produits, en une requête. */
export const summarizeByProduct = async (
	productIds: string[],
): Promise<Map<string, { quantity: number; available: number; threshold: number }>> => {
	if (productIds.length === 0) return new Map();

	const rows = await db
		.select({
			productId: t.inventoryItems.productId,
			quantity: sql<number>`sum(${t.inventoryItems.quantity})::int`,
			available: sql<number>`sum(${availableExpression})::int`,
			threshold: sql<number>`max(${t.inventoryItems.lowStockThreshold})::int`,
		})
		.from(t.inventoryItems)
		.where(inArray(t.inventoryItems.productId, productIds))
		.groupBy(t.inventoryItems.productId);

	return new Map(
		rows.map((row) => [
			row.productId,
			{ quantity: row.quantity, available: row.available, threshold: row.threshold },
		]),
	);
};
