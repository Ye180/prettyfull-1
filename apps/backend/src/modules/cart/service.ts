import type { Cart, CartItem, CurrencyCode, ShippingOption } from "@prettyfull/contracts";
import { and, eq, isNull, sql } from "drizzle-orm";
import { db, type Transaction } from "../../db/index.js";
import * as t from "../../db/schema/index.js";
import type { AddressSnapshot } from "../../db/schema/orders.js";
import { badRequest, conflict, insufficientStock, notFound } from "../../lib/errors.js";
import { getShippingAdapter } from "../../integrations/shipping/registry.js";
import { getAppliedDiscount, resolveDiscountForSubtotal } from "../promotions/service.js";
import { getStoreSettings } from "../settings/service.js";

/**
 * Panier serveur.
 *
 * Les prix ne sont **pas** figés dans le panier : ils sont relus à chaque
 * lecture depuis le catalogue, et ne se figent qu'au passage en commande
 * (§2.4). Un changement de tarif entre l'ajout et le paiement est donc
 * répercuté honnêtement, au lieu de vendre à un prix périmé.
 */

export interface CartOwner {
	userId?: string | null;
	sessionToken?: string | null;
}

const ownerFilter = (owner: CartOwner) =>
	owner.userId
		? eq(t.carts.userId, owner.userId)
		: owner.sessionToken
			? eq(t.carts.sessionToken, owner.sessionToken)
			: null;

/** Récupère le panier actif du propriétaire, ou le crée. */
export const getOrCreateCart = async (owner: CartOwner): Promise<string> => {
	const filter = ownerFilter(owner);
	if (!filter) throw badRequest("Aucun identifiant de panier fourni.");

	const [existing] = await db
		.select({ id: t.carts.id })
		.from(t.carts)
		.where(and(filter, eq(t.carts.status, "active")))
		.limit(1);

	if (existing) return existing.id;

	const settings = await getStoreSettings();

	const [created] = await db
		.insert(t.carts)
		.values({
			userId: owner.userId ?? null,
			sessionToken: owner.userId ? null : (owner.sessionToken ?? null),
			currency: settings.defaultCurrency,
			status: "active",
		})
		.returning({ id: t.carts.id });

	return created!.id;
};

/**
 * Rattache un panier anonyme à une cliente qui vient de se connecter.
 *
 * Les lignes du panier invité sont fusionnées dans le panier du compte
 * lorsqu'il en existe déjà un : perdre le contenu d'un panier à la connexion
 * est l'un des abandons les plus coûteux d'un tunnel d'achat.
 */
export const mergeGuestCart = async (
	sessionToken: string,
	userId: string,
): Promise<void> => {
	const [guest] = await db
		.select({ id: t.carts.id })
		.from(t.carts)
		.where(and(eq(t.carts.sessionToken, sessionToken), eq(t.carts.status, "active")))
		.limit(1);

	if (!guest) return;

	const [owned] = await db
		.select({ id: t.carts.id })
		.from(t.carts)
		.where(and(eq(t.carts.userId, userId), eq(t.carts.status, "active")))
		.limit(1);

	if (!owned) {
		await db
			.update(t.carts)
			.set({ userId, sessionToken: null, updatedAt: new Date() })
			.where(eq(t.carts.id, guest.id));
		return;
	}

	const guestItems = await db
		.select()
		.from(t.cartItems)
		.where(eq(t.cartItems.cartId, guest.id));

	await db.transaction(async (tx) => {
		for (const item of guestItems) {
			// Article déjà présent dans le panier du compte : les quantités
			// s'additionnent au lieu de créer un doublon.
			await tx
				.insert(t.cartItems)
				.values({ ...item, id: undefined as unknown as string, cartId: owned.id })
				.onConflictDoUpdate({
					target: [t.cartItems.cartId, t.cartItems.inventoryItemId],
					set: { quantity: sql`${t.cartItems.quantity} + ${item.quantity}` },
				});
		}

		await tx
			.update(t.carts)
			.set({ status: "abandoned", updatedAt: new Date() })
			.where(eq(t.carts.id, guest.id));
	});
};

