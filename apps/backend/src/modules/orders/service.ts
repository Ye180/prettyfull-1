import {
	canTransitionOrder,
	type CheckoutInput,
	type CurrencyCode,
	type Order,
	type OrderStatus,
	type Paginated,
	type PaymentStatus,
} from "@prettyfull/contracts";
import { and, count, desc, eq, gte, ilike, inArray, lte, or, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { db, type Transaction } from "../../db/index.js";
import * as t from "../../db/schema/index.js";
import type { AddressSnapshot } from "../../db/schema/orders.js";
import { badRequest, conflict, notFound, paymentError } from "../../lib/errors.js";
import { paginate, toSqlPagination } from "../../lib/response.js";
import { decryptCredentials, safeCompare } from "../../lib/crypto.js";
import { createHmac } from "node:crypto";
import { env } from "../../lib/env.js";
import { getPaymentAdapter } from "../../integrations/payment/registry.js";
import * as inventory from "../inventory/service.js";
import * as cart from "../cart/service.js";
import { incrementUsage, resolveDiscountForSubtotal } from "../promotions/service.js";
import { getStoreSettings } from "../settings/service.js";

/**
 * Commandes (§2.4).
 *
 * Deux invariants structurent ce module :
 *
 *  1. **Instantané** - chaque ligne fige le libellé, le SKU, la vignette et le
 *     prix au moment de l'achat. Modifier ou archiver un produit ensuite ne
 *     réécrit jamais une commande passée.
 *  2. **Stock** - le passage en commande *réserve* (§2.3), il ne décrémente
 *     pas. La décrémentation ferme intervient à la confirmation de paiement,
 *     et l'annulation ou l'expiration relâchent la réservation.
 */

// --- Lecture ---------------------------------------------------------------

const toAddress = (value: AddressSnapshot | null): Order["shippingAddress"] =>
	value ? (value as unknown as Order["shippingAddress"]) : {};

const hydrateOrders = async (
	orderIds: string[],
	options: { withHistory?: boolean } = {},
): Promise<Map<string, Order>> => {
	if (orderIds.length === 0) return new Map();

	const [orderRows, itemRows, historyRows, transactionRows] = await Promise.all([
		db.select().from(t.orders).where(inArray(t.orders.id, orderIds)),
		db.select().from(t.orderItems).where(inArray(t.orderItems.orderId, orderIds)),
		options.withHistory
			? db
					.select()
					.from(t.orderStatusHistory)
					.where(inArray(t.orderStatusHistory.orderId, orderIds))
					.orderBy(desc(t.orderStatusHistory.createdAt))
			: Promise.resolve([]),
		options.withHistory
			? db
					.select()
					.from(t.transactions)
					.where(inArray(t.transactions.orderId, orderIds))
					.orderBy(desc(t.transactions.createdAt))
			: Promise.resolve([]),
	]);

	const result = new Map<string, Order>();

	for (const order of orderRows) {
		result.set(order.id, {
			id: order.id,
			displayId: order.displayId,
			userId: order.userId,
			email: order.email,
			phone: order.phone,
			status: order.status,
			paymentStatus: order.paymentStatus,
			fulfillmentStatus: order.fulfillmentStatus,
			currency: order.currency,
			items: itemRows
				.filter((item) => item.orderId === order.id)
				.map((item) => ({
					id: item.id,
					productId: item.productId,
					variantId: item.variantId,
					sizeId: item.sizeId,
					productName: item.productName,
					productSlug: item.productSlug,
					variantName: item.variantName,
					sizeLabel: item.sizeLabel,
					sku: item.sku,
					thumbnail: item.thumbnail,
					unitPrice: item.unitPrice,
					quantity: item.quantity,
					lineTotal: item.lineTotal,
					refundedQuantity: item.refundedQuantity,
				})),
			shippingAddress: toAddress(order.shippingAddress),
			billingAddress: order.billingAddress ? toAddress(order.billingAddress) : null,
			shippingMethod: order.shippingMethod,
			trackingNumber: order.trackingNumber,
			trackingUrl: order.trackingUrl,
			carrier: order.carrier,
			subtotal: order.subtotal,
			shippingTotal: order.shippingTotal,
			taxTotal: order.taxTotal,
			discountTotal: order.discountTotal,
			discountCode: order.discountCode,
			total: order.total,
			refundedTotal: order.refundedTotal,
			note: order.note,
			placedAt: order.placedAt.toISOString(),
			paidAt: order.paidAt?.toISOString() ?? null,
			shippedAt: order.shippedAt?.toISOString() ?? null,
			deliveredAt: order.deliveredAt?.toISOString() ?? null,
			cancelledAt: order.cancelledAt?.toISOString() ?? null,
			...(options.withHistory
				? {
						statusHistory: historyRows
							.filter((row) => row.orderId === order.id)
							.map((row) => ({
								id: row.id,
								fromStatus: row.fromStatus,
								toStatus: row.toStatus,
								comment: row.comment,
								userId: row.userId,
								userName: row.userLabel,
								createdAt: row.createdAt.toISOString(),
							})),
						transactions: transactionRows
							.filter((row) => row.orderId === order.id)
							.map((row) => ({
								id: row.id,
								orderId: row.orderId,
								providerKey: row.providerKey,
								providerTransactionId: row.providerTransactionId,
								kind: row.kind,
								status: row.status,
								amount: row.amount,
								currency: row.currency,
								errorMessage: row.errorMessage,
								createdAt: row.createdAt.toISOString(),
								updatedAt: row.updatedAt.toISOString(),
							})),
					}
				: {}),
			createdAt: order.createdAt.toISOString(),
			updatedAt: order.updatedAt.toISOString(),
		});
	}

	return result;
};

export const getOrder = async (id: string): Promise<Order> => {
	const orders = await hydrateOrders([id], { withHistory: true });
	const order = orders.get(id);
	if (!order) throw notFound("Commande");
	return order;
};

/** Lecture côté cliente : la commande doit lui appartenir. */
export const getOrderForUser = async (id: string, userId: string): Promise<Order> => {
	const order = await getOrder(id);
	if (order.userId !== userId) throw notFound("Commande");
	return order;
};

export interface OrderListQuery {
	page: number;
	limit: number;
	q?: string;
	status?: OrderStatus;
	paymentStatus?: PaymentStatus;
	fulfillmentStatus?: (typeof t.fulfillmentStatusEnum.enumValues)[number];
	userId?: string;
	email?: string;
	from?: string;
	to?: string;
	minTotal?: number;
	maxTotal?: number;
}

export const listOrders = async (query: OrderListQuery): Promise<Paginated<Order>> => {
	const filters: SQL[] = [];

	if (query.status) filters.push(eq(t.orders.status, query.status));
	if (query.paymentStatus) filters.push(eq(t.orders.paymentStatus, query.paymentStatus));
	if (query.fulfillmentStatus) {
		filters.push(eq(t.orders.fulfillmentStatus, query.fulfillmentStatus));
	}
	if (query.userId) filters.push(eq(t.orders.userId, query.userId));
	if (query.email) filters.push(ilike(t.orders.email, `%${query.email}%`));
	if (query.from) filters.push(gte(t.orders.createdAt, new Date(query.from)));
	if (query.to) filters.push(lte(t.orders.createdAt, new Date(query.to)));
	if (query.minTotal !== undefined) filters.push(gte(t.orders.total, query.minTotal));
	if (query.maxTotal !== undefined) filters.push(lte(t.orders.total, query.maxTotal));

	if (query.q) {
		const numeric = Number(query.q.replace(/\D/g, ""));
		// La recherche accepte indifféremment un numéro de commande, un e-mail
		// ou un numéro de suivi - c'est ce que tape un agent au téléphone.
		const search = or(
			ilike(t.orders.email, `%${query.q}%`),
			ilike(t.orders.trackingNumber, `%${query.q}%`),
			...(Number.isFinite(numeric) && numeric > 0
				? [eq(t.orders.displayId, numeric)]
				: []),
		);
		if (search) filters.push(search);
	}

	const where = filters.length > 0 ? and(...filters) : undefined;
	const { limit, offset } = toSqlPagination(query);

	const [rows, [totals]] = await Promise.all([
		db
			.select({ id: t.orders.id })
			.from(t.orders)
			.where(where)
			.orderBy(desc(t.orders.createdAt))
			.limit(limit)
			.offset(offset),
		db.select({ total: count() }).from(t.orders).where(where),
	]);

	const hydrated = await hydrateOrders(rows.map((row) => row.id));

	return paginate(
		rows.flatMap((row) => {
			const order = hydrated.get(row.id);
			return order ? [order] : [];
		}),
		query,
		totals?.total ?? 0,
	);
};

// --- Passage en commande ---------------------------------------------------

const loadProviderConfig = async (providerKey: string) => {
	const [row] = await db
		.select()
		.from(t.paymentProviders)
		.where(eq(t.paymentProviders.key, providerKey))
		.limit(1);

	if (!row) throw badRequest("Moyen de paiement inconnu.");
	if (!row.isEnabled) throw badRequest("Ce moyen de paiement n'est pas disponible.");

	const adapter = getPaymentAdapter(providerKey);
	if (!adapter) {
		throw paymentError("Aucun adaptateur n'est enregistré pour ce moyen de paiement.");
	}

	return {
		adapter,
		runtime: {
			environment: row.environment,
			// Les clés sont déchiffrées uniquement ici, au moment de l'appel.
			credentials: decryptCredentials(row.credentials),
			config: row.config,
		},
	};
};

const appendStatusHistory = async (
	tx: Transaction,
	orderId: string,
	fromStatus: OrderStatus | null,
	toStatus: OrderStatus,
	comment: string | null,
	actor?: { userId: string; label: string },
): Promise<void> => {
	await tx.insert(t.orderStatusHistory).values({
		orderId,
		fromStatus,
		toStatus,
		comment,
		userId: actor?.userId ?? null,
		userLabel: actor?.label ?? null,
	});
};

export interface CheckoutResult {
	orderId: string;
	displayId: number;
	status: OrderStatus;
	paymentStatus: PaymentStatus;
	redirectUrl: string | null;
	transactionId: string | null;
	/** Jeton de consultation, pour une commande passée sans compte. */
	confirmationToken: string;
}

/**
 * Jeton de consultation d'une commande passée en invité.
 *
 * Une commande sans compte doit rester consultable par son auteur - page de
 * confirmation, retour depuis la page de paiement - mais par personne d'autre.
 * Une signature HMAC de l'identifiant répond aux deux : impossible à deviner,
 * et sans état à stocker ni à faire expirer.
 */
export const confirmationTokenFor = (orderId: string): string =>
	createHmac("sha256", env.JWT_SECRET)
		.update(`order-confirmation:${orderId}`)
		.digest("hex")
		.slice(0, 32);

/**
 * Commande accessible par jeton, sans authentification.
 *
 * La comparaison est à temps constant : comparer deux chaînes caractère par
 * caractère laisserait fuiter le jeton par mesure du temps de réponse.
 */
export const getOrderByToken = async (id: string, token: string): Promise<Order> => {
	if (!safeCompare(token, confirmationTokenFor(id))) throw notFound("Commande");
	return getOrder(id);
};

/**
 * Transforme un panier en commande.
 *
 * Déroulé, tout en une transaction sauf l'appel au prestataire :
 *   1. relecture des prix au catalogue (le panier ne fige rien) ;
 *   2. réservation du stock, sous verrou - c'est ici que la survente est
 *      empêchée, avant tout appel externe ;
 *   3. création de la commande et de ses lignes en instantané ;
 *   4. appel du prestataire, hors transaction : un timeout réseau ne doit pas
 *      maintenir des verrous de stock ouverts.
 *
 * Si le prestataire refuse, la commande reste en `pending_payment` avec sa
 * réservation : la cliente peut relancer le paiement, et la réservation
 * expirera d'elle-même en cas d'abandon.
 */
export const checkout = async (
	cartId: string,
	input: CheckoutInput,
	actor: { userId: string | null },
): Promise<CheckoutResult> => {
	const settings = await getStoreSettings();

	const lines = await cart.loadCartLines(cartId);
	if (lines.length === 0) throw badRequest("Votre panier est vide.");

	const [cartRow] = await db
		.select({
			currency: t.carts.currency,
			status: t.carts.status,
			discountCodeId: t.carts.discountCodeId,
		})
		.from(t.carts)
		.where(eq(t.carts.id, cartId))
		.limit(1);

	if (!cartRow || cartRow.status !== "active") {
		throw conflict("Ce panier a déjà été validé.");
	}

	const subtotal = lines.reduce((total, line) => total + line.lineTotal, 0);
	const shipping = await cart.resolveShippingAmount(cartId, input.shippingRateId, subtotal);

	if (!shipping) throw badRequest("Choisissez un mode de livraison.");

	const shippingTotal = shipping.amount;

	// Revalidé ici, pas seulement recopié du panier : le code peut avoir
	// expiré ou atteint sa limite entre son application et le paiement (§2.9).
	let discount: { promoCodeId: string; code: string; amount: number } | null = null;

	if (cartRow.discountCodeId) {
		const [promo] = await db
			.select({ code: t.promoCodes.code })
			.from(t.promoCodes)
			.where(eq(t.promoCodes.id, cartRow.discountCodeId))
			.limit(1);

		if (promo) discount = await resolveDiscountForSubtotal(promo.code, subtotal);
	}

	const discountTotal = discount?.amount ?? 0;
	const total = Math.max(0, subtotal + shippingTotal - discountTotal);

	const { adapter, runtime } = await loadProviderConfig(input.paymentProviderKey);

	const expiresAt = new Date(Date.now() + settings.stockReservationMinutes * 60_000);

	const { orderId, displayId } = await db.transaction(async (tx) => {
		const [order] = await tx
			.insert(t.orders)
			.values({
				userId: actor.userId,
				email: input.email,
				phone: input.phone ?? null,
				status: "pending_payment",
				paymentStatus: "pending",
				fulfillmentStatus: "not_fulfilled",
				currency: cartRow.currency,
				shippingAddress: input.shippingAddress as AddressSnapshot,
				billingAddress: (input.billingAddress ?? input.shippingAddress) as AddressSnapshot,
				shippingMethod: {
					rateId: input.shippingRateId,
					providerKey: shipping.providerKey,
					name: shipping.name,
					amount: shippingTotal,
				},
				subtotal,
				shippingTotal,
				taxTotal: 0,
				discountTotal,
				discountCodeId: discount?.promoCodeId ?? null,
				discountCode: discount?.code ?? null,
				total,
				note: input.note ?? null,
			})
			.returning({ id: t.orders.id, displayId: t.orders.displayId });

		const id = order!.id;

		await tx.insert(t.orderItems).values(
			lines.map((line) => ({
				orderId: id,
				productId: line.productId,
				variantId: line.variantId,
				sizeId: line.sizeId,
				inventoryItemId: line.inventoryItemId,
				productName: line.productName,
				productSlug: line.productSlug,
				variantName: line.variantName,
				sizeLabel: line.sizeLabel,
				sku: line.sku,
				thumbnail: line.thumbnail,
				unitPrice: line.unitPrice,
				quantity: line.quantity,
				lineTotal: line.lineTotal,
			})),
		);

		// Réservation sous verrou : si un article vient d'être épuisé par une
		// autre commande, tout est annulé et rien n'est créé.
		await inventory.reserveStock(
			tx,
			lines.map((line) => ({
				inventoryItemId: line.inventoryItemId,
				quantity: line.quantity,
				label: [line.productName, line.variantName, line.sizeLabel]
					.filter(Boolean)
					.join(" - "),
			})),
			{ orderId: id, cartId, expiresAt },
		);

		await appendStatusHistory(tx, id, null, "pending_payment", "Commande créée");

		if (discount) await incrementUsage(discount.promoCodeId, tx);

		await tx
			.update(t.carts)
			.set({ status: "completed", completedAt: new Date(), updatedAt: new Date() })
			.where(eq(t.carts.id, cartId));

		return { orderId: id, displayId: order!.displayId };
	});

	const storefront = input.returnUrl ?? env.STOREFRONT_URL;

	const initiation = await adapter.initiate({
		...runtime,
		order: {
			id: orderId,
			displayId,
			amount: total,
			currency: cartRow.currency as CurrencyCode,
			email: input.email,
			phone: input.phone ?? null,
			description: `${settings.orderNumberPrefix}-${displayId}`,
		},
		successUrl: `${storefront}/order-confirmation?order_id=${orderId}&token=${confirmationTokenFor(orderId)}`,
		cancelUrl: `${storefront}/checkout?order=${orderId}&status=cancelled`,
		webhookUrl: `${env.PUBLIC_API_URL}/api/webhooks/${adapter.key}`,
	});

	const [transaction] = await db
		.insert(t.transactions)
		.values({
			orderId,
			providerKey: adapter.key,
			providerTransactionId: initiation.providerTransactionId,
			kind: "payment",
			status:
				initiation.status === "succeeded"
					? "success"
					: initiation.status === "failed"
						? "failed"
						: "pending",
			amount: total,
			currency: cartRow.currency,
			rawResponse: initiation.raw ?? null,
			errorMessage: initiation.errorMessage ?? null,
		})
		.returning({ id: t.transactions.id });

	// Encaissement immédiat (aucun aller-retour externe) : le stock est
	// consommé tout de suite.
	if (initiation.status === "succeeded") {
		await markOrderPaid(orderId, { comment: `Paiement ${adapter.name} confirmé` });
	}

	const order = await getOrder(orderId);

	return {
		orderId,
		displayId,
		status: order.status,
		paymentStatus: order.paymentStatus,
		redirectUrl: initiation.redirectUrl,
		transactionId: transaction?.id ?? null,
		confirmationToken: confirmationTokenFor(orderId),
	};
};

// --- Cycle de vie ----------------------------------------------------------

/**
 * Confirme le paiement : consomme les réservations, décrémente fermement le
 * stock, passe la commande en `paid`.
 *
 * Idempotent : une commande déjà payée est ignorée sans erreur - un
 * prestataire qui rejoue sa notification ne doit pas décrémenter deux fois.
 */
export const markOrderPaid = async (
	orderId: string,
	options: { comment?: string; actor?: { userId: string; label: string } } = {},
): Promise<void> => {
	await db.transaction(async (tx) => {
		const [order] = await tx
			.select({ id: t.orders.id, status: t.orders.status, paymentStatus: t.orders.paymentStatus })
			.from(t.orders)
			.where(eq(t.orders.id, orderId))
			.for("update")
			.limit(1);

		if (!order) throw notFound("Commande");
		if (order.paymentStatus === "paid") return;

		await inventory.consumeReservations(tx, orderId);

		const now = new Date();

		await tx
			.update(t.orders)
			.set({
				status: "paid",
				paymentStatus: "paid",
				paidAt: now,
				updatedAt: now,
			})
			.where(eq(t.orders.id, orderId));

		// Le journal des transactions (§2.5) doit refléter l'encaissement, y
		// compris lorsqu'il est confirmé à la main : sans cela, une commande
		// payée à la livraison resterait éternellement « en attente » au
		// journal, qui perdrait sa valeur de preuve.
		await tx
			.update(t.transactions)
			.set({ status: "success", updatedAt: now })
			.where(
				and(
					eq(t.transactions.orderId, orderId),
					eq(t.transactions.kind, "payment"),
					eq(t.transactions.status, "pending"),
				),
			);

		await appendStatusHistory(
			tx,
			orderId,
			order.status,
			"paid",
			options.comment ?? "Paiement confirmé",
			options.actor,
		);
	});
};

/** Marque un paiement en échec ; le stock reste réservé jusqu'à expiration. */
export const markPaymentFailed = async (
	orderId: string,
	reason: string,
): Promise<void> => {
	await db
		.update(t.orders)
		.set({ paymentStatus: "failed", updatedAt: new Date() })
		.where(and(eq(t.orders.id, orderId), eq(t.orders.paymentStatus, "pending")));

	await db.transaction(async (tx) => {
		await appendStatusHistory(tx, orderId, "pending_payment", "pending_payment", reason);
	});
};

/**
 * Change le statut d'une commande, en respectant les transitions autorisées.
 *
 * Le graphe vit dans les contrats (`ORDER_STATUS_TRANSITIONS`) : impossible,
 * par exemple, d'expédier une commande jamais payée ou de rouvrir une
 * commande annulée.
 */
export const updateOrderStatus = async (
	orderId: string,
	nextStatus: OrderStatus,
	options: { comment?: string; actor: { userId: string; label: string } },
): Promise<Order> => {
	await db.transaction(async (tx) => {
		const [order] = await tx
			.select({ status: t.orders.status })
			.from(t.orders)
			.where(eq(t.orders.id, orderId))
			.for("update")
			.limit(1);

		if (!order) throw notFound("Commande");
		if (order.status === nextStatus) return;

		if (!canTransitionOrder(order.status, nextStatus)) {
			throw conflict(
				`Transition impossible : une commande « ${order.status} » ne peut pas passer à « ${nextStatus} ».`,
			);
		}

		const now = new Date();

		// Annuler relâche les réservations et remet en stock ce qui avait été
		// fermement décrémenté.
		if (nextStatus === "cancelled") {
			await inventory.releaseReservations(tx, { orderId });

			const items = await tx
				.select({
					inventoryItemId: t.orderItems.inventoryItemId,
					quantity: t.orderItems.quantity,
				})
				.from(t.orderItems)
				.where(eq(t.orderItems.orderId, orderId));

			const [wasPaid] = await tx
				.select({ paymentStatus: t.orders.paymentStatus })
				.from(t.orders)
				.where(eq(t.orders.id, orderId))
				.limit(1);

			if (wasPaid?.paymentStatus === "paid") {
				for (const item of items) {
					if (!item.inventoryItemId) continue;
					await inventory.applyMovement(tx, {
						inventoryItemId: item.inventoryItemId,
						delta: item.quantity,
						reason: "order_cancelled",
						orderId,
						userId: options.actor.userId,
						userLabel: options.actor.label,
					});
				}
			}
		}

		await tx
			.update(t.orders)
			.set({
				status: nextStatus,
				...(nextStatus === "shipped"
					? { fulfillmentStatus: "shipped" as const, shippedAt: now }
					: {}),
				...(nextStatus === "preparing" ? { fulfillmentStatus: "preparing" as const } : {}),
				...(nextStatus === "delivered"
					? { fulfillmentStatus: "delivered" as const, deliveredAt: now }
					: {}),
				...(nextStatus === "cancelled"
					? { cancelledAt: now, paymentStatus: "cancelled" as const }
					: {}),
				updatedAt: now,
			})
			.where(eq(t.orders.id, orderId));

		await appendStatusHistory(
			tx,
			orderId,
			order.status,
			nextStatus,
			options.comment ?? null,
			options.actor,
		);
	});

	return getOrder(orderId);
};

export const updateFulfillment = async (
	orderId: string,
	input: {
		fulfillmentStatus?: (typeof t.fulfillmentStatusEnum.enumValues)[number];
		trackingNumber?: string | null;
		trackingUrl?: string | null;
		carrier?: string | null;
	},
): Promise<Order> => {
	const patch = Object.fromEntries(
		Object.entries(input).filter(([, value]) => value !== undefined),
	);

	if (Object.keys(patch).length === 0) return getOrder(orderId);

	const [updated] = await db
		.update(t.orders)
		.set({ ...patch, updatedAt: new Date() })
		.where(eq(t.orders.id, orderId))
		.returning({ id: t.orders.id });

	if (!updated) throw notFound("Commande");
	return getOrder(orderId);
};

/**
 * Remboursement total ou partiel (§2.4).
 *
 * Sans `items`, le montant est remboursé globalement. Avec `items`, les
 * quantités remboursées sont tracées ligne par ligne et, si `restock` est
 * demandé, remises en stock avec un mouvement `order_refunded`.
 */
export const refundOrder = async (
	orderId: string,
	input: {
		amount?: number;
		reason: string;
		items?: { orderItemId: string; quantity: number }[];
		restock: boolean;
	},
	actor: { userId: string; label: string },
): Promise<Order> => {
	const order = await getOrder(orderId);

	if (order.paymentStatus !== "paid" && order.paymentStatus !== "partially_refunded") {
		throw conflict("Seule une commande payée peut être remboursée.");
	}

	const refundable = order.total - order.refundedTotal;

	// Sans lignes ni montant, on rembourse le reste dû.
	const amount = input.items
		? input.items.reduce((total, entry) => {
				const item = order.items.find((candidate) => candidate.id === entry.orderItemId);
				if (!item) throw badRequest("Ligne de commande introuvable.");

				const remaining = item.quantity - item.refundedQuantity;
				if (entry.quantity > remaining) {
					throw conflict(
						`« ${item.productName} » : ${remaining} unité(s) remboursable(s), ${entry.quantity} demandée(s).`,
					);
				}

				return total + item.unitPrice * entry.quantity;
			}, 0)
		: (input.amount ?? refundable);

	if (amount <= 0) throw badRequest("Le montant à rembourser doit être positif.");
	if (amount > refundable) {
		throw conflict(
			`Montant remboursable restant : ${refundable}. Demandé : ${amount}.`,
		);
	}

	// Remboursement chez le prestataire avant toute écriture : inutile de
	// tracer un remboursement qu'il a refusé.
	const [transaction] = await db
		.select({
			providerKey: t.transactions.providerKey,
			providerTransactionId: t.transactions.providerTransactionId,
		})
		.from(t.transactions)
		.where(and(eq(t.transactions.orderId, orderId), eq(t.transactions.kind, "payment")))
		.orderBy(desc(t.transactions.createdAt))
		.limit(1);

	let providerRefundId: string | null = null;

	if (transaction) {
		const adapter = getPaymentAdapter(transaction.providerKey);

		if (adapter?.supportsRefunds && adapter.refund) {
			const [providerRow] = await db
				.select()
				.from(t.paymentProviders)
				.where(eq(t.paymentProviders.key, transaction.providerKey))
				.limit(1);

			const result = await adapter.refund({
				environment: providerRow?.environment ?? "test",
				credentials: decryptCredentials(providerRow?.credentials ?? {}),
				config: providerRow?.config ?? {},
				order: {
					id: order.id,
					displayId: order.displayId,
					amount,
					currency: order.currency,
					email: order.email,
					phone: order.phone,
					description: `Remboursement commande ${order.displayId}`,
				},
				providerTransactionId: transaction.providerTransactionId,
				amount,
				reason: input.reason,
			});

			if (result.status === "failed") {
				throw paymentError(
					result.errorMessage ?? "Le prestataire a refusé le remboursement.",
				);
			}

			providerRefundId = result.providerRefundId;
		}
	}

	await db.transaction(async (tx) => {
		await tx.insert(t.refunds).values({
			orderId,
			amount,
			reason: input.reason,
			items: input.items ?? null,
			userId: actor.userId,
		});

		await tx.insert(t.transactions).values({
			orderId,
			providerKey: transaction?.providerKey ?? "manual",
			providerTransactionId: providerRefundId,
			kind: "refund",
			status: "success",
			amount,
			currency: order.currency,
		});

		if (input.items) {
			for (const entry of input.items) {
				await tx
					.update(t.orderItems)
					.set({
						refundedQuantity: sql`${t.orderItems.refundedQuantity} + ${entry.quantity}`,
					})
					.where(eq(t.orderItems.id, entry.orderItemId));

				if (input.restock) {
					const [item] = await tx
						.select({ inventoryItemId: t.orderItems.inventoryItemId })
						.from(t.orderItems)
						.where(eq(t.orderItems.id, entry.orderItemId))
						.limit(1);

					if (item?.inventoryItemId) {
						await inventory.applyMovement(tx, {
							inventoryItemId: item.inventoryItemId,
							delta: entry.quantity,
							reason: "order_refunded",
							note: input.reason,
							orderId,
							userId: actor.userId,
							userLabel: actor.label,
						});
					}
				}
			}
		}

		const refundedTotal = order.refundedTotal + amount;
		const fullyRefunded = refundedTotal >= order.total;
		const now = new Date();

		await tx
			.update(t.orders)
			.set({
				refundedTotal,
				paymentStatus: fullyRefunded ? "refunded" : "partially_refunded",
				...(fullyRefunded ? { status: "refunded" as const } : {}),
				updatedAt: now,
			})
			.where(eq(t.orders.id, orderId));

		if (fullyRefunded) {
			await appendStatusHistory(
				tx,
				orderId,
				order.status,
				"refunded",
				input.reason,
				actor,
			);
		}
	});

	return getOrder(orderId);
};