/**
 * Résout le point de stock correspondant à un article demandé.
 *
 * Refuse une combinaison incohérente avec le régime du produit : demander une
 * taille sur un produit sans taille, ou omettre la variante d'un produit à
 * variantes, doit échouer explicitement plutôt que retomber sur un stock
 * arbitraire.
 */
const resolveInventoryItem = async (selector: {
	productId: string;
	variantId?: string | null;
	sizeId?: string | null;
}) => {
	const [row] = await db
		.select({
			inventoryItemId: t.inventoryItems.id,
			quantity: t.inventoryItems.quantity,
			reservedQuantity: t.inventoryItems.reservedQuantity,
			allowBackorder: t.inventoryItems.allowBackorder,
			productName: t.products.name,
			productStatus: t.products.status,
			productDeletedAt: t.products.deletedAt,
			variantName: t.productVariants.name,
			variantStatus: t.productVariants.status,
			sizeLabel: t.sizes.label,
			sizeStatus: t.sizes.status,
		})
		.from(t.inventoryItems)
		.innerJoin(t.products, eq(t.products.id, t.inventoryItems.productId))
		.leftJoin(t.productVariants, eq(t.productVariants.id, t.inventoryItems.variantId))
		.leftJoin(t.sizes, eq(t.sizes.id, t.inventoryItems.sizeId))
		.where(
			and(
				eq(t.inventoryItems.productId, selector.productId),
				sql`${t.inventoryItems.variantId} is not distinct from ${selector.variantId ?? null}`,
				sql`${t.inventoryItems.sizeId} is not distinct from ${selector.sizeId ?? null}`,
			),
		)
		.limit(1);

	if (!row) {
		throw badRequest(
			"Cette combinaison de coloris et de taille n'existe pas pour ce produit.",
		);
	}

	if (row.productDeletedAt || row.productStatus !== "published") {
		throw conflict("Ce produit n'est plus disponible à la vente.");
	}

	if (row.variantStatus === "inactive" || row.sizeStatus === "inactive") {
		throw conflict("Cette déclinaison n'est plus disponible.");
	}

	return row;
};

export const addItem = async (
	cartId: string,
	selector: { productId: string; variantId?: string | null; sizeId?: string | null },
	quantity: number,
): Promise<void> => {
	const target = await resolveInventoryItem(selector);

	const [existing] = await db
		.select({ id: t.cartItems.id, quantity: t.cartItems.quantity })
		.from(t.cartItems)
		.where(
			and(
				eq(t.cartItems.cartId, cartId),
				eq(t.cartItems.inventoryItemId, target.inventoryItemId),
			),
		)
		.limit(1);

	const desired = (existing?.quantity ?? 0) + quantity;
	const available = target.quantity - target.reservedQuantity;

	if (!target.allowBackorder && desired > available) {
		throw insufficientStock(
			available <= 0
				? `« ${target.productName} » n'est plus disponible dans cette taille.`
				: `Il ne reste que ${available} unité(s) de « ${target.productName} ».`,
			{ available: [String(Math.max(0, available))] },
		);
	}

	if (existing) {
		await db
			.update(t.cartItems)
			.set({ quantity: desired, updatedAt: new Date() })
			.where(eq(t.cartItems.id, existing.id));
	} else {
		await db.insert(t.cartItems).values({
			cartId,
			inventoryItemId: target.inventoryItemId,
			productId: selector.productId,
			variantId: selector.variantId ?? null,
			sizeId: selector.sizeId ?? null,
			quantity,
		});
	}

	await touchCart(cartId);
};

export const updateItemQuantity = async (
	cartId: string,
	itemId: string,
	quantity: number,
): Promise<void> => {
	const [item] = await db
		.select({
			id: t.cartItems.id,
			inventoryItemId: t.cartItems.inventoryItemId,
			available: sql<number>`${t.inventoryItems.quantity} - ${t.inventoryItems.reservedQuantity}`,
			allowBackorder: t.inventoryItems.allowBackorder,
			productName: t.products.name,
		})
		.from(t.cartItems)
		.innerJoin(t.inventoryItems, eq(t.inventoryItems.id, t.cartItems.inventoryItemId))
		.innerJoin(t.products, eq(t.products.id, t.cartItems.productId))
		.where(and(eq(t.cartItems.id, itemId), eq(t.cartItems.cartId, cartId)))
		.limit(1);

	if (!item) throw notFound("Ligne de panier");

	// Quantité nulle : la ligne est retirée, ce qui évite au storefront
	// d'appeler une seconde route pour la suppression.
	if (quantity === 0) {
		await db.delete(t.cartItems).where(eq(t.cartItems.id, itemId));
		await touchCart(cartId);
		return;
	}

	if (!item.allowBackorder && quantity > item.available) {
		throw insufficientStock(
			`Il ne reste que ${Math.max(0, item.available)} unité(s) de « ${item.productName} ».`,
			{ available: [String(Math.max(0, item.available))] },
		);
	}

	await db
		.update(t.cartItems)
		.set({ quantity, updatedAt: new Date() })
		.where(eq(t.cartItems.id, itemId));

	await touchCart(cartId);
};

export const removeItem = async (cartId: string, itemId: string): Promise<void> => {
	await db
		.delete(t.cartItems)
		.where(and(eq(t.cartItems.id, itemId), eq(t.cartItems.cartId, cartId)));
	await touchCart(cartId);
};

export const clearCart = async (cartId: string): Promise<void> => {
	await db.delete(t.cartItems).where(eq(t.cartItems.cartId, cartId));
	await touchCart(cartId);
};

const touchCart = async (cartId: string): Promise<void> => {
	await db.update(t.carts).set({ updatedAt: new Date() }).where(eq(t.carts.id, cartId));
};

export const setCartAddresses = async (
	cartId: string,
	input: { shippingAddress?: AddressSnapshot; billingAddress?: AddressSnapshot | null },
): Promise<void> => {
	await db
		.update(t.carts)
		.set({
			...(input.shippingAddress ? { shippingAddress: input.shippingAddress } : {}),
			...(input.billingAddress !== undefined ? { billingAddress: input.billingAddress } : {}),
			updatedAt: new Date(),
		})
		.where(eq(t.carts.id, cartId));
};

export const setShippingRate = async (
	cartId: string,
	rateId: string | null,
): Promise<void> => {
	await db
		.update(t.carts)
		.set({ shippingRateId: rateId, updatedAt: new Date() })
		.where(eq(t.carts.id, cartId));
};

/**
 * Applique un code promo au panier : revalidé au sous-total courant, jamais
 * figé ici - `getCart` recalcule la remise à chaque lecture (§2.9), comme le
 * sous-total lui-même.
 */
export const applyDiscountCode = async (cartId: string, code: string): Promise<void> => {
	const lines = await loadCartLines(cartId);
	if (lines.length === 0) throw badRequest("Votre panier est vide.");

	const subtotal = lines.reduce((total, line) => total + line.lineTotal, 0);
	const { promoCodeId } = await resolveDiscountForSubtotal(code, subtotal);

	await db
		.update(t.carts)
		.set({ discountCodeId: promoCodeId, updatedAt: new Date() })
		.where(eq(t.carts.id, cartId));
};

export const removeDiscountCode = async (cartId: string): Promise<void> => {
	await db
		.update(t.carts)
		.set({ discountCodeId: null, updatedAt: new Date() })
		.where(eq(t.carts.id, cartId));
};

// --- Lecture et totaux -----------------------------------------------------

/** Lignes du panier, prix relus au catalogue. */
export const loadCartLines = async (
	cartId: string,
	executor: Transaction | typeof db = db,
): Promise<CartItem[]> => {
	const rows = await executor
		.select({
			id: t.cartItems.id,
			productId: t.cartItems.productId,
			variantId: t.cartItems.variantId,
			sizeId: t.cartItems.sizeId,
			inventoryItemId: t.cartItems.inventoryItemId,
			quantity: t.cartItems.quantity,
			productName: t.products.name,
			productSlug: t.products.slug,
			basePrice: t.products.basePrice,
			weightGrams: t.products.weightGrams,
			variantName: t.productVariants.name,
			variantPrice: t.productVariants.priceOverride,
			sizeLabel: t.sizes.label,
			sizePrice: t.sizes.priceOverride,
			sku: sql<
				string | null
			>`coalesce(${t.sizes.sku}, ${t.productVariants.sku}, ${t.products.sku})`,
			available: sql<number>`${t.inventoryItems.quantity} - ${t.inventoryItems.reservedQuantity}`,
			thumbnail: sql<string | null>`coalesce(
				(select ${t.variantImages.url} from ${t.variantImages}
				 where ${t.variantImages.variantId} = ${t.cartItems.variantId}
				 order by ${t.variantImages.position} limit 1),
				(select ${t.productImages.url} from ${t.productImages}
				 where ${t.productImages.productId} = ${t.products.id}
				 order by ${t.productImages.position} limit 1)
			)`,
		})
		.from(t.cartItems)
		.innerJoin(t.products, eq(t.products.id, t.cartItems.productId))
		.innerJoin(t.inventoryItems, eq(t.inventoryItems.id, t.cartItems.inventoryItemId))
		.leftJoin(t.productVariants, eq(t.productVariants.id, t.cartItems.variantId))
		.leftJoin(t.sizes, eq(t.sizes.id, t.cartItems.sizeId))
		.where(eq(t.cartItems.cartId, cartId));

	return rows.map((row) => {
		// Cascade de prix du §2.2 : taille, puis variante, puis produit.
		const unitPrice = row.sizePrice ?? row.variantPrice ?? row.basePrice;

		return {
			id: row.id,
			productId: row.productId,
			variantId: row.variantId,
			sizeId: row.sizeId,
			inventoryItemId: row.inventoryItemId,
			productName: row.productName,
			productSlug: row.productSlug,
			variantName: row.variantName,
			sizeLabel: row.sizeLabel,
			sku: row.sku,
			thumbnail: row.thumbnail,
			unitPrice,
			quantity: row.quantity,
			lineTotal: unitPrice * row.quantity,
			availableQuantity: row.available,
		};
	});
};

/** Poids total du panier, pour le calcul des frais de port au poids. */
export const cartWeight = async (cartId: string): Promise<number> => {
	const [row] = await db
		.select({
			weight: sql<number>`coalesce(sum(coalesce(${t.products.weightGrams}, 0) * ${t.cartItems.quantity}), 0)::int`,
		})
		.from(t.cartItems)
		.innerJoin(t.products, eq(t.products.id, t.cartItems.productId))
		.where(eq(t.cartItems.cartId, cartId));

	return row?.weight ?? 0;
};

/** Options de livraison disponibles pour l'adresse enregistrée sur le panier. */
export const listShippingOptions = async (cartId: string): Promise<ShippingOption[]> => {
	const [cart] = await db
		.select({
			currency: t.carts.currency,
			shippingAddress: t.carts.shippingAddress,
		})
		.from(t.carts)
		.where(eq(t.carts.id, cartId))
		.limit(1);

	if (!cart?.shippingAddress) {
		throw badRequest(
			"Renseignez d'abord une adresse de livraison pour connaître les options disponibles.",
		);
	}

	const lines = await loadCartLines(cartId);
	const subtotal = lines.reduce((total, line) => total + line.lineTotal, 0);
	const weightGrams = await cartWeight(cartId);

	const providers = await db
		.select({
			key: t.shippingProviders.key,
			environment: t.shippingProviders.environment,
			credentials: t.shippingProviders.credentials,
			config: t.shippingProviders.config,
		})
		.from(t.shippingProviders)
		.where(eq(t.shippingProviders.isEnabled, true));

	const options: ShippingOption[] = [];

	for (const provider of providers) {
		const adapter = getShippingAdapter(provider.key);
		if (!adapter) continue;

		// Un transporteur injoignable ne doit pas bloquer le tunnel : ses
		// options sont simplement absentes de la liste.
		try {
			const quotes = await adapter.quote({
				environment: provider.environment,
				credentials: provider.credentials,
				config: provider.config,
				destination: {
					countryCode: cart.shippingAddress.countryCode,
					city: cart.shippingAddress.city,
					postalCode: cart.shippingAddress.postalCode ?? null,
					province: cart.shippingAddress.province ?? null,
				},
				weightGrams,
				subtotal,
				currency: cart.currency as CurrencyCode,
			});

			options.push(
				...quotes.map((quote) => ({
					rateId: quote.rateId,
					providerKey: provider.key,
					name: quote.name,
					amount: quote.amount,
					currency: quote.currency,
					estimatedDaysMin: quote.estimatedDaysMin,
					estimatedDaysMax: quote.estimatedDaysMax,
				})),
			);
		} catch (error) {
			console.error(`[livraison] ${provider.key} injoignable`, error);
		}
	}

	return options.sort((a, b) => a.amount - b.amount);
};

/** Montant de port du tarif retenu ; zéro si aucun n'est encore choisi. */
export const resolveShippingAmount = async (
	cartId: string,
	rateId: string | null,
	subtotal: number,
): Promise<{ amount: number; name: string; providerKey: string } | null> => {
	if (!rateId) return null;

	const [rate] = await db
		.select({
			name: t.shippingRates.name,
			amount: t.shippingRates.amount,
			providerKey: t.shippingRates.providerKey,
			freeAboveTotal: t.shippingRates.freeAboveTotal,
		})
		.from(t.shippingRates)
		.where(and(eq(t.shippingRates.id, rateId), eq(t.shippingRates.isActive, true)))
		.limit(1);

	if (!rate) return null;

	const free = rate.freeAboveTotal !== null && subtotal >= rate.freeAboveTotal;

	return {
		amount: free ? 0 : rate.amount,
		name: free ? `${rate.name} - offerte` : rate.name,
		providerKey: rate.providerKey,
	};
};

export const getCart = async (cartId: string): Promise<Cart> => {
	const [cart] = await db
		.select()
		.from(t.carts)
		.where(and(eq(t.carts.id, cartId), isNull(t.carts.completedAt)))
		.limit(1);

	if (!cart) throw notFound("Panier");

	const items = await loadCartLines(cartId);
	const subtotal = items.reduce((total, line) => total + line.lineTotal, 0);
	const shipping = await resolveShippingAmount(cartId, cart.shippingRateId, subtotal);

	const shippingTotal = shipping?.amount ?? 0;

	// Les prix du catalogue sont TTC (taux « inclusif » par défaut, §4.9) :
	// la taxe est déjà comprise dans le sous-total et ne s'y ajoute pas.
	const taxTotal = 0;

	const discount = cart.discountCodeId
		? await getAppliedDiscount(cart.discountCodeId, subtotal)
		: null;
	const discountTotal = discount?.amount ?? 0;

	return {
		id: cart.id,
		userId: cart.userId,
		email: cart.email,
		currency: cart.currency,
		items,
		shippingAddress: cart.shippingAddress
			? (cart.shippingAddress as unknown as Cart["shippingAddress"])
			: null,
		billingAddress: cart.billingAddress
			? (cart.billingAddress as unknown as Cart["billingAddress"])
			: null,
		shippingRateId: cart.shippingRateId,
		subtotal,
		shippingTotal,
		taxTotal,
		discountTotal,
		discountCode: discount?.code ?? null,
		total: Math.max(0, subtotal + shippingTotal + taxTotal - discountTotal),
		updatedAt: cart.updatedAt.toISOString(),
	};
};
